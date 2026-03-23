"use client";

import { useState, useEffect } from "react";
import { Search, Users, Phone, Mail, Trash2 } from "lucide-react";

export default function ProspectosPage() {
  const [prospectos, setProspectos] = useState<any[]>([]);
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [modalEliminar, setModalEliminar] = useState<string | null>(null);

  const fetchData = async () => {
    setCargando(true);
    try {
      const res = await fetch("/api/prospectos");
      if (res.ok) {
        const data = await res.json();
        setProspectos(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const cambiarEstado = async (id: string, nuevoEstado: string) => {
    await fetch("/api/prospectos", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, estado: nuevoEstado }),
    });
    fetchData();
  };

  const confirmarEliminacion = async () => {
    if (modalEliminar) {
      await fetch(`/api/prospectos?id=${modalEliminar}`, { method: "DELETE" });
      setModalEliminar(null);
      fetchData();
    }
  };

  const filtrados = prospectos.filter(p => 
    p.nombre.toLowerCase().includes(busqueda.toLowerCase()) || 
    p.email.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto space-y-8 relative">
      
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Gestión de Prospectos (CRM)</h2>
          <p className="text-sm text-gray-500 mt-1">Administra los leads y solicitudes de contacto de potenciales clientes.</p>
        </div>
        <div className="bg-blue-50 text-blue-700 border border-blue-200 px-4 py-2 rounded-md text-sm font-bold flex items-center gap-2 shadow-sm">
          <Users size={18} /> {prospectos.length} Clientes Potenciales
        </div>
      </div>

      {/* CONTENEDOR PRINCIPAL */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        
        {/* BARRA DE BÚSQUEDA */}
        <div className="p-5 border-b border-gray-200 bg-gray-50 flex items-center gap-4">
          <div className="relative w-full max-w-md">
            <input 
              type="text" 
              placeholder="Buscar por cliente o correo..." 
              value={busqueda} 
              onChange={e => setBusqueda(e.target.value)} 
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-sm bg-white" 
            />
            <Search className="absolute left-3.5 top-3 text-gray-400" size={18} />
          </div>
        </div>

        {/* TABLA DE PROSPECTOS */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">Cliente / Empresa</th>
                <th className="px-6 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">Contacto</th>
                <th className="px-6 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">Mensaje</th>
                <th className="px-6 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Estado Comercial</th>
                <th className="px-6 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {cargando ? (
                <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-400">Cargando prospectos...</td></tr>
              ) : filtrados.length > 0 ? (
                filtrados.map(p => (
                  <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-semibold text-gray-900 text-base">{p.nombre}</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {new Date(p.createdAt).toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1.5">
                        <p className="text-sm flex items-center gap-2 text-gray-600"><Mail size={14} className="text-blue-500"/> {p.email}</p>
                        <p className="text-sm flex items-center gap-2 text-gray-600"><Phone size={14} className="text-emerald-500"/> {p.telefono || "No especificado"}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-600 max-w-xs truncate" title={p.mensaje}>{p.mensaje || "Sin mensaje"}</p>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <select 
                        value={p.estado}
                        onChange={(e) => cambiarEstado(p.id, e.target.value)}
                        className={`text-xs font-bold rounded px-2.5 py-1.5 border outline-none cursor-pointer transform active:scale-95 transition-all shadow-sm
                          ${p.estado === 'Nuevo' ? 'bg-amber-50 text-amber-700 border-amber-200' : 
                            p.estado === 'Contactado' ? 'bg-blue-50 text-blue-700 border-blue-200' : 
                            'bg-emerald-50 text-emerald-700 border-emerald-200'}`}
                      >
                        <option value="Nuevo">Nuevo</option>
                        <option value="Contactado">Contactado</option>
                        <option value="Cerrado">Cerrado</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-right">
                       <button onClick={() => setModalEliminar(p.id)} className="text-gray-400 cursor-pointer hover:text-red-600 hover:bg-red-50 rounded-md transition-all p-2">
                         <Trash2 size={18} />
                       </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-500">No hay prospectos en la base de datos.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL PERSONALIZADO DE ELIMINACIÓN */}
      {modalEliminar && (
        <div className="fixed inset-0 bg-neutral-900/60 flex items-center justify-center z-50 animate-in fade-in duration-200 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full mx-4 border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-2">¿Eliminar prospecto?</h3>
            <p className="text-gray-500 mb-6 text-sm">Esta acción borrará los datos del cliente de tu sistema. No se puede deshacer.</p>
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