"use client";

import { useState, useEffect } from "react";
import { Search, Plus, Wrench, Trash2, Activity } from "lucide-react";

export default function ServiciosPage() {
  const [servicios, setServicios] = useState<any[]>([]);
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState("");

  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");

  const [modalEliminar, setModalEliminar] = useState<string | null>(null);

  const fetchData = async () => {
    setCargando(true);
    try {
      const res = await fetch("/api/servicios");
      if (res.ok) {
        const data = await res.json();
        setServicios(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("/api/servicios", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, descripcion }),
    });
    setNombre(""); setDescripcion("");
    fetchData();
  };

  const confirmarEliminacion = async () => {
    if (modalEliminar) {
      await fetch(`/api/servicios?id=${modalEliminar}`, { method: "DELETE" });
      setModalEliminar(null);
      fetchData();
    }
  };

  const filtrados = servicios.filter(s => s.nombre.toLowerCase().includes(busqueda.toLowerCase()));

  return (
    <div className="max-w-7xl mx-auto space-y-8 relative">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-slate-800">Catálogo de Servicios</h2>
        <div className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2">
          <Activity size={18} /> {servicios.length} Activos
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 sticky top-6">
            <h3 className="text-lg font-semibold mb-6 flex items-center gap-2 text-slate-800">
              <Plus size={20} className="text-blue-600" /> Nuevo Servicio
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Nombre de la labor</label>
                <input type="text" value={nombre} onChange={e => setNombre(e.target.value)} required placeholder="Ej: Fusión de Fibra Óptica" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800 outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Alcance / Descripción Técnica</label>
                <textarea value={descripcion} onChange={e => setDescripcion(e.target.value)} rows={5} required className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800 outline-none focus:ring-2 focus:ring-blue-500 resize-none" placeholder="Detalla los entregables del servicio..." />
              </div>
              <button type="submit" className="w-full cursor-pointer transform active:scale-95 transition-all bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 shadow-md">
                Guardar Servicio
              </button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <div className="relative">
            <input type="text" placeholder="Buscar servicio..." value={busqueda} onChange={e => setBusqueda(e.target.value)} className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-xl text-slate-800 outline-none focus:ring-2 focus:ring-blue-500" />
            <Search className="absolute left-4 top-3.5 text-slate-400" size={20} />
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-slate-600 uppercase">Servicio Ofrecido</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-600 uppercase text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {cargando ? <tr><td colSpan={2} className="px-6 py-12 text-center text-slate-400">Cargando...</td></tr> : 
                 filtrados.length > 0 ? filtrados.map(s => (
                  <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 mt-1 bg-blue-50 rounded-lg flex-shrink-0 flex items-center justify-center text-blue-500"><Wrench size={20} /></div>
                        <div>
                          <p className="font-bold text-slate-800">{s.nombre}</p>
                          <p className="text-xs text-slate-500 mt-1">{s.descripcion}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                       <button onClick={() => setModalEliminar(s.id)} className="text-slate-400 cursor-pointer hover:text-red-500 hover:bg-red-50 rounded-md transition-all p-2"><Trash2 size={18} /></button>
                    </td>
                  </tr>
                )) : <tr><td colSpan={2} className="px-6 py-12 text-center text-slate-500">No hay servicios.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {modalEliminar && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 animate-in fade-in">
          <div className="bg-white p-6 rounded-xl shadow-xl max-w-sm w-full mx-4 border border-slate-200">
            <h3 className="text-xl font-bold text-slate-800 mb-2">¿Eliminar servicio?</h3>
            <p className="text-slate-600 mb-6 text-sm">Esta acción no se puede deshacer.</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setModalEliminar(null)} className="px-4 py-2 cursor-pointer text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg">Cancelar</button>
              <button onClick={confirmarEliminacion} className="px-4 py-2 cursor-pointer text-sm font-medium bg-red-600 text-white rounded-lg hover:bg-red-700">Eliminar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}