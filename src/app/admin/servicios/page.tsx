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
      
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Catálogo de Servicios</h2>
          <p className="text-sm text-gray-500 mt-1">Gestiona los servicios técnicos y labores ofrecidas por N&S.</p>
        </div>
        <div className="bg-blue-50 text-blue-700 border border-blue-200 px-4 py-2 rounded-md text-sm font-bold flex items-center gap-2 shadow-sm">
          <Activity size={18} /> {servicios.length} Activos
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* FORMULARIO */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 sticky top-6">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-gray-900">
              <Plus size={20} className="text-blue-600" /> Nuevo Servicio
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Nombre de la labor</label>
                <input 
                  type="text" 
                  value={nombre} 
                  onChange={e => setNombre(e.target.value)} 
                  required 
                  placeholder="Ej: Fusión de Fibra Óptica" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white" 
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Alcance / Descripción Técnica</label>
                <textarea 
                  value={descripcion} 
                  onChange={e => setDescripcion(e.target.value)} 
                  rows={5} 
                  required 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white resize-none" 
                  placeholder="Detalla los entregables del servicio..." 
                />
              </div>
              <button type="submit" className="w-full cursor-pointer transform active:scale-95 transition-all bg-blue-600 text-white py-2.5 rounded-md font-bold hover:bg-blue-700 shadow-sm mt-2">
                Guardar Servicio
              </button>
            </form>
          </div>
        </div>

        {/* LISTA DE SERVICIOS */}
        <div className="lg:col-span-2 space-y-4">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Buscar servicio..." 
              value={busqueda} 
              onChange={e => setBusqueda(e.target.value)} 
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-sm bg-white" 
            />
            <Search className="absolute left-3.5 top-3 text-gray-400" size={18} />
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">Servicio Ofrecido</th>
                  <th className="px-6 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {cargando ? (
                  <tr><td colSpan={2} className="px-6 py-12 text-center text-gray-400 text-sm">Cargando servicios...</td></tr>
                ) : filtrados.length > 0 ? (
                  filtrados.map(s => (
                  <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 mt-1 bg-gray-50 border border-gray-100 rounded-md flex-shrink-0 flex items-center justify-center text-gray-500">
                          <Wrench size={18} />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 text-sm">{s.nombre}</p>
                          <p className="text-xs text-gray-500 mt-1 leading-relaxed">{s.descripcion}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right align-top">
                       <button onClick={() => setModalEliminar(s.id)} className="text-gray-400 cursor-pointer hover:text-red-600 hover:bg-red-50 rounded-md transition-all p-2 mt-1">
                         <Trash2 size={18} />
                       </button>
                    </td>
                  </tr>
                ))) : (
                  <tr><td colSpan={2} className="px-6 py-12 text-center text-gray-500 text-sm">No hay servicios registrados.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* MODAL PERSONALIZADO DE ELIMINACIÓN */}
      {modalEliminar && (
        <div className="fixed inset-0 bg-neutral-900/60 flex items-center justify-center z-50 animate-in fade-in duration-200 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full mx-4 border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-2">¿Eliminar servicio?</h3>
            <p className="text-gray-500 mb-6 text-sm">Esta acción no se puede deshacer y el servicio dejará de estar disponible en tu catálogo.</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setModalEliminar(null)} className="px-4 py-2 cursor-pointer text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-md transition-colors">Cancelar</button>
              <button onClick={confirmarEliminacion} className="px-4 py-2 cursor-pointer text-sm font-bold bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors shadow-sm">Sí, eliminar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}