'use client';

import { useState, useEffect, useMemo } from 'react';
import { Search, Filter, ShoppingCart, Loader2, Image as ImageIcon, X, Plus, Minus, MessageCircle, Briefcase, User, Phone } from 'lucide-react';
import Link from 'next/link';
// BLOQUE 0: IMPORTACION DEL NAVBAR
import Navbar from '@/src/components/Navbar';

// =====================================================================
// BLOQUE 1: INTERFACES
// =====================================================================
interface Categoria {
  id: string;
  nombre: string;
}

interface Producto {
  id: string;
  nombre: string;
  slug: string; // <-- Importante para redireccionar a la vista unitaria
  sku: string;
  precio: number;
  categoriaId: string;
  imagenPrincipal?: string | null;
  marca?: string | null;
  categoria?: Categoria;
  stock: number;
  isActivo: boolean;
}

// Interfaz para el Carrito
interface CartItem {
  producto: Producto;
  cantidad: number;
}

export default function ProductosPage() {
  // =====================================================================
  // BLOQUE 2: ESTADOS GLOBALES (Catálogo)
  // =====================================================================
  const [productos, setProductos] = useState<Producto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [cargando, setCargando] = useState(true);

  const [categoriaSel, setCategoriaSel] = useState<string>('');
  const [busqueda, setBusqueda] = useState<string>('');

  // =====================================================================
  // BLOQUE 3: ESTADOS DEL CARRITO Y CHECKOUT
  // =====================================================================
  const [carrito, setCarrito] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Controla si mostramos la lista de productos o el formulario de datos
  const [pasoCheckout, setPasoCheckout] = useState<'carrito' | 'formulario'>('carrito');
  const [procesandoPedido, setProcesandoPedido] = useState(false);

  // Datos del cliente para la BD y WhatsApp
  const [formData, setFormData] = useState({ nombre: '', empresa: '', telefono: '' });

  // =====================================================================
  // BLOQUE 4: CARGA DE DATOS DESDE LA BASE DE DATOS
  // =====================================================================
  useEffect(() => {
    const fetchDatos = async () => {
      try {
        const [resProd, resCat] = await Promise.all([
          fetch('/api/productos').then(r => r.json()),
          fetch('/api/categorias').then(r => r.json())
        ]);
        if (Array.isArray(resProd)) setProductos(resProd);
        if (Array.isArray(resCat)) setCategorias(resCat);
      } catch (error) {
        console.error("Error al cargar la tienda:", error);
      } finally {
        setCargando(false);
      }
    };
    fetchDatos();
  }, []);

  // =====================================================================
  // BLOQUE 5: LÓGICA DE FILTRADO
  // =====================================================================
  const productosFiltrados = useMemo(() => {
    return productos.filter(prod => {
      const coincideCat = categoriaSel === '' || prod.categoriaId === categoriaSel;
      const termino = busqueda.toLowerCase();
      const catNombre = prod.categoria?.nombre?.toLowerCase() || '';

      const coincideBusqueda = prod.nombre.toLowerCase().includes(termino) ||
        prod.sku.toLowerCase().includes(termino) ||
        catNombre.includes(termino);

      return coincideCat && coincideBusqueda && prod.isActivo !== false; // Opcional: solo activos
    });
  }, [productos, categoriaSel, busqueda]);

  // =====================================================================
  // BLOQUE 6: LÓGICA DEL CARRITO DE COMPRAS
  // =====================================================================
  const agregarAlCarrito = (producto: Producto, e: React.MouseEvent) => {
    e.preventDefault(); // EVITA QUE EL <Link> SE ACTIVE AL DAR CLIC AL BOTÓN DEL CARRITO

    setCarrito(prev => {
      const existe = prev.find(item => item.producto.id === producto.id);
      if (existe) {
        return prev.map(item => item.producto.id === producto.id ? { ...item, cantidad: item.cantidad + 1 } : item);
      }
      return [...prev, { producto, cantidad: 1 }];
    });
    setIsCartOpen(true); // Abre el panel automáticamente
  };

  const modificarCantidad = (id: string, delta: number) => {
    setCarrito(prev => prev.map(item => {
      if (item.producto.id === id) {
        const nuevaCantidad = Math.max(1, item.cantidad + delta); // Mínimo 1
        return { ...item, cantidad: nuevaCantidad };
      }
      return item;
    }));
  };

  const eliminarDelCarrito = (id: string) => {
    setCarrito(prev => prev.filter(item => item.producto.id !== id));
    if (carrito.length === 1) setPasoCheckout('carrito'); // Si se queda vacío, regresa al paso 1
  };

  const totalCarrito = carrito.reduce((sum, item) => sum + (item.producto.precio * item.cantidad), 0);
  const totalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0);

  // =====================================================================
  // BLOQUE 7: PROCESAMIENTO DEL PEDIDO (BASE DE DATOS + WHATSAPP)
  // =====================================================================
  const procesarPedido = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcesandoPedido(true);

    try {
      // 1. Preparamos el paquete de datos
      const payload = {
        clienteNombre: formData.nombre,
        telefonoWa: formData.telefono,
        empresa: formData.empresa || null,
        total: totalCarrito,
        estado: 'PENDIENTE',
        detalles: carrito.map(item => ({
          codigo: item.producto.sku,
          nombre: item.producto.nombre,
          cantidad: item.cantidad,
          precio: item.producto.precio
        }))
      };

      // 2. Disparamos a la Base de Datos EN SEGUNDO PLANO
      // (Le quitamos el "await" para no hacer esperar al cliente ni 1 milisegundo)
      fetch('/api/pedidos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }).catch(err => console.error("Error BD:", err));

      // 3. Generamos el texto para WhatsApp
      let textoWA = `Hola NetworksPerú, deseo cotizar el siguiente pedido:\n\n`;
      textoWA += `*DATOS DEL CLIENTE:*\n`;
      textoWA += `- Nombre: ${formData.nombre}\n`;
      if (formData.empresa) textoWA += `- Empresa: ${formData.empresa}\n`;
      textoWA += `- WhatsApp: ${formData.telefono}\n\n`;

      textoWA += `*PRODUCTOS:*\n`;
      carrito.forEach(item => {
        textoWA += `▫️ [${item.producto.sku}] ${item.producto.nombre} (Cant: ${item.cantidad})\n`;
      });

      textoWA += `\n*TOTAL REFERENCIAL: S/ ${totalCarrito.toFixed(2)}*`;

      // 4. Reseteamos el carrito para que quede limpio
      setCarrito([]);
      setFormData({ nombre: '', empresa: '', telefono: '' });
      setIsCartOpen(false);
      setPasoCheckout('carrito');

      // 5. Redirección INMEDIATA a WhatsApp (Evita bloqueos de ventanas emergentes)
      const numeroVendedor = "51928994899";
      const urlWA = `https://api.whatsapp.com/send?phone=${numeroVendedor}&text=${encodeURIComponent(textoWA)}`;

      // Usamos location.href para que abra en la misma ventana, asegurando que funcione en celular y PC
      window.location.href = urlWA;

    } catch (error) {
      alert("Hubo un error al procesar el pedido. Intenta nuevamente.");
    } finally {
      setProcesandoPedido(false);
    }
  };

  return (
    <>
      <Navbar />

      {/* =====================================================================
          BLOQUE 8: ESTRUCTURA DEL CATÁLOGO
      ===================================================================== */}
      <div className="bg-slate-50 min-h-screen font-sans pt-28 pb-12 relative z-0">
        <div className="max-w-[1600px] mx-auto w-full px-4 sm:px-6 md:px-8 flex flex-col lg:flex-row gap-8">

          {/* Controles Móviles y Sidebar... (Sin cambios, idéntico al anterior) */}
          <div className="lg:hidden flex flex-col gap-4 mb-2">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input type="text" placeholder="Buscar equipos, marcas o categorías..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} className="w-full bg-white border border-slate-200 p-3 pl-10 rounded-xl text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-slate-800 shadow-sm" />
            </div>
            <select value={categoriaSel} onChange={(e) => setCategoriaSel(e.target.value)} className="w-full bg-white border border-slate-200 p-3 rounded-xl text-sm text-slate-700 outline-none focus:border-blue-500 shadow-sm appearance-none font-medium">
              <option value="">Todas las Categorías</option>
              {categorias.map(cat => (<option key={cat.id} value={cat.id}>{cat.nombre}</option>))}
            </select>
          </div>

          <aside className="hidden lg:block w-72 shrink-0 sticky top-[120px] h-max max-h-[calc(100vh-140px)] overflow-y-auto pr-2 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-200 hover:[&::-webkit-scrollbar-thumb]:bg-slate-300">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <div className="flex items-center gap-2 font-bold text-slate-900 mb-6 pb-4 border-b border-slate-100">
                <Filter size={18} className="text-blue-600" /> Filtros del Catálogo
              </div>
              <div className="space-y-2">
                <button onClick={() => setCategoriaSel('')} className={`w-full text-left font-bold text-sm transition-colors py-1 ${categoriaSel === '' ? 'text-blue-600' : 'text-slate-600 hover:text-blue-600'}`}>
                  Todas las Categorías
                </button>
                {categorias.map(cat => (
                  <div key={cat.id} className="space-y-2">
                    <button onClick={() => setCategoriaSel(cat.id === categoriaSel ? '' : cat.id)} className={`w-full text-left font-bold text-sm transition-colors py-1 ${cat.id === categoriaSel ? 'text-blue-600' : 'text-slate-800 hover:text-blue-600'}`}>
                      {cat.nombre}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </aside>

          {/* Grilla de Productos */}
          <main className="flex-1">
            <div className="hidden lg:flex items-center justify-between mb-6 bg-white p-2 pl-4 rounded-2xl shadow-sm border border-slate-200">
              <div className="flex items-center gap-3 flex-1">
                <Search className="text-slate-400" size={20} />
                <input type="text" placeholder="Buscar equipos, marcas o categorías..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} className="w-full py-2 text-sm outline-none text-slate-800 placeholder:text-slate-400 font-medium bg-transparent" />
              </div>
              <div className="text-xs font-bold text-slate-500 bg-slate-100 px-4 py-2 rounded-lg ml-4 tracking-wide">
                {productosFiltrados.length} {productosFiltrados.length === 1 ? 'RESULTADO' : 'RESULTADOS'}
              </div>
            </div>

            {cargando ? (
              <div className="w-full flex flex-col items-center justify-center py-20">
                <Loader2 size={48} className="animate-spin text-blue-600 mb-4" />
                <p className="text-slate-500 font-medium">Cargando catálogo...</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6">
                  {productosFiltrados.map((prod) => (
                    // EL LINK ENVUELVE TODA LA TARJETA Y USA EL SLUG
                    <Link href={`/productos/${prod.slug || prod.id}`} key={prod.id} className="bg-white rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-slate-200 flex flex-col overflow-hidden group cursor-pointer">
                      <div className="aspect-square bg-slate-50 relative p-6 flex items-center justify-center border-b border-slate-100 overflow-hidden">
                        {prod.imagenPrincipal ? (
                          <img src={prod.imagenPrincipal} alt={prod.nombre} className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500" />
                        ) : (
                          <div className="w-16 h-16 bg-white rounded-xl shadow-sm flex items-center justify-center border border-slate-200 text-slate-400"><ImageIcon size={24} /></div>
                        )}
                        <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-[9px] font-extrabold uppercase px-2 py-1 rounded-md text-slate-600 border border-slate-200/50 shadow-sm">
                          {prod.marca || prod.categoria?.nombre || 'General'}
                        </span>
                      </div>
                      <div className="p-4 sm:p-5 flex flex-col flex-1">
                        <p className="text-[10px] font-bold text-slate-400 mb-1 tracking-wider">{prod.sku}</p>
                        <h3 className="text-sm font-bold text-slate-900 leading-tight mb-3 flex-1 group-hover:text-blue-600 transition-colors">{prod.nombre}</h3>
                        <div className="flex items-end justify-between mt-auto pt-2 border-t border-slate-50">
                          <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase">Precio Ref.</p>
                            <p className="text-lg font-black text-slate-900">S/ {prod.precio.toFixed(2)}</p>
                          </div>
                          {/* BOTON DE CARRITO CON EVENTO DETENIDO */}
                          <button
                            onClick={(e) => agregarAlCarrito(prod, e)}
                            className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center hover:bg-blue-600 transition-all active:scale-95 shadow-md"
                            title="Agregar al carrito"
                          >
                            <ShoppingCart size={18} />
                          </button>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                {productosFiltrados.length === 0 && (
                  <div className="w-full bg-white border border-slate-200 border-dashed rounded-2xl p-12 text-center flex flex-col items-center justify-center mt-2">
                    <Filter size={40} className="text-slate-300 mb-4" />
                    <h3 className="text-lg font-bold text-slate-700">No se encontraron productos</h3>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>

      {/* =====================================================================
          BLOQUE 9: BOTÓN FLOTANTE DEL CARRITO (Solo se muestra si hay items)
      ===================================================================== */}
      {carrito.length > 0 && (
        <button
          onClick={() => setIsCartOpen(true)}
          className="fixed bottom-6 right-6 z-40 bg-blue-600 text-white p-4 rounded-full shadow-2xl hover:bg-blue-700 transition-transform hover:scale-105 active:scale-95 flex items-center justify-center"
        >
          <ShoppingCart size={28} />
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-black w-6 h-6 rounded-full flex items-center justify-center border-2 border-white">
            {totalItems}
          </span>
        </button>
      )}

      {/* =====================================================================
          BLOQUE 10: DRAWER (PANEL DESLIZANTE) DEL CARRITO Y CHECKOUT
      ===================================================================== */}
      {/* Overlay oscuro */}
      {isCartOpen && <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[60] transition-opacity" onClick={() => setIsCartOpen(false)} />}

      {/* Panel Lateral */}
      <div className={`fixed top-0 right-0 h-full w-full sm:w-[450px] bg-white z-[70] shadow-2xl transform transition-transform duration-300 flex flex-col ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}>

        {/* Header del Drawer */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50 shrink-0">
          <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
            <ShoppingCart className="text-blue-600" size={22} />
            {pasoCheckout === 'carrito' ? 'Tu Cotización' : 'Datos del Cliente'}
          </h2>
          <button onClick={() => setIsCartOpen(false)} className="p-2 bg-white border border-slate-200 rounded-full hover:bg-slate-100 text-slate-500"><X size={18} /></button>
        </div>

        {/* Body del Drawer */}
        <div className="flex-1 overflow-y-auto p-5 bg-white">

          {/* PASO 1: LISTA DE PRODUCTOS */}
          {pasoCheckout === 'carrito' && (
            <>
              {carrito.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-4">
                  <ShoppingCart size={64} className="opacity-20" />
                  <p className="font-medium text-sm">Tu carrito está vacío</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {carrito.map(item => (
                    <div key={item.producto.id} className="flex gap-4 border border-slate-100 p-3 rounded-2xl shadow-sm relative pr-10">
                      {/* Botón Eliminar Individual */}
                      <button onClick={() => eliminarDelCarrito(item.producto.id)} className="absolute top-3 right-3 text-slate-300 hover:text-red-500 transition-colors">
                        <X size={16} />
                      </button>

                      <div className="w-20 h-20 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100 shrink-0 p-2">
                        {item.producto.imagenPrincipal ? <img src={item.producto.imagenPrincipal} alt={item.producto.nombre} className="w-full h-full object-contain mix-blend-multiply" /> : <ImageIcon size={20} className="text-slate-300" />}
                      </div>
                      <div className="flex flex-col flex-1 justify-between">
                        <div>
                          <p className="text-[9px] font-bold text-slate-400 mb-0.5">{item.producto.sku}</p>
                          <h4 className="text-xs font-bold text-slate-800 line-clamp-2 leading-tight pr-4">{item.producto.nombre}</h4>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-white">
                            <button onClick={() => modificarCantidad(item.producto.id, -1)} className="px-2.5 py-1 text-slate-500 hover:bg-slate-100 active:bg-slate-200"><Minus size={14} /></button>
                            <span className="px-2 text-xs font-bold text-slate-700 font-mono w-6 text-center">{item.cantidad}</span>
                            <button onClick={() => modificarCantidad(item.producto.id, 1)} className="px-2.5 py-1 text-slate-500 hover:bg-slate-100 active:bg-slate-200"><Plus size={14} /></button>
                          </div>
                          <p className="text-sm font-black text-slate-900 font-mono">S/ {(item.producto.precio * item.cantidad).toFixed(2)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* PASO 2: FORMULARIO DE CLIENTE */}
          {pasoCheckout === 'formulario' && (
            <form id="checkout-form" onSubmit={procesarPedido} className="space-y-5">
              <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl text-xs text-blue-800 mb-6">
                <strong>Casi listo.</strong> Completa tus datos corporativos para que un asesor te asigne tu cotización formal y apruebe tu pedido.
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 flex items-center gap-1.5"><User size={12} /> Nombre Completo *</label>
                <input type="text" required value={formData.nombre} onChange={e => setFormData({ ...formData, nombre: e.target.value })} placeholder="Ej: Juan Pérez" className="w-full border border-slate-200 p-3 rounded-xl text-sm focus:border-blue-500 outline-none text-slate-800 bg-slate-50 focus:bg-white transition-colors" />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 flex items-center gap-1.5"><Phone size={12} /> Teléfono / WhatsApp *</label>
                <input type="tel" required value={formData.telefono} onChange={e => setFormData({ ...formData, telefono: e.target.value })} placeholder="Ej: 999 888 777" className="w-full border border-slate-200 p-3 rounded-xl text-sm focus:border-blue-500 outline-none text-slate-800 bg-slate-50 focus:bg-white transition-colors font-mono" />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 flex items-center gap-1.5"><Briefcase size={12} /> Razón Social o Empresa (Opcional)</label>
                <input type="text" value={formData.empresa} onChange={e => setFormData({ ...formData, empresa: e.target.value })} placeholder="Ej: Tech Solutions SAC" className="w-full border border-slate-200 p-3 rounded-xl text-sm focus:border-blue-500 outline-none text-slate-800 bg-slate-50 focus:bg-white transition-colors" />
              </div>
            </form>
          )}

        </div>

        {/* Footer del Drawer (Totalizador y Botón de Acción) */}
        <div className="p-5 border-t border-slate-100 bg-white shrink-0">
          <div className="flex justify-between items-center mb-5">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Total Referencial:</span>
            <span className="text-2xl font-black text-slate-900 font-mono">S/ {totalCarrito.toFixed(2)}</span>
          </div>

          {pasoCheckout === 'carrito' ? (
            <button
              disabled={carrito.length === 0}
              onClick={() => setPasoCheckout('formulario')}
              className="w-full bg-blue-600 text-white font-black py-4 rounded-xl hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Generar Cotización Formal
            </button>
          ) : (
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setPasoCheckout('carrito')}
                className="px-4 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-colors"
              >
                Volver
              </button>
              <button
                form="checkout-form"
                type="submit"
                disabled={procesandoPedido}
                className="flex-1 bg-[#25D366] text-white font-black py-4 rounded-xl hover:bg-[#20bd5a] transition-all flex items-center justify-center gap-2 shadow-lg shadow-green-600/20 active:scale-95 disabled:opacity-50"
              >
                {procesandoPedido ? <Loader2 size={18} className="animate-spin" /> : <MessageCircle size={18} />}
                {procesandoPedido ? 'Procesando...' : 'Enviar a WhatsApp'}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}