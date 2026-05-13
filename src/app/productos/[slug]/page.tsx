'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ShoppingCart, ShieldCheck, Truck, ChevronRight, Loader2, Image as ImageIcon, MessageCircle, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

// =====================================================================
// BLOQUE 0: IMPORTACION DEL NAVBAR
// =====================================================================
import Navbar from '@/src/components/Navbar';

// =====================================================================
// BLOQUE 1: INTERFACES DE BASE DE DATOS
// =====================================================================
interface Categoria {
  id: string;
  nombre: string;
}

interface Producto {
  id: string;
  nombre: string;
  slug: string;
  sku: string;
  precio: number;
  descripcion: string;
  categoriaId: string;
  imagenPrincipal?: string | null;
  galeria: string[];
  marca?: string | null;
  stock: number;
  categoria?: Categoria;
}

export default function ProductoDetallePage() {
  const { slug } = useParams(); // Capturamos la URL amigable
  const router = useRouter();

  // =====================================================================
  // BLOQUE 2: ESTADOS GLOBALES DE LA PÁGINA
  // =====================================================================
  const [producto, setProducto] = useState<Producto | null>(null);
  const [relacionados, setRelacionados] = useState<Producto[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(false);

  // Estados para la galería interactiva
  const [todasLasImagenes, setTodasLasImagenes] = useState<string[]>([]);
  const [imgActiva, setImgActiva] = useState<string>('');

  // =====================================================================
  // BLOQUE 3: CARGA Y FILTRADO DE DATOS REALES
  // =====================================================================
  useEffect(() => {
    const fetchProducto = async () => {
      try {
        // En un proyecto gigante haríamos un endpoint específico (/api/productos/[slug])
        // pero como es catálogo B2B, filtrar desde el GET general es súper rápido.
        const res = await fetch('/api/productos');
        if (!res.ok) throw new Error("Error en API");
        const todosLosProductos: Producto[] = await res.json();

        const prodEncontrado = todosLosProductos.find(p => p.slug === slug);
        
        if (!prodEncontrado) {
          setError(true);
          setCargando(false);
          return;
        }

        setProducto(prodEncontrado);

        // Preparamos la galería combinando la principal y las extra
        const imagenes = [];
        if (prodEncontrado.imagenPrincipal) imagenes.push(prodEncontrado.imagenPrincipal);
        if (Array.isArray(prodEncontrado.galeria)) {
          imagenes.push(...prodEncontrado.galeria);
        }
        
        setTodasLasImagenes(imagenes);
        if (imagenes.length > 0) setImgActiva(imagenes[0]);

        // Filtramos productos relacionados (Misma categoría, distinto producto)
        const prodsRelacionados = todosLosProductos
          .filter(p => p.categoriaId === prodEncontrado.categoriaId && p.id !== prodEncontrado.id)
          .slice(0, 4); // Máximo 4 para el footer
        
        setRelacionados(prodsRelacionados);

      } catch (err) {
        console.error("Error al cargar producto:", err);
        setError(true);
      } finally {
        setCargando(false);
      }
    };

    if (slug) fetchProducto();
  }, [slug]);

  // =====================================================================
  // BLOQUE 4: PANTALLAS DE CARGA Y ERROR
  // =====================================================================
  if (cargando) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
        <Loader2 size={48} className="animate-spin text-[#1D4ED8] mb-4" />
        <p className="text-[#64748B] font-bold tracking-widest uppercase text-sm">Cargando producto...</p>
      </div>
    );
  }

  if (error || !producto) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 text-center">
        <AlertTriangle size={64} className="text-[#DC2626] mb-4" />
        <h1 className="text-2xl font-black text-[#0F172A] mb-2">Producto no encontrado</h1>
        <p className="text-[#64748B] mb-6">El producto que buscas ya no existe o la URL es incorrecta.</p>
        <Link href="/productos" className="bg-[#1D4ED8] text-white px-6 py-3 rounded-xl font-bold">Volver al catálogo</Link>
      </div>
    );
  }

  // =====================================================================
  // BLOQUE 5: RENDERIZADO PRINCIPAL (UI TIPO E-COMMERCE PREMIUM)
  // =====================================================================
  return (
    <>
      <Navbar />
      
      <main className="bg-[#FFFFFF] min-h-screen pt-28 pb-20 font-sans">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* BREADCRUMBS (Rastro de migas de pan) */}
          <nav className="flex items-center gap-2 text-xs font-bold text-[#64748B] mb-8 uppercase tracking-widest overflow-x-auto whitespace-nowrap pb-2">
            <Link href="/productos" className="hover:text-[#1D4ED8] transition-colors">Catálogo</Link>
            <ChevronRight size={14} className="shrink-0" />
            <span className="hover:text-[#1D4ED8] cursor-pointer transition-colors">{producto.categoria?.nombre || 'General'}</span>
            <ChevronRight size={14} className="shrink-0" />
            <span className="text-[#0F172A] truncate max-w-[200px] sm:max-w-none">{producto.nombre}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 mb-20">
            
            {/* =====================================================================
                BLOQUE 6: GALERÍA VISUAL (ESTILO TEMU/AMAZON)
            ===================================================================== */}
            <div className="lg:col-span-7 flex flex-col-reverse sm:flex-row gap-4 sm:gap-6 h-max">
              
              {/* Miniaturas (Verticales en PC, Horizontales en Móvil) */}
              {todasLasImagenes.length > 1 && (
                <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-y-auto sm:max-h-[600px] pb-2 sm:pb-0 shrink-0 [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-slate-300">
                  {todasLasImagenes.map((img, idx) => (
                    <button 
                      key={idx}
                      onMouseEnter={() => setImgActiva(img)} // Efecto Amazon: Cambia al pasar el mouse
                      onClick={() => setImgActiva(img)}
                      className={`w-16 h-16 sm:w-20 sm:h-20 shrink-0 rounded-xl border-2 transition-all overflow-hidden bg-[#F8FAFC] flex items-center justify-center p-1 ${imgActiva === img ? 'border-[#1D4ED8] shadow-md' : 'border-transparent hover:border-[#E2E8F0]'}`}
                    >
                      <img src={img} alt={`Vista ${idx}`} className="w-full h-full object-contain mix-blend-multiply" />
                    </button>
                  ))}
                </div>
              )}

              {/* Imagen Principal Grande */}
              <div className="flex-1 aspect-square sm:aspect-auto sm:h-[600px] bg-[#F8FAFC] rounded-3xl border border-[#E2E8F0] flex items-center justify-center overflow-hidden relative group">
                <div className="absolute top-4 left-4 bg-white px-3 py-1 rounded-full text-[10px] font-black text-[#0F172A] border border-[#E2E8F0] shadow-sm z-10 uppercase tracking-wider">
                  {producto.marca || 'Genérico'}
                </div>
                
                {imgActiva ? (
                  <img src={imgActiva} alt={producto.nombre} className="w-full h-full object-contain mix-blend-multiply p-8 group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="text-[#9CA3AF] flex flex-col items-center">
                    <ImageIcon size={64} className="mb-2 opacity-50" />
                    <span className="text-xs font-bold uppercase tracking-widest">Sin Imagen</span>
                  </div>
                )}
              </div>
            </div>

            {/* =====================================================================
                BLOQUE 7: CAJA DE COMPRA E INFO (LADO DERECHO)
            ===================================================================== */}
            <div className="lg:col-span-5 flex flex-col">
              <div className="mb-6 border-b border-[#E2E8F0] pb-6">
                <p className="text-[#64748B] font-bold text-xs mb-2 tracking-widest">SKU: {producto.sku}</p>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#0F172A] leading-tight">
                  {producto.nombre}
                </h1>
                
                {/* Etiqueta de Stock */}
                <div className="mt-4 flex items-center gap-2">
                  {producto.stock > 0 ? (
                    <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-md text-xs font-bold flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div> En Stock ({producto.stock} unid.)
                    </span>
                  ) : (
                    <span className="bg-red-50 text-red-700 border border-red-200 px-3 py-1 rounded-md text-xs font-bold">
                      Agotado Temporalmente
                    </span>
                  )}
                </div>
              </div>

              {/* Zona de Precio */}
              <div className="mb-8 bg-[#F8FAFC] p-6 rounded-2xl border border-[#E2E8F0]">
                <p className="text-[#64748B] text-[10px] font-bold uppercase tracking-widest mb-1">Precio Unitario Ref.</p>
                <div className="flex items-end gap-2">
                  <span className="text-4xl font-black text-[#0F172A] font-mono">S/ {producto.precio.toFixed(2)}</span>
                  <span className="text-[#64748B] text-sm font-bold mb-1">+ IGV</span>
                </div>
                <p className="text-[11px] text-[#64748B] mt-2 font-medium">* Precios exclusivos para empresas y proyectos corporativos.</p>
              </div>

              {/* Descripción */}
              <div className="space-y-4 mb-8">
                <h3 className="text-sm font-black text-[#0F172A] uppercase tracking-wider">Descripción del Producto</h3>
                <p className="text-[#475569] leading-relaxed text-sm whitespace-pre-wrap">
                  {producto.descripcion}
                </p>
              </div>

              {/* Badges de Confianza */}
              <div className="grid grid-cols-2 gap-3 mb-8">
                <div className="flex items-center gap-3 p-3 bg-[#FFFFFF] rounded-xl border border-[#E2E8F0] shadow-sm">
                  <ShieldCheck className="text-[#1D4ED8]" size={20} />
                  <div>
                    <p className="text-[9px] font-bold text-[#64748B] uppercase">Garantía</p>
                    <p className="text-xs font-bold text-[#0F172A]">Soporte Oficial</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-[#FFFFFF] rounded-xl border border-[#E2E8F0] shadow-sm">
                  <Truck className="text-[#1D4ED8]" size={20} />
                  <div>
                    <p className="text-[9px] font-bold text-[#64748B] uppercase">Logística</p>
                    <p className="text-xs font-bold text-[#0F172A]">Envíos Nacionales</p>
                  </div>
                </div>
              </div>

              {/* Botones de Acción Mágicos */}
              <div className="flex flex-col sm:flex-row gap-3 mt-auto">
                <button 
                  disabled={producto.stock === 0}
                  className="flex-1 bg-[#0F172A] text-white font-black py-4 rounded-xl hover:bg-[#1e293b] transition-all flex items-center justify-center gap-2 shadow-lg shadow-slate-900/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ShoppingCart size={18} /> Agregar al Carrito
                </button>
                <button 
                  onClick={() => window.open(`https://wa.me/51999999999?text=Hola,%20deseo%20cotizar%20el%20producto:%20${producto.sku}%20-%20${producto.nombre}`, '_blank')}
                  className="flex-1 bg-[#25D366] text-white font-black py-4 rounded-xl hover:bg-[#20bd5a] transition-all flex items-center justify-center gap-2 shadow-lg shadow-green-600/20 active:scale-95"
                >
                  <MessageCircle size={18} /> Cotizar por WhatsApp
                </button>
              </div>

            </div>
          </div>

          {/* =====================================================================
              BLOQUE 8: PRODUCTOS RELACIONADOS
          ===================================================================== */}
          {relacionados.length > 0 && (
            <section className="pt-10 border-t border-[#E2E8F0]">
              <h2 className="text-xl font-black text-[#0F172A] mb-8 flex items-center gap-3">
                <div className="w-1.5 h-6 bg-[#1D4ED8] rounded-full"></div>
                Productos Relacionados
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                {relacionados.map((rel) => (
                  <Link 
                    key={rel.id} 
                    href={`/productos/${rel.slug}`}
                    className="bg-[#FFFFFF] rounded-2xl border border-[#E2E8F0] p-4 hover:shadow-xl hover:border-[#1D4ED8] hover:-translate-y-1 transition-all group flex flex-col"
                  >
                    <div className="aspect-square bg-[#F8FAFC] rounded-xl mb-4 flex items-center justify-center overflow-hidden relative">
                      {rel.imagenPrincipal ? (
                        <img src={rel.imagenPrincipal} alt={rel.nombre} className="w-full h-full object-contain mix-blend-multiply p-4 group-hover:scale-110 transition-transform duration-500" />
                      ) : (
                        <ImageIcon size={24} className="text-[#9CA3AF]" />
                      )}
                    </div>
                    <p className="text-[10px] font-bold text-[#64748B] mb-1 uppercase tracking-widest">{rel.marca || 'Genérico'}</p>
                    <h3 className="text-sm font-bold text-[#0F172A] mb-3 group-hover:text-[#1D4ED8] transition-colors line-clamp-2 flex-1">
                      {rel.nombre}
                    </h3>
                    <p className="text-lg font-black text-[#0F172A] font-mono">S/ {rel.precio.toFixed(2)}</p>
                  </Link>
                ))}
              </div>
            </section>
          )}

        </div>
      </main>
    </>
  );
}