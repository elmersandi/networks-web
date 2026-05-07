'use client';

import { useState, useEffect } from 'react';
import { Plus, Users, Mail, Phone, Building2, MessageSquare, Trash2, Edit2, X, Loader2, ExternalLink } from 'lucide-react';

interface Prospecto {
  id: string;
  nombre: string;
  empresa: string | null;
  ruc: string | null;
  email: string;
  telefono: string;
  requerimiento: string;
  mensaje: string | null;
  estado: string;
  createdAt?: string;
}

export default function ProspectosPage() {
  const [prospectos, setProspectos] = useState<Prospecto[]>([]);
  const [cargandoDatos, setCargandoDatos] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cargandoForm, setCargandoForm] = useState(false);

  const formInicial = { nombre: '', empresa: '', ruc: '', email: '', telefono: '', requerimiento: '', mensaje: '', estado: 'NUEVO' };
  const [formData, setFormData] = useState(formInicial);

  const cargarDatos = async () => {
    try {
      const res = await fetch('/api/prospectos');
      const data = await res.json();
      if (Array.isArray(data)) setProspectos(data);
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
      const res = await fetch('/api/prospectos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        const nuevo = await res.json();
        setProspectos(prev => [nuevo, ...prev]);
        setIsModalOpen(false);
        setFormData(formInicial);
      } else {
        alert("Error al guardar prospecto.");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setCargandoForm(false);
    }
  };

  const eliminarProspecto = async (id: string) => {
    if (!confirm("¿Eliminar este prospecto del CRM?")) return;
    try {
      const res = await fetch(`/api/prospectos?id=${id}`, { method: 'DELETE' });
      if (res.ok) setProspectos(prev => prev.filter(p => p.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  // Función para obtener color según el estado
  const getColorEstado = (estado: string) => {
    switch (estado) {
      case 'NUEVO': return 'bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800';
      case 'CONTACTADO': return 'bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800';
      case 'COTIZADO': return 'bg-purple-50 text-purple-600 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800';
      case 'GANADO': return 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800';
      case 'PERDIDO': return 'bg-rose-50 text-rose-600 border-rose-200 dark:bg-rose-900/20 dark:text-rose-400 dark:border-rose-800';
      default: return 'bg-slate-50 text-slate-600 border-slate-200 dark:bg-neutral-800 dark:text-neutral-400 dark:border-neutral-700';
    }
  };

  return (
    <div className="space-y-8 relative transition-colors">
      
      {/* CABECERA */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">CRM Prospectos</h1>
          <p className="text-slate-500 dark:text-neutral-400 mt-1 text-sm">Gestiona cotizaciones y oportunidades de negocio B2B.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-sm active:scale-95">
          <Plus size={18} /> Nuevo Prospecto
        </button>
      </div>

      {/* TABLA PRINCIPAL */}
      <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-2xl shadow-sm overflow-hidden transition-colors">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 dark:bg-neutral-950 border-b border-slate-200 dark:border-neutral-800 text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-neutral-500">
              <tr>
                <th className="px-6 py-4">Cliente / Empresa</th>
                <th className="px-6 py-4">Contacto Rápido</th>
                <th className="px-6 py-4">Requerimiento</th>
                <th className="px-6 py-4 text-center">Estado</th>
                <th className="px-6 py-4 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-neutral-800">
              {cargandoDatos ? (
                <tr><td colSpan={5} className="text-center py-12 text-slate-400 dark:text-neutral-600"><Loader2 className="animate-spin mx-auto mb-2" size={24} />Cargando CRM...</td></tr>
              ) : prospectos.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-16 text-slate-400 dark:text-neutral-500">
                    <Users size={40} className="mx-auto mb-3 opacity-20" />
                    La bandeja de prospectos está vacía.<br/>
                    <span className="text-xs">Los formularios web aparecerán aquí.</span>
                  </td>
                </tr>
              ) : prospectos.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/50 dark:hover:bg-neutral-800/50 transition-colors">
                  
                  {/* CLIENTE Y EMPRESA */}
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      {p.nombre}
                    </div>
                    {p.empresa && (
                      <div className="text-xs text-slate-500 dark:text-neutral-400 flex items-center gap-1 mt-1">
                        <Building2 size={12} /> {p.empresa} {p.ruc && `(RUC: ${p.ruc})`}
                      </div>
                    )}
                  </td>

                  {/* CONTACTO RÁPIDO (Botones de acción) */}
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1.5">
                      <a href={`mailto:${p.email}`} className="flex items-center gap-2 text-xs text-slate-600 dark:text-neutral-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                        <Mail size={14} /> {p.email}
                      </a>
                      <a href={`https://wa.me/51${p.telefono.replace(/\D/g,'')}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-xs text-slate-600 dark:text-neutral-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                        <Phone size={14} /> {p.telefono} <ExternalLink size={10} />
                      </a>
                    </div>
                  </td>

                  {/* REQUERIMIENTO */}
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-700 dark:text-neutral-200 text-xs uppercase tracking-wide">{p.requerimiento}</div>
                    <div className="text-xs text-slate-500 dark:text-neutral-500 mt-1 truncate max-w-[200px] flex items-center gap-1">
                      <MessageSquare size={12} /> {p.mensaje || 'Sin mensaje adicional'}
                    </div>
                  </td>

                  {/* ESTADO */}
                  <td className="px-6 py-4 text-center">
                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold border tracking-widest ${getColorEstado(p.estado)}`}>
                      {p.estado}
                    </span>
                  </td>

                  {/* ACCIONES */}
                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-2">
                      <button className="p-1.5 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-md transition-colors"><Edit2 size={16} /></button>
                      <button onClick={() => eliminarProspecto(p.id)} className="p-1.5 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-md transition-colors"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL NUEVO PROSPECTO */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 dark:bg-black/60 backdrop-blur-[2px]">
          <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] border border-slate-200 dark:border-neutral-800">
            
            <div className="p-5 border-b border-slate-100 dark:border-neutral-800 bg-slate-50 dark:bg-neutral-950 flex justify-between items-center shrink-0">
              <h2 className="font-bold text-slate-900 dark:text-white flex items-center gap-2"><Users size={18} className="text-blue-500"/> Registrar Prospecto Manual</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-rose-500 transition-colors"><X size={20}/></button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 dark:text-neutral-400 uppercase tracking-widest mb-1.5">Nombre del Contacto</label>
                  <input type="text" required value={formData.nombre} onChange={e=>setFormData({...formData, nombre: e.target.value})} placeholder="Ej: Juan Pérez" className="w-full bg-white dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 p-2.5 rounded-xl outline-none focus:border-blue-500 dark:focus:border-blue-500 text-sm dark:text-white transition-colors" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 dark:text-neutral-400 uppercase tracking-widest mb-1.5">Empresa (Opcional)</label>
                  <input type="text" value={formData.empresa} onChange={e=>setFormData({...formData, empresa: e.target.value})} placeholder="Ej: Importaciones SAC" className="w-full bg-white dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 p-2.5 rounded-xl outline-none focus:border-blue-500 dark:focus:border-blue-500 text-sm dark:text-white transition-colors" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 dark:text-neutral-400 uppercase tracking-widest mb-1.5">RUC (Opcional)</label>
                  <input type="text" value={formData.ruc} onChange={e=>setFormData({...formData, ruc: e.target.value})} placeholder="20..." className="w-full bg-white dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 p-2.5 rounded-xl outline-none focus:border-blue-500 dark:focus:border-blue-500 text-sm font-mono dark:text-white transition-colors" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 dark:text-neutral-400 uppercase tracking-widest mb-1.5">Teléfono / Celular</label>
                  <input type="text" required value={formData.telefono} onChange={e=>setFormData({...formData, telefono: e.target.value})} placeholder="999 888 777" className="w-full bg-white dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 p-2.5 rounded-xl outline-none focus:border-blue-500 dark:focus:border-blue-500 text-sm font-mono dark:text-white transition-colors" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 dark:text-neutral-400 uppercase tracking-widest mb-1.5">Estado</label>
                  <select required value={formData.estado} onChange={e=>setFormData({...formData, estado: e.target.value})} className="w-full bg-white dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 p-2.5 rounded-xl outline-none focus:border-blue-500 dark:focus:border-blue-500 text-sm dark:text-white transition-colors">
                    <option value="NUEVO">NUEVO</option>
                    <option value="CONTACTADO">CONTACTADO</option>
                    <option value="COTIZADO">COTIZADO</option>
                    <option value="GANADO">GANADO (Cerrado)</option>
                    <option value="PERDIDO">PERDIDO (Descartado)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 dark:text-neutral-400 uppercase tracking-widest mb-1.5">Correo Electrónico</label>
                <input type="email" required value={formData.email} onChange={e=>setFormData({...formData, email: e.target.value})} placeholder="correo@empresa.com" className="w-full bg-white dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 p-2.5 rounded-xl outline-none focus:border-blue-500 dark:focus:border-blue-500 text-sm dark:text-white transition-colors" />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 dark:text-neutral-400 uppercase tracking-widest mb-1.5">Servicio de Interés</label>
                <input type="text" required value={formData.requerimiento} onChange={e=>setFormData({...formData, requerimiento: e.target.value})} placeholder="Ej: Cámaras de Seguridad para Almacén" className="w-full bg-white dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 p-2.5 rounded-xl outline-none focus:border-blue-500 dark:focus:border-blue-500 text-sm dark:text-white transition-colors" />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 dark:text-neutral-400 uppercase tracking-widest mb-1.5">Mensaje o Notas</label>
                <textarea value={formData.mensaje} onChange={e=>setFormData({...formData, mensaje: e.target.value})} placeholder="Detalles de la cotización, horarios de contacto, etc..." className="w-full bg-white dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 p-2.5 rounded-xl outline-none focus:border-blue-500 dark:focus:border-blue-500 text-sm dark:text-white resize-none min-h-[80px] transition-colors"></textarea>
              </div>
              
              <div className="pt-4 border-t border-slate-100 dark:border-neutral-800 flex gap-3">
                <button type="button" onClick={()=>setIsModalOpen(false)} className="flex-1 bg-slate-100 dark:bg-neutral-800 hover:bg-slate-200 dark:hover:bg-neutral-700 py-3 rounded-xl font-bold text-slate-600 dark:text-neutral-300 transition-colors">Cancelar</button>
                <button type="submit" disabled={cargandoForm} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold transition-all disabled:opacity-50 shadow-lg shadow-blue-600/20">
                  {cargandoForm ? 'Guardando...' : 'Registrar Prospecto'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}