'use client';

import { useState, useEffect } from 'react';
import { Search, Plus, Edit2, Trash2, Tags, X, Loader2 } from 'lucide-react';

interface Categoria { 
  id: string; 
  nombre: string; 
  slug: string; 
  descripcion: string | null; 
  _count?: { productos: number }; 
}

export default function CategoriasPage() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [cargandoDatos, setCargandoDatos] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cargandoForm, setCargandoForm] = useState(false);
  const [formData, setFormData] = useState({ nombre: '', slug: '', descripcion: '' });

  // Autogenera el "slug" (ej: "Cámaras de Seguridad" -> "camaras-de-seguridad")
  const generarSlug = (texto: string) => {
    setFormData({ 
      ...formData, 
      nombre: texto, 
      slug: texto.toLowerCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[\W_]+/g, "-") 
    });
  };

  useEffect(() => {
    fetch('/api/categorias')
      .then(r => r.json())
      .then(d => { 
        if(Array.isArray(d)) setCategorias(d); 
        setCargandoDatos(false); 
      })
      .catch(e => { console.error(e); setCargandoDatos(false); });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); 
    setCargandoForm(true);
    try {
      const res = await fetch('/api/categorias', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify(formData) 
      });
      
      if(res.ok) { 
        const n = await res.json(); 
        setCategorias(p => [{...n, _count:{productos:0}}, ...p]); 
        setIsModalOpen(false); 
        setFormData({nombre:'', slug:'', descripcion:''}); 
      } else { 
        alert("Error al guardar. Verifica que el nombre o slug no estén repetidos."); 
      }
    } catch(error) {
      console.error(error);
    } finally {
      setCargandoForm(false);
    }
  };

  const eliminarCategoria = async (id: string) => {
    if(confirm("¿Estás seguro de eliminar esta categoría? (Asegúrate de que no tenga productos asociados)")) { 
      try {
        const res = await fetch(`/api/categorias?id=${id}`, { method: 'DELETE' }); 
        if(res.ok) setCategorias(p => p.filter(c => c.id !== id)); 
        else alert("No se puede eliminar una categoría que ya tiene productos.");
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <div className="space-y-8 relative transition-colors">
      
      {/* CABECERA */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Categorías</h1>
          <p className="text-slate-500 dark:text-neutral-400 mt-1 text-sm">Clasificación de productos en la tienda.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="flex items-center justify-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold shadow-sm hover:bg-blue-700 transition-all active:scale-95">
          <Plus size={18} /> Nueva Categoría
        </button>
      </div>

      {/* TABLA PRINCIPAL */}
      <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-2xl shadow-sm overflow-hidden transition-colors">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 dark:bg-neutral-950 border-b border-slate-200 dark:border-neutral-800 text-[10px] font-bold uppercase text-slate-500 dark:text-neutral-500">
              <tr>
                <th className="px-6 py-4">Nombre de Categoría</th>
                <th className="px-6 py-4">Descripción</th>
                <th className="px-6 py-4">URL (Slug)</th>
                <th className="px-6 py-4 text-center">Productos</th>
                <th className="px-6 py-4 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-neutral-800">
              {cargandoDatos ? (
                <tr><td colSpan={5} className="text-center py-12 text-slate-400 dark:text-neutral-600"><Loader2 className="animate-spin mx-auto mb-2" size={24} />Cargando...</td></tr>
              ) : categorias.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-12 text-slate-400 dark:text-neutral-500">Sin categorías registradas.</td></tr>
              ) : categorias.map((cat) => (
                <tr key={cat.id} className="hover:bg-slate-50/50 dark:hover:bg-neutral-800/50 transition-colors">
                  <td className="px-6 py-4 font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Tags size={16} className="text-blue-500" />
                    {cat.nombre}
                  </td>
                  <td className="px-6 py-4 text-slate-600 dark:text-neutral-400 text-xs truncate max-w-[200px]">
                    {cat.descripcion || <span className="italic text-slate-400 dark:text-neutral-600">Sin descripción</span>}
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-slate-500 dark:text-neutral-400 font-mono text-xs bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 px-2 py-1 rounded">/{cat.slug}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="font-bold text-slate-700 dark:text-neutral-300">{cat._count?.productos || 0}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex justify-center gap-2">
                      <button className="p-1.5 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-md transition-colors"><Edit2 size={16} /></button>
                      <button onClick={()=>eliminarCategoria(cat.id)} className="p-1.5 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-md transition-colors"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL DE NUEVA CATEGORÍA */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 dark:bg-black/60 backdrop-blur-[2px]">
          <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-200 dark:border-neutral-800">
            
            <div className="p-5 border-b border-slate-100 dark:border-neutral-800 bg-slate-50 dark:bg-neutral-950 flex justify-between items-center">
              <h2 className="font-bold text-slate-900 dark:text-white flex items-center gap-2"><Tags size={18} className="text-blue-500"/> Nueva Categoría</h2>
              <button onClick={()=>setIsModalOpen(false)} className="text-slate-400 hover:text-rose-500 transition-colors"><X size={20}/></button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 dark:text-neutral-400 uppercase tracking-widest mb-1.5">Nombre de la Categoría</label>
                <input type="text" required value={formData.nombre} onChange={e=>generarSlug(e.target.value)} placeholder="Ej: Cámaras de Seguridad" className="w-full bg-white dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 p-3 rounded-lg outline-none focus:border-blue-500 dark:focus:border-blue-500 text-sm dark:text-white transition-colors" />
              </div>
              
              <div>
                <label className="block text-[10px] font-bold text-slate-500 dark:text-neutral-400 uppercase tracking-widest mb-1.5">Descripción (Opcional)</label>
                <textarea value={formData.descripcion} onChange={e=>setFormData({...formData, descripcion: e.target.value})} placeholder="Breve detalle..." className="w-full bg-white dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 p-3 rounded-lg outline-none focus:border-blue-500 dark:focus:border-blue-500 text-sm dark:text-white resize-none h-20 transition-colors"></textarea>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 dark:text-neutral-400 uppercase tracking-widest mb-1.5">URL Amigable (Slug)</label>
                <input type="text" readOnly value={formData.slug} className="w-full bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 p-3 rounded-lg outline-none text-slate-400 dark:text-neutral-500 font-mono text-xs cursor-not-allowed transition-colors" />
                <p className="text-[10px] text-slate-400 dark:text-neutral-600 mt-1">Se genera automáticamente para el link de la tienda.</p>
              </div>
              
              <div className="pt-2 border-t border-slate-100 dark:border-neutral-800">
                <button type="submit" disabled={cargandoForm} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 mt-2 rounded-lg font-bold transition-all disabled:opacity-50 shadow-lg shadow-blue-600/20">
                  {cargandoForm ? 'Guardando...' : 'Guardar Categoría'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}