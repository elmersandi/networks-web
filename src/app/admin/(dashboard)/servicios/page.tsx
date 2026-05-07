'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Wrench, X, Loader2, Image as ImageIcon, CheckCircle2, XCircle } from 'lucide-react';

interface Servicio {
  id: string;
  nombre: string;
  slug: string;
  descripcion: string;
  imagenUrl?: string | null;
  isActivo: boolean;
}

export default function ServiciosPage() {
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [cargandoDatos, setCargandoDatos] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cargandoForm, setCargandoForm] = useState(false);
  
  const formInicial = { nombre: '', slug: '', descripcion: '', imagenUrl: '', isActivo: true };
  const [formData, setFormData] = useState(formInicial);

  // Autogenera el slug basado en el nombre del servicio
  const generarSlug = (texto: string) => {
    setFormData({ 
      ...formData, 
      nombre: texto, 
      slug: texto.toLowerCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[\W_]+/g, "-") 
    });
  };

  const cargarDatos = async () => {
    try {
      const res = await fetch('/api/servicios');
      const data = await res.json();
      if (Array.isArray(data)) setServicios(data);
    } catch (error) {
      console.error(error);
    } finally {
      setCargandoDatos(false);
    }
  };

  useEffect(() => { cargarDatos(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCargandoForm(true);
    try {
      const res = await fetch('/api/servicios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      if (res.ok) {
        const nuevo = await res.json();
        setServicios(prev => [nuevo, ...prev]);
        setIsModalOpen(false);
        setFormData(formInicial);
      } else {
        alert("Error al guardar. Verifica que el nombre o slug no estén duplicados.");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setCargandoForm(false);
    }
  };

  const eliminarServicio = async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar este servicio?")) return;
    try {
      const res = await fetch(`/api/servicios?id=${id}`, { method: 'DELETE' });
      if (res.ok) setServicios(prev => prev.filter(s => s.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="space-y-8 relative transition-colors">
      
      {/* CABECERA */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Servicios Corporativos</h1>
          <p className="text-slate-500 dark:text-neutral-400 mt-1 text-sm">Gestiona la oferta de servicios de infraestructura y telecomunicaciones.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="flex items-center justify-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-sm hover:bg-blue-700 transition-all active:scale-95">
          <Plus size={18} /> Nuevo Servicio
        </button>
      </div>

      {/* TABLA PRINCIPAL */}
      <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-2xl shadow-sm overflow-hidden transition-colors">
        <div className="p-4 border-b border-slate-100 dark:border-neutral-800 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-800 dark:text-white">Catálogo de Servicios</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 dark:bg-neutral-950 border-b border-slate-200 dark:border-neutral-800 text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-neutral-500">
              <tr>
                <th className="px-6 py-4">Portada</th>
                <th className="px-6 py-4">Servicio & URL</th>
                <th className="px-6 py-4">Descripción</th>
                <th className="px-6 py-4 text-center">Estado</th>
                <th className="px-6 py-4 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-neutral-800">
              {cargandoDatos ? (
                <tr><td colSpan={5} className="text-center py-12 text-slate-400 dark:text-neutral-600"><Loader2 className="animate-spin mx-auto mb-2" size={24} />Cargando datos...</td></tr>
              ) : servicios.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-12 text-slate-400 dark:text-neutral-500">Aún no hay servicios registrados en la base de datos.</td></tr>
              ) : servicios.map((servicio) => (
                <tr key={servicio.id} className="hover:bg-slate-50/50 dark:hover:bg-neutral-800/50 transition-colors">
                  
                  {/* IMAGEN */}
                  <td className="px-6 py-4">
                    <div className="w-12 h-10 rounded-lg bg-slate-100 dark:bg-neutral-800 flex items-center justify-center overflow-hidden border border-slate-200 dark:border-neutral-700">
                      {servicio.imagenUrl ? <img src={servicio.imagenUrl} alt="srv" className="w-full h-full object-cover" /> : <ImageIcon size={16} className="text-slate-400 dark:text-neutral-600" />}
                    </div>
                  </td>

                  {/* NOMBRE Y SLUG */}
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <Wrench size={14} className="text-blue-500 hidden sm:block" />
                      {servicio.nombre}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-neutral-400 font-mono mt-0.5">/{servicio.slug}</div>
                  </td>

                  {/* DESCRIPCIÓN */}
                  <td className="px-6 py-4 text-slate-600 dark:text-neutral-400 text-xs truncate max-w-[250px] whitespace-normal line-clamp-2">
                    {servicio.descripcion}
                  </td>

                  {/* ESTADO */}
                  <td className="px-6 py-4 text-center">
                    {servicio.isActivo ? (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded-md border border-emerald-100 dark:border-emerald-900/50"><CheckCircle2 size={14}/> Visible</span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 dark:text-neutral-400 bg-slate-100 dark:bg-neutral-800 px-2 py-1 rounded-md border border-slate-200 dark:border-neutral-700"><XCircle size={14}/> Oculto</span>
                    )}
                  </td>

                  {/* ACCIONES */}
                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-2">
                      <button className="p-1.5 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-md transition-colors"><Edit2 size={16} /></button>
                      <button onClick={() => eliminarServicio(servicio.id)} className="p-1.5 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-md transition-colors"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL DE REGISTRO */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 dark:bg-black/60 backdrop-blur-[2px]">
          <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh] border border-slate-200 dark:border-neutral-800">
            
            <div className="flex justify-between items-center p-5 border-b border-slate-100 dark:border-neutral-800 shrink-0 bg-slate-50 dark:bg-neutral-950">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2"><Wrench size={20} className="text-blue-600 dark:text-blue-500"/> Ficha de Servicio</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-rose-600 transition-colors"><X size={20} /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5">
              
              <div>
                <label className="block text-[10px] font-bold text-slate-500 dark:text-neutral-400 uppercase tracking-widest mb-1.5">Nombre del Servicio</label>
                <input type="text" required value={formData.nombre} onChange={e => generarSlug(e.target.value)} placeholder="Ej: Instalación de Fibra Óptica" className="w-full bg-white dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 p-3 rounded-xl focus:border-blue-500 dark:focus:border-blue-500 outline-none dark:text-white text-sm transition-colors" />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 dark:text-neutral-400 uppercase tracking-widest mb-1.5">Descripción Completa</label>
                <textarea required value={formData.descripcion} onChange={e => setFormData({...formData, descripcion: e.target.value})} placeholder="Detalles de lo que incluye el servicio..." className="w-full bg-white dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 p-3 rounded-xl focus:border-blue-500 dark:focus:border-blue-500 outline-none min-h-[100px] dark:text-white text-sm resize-none transition-colors"></textarea>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 dark:text-neutral-400 uppercase tracking-widest mb-1.5">URL de la Portada (Imagen)</label>
                <input type="text" value={formData.imagenUrl || ""} onChange={e => setFormData({...formData, imagenUrl: e.target.value})} placeholder="https://ejemplo.com/foto.jpg" className="w-full bg-white dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 p-3 rounded-xl focus:border-blue-500 dark:focus:border-blue-500 outline-none dark:text-white text-sm transition-colors" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 dark:text-neutral-400 uppercase tracking-widest mb-1.5">URL Amigable (Slug)</label>
                  <input type="text" readOnly value={formData.slug} className="w-full bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 p-3 rounded-xl outline-none text-slate-400 dark:text-neutral-600 font-mono text-xs cursor-not-allowed transition-colors" />
                </div>
                
                <div className="flex flex-col justify-end">
                   <label className="flex items-center gap-2 cursor-pointer p-3 border border-slate-200 dark:border-neutral-800 rounded-xl bg-slate-50 dark:bg-neutral-950 hover:bg-slate-100 dark:hover:bg-neutral-800 transition-colors">
                     <input type="checkbox" checked={formData.isActivo} onChange={(e) => setFormData({...formData, isActivo: e.target.checked})} className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500" />
                     <span className="text-sm font-bold text-slate-700 dark:text-neutral-300">Mostrar en Web</span>
                   </label>
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-slate-100 dark:border-neutral-800">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 bg-slate-100 dark:bg-neutral-800 hover:bg-slate-200 dark:hover:bg-neutral-700 py-3 rounded-xl font-bold text-slate-600 dark:text-neutral-300 transition-colors">Cancelar</button>
                <button type="submit" disabled={cargandoForm} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold transition-colors shadow-lg shadow-blue-600/20 disabled:opacity-50">
                  {cargandoForm ? 'Guardando...' : 'Guardar Servicio'}
                </button>
              </div>
            </form>
            
          </div>
        </div>
      )}
    </div>
  );
}