'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, Plus, Edit2, Trash2, Package, X, Loader2, Image as ImageIcon, AlertTriangle, CheckCircle2, XCircle, UploadCloud, Link as LinkIcon } from 'lucide-react';

// =====================================================================
// TÍTULO: 1. TIPADO DE DATOS (INTERFACES)
// SUBTÍTULO: Define la estructura estricta para TypeScript (Cero 'any')
// =====================================================================
interface Categoria { id: string; nombre: string; }
interface Producto { 
  id: string; sku: string; nombre: string; slug: string; modelo?: string | null; 
  descripcion: string; marca?: string | null; precio: number; stock: number; 
  imagenPrincipal?: string | null; galeria: string[]; isActivo: boolean; 
  categoriaId: string; categoria?: Categoria; 
}

// Interfaz adaptada para el formulario (donde los números entran como texto temporalmente)
interface ProductoFormData {
  id: string; sku: string; nombre: string; slug: string; modelo: string; descripcion: string; 
  marca: string; precio: string; stock: string; imagenPrincipal: string; 
  galeria: string[]; categoriaId: string; isActivo: boolean;
}

export default function InventarioPage() {
  // =====================================================================
  // TÍTULO: 2. ESTADOS GLOBALES DE LA PANTALLA
  // =====================================================================
  const [productos, setProductos] = useState<Producto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [cargandoDatos, setCargandoDatos] = useState(true);
  const [busqueda, setBusqueda] = useState('');

  // =====================================================================
  // TÍTULO: 3. ESTADOS DE MODALES Y FORMULARIOS
  // =====================================================================
  const [isModalCrudOpen, setIsModalCrudOpen] = useState(false);
  const [modoModal, setModoModal] = useState<'crear' | 'editar'>('crear');
  const [cargandoForm, setCargandoForm] = useState(false);
  const [subiendoImagen, setSubiendoImagen] = useState(false);

  const [modalEliminar, setModalEliminar] = useState({ isOpen: false, id: '', nombre: '' });
  const [alertaSistema, setAlertaSistema] = useState({ isOpen: false, mensaje: '', tipo: 'exito' });

  // Molde inicial vacío (AHORA INCLUYE SLUG)
  const formInicial: ProductoFormData = { 
    id: '', sku: '', nombre: '', slug: '', modelo: '', descripcion: '', marca: '', 
    precio: '', stock: '', imagenPrincipal: '', galeria: [], categoriaId: '', isActivo: true 
  };
  const [formData, setFormData] = useState<ProductoFormData>(formInicial);

  const inputPrincipalRef = useRef<HTMLInputElement>(null);
  const inputGaleriaRef = useRef<HTMLInputElement>(null);

  // =====================================================================
  // TÍTULO: 4. LÓGICA DE AUTO-SLUG
  // SUBTÍTULO: Genera la URL amigable automáticamente al escribir el nombre
  // =====================================================================
  const manejarCambioNombre = (texto: string) => {
    const slugGenerado = texto.toLowerCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[\W_]+/g, "-");
    setFormData({ ...formData, nombre: texto, slug: slugGenerado });
  };

  // =====================================================================
  // TÍTULO: 5. FUNCIONES DE LECTURA (GET)
  // =====================================================================
  const cargarDatos = async () => {
    setCargandoDatos(true);
    try {
      const [resProd, resCat] = await Promise.all([fetch('/api/productos'), fetch('/api/categorias')]);
      const dataProd = await resProd.json();
      const dataCat = await resCat.json();
      if (Array.isArray(dataProd)) setProductos(dataProd);
      if (Array.isArray(dataCat)) setCategorias(dataCat);
    } catch (error) { 
      mostrarAlerta("Error al conectar con la base de datos.", "error");
    } finally { 
      setCargandoDatos(false); 
    }
  };

  useEffect(() => { cargarDatos(); }, []);

  const mostrarAlerta = (mensaje: string, tipo: 'exito' | 'error') => {
    setAlertaSistema({ isOpen: true, mensaje, tipo });
    setTimeout(() => setAlertaSistema({ isOpen: false, mensaje: '', tipo: 'exito' }), 4000);
  };

  // =====================================================================
  // TÍTULO: 6. BUSCADOR EN TIEMPO REAL (AHORA BUSCA POR SLUG TAMBIÉN)
  // =====================================================================
  const productosFiltrados = productos.filter(prod => 
    prod.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    prod.sku.toLowerCase().includes(busqueda.toLowerCase()) ||
    prod.slug?.toLowerCase().includes(busqueda.toLowerCase())
  );

  // =====================================================================
  // TÍTULO: 7. CONTROLADORES DE MODALES
  // =====================================================================
  const abrirModalCrear = () => {
    setModoModal('crear');
    setFormData({ ...formInicial, categoriaId: categorias.length > 0 ? categorias[0].id : '' });
    setIsModalCrudOpen(true);
  };

  const abrirModalEditar = (prod: Producto) => {
    setModoModal('editar');
    setFormData({
      id: prod.id, sku: prod.sku, nombre: prod.nombre, slug: prod.slug, modelo: prod.modelo || '',
      descripcion: prod.descripcion, marca: prod.marca || '', precio: prod.precio.toString(),
      stock: prod.stock.toString(), imagenPrincipal: prod.imagenPrincipal || '',
      galeria: prod.galeria || [], categoriaId: prod.categoriaId, isActivo: prod.isActivo
    });
    setIsModalCrudOpen(true);
  };

  // =====================================================================
  // TÍTULO: 8. LÓGICA DE DRAG & DROP Y CLOUDINARY
  // =====================================================================
  const subirImagen = async (file: File, tipo: 'principal' | 'galeria') => {
    setSubiendoImagen(true);
    const data = new FormData();
    data.append('file', file);
    
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: data });
      if (!res.ok) throw new Error("Error al subir a Cloudinary");
      
      const responseData = await res.json();
      const imageUrl = responseData.url; 

      if (tipo === 'principal') {
        setFormData(prev => ({ ...prev, imagenPrincipal: imageUrl }));
      } else {
        setFormData(prev => ({ ...prev, galeria: [...prev.galeria, imageUrl] }));
      }
      mostrarAlerta("Imagen subida correctamente.", "exito");
    } catch (error) {
      mostrarAlerta("Error al subir la imagen. Intenta de nuevo.", "error");
    } finally {
      setSubiendoImagen(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, tipo: 'principal' | 'galeria') => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      subirImagen(e.dataTransfer.files[0], tipo);
    }
  };

  const quitarImagenGaleria = (index: number) => {
    const nuevaGaleria = [...formData.galeria];
    nuevaGaleria.splice(index, 1);
    setFormData({ ...formData, galeria: nuevaGaleria });
  };

  // =====================================================================
  // TÍTULO: 9. FUNCIONES DE GUARDADO Y ELIMINACIÓN (POST, PUT, DELETE)
  // =====================================================================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (subiendoImagen) return; 
    
    setCargandoForm(true);
    try {
      const metodo = modoModal === 'crear' ? 'POST' : 'PUT';
      const url = modoModal === 'crear' ? '/api/productos' : `/api/productos?id=${formData.id}`;
      
      const payload = { 
        ...formData, precio: parseFloat(formData.precio), stock: parseInt(formData.stock, 10) 
      };

      const res = await fetch(url, { method: metodo, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });

      if (res.ok) {
        await cargarDatos();
        setIsModalCrudOpen(false);
        mostrarAlerta(modoModal === 'crear' ? "Producto registrado." : "Producto actualizado.", "exito");
      } else { 
        const errorData = await res.json().catch(() => ({}));
        mostrarAlerta(errorData.error || "Error al guardar. Verifica que el SKU o Slug no estén duplicados.", "error");
      }
    } catch (error) { 
      mostrarAlerta("Error de red al intentar guardar.", "error");
    } finally { 
      setCargandoForm(false); 
    }
  };

  const confirmarEliminar = (id: string, nombre: string) => setModalEliminar({ isOpen: true, id, nombre });

  const ejecutarEliminacion = async () => {
    try {
      const res = await fetch(`/api/productos?id=${modalEliminar.id}`, { method: 'DELETE' });
      if (res.ok) {
        setProductos(p => p.filter(prod => prod.id !== modalEliminar.id));
        mostrarAlerta("Producto eliminado.", "exito");
      } else {
        mostrarAlerta("No se puede eliminar el producto.", "error");
      }
    } catch (error) { 
      mostrarAlerta("Error al intentar eliminar.", "error");
    } finally {
      setModalEliminar({ isOpen: false, id: '', nombre: '' });
    }
  };

  // =====================================================================
  // TÍTULO: 10. RENDERIZADO DE LA INTERFAZ (UI)
  // =====================================================================
  return (
    <div className="admin-b2b space-y-8 relative transition-colors">
      
      {/* 10.1 CABECERA PRINCIPAL */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#0F172A] dark:text-[#F3F4F6]">Inventario</h1>
          <p className="text-[#64748B] dark:text-[#9CA3AF] mt-1 text-sm">Gestiona todos los detalles, stock y URLs de tus productos.</p>
        </div>
        <button onClick={abrirModalCrear} className="cursor-pointer flex items-center justify-center gap-2 bg-[#1D4ED8] text-white px-5 py-2.5 rounded-md font-medium hover:bg-[#1E40AF] transition-colors shadow-sm">
          <Plus size={18} /> Nuevo Producto
        </button>
      </div>

      {/* 10.2 TABLA PRINCIPAL DE DATOS */}
      <div className="bg-[#FFFFFF] dark:bg-[#121212] border border-[#E2E8F0] dark:border-[#262626] rounded-xl overflow-hidden transition-colors shadow-sm">
        
        <div className="p-4 border-b border-[#E2E8F0] dark:border-[#262626] bg-[#FFFFFF] dark:bg-[#121212] flex flex-col sm:flex-row items-center justify-between gap-4">
          <h2 className="text-sm font-bold text-[#0F172A] dark:text-[#F3F4F6] hidden sm:block">Catálogo de Productos</h2>
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-2.5 text-[#64748B] dark:text-[#9CA3AF]" size={18} />
            <input type="text" placeholder="Buscar por nombre, SKU o ruta..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} className="w-full pl-10 pr-4 py-2 bg-[#FFFFFF] dark:bg-[#121212] border border-[#E2E8F0] dark:border-[#262626] rounded-md outline-none focus:border-[#1D4ED8] text-[#0F172A] dark:text-[#F3F4F6] text-sm shadow-sm" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead className="bg-[#F8FAFC] dark:bg-[#1A1A1A] border-b border-[#E2E8F0] dark:border-[#262626] text-xs font-semibold uppercase tracking-wider text-[#64748B] dark:text-[#9CA3AF]">
              <tr>
                <th className="px-6 py-4 font-semibold">Imagen</th>
                <th className="px-6 py-4 font-semibold">Producto & Identificadores</th>
                <th className="px-6 py-4 font-semibold">Marca & Modelo</th>
                <th className="px-6 py-4 font-semibold">Categoría</th>
                <th className="px-6 py-4 font-semibold text-right">Precio</th>
                <th className="px-6 py-4 font-semibold text-center">Stock</th>
                <th className="px-6 py-4 font-semibold text-center">Estado</th>
                <th className="px-6 py-4 font-semibold text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-[#FFFFFF] dark:bg-[#121212]">
              {cargandoDatos ? (
                <tr><td colSpan={8} className="text-center py-12 text-[#64748B] dark:text-[#9CA3AF] border-b border-[#E2E8F0] dark:border-[#262626]"><Loader2 className="animate-spin mx-auto mb-2" size={24} />Cargando inventario...</td></tr>
              ) : productosFiltrados.length === 0 ? (
                <tr><td colSpan={8} className="text-center py-12 text-[#64748B] dark:text-[#9CA3AF] border-b border-[#E2E8F0] dark:border-[#262626]">{busqueda ? 'No hay productos.' : 'Inventario vacío.'}</td></tr>
              ) : productosFiltrados.map((prod) => (
                <tr key={prod.id} className="hover:bg-[#F8FAFC] dark:hover:bg-[#262626]/30 transition-colors border-b border-[#E2E8F0] dark:border-[#262626] last:border-0">
                  <td className="px-6 py-4 border-none">
                    <div className="w-10 h-10 rounded-lg bg-[#F8FAFC] dark:bg-[#1A1A1A] flex items-center justify-center overflow-hidden border border-[#E2E8F0] dark:border-[#262626]">
                      {prod.imagenPrincipal ? <img src={prod.imagenPrincipal} alt={prod.nombre} className="w-full h-full object-cover" /> : <ImageIcon size={16} className="text-[#64748B] dark:text-[#9CA3AF]" />}
                    </div>
                  </td>
                  <td className="px-6 py-4 border-none">
                    <div className="font-bold text-[#0F172A] dark:text-[#F3F4F6]">{prod.nombre}</div>
                    {/* AHORA MUESTRA EL SKU Y EL SLUG EN LA TABLA */}
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] text-[#64748B] dark:text-[#9CA3AF] font-mono border border-[#E2E8F0] dark:border-[#262626] px-1.5 py-0.5 rounded bg-[#F8FAFC] dark:bg-[#000000]">SKU: {prod.sku}</span>
                      <span className="text-[10px] text-[#64748B] dark:text-[#9CA3AF] font-mono border border-[#E2E8F0] dark:border-[#262626] px-1.5 py-0.5 rounded bg-[#F8FAFC] dark:bg-[#000000]">/{prod.slug}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 border-none">
                    <div className="text-sm font-medium text-[#0F172A] dark:text-[#F3F4F6]">{prod.marca || '-'}</div>
                    <div className="text-xs text-[#64748B] dark:text-[#9CA3AF] mt-0.5">{prod.modelo || '-'}</div>
                  </td>
                  <td className="px-6 py-4 border-none">
                    <span className="px-2.5 py-1 bg-blue-50 dark:bg-[#1A1A1A] text-[#1D4ED8] rounded-md text-xs font-semibold border border-blue-100 dark:border-[#262626]">{prod.categoria?.nombre || '-'}</span>
                  </td>
                  <td className="px-6 py-4 text-right font-bold text-[#0F172A] dark:text-[#F3F4F6] font-mono border-none">
                    S/ {prod.precio?.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-center border-none">
                    <span className={`font-bold px-2.5 py-1 rounded-md text-xs border ${prod.stock > 5 ? 'text-[#059669] bg-green-50 border-green-200 dark:bg-[#1A1A1A] dark:border-[#262626]' : 'text-[#DC2626] bg-red-50 border-red-200 dark:bg-[#1A1A1A] dark:border-[#262626]'}`}>{prod.stock}</span>
                  </td>
                  <td className="px-6 py-4 text-center border-none">
                    {prod.isActivo ? (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#059669]"><CheckCircle2 size={14}/> Activo</span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#64748B] dark:text-[#9CA3AF]"><XCircle size={14}/> Inactivo</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center border-none">
                    <div className="flex justify-center gap-2">
                      <button onClick={() => abrirModalEditar(prod)} className="cursor-pointer p-1.5 text-[#1D4ED8] hover:bg-blue-50 dark:hover:bg-[#262626] rounded-md transition-colors"><Edit2 size={16} /></button>
                      <button onClick={() => confirmarEliminar(prod.id, prod.nombre)} className="cursor-pointer p-1.5 text-[#DC2626] hover:bg-red-50 dark:hover:bg-[#262626] rounded-md transition-colors"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* =====================================================================
          TÍTULO: 10.3 MODAL DE FORMULARIO (CREAR / EDITAR)
      ===================================================================== */}
      {isModalCrudOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#FFFFFF] dark:bg-[#121212] rounded-xl w-full max-w-4xl flex flex-col max-h-[90vh] border border-[#E2E8F0] dark:border-[#262626] shadow-2xl overflow-hidden">
            
            <div className="flex justify-between items-center p-5 border-b border-[#E2E8F0] dark:border-[#262626] bg-[#F8FAFC] dark:bg-[#1A1A1A] shrink-0">
              <h2 className="font-bold text-[#0F172A] dark:text-[#F3F4F6] flex items-center gap-2">
                <Package size={20} className="text-[#1D4ED8]"/> 
                {modoModal === 'crear' ? 'Registrar Nuevo Producto' : 'Editar Ficha Técnica'}
              </h2>
              <button onClick={() => setIsModalCrudOpen(false)} className="cursor-pointer text-[#64748B] hover:text-[#DC2626] transition-colors"><X size={20} /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
              <div className="p-6 overflow-y-auto flex-1">
                <div className="flex flex-col lg:flex-row gap-6">
                  
                  {/* Lado Izquierdo: Inputs de Texto */}
                  <div className="flex-1 space-y-5">
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-[#64748B] dark:text-[#9CA3AF] uppercase tracking-widest mb-1.5">SKU (Código) *</label>
                        <input type="text" required value={formData.sku} onChange={e=>setFormData({...formData, sku: e.target.value.toUpperCase()})} placeholder="Ej: CAM-001" className="w-full bg-[#FFFFFF] dark:bg-[#000000] border border-[#E2E8F0] dark:border-[#262626] p-3 rounded-md outline-none text-[#0F172A] dark:text-[#F3F4F6] text-sm font-mono" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-[#64748B] dark:text-[#9CA3AF] uppercase tracking-widest mb-1.5">Categoría *</label>
                        <select required value={formData.categoriaId} onChange={e=>setFormData({...formData, categoriaId: e.target.value})} className="w-full bg-[#FFFFFF] dark:bg-[#000000] border border-[#E2E8F0] dark:border-[#262626] p-3 rounded-md outline-none text-[#0F172A] dark:text-[#F3F4F6] text-sm cursor-pointer">
                          <option value="" disabled>Seleccione categoría</option>
                          {categorias.map(c=><option key={c.id} value={c.id}>{c.nombre}</option>)}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-[#64748B] dark:text-[#9CA3AF] uppercase tracking-widest mb-1.5">Nombre del Producto *</label>
                      <input type="text" required value={formData.nombre} onChange={e=>manejarCambioNombre(e.target.value)} placeholder="Ej: Cámara Domo PTZ Full HD" className="w-full bg-[#FFFFFF] dark:bg-[#000000] border border-[#E2E8F0] dark:border-[#262626] p-3 rounded-md outline-none text-[#0F172A] dark:text-[#F3F4F6] text-sm" />
                    </div>

                    {/* NUEVO CAMPO: SLUG */}
                    <div>
                      <label className="flex items-center gap-1.5 text-[10px] font-bold text-[#64748B] dark:text-[#9CA3AF] uppercase tracking-widest mb-1.5">
                        <LinkIcon size={12}/> URL Amigable (Slug) *
                      </label>
                      <input type="text" required value={formData.slug} onChange={e=>setFormData({...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-')})} className="w-full bg-[#F8FAFC] dark:bg-[#1A1A1A] border border-[#E2E8F0] dark:border-[#262626] p-3 rounded-md outline-none text-[#64748B] dark:text-[#9CA3AF] text-xs font-mono" />
                      <p className="text-[10px] text-[#64748B] dark:text-[#9CA3AF] mt-1.5">Ruta web: /productos/{formData.slug || '...'}</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-[#64748B] dark:text-[#9CA3AF] uppercase tracking-widest mb-1.5">Marca</label>
                        <input type="text" value={formData.marca} onChange={e=>setFormData({...formData, marca: e.target.value})} placeholder="Ej: Hikvision" className="w-full bg-[#FFFFFF] dark:bg-[#000000] border border-[#E2E8F0] dark:border-[#262626] p-3 rounded-md outline-none text-[#0F172A] dark:text-[#F3F4F6] text-sm" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-[#64748B] dark:text-[#9CA3AF] uppercase tracking-widest mb-1.5">Modelo</label>
                        <input type="text" value={formData.modelo} onChange={e=>setFormData({...formData, modelo: e.target.value})} placeholder="Ej: DS-2CE56D0T" className="w-full bg-[#FFFFFF] dark:bg-[#000000] border border-[#E2E8F0] dark:border-[#262626] p-3 rounded-md outline-none text-[#0F172A] dark:text-[#F3F4F6] text-sm" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-[#64748B] dark:text-[#9CA3AF] uppercase tracking-widest mb-1.5">Descripción Detallada *</label>
                      <textarea required value={formData.descripcion} onChange={e=>setFormData({...formData, descripcion: e.target.value})} placeholder="Especificaciones principales..." className="w-full bg-[#FFFFFF] dark:bg-[#000000] border border-[#E2E8F0] dark:border-[#262626] p-3 rounded-md outline-none text-[#0F172A] dark:text-[#F3F4F6] text-sm min-h-[100px] resize-none"></textarea>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-[#F8FAFC] dark:bg-[#1A1A1A] p-4 rounded-md border border-[#E2E8F0] dark:border-[#262626]">
                      <div>
                        <label className="block text-[10px] font-bold text-[#64748B] dark:text-[#9CA3AF] uppercase tracking-widest mb-1.5">Precio (S/) *</label>
                        <input type="number" step="0.01" required value={formData.precio} onChange={e=>setFormData({...formData, precio: e.target.value})} className="w-full bg-[#FFFFFF] dark:bg-[#000000] border border-[#E2E8F0] dark:border-[#262626] p-3 rounded-md outline-none text-[#0F172A] dark:text-[#F3F4F6] text-sm font-mono" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-[#64748B] dark:text-[#9CA3AF] uppercase tracking-widest mb-1.5">Stock *</label>
                        <input type="number" required value={formData.stock} onChange={e=>setFormData({...formData, stock: e.target.value})} className="w-full bg-[#FFFFFF] dark:bg-[#000000] border border-[#E2E8F0] dark:border-[#262626] p-3 rounded-md outline-none text-[#0F172A] dark:text-[#F3F4F6] text-sm font-mono" />
                      </div>
                      <div className="flex flex-col justify-end">
                         <label className="flex items-center justify-center gap-2 cursor-pointer p-3 border border-[#E2E8F0] dark:border-[#262626] rounded-md bg-[#FFFFFF] dark:bg-[#000000] hover:bg-[#E2E8F0] dark:hover:bg-[#262626] h-full transition-colors">
                           <input type="checkbox" checked={formData.isActivo} onChange={(e) => setFormData({...formData, isActivo: e.target.checked})} className="w-4 h-4 cursor-pointer accent-[#1D4ED8]" />
                           <span className="text-sm font-bold text-[#0F172A] dark:text-[#F3F4F6]">Activo</span>
                         </label>
                      </div>
                    </div>
                  </div>

                  {/* Lado Derecho: Zonas Drag & Drop */}
                  <div className="w-full lg:w-72 flex flex-col gap-5 border-t lg:border-t-0 lg:border-l border-[#E2E8F0] dark:border-[#262626] pt-5 lg:pt-0 lg:pl-6">
                    <div>
                      <label className="block text-[10px] font-bold text-[#64748B] dark:text-[#9CA3AF] uppercase tracking-widest mb-1.5">Imagen Principal (Catálogo)</label>
                      <div 
                        className="relative w-full h-48 rounded-xl border-2 border-dashed border-[#E2E8F0] dark:border-[#262626] bg-[#F8FAFC] dark:bg-[#1A1A1A] hover:bg-[#E2E8F0] dark:hover:bg-[#262626]/50 transition-colors flex flex-col items-center justify-center cursor-pointer overflow-hidden group"
                        onDragOver={(e) => e.preventDefault()} onDrop={(e) => handleDrop(e, 'principal')} onClick={() => inputPrincipalRef.current?.click()}
                      >
                        <input type="file" className="hidden" ref={inputPrincipalRef} onChange={(e) => e.target.files?.[0] && subirImagen(e.target.files[0], 'principal')} accept="image/*" />
                        {subiendoImagen ? ( <Loader2 size={32} className="animate-spin text-[#1D4ED8]" /> ) : formData.imagenPrincipal ? (
                          <>
                            <img src={formData.imagenPrincipal} alt="Principal" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                              <span className="text-white text-xs font-bold flex items-center gap-2"><Edit2 size={14}/> Cambiar</span>
                            </div>
                          </>
                        ) : (
                          <div className="text-center p-4">
                            <UploadCloud size={32} className="mx-auto text-[#64748B] dark:text-[#9CA3AF] mb-2" />
                            <p className="text-xs text-[#64748B] dark:text-[#9CA3AF] font-medium">Arrastra una imagen o clic para buscar</p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-[#64748B] dark:text-[#9CA3AF] uppercase tracking-widest mb-1.5">Galería de Fotos (Opcional)</label>
                      <div 
                        className="w-full p-3 rounded-lg border-2 border-dashed border-[#E2E8F0] dark:border-[#262626] bg-[#F8FAFC] dark:bg-[#1A1A1A] hover:border-[#1D4ED8] transition-colors cursor-pointer text-center"
                        onDragOver={(e) => e.preventDefault()} onDrop={(e) => handleDrop(e, 'galeria')} onClick={() => inputGaleriaRef.current?.click()}
                      >
                        <input type="file" className="hidden" ref={inputGaleriaRef} onChange={(e) => e.target.files?.[0] && subirImagen(e.target.files[0], 'galeria')} accept="image/*" />
                        <span className="text-xs text-[#1D4ED8] font-bold flex items-center justify-center gap-2">
                          <Plus size={14}/> {subiendoImagen ? 'Subiendo...' : 'Agregar Foto'}
                        </span>
                      </div>

                      {formData.galeria.length > 0 && (
                        <div className="grid grid-cols-3 gap-2 mt-3">
                          {formData.galeria.map((url, i) => (
                            <div key={i} className="relative aspect-square rounded-md overflow-hidden group border border-[#E2E8F0] dark:border-[#262626]">
                              <img src={url} alt="Galeria" className="w-full h-full object-cover" />
                              <button type="button" onClick={() => quitarImagenGaleria(i)} className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow-lg">
                                <X size={12} />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Botones Fijos Abajo */}
              <div className="p-4 border-t border-[#E2E8F0] dark:border-[#262626] bg-[#F8FAFC] dark:bg-[#1A1A1A] shrink-0 flex gap-3">
                <button type="button" onClick={()=>setIsModalCrudOpen(false)} className="cursor-pointer flex-1 bg-[#FFFFFF] dark:bg-[#000000] border border-[#E2E8F0] dark:border-[#262626] hover:bg-[#E2E8F0] dark:hover:bg-[#262626] py-3 rounded-md font-medium text-[#0F172A] dark:text-[#F3F4F6] transition-colors">
                  Cancelar
                </button>
                <button type="submit" disabled={cargandoForm || subiendoImagen} className="cursor-pointer flex-[2] bg-[#1D4ED8] hover:bg-[#1E40AF] text-white py-3 rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2">
                  {cargandoForm ? <Loader2 size={16} className="animate-spin" /> : null}
                  {cargandoForm ? 'Guardando...' : (modoModal === 'crear' ? 'Guardar Producto' : 'Actualizar Producto')}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* 10.4 MODAL DE CONFIRMACIÓN DE ELIMINAR */}
      {modalEliminar.isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#FFFFFF] dark:bg-[#121212] rounded-xl w-full max-w-sm overflow-hidden border border-[#E2E8F0] dark:border-[#262626] shadow-2xl p-6 text-center">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4"><AlertTriangle size={32} className="text-[#DC2626]" /></div>
            <h3 className="text-xl font-bold text-[#0F172A] dark:text-[#F3F4F6] mb-2">¿Eliminar Producto?</h3>
            <p className="text-[#64748B] dark:text-[#9CA3AF] text-sm mb-6">Estás a punto de borrar <strong>{modalEliminar.nombre}</strong>.</p>
            <div className="flex gap-3">
              <button onClick={() => setModalEliminar({ isOpen: false, id: '', nombre: '' })} className="cursor-pointer flex-1 bg-[#F8FAFC] dark:bg-[#000000] border border-[#E2E8F0] dark:border-[#262626] hover:bg-[#E2E8F0] py-3 rounded-md font-medium text-[#0F172A] dark:text-[#F3F4F6] transition-colors">Cancelar</button>
              <button onClick={ejecutarEliminacion} className="cursor-pointer flex-1 bg-[#DC2626] hover:bg-[#991B1B] text-white py-3 rounded-md font-medium transition-colors">Sí, eliminar</button>
            </div>
          </div>
        </div>
      )}

      {/* 10.5 SISTEMA DE ALERTAS GLOBALES (TOAST) */}
      {alertaSistema.isOpen && (
        <div className="fixed bottom-6 right-6 z-[70] animate-in slide-in-from-bottom-5 fade-in duration-300">
          <div className={`flex items-center gap-3 px-6 py-4 rounded-lg shadow-xl border ${alertaSistema.tipo === 'exito' ? 'bg-[#059669] border-[#047857]' : 'bg-[#DC2626] border-[#991B1B]'} text-white`}>
            {alertaSistema.tipo === 'exito' ? <CheckCircle2 size={24} /> : <XCircle size={24} />}
            <span className="font-medium">{alertaSistema.mensaje}</span>
            <button onClick={() => setAlertaSistema({ ...alertaSistema, isOpen: false })} className="cursor-pointer ml-2 hover:opacity-75 transition-opacity"><X size={18} /></button>
          </div>
        </div>
      )}

    </div>
  );
}