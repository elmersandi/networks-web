'use client';

import { useState, useEffect } from 'react';
import { Search, Plus, Edit2, Trash2, Package, X, Server, Loader2, Image as ImageIcon, AlertCircle, CheckCircle2, XCircle } from 'lucide-react';

interface Categoria { id: string; nombre: string; }
interface Producto { 
  id: string; 
  sku: string; 
  nombre: string; 
  modelo?: string | null; 
  descripcion: string; 
  marca?: string | null; 
  precio: number; 
  stock: number; 
  imagenUrl?: string | null; 
  isActivo: boolean; 
  categoriaId: string; 
  categoria?: Categoria; 
}

export default function InventarioPage() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [cargandoDatos, setCargandoDatos] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cargandoForm, setCargandoForm] = useState(false);
  
  // FORMULARIO CON TODOS LOS CAMPOS DE LA BASE DE DATOS
  const formInicial = { sku: '', nombre: '', modelo: '', descripcion: '', marca: '', precio: '', stock: '', imagenUrl: '', categoriaId: '', isActivo: true };
  const [formData, setFormData] = useState(formInicial);

  const cargarDatos = async () => {
    try {
      const [resProd, resCat] = await Promise.all([fetch('/api/productos'), fetch('/api/categorias')]);
      const dataProd = await resProd.json();
      const dataCat = await resCat.json();
      if (Array.isArray(dataProd)) setProductos(dataProd);
      if (Array.isArray(dataCat)) {
        setCategorias(dataCat);
        if (dataCat.length > 0) setFormData(prev => ({ ...prev, categoriaId: dataCat[0].id }));
      }
    } catch (error) { console.error(error); } finally { setCargandoDatos(false); }
  };

  useEffect(() => { cargarDatos(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCargandoForm(true);
    try {
      const res = await fetch('/api/productos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          ...formData, 
          precio: parseFloat(formData.precio), 
          stock: parseInt(formData.stock) 
        }),
      });
      if (res.ok) {
        const nuevo = await res.json();
        const cat = categorias.find(c => c.id === nuevo.categoriaId);
        setProductos(prev => [{ ...nuevo, categoria: cat }, ...prev]);
        setIsModalOpen(false);
        setFormData({ ...formInicial, categoriaId: categorias.length > 0 ? categorias[0].id : '' });
      } else { alert("Error al guardar. Verifica que el SKU no esté duplicado."); }
    } catch (error) { console.error(error); } finally { setCargandoForm(false); }
  };

  const eliminarProducto = async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar este producto del sistema?")) return;
    try {
      const res = await fetch(`/api/productos?id=${id}`, { method: 'DELETE' });
      if (res.ok) setProductos(prev => prev.filter(p => p.id !== id));
    } catch (error) { console.error(error); }
  };

  return (
    <div className="space-y-8 relative transition-colors">
      {/* CABECERA */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Inventario Maestro</h1>
          <p className="text-slate-500 dark:text-neutral-400 mt-1 text-sm">Gestiona todos los campos de los productos en la base de datos.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="flex items-center justify-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-sm hover:bg-blue-700 transition-all active:scale-95">
          <Plus size={18} /> Nuevo Producto
        </button>
      </div>

      {/* TABLA PRINCIPAL */}
      <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-2xl shadow-sm overflow-hidden transition-colors">
        <div className="p-4 border-b border-slate-100 dark:border-neutral-800 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-800 dark:text-white">Lista Completa de Productos</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 dark:bg-neutral-950 border-b border-slate-200 dark:border-neutral-800 text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-neutral-500">
              <tr>
                <th className="px-6 py-4">Imagen</th>
                <th className="px-6 py-4">Producto & SKU</th>
                <th className="px-6 py-4">Marca & Modelo</th>
                <th className="px-6 py-4">Categoría</th>
                <th className="px-6 py-4 text-right">Precio</th>
                <th className="px-6 py-4 text-center">Stock</th>
                <th className="px-6 py-4 text-center">Estado</th>
                <th className="px-6 py-4 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-neutral-800">
              {cargandoDatos ? (
                <tr><td colSpan={8} className="text-center py-12 text-slate-400 dark:text-neutral-600"><Loader2 className="animate-spin mx-auto mb-2" size={24} />Cargando base de datos...</td></tr>
              ) : productos.length === 0 ? (
                <tr><td colSpan={8} className="text-center py-12 text-slate-400 dark:text-neutral-500">El inventario está vacío.</td></tr>
              ) : productos.map((prod) => (
                <tr key={prod.id} className="hover:bg-slate-50/50 dark:hover:bg-neutral-800/50 transition-colors">
                  
                  {/* IMAGEN */}
                  <td className="px-6 py-4">
                    <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-neutral-800 flex items-center justify-center overflow-hidden border border-slate-200 dark:border-neutral-700">
                      {prod.imagenUrl ? <img src={prod.imagenUrl} alt="prod" className="w-full h-full object-cover" /> : <ImageIcon size={16} className="text-slate-400 dark:text-neutral-600" />}
                    </div>
                  </td>

                  {/* PRODUCTO Y SKU */}
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-900 dark:text-white">{prod.nombre}</div>
                    <div className="text-xs text-slate-500 dark:text-neutral-400 font-mono mt-0.5 border border-slate-200 dark:border-neutral-700 inline-block px-1.5 rounded bg-slate-50 dark:bg-neutral-950">{prod.sku}</div>
                  </td>

                  {/* MARCA Y MODELO */}
                  <td className="px-6 py-4">
                    <div className="text-sm text-slate-700 dark:text-neutral-300 font-medium">{prod.marca || '-'}</div>
                    <div className="text-xs text-slate-500 dark:text-neutral-500">{prod.modelo || '-'}</div>
                  </td>

                  {/* CATEGORÍA */}
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg text-xs font-bold border border-blue-100 dark:border-blue-900/50">
                      {prod.categoria?.nombre || '-'}
                    </span>
                  </td>

                  {/* PRECIO Y STOCK */}
                  <td className="px-6 py-4 text-right font-bold text-slate-700 dark:text-neutral-200">S/ {prod.precio?.toFixed(2)}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`font-bold px-2 py-1 rounded-md text-xs ${prod.stock > 5 ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20' : 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-900/20'}`}>
                      {prod.stock}
                    </span>
                  </td>

                  {/* ESTADO ACTIVO/INACTIVO */}
                  <td className="px-6 py-4 text-center">
                    {prod.isActivo ? (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400"><CheckCircle2 size={14}/> Activo</span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-400 dark:text-neutral-500"><XCircle size={14}/> Inactivo</span>
                    )}
                  </td>

                  {/* ACCIONES */}
                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-2">
                      <button className="p-1.5 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-md transition-colors"><Edit2 size={16} /></button>
                      <button onClick={() => eliminarProducto(prod.id)} className="p-1.5 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-md transition-colors"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL DE REGISTRO CON TODOS LOS CAMPOS */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 dark:bg-black/60 backdrop-blur-[2px]">
          <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] border border-slate-200 dark:border-neutral-800">
            
            <div className="flex justify-between items-center p-5 border-b border-slate-100 dark:border-neutral-800 shrink-0 bg-slate-50 dark:bg-neutral-950">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2"><Package size={20} className="text-blue-600 dark:text-blue-500"/> Ficha Técnica de Producto</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-rose-600 transition-colors"><X size={20} /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5">
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 dark:text-neutral-400 uppercase tracking-widest mb-1.5">SKU (Código único)</label>
                  <input type="text" required value={formData.sku} onChange={e=>setFormData({...formData, sku: e.target.value.toUpperCase()})} placeholder="Ej: CAM-001" className="w-full bg-white dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 p-2.5 rounded-xl focus:border-blue-500 dark:focus:border-blue-500 outline-none dark:text-white text-sm" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 dark:text-neutral-400 uppercase tracking-widest mb-1.5">Categoría</label>
                  <select required value={formData.categoriaId} onChange={e=>setFormData({...formData, categoriaId: e.target.value})} className="w-full bg-white dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 p-2.5 rounded-xl focus:border-blue-500 dark:focus:border-blue-500 outline-none dark:text-white text-sm">
                    {categorias.map(c=><option key={c.id} value={c.id}>{c.nombre}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 dark:text-neutral-400 uppercase tracking-widest mb-1.5">Nombre del Producto</label>
                <input type="text" required value={formData.nombre} onChange={e=>setFormData({...formData, nombre: e.target.value})} placeholder="Ej: Cámara Domo PTZ" className="w-full bg-white dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 p-2.5 rounded-xl focus:border-blue-500 dark:focus:border-blue-500 outline-none dark:text-white text-sm" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 dark:text-neutral-400 uppercase tracking-widest mb-1.5">Marca</label>
                  <input type="text" value={formData.marca} onChange={e=>setFormData({...formData, marca: e.target.value})} placeholder="Ej: Hikvision" className="w-full bg-white dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 p-2.5 rounded-xl focus:border-blue-500 dark:focus:border-blue-500 outline-none dark:text-white text-sm" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 dark:text-neutral-400 uppercase tracking-widest mb-1.5">Modelo</label>
                  <input type="text" value={formData.modelo} onChange={e=>setFormData({...formData, modelo: e.target.value})} placeholder="Ej: DS-2CE56D0T-IRPF" className="w-full bg-white dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 p-2.5 rounded-xl focus:border-blue-500 dark:focus:border-blue-500 outline-none dark:text-white text-sm" />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 dark:text-neutral-400 uppercase tracking-widest mb-1.5">Descripción Detallada</label>
                <textarea required value={formData.descripcion} onChange={e=>setFormData({...formData, descripcion: e.target.value})} placeholder="Especificaciones del producto..." className="w-full bg-white dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 p-2.5 rounded-xl focus:border-blue-500 dark:focus:border-blue-500 outline-none min-h-[80px] dark:text-white text-sm resize-none"></textarea>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 dark:text-neutral-400 uppercase tracking-widest mb-1.5">URL de la Imagen</label>
                <input type="text" value={formData.imagenUrl || ""} onChange={e=>setFormData({...formData, imagenUrl: e.target.value})} placeholder="https://..." className="w-full bg-white dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 p-2.5 rounded-xl focus:border-blue-500 dark:focus:border-blue-500 outline-none dark:text-white text-sm" />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 dark:text-neutral-400 uppercase tracking-widest mb-1.5">Precio (S/)</label>
                  <input type="number" step="0.01" required value={formData.precio} onChange={e=>setFormData({...formData, precio: e.target.value})} className="w-full bg-white dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 p-2.5 rounded-xl focus:border-blue-500 dark:focus:border-blue-500 outline-none dark:text-white text-sm font-mono" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 dark:text-neutral-400 uppercase tracking-widest mb-1.5">Stock</label>
                  <input type="number" required value={formData.stock} onChange={e=>setFormData({...formData, stock: e.target.value})} className="w-full bg-white dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 p-2.5 rounded-xl focus:border-blue-500 dark:focus:border-blue-500 outline-none dark:text-white text-sm font-mono" />
                </div>
                <div className="flex flex-col justify-end">
                   <label className="flex items-center gap-2 cursor-pointer p-2.5 border border-slate-200 dark:border-neutral-800 rounded-xl bg-slate-50 dark:bg-neutral-950 hover:bg-slate-100 dark:hover:bg-neutral-800 transition-colors">
                     <input type="checkbox" checked={formData.isActivo} onChange={(e) => setFormData({...formData, isActivo: e.target.checked})} className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500" />
                     <span className="text-sm font-bold text-slate-700 dark:text-neutral-300">Activo en Web</span>
                   </label>
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-slate-100 dark:border-neutral-800">
                <button type="button" onClick={()=>setIsModalOpen(false)} className="flex-1 bg-slate-100 dark:bg-neutral-800 hover:bg-slate-200 dark:hover:bg-neutral-700 py-3 rounded-xl font-bold text-slate-600 dark:text-neutral-300 transition-colors">Cancelar</button>
                <button type="submit" disabled={cargandoForm} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold transition-colors shadow-lg shadow-blue-600/20 disabled:opacity-50">
                  {cargandoForm ? 'Guardando...' : 'Guardar Producto'}
                </button>
              </div>
            </form>
            
          </div>
        </div>
      )}
    </div>
  );
}