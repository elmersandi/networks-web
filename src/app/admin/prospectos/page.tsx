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
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-slate-800">Gestión de Prospectos (CRM)</h2>
        <div className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2">
          <Users size={18} /> {prospectos.length} Clientes Potenciales
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center gap-4">
          <div className="relative w-full max-w-md">
            <input type="text" placeholder="Buscar por cliente o correo..." value={busqueda} onChange={e => setBusqueda(e.target.value)} className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-xl text-slate-800 outline-none focus:ring-2 focus:ring-blue-500" />
            <Search className="absolute left-4 top-3.5 text-slate-400" size={20} />
          </div>
        </div>

        <table className="w-full text-left">
          <thead className="bg-white border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-slate-600 uppercase">Cliente / Empresa</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-600 uppercase">Contacto</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-600 uppercase">Mensaje</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-600 uppercase text-center">Estado Comercial</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-600 uppercase text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {cargando ? <tr><td colSpan={5} className="px-6 py-12 text-center text-slate-400">Cargando prospectos...</td></tr> : 
             filtrados.length > 0 ? filtrados.map(p => (
              <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <p className="font-bold text-slate-800 text-base">{p.nombre}</p>
                  <p className="text-xs text-slate-400 mt-1">
                    {new Date(p.createdAt).toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </p>
                </td>
                <td className="px-6 py-4">
                  <div className="space-y-1">
                    <p className="text-sm flex items-center gap-2 text-slate-600"><Mail size={14} className="text-blue-500"/> {p.email}</p>
                    <p className="text-sm flex items-center gap-2 text-slate-600"><Phone size={14} className="text-emerald-500"/> {p.telefono || "No especificado"}</p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm text-slate-600 max-w-xs truncate" title={p.mensaje}>{p.mensaje || "Sin mensaje"}</p>
                </td>
                <td className="px-6 py-4 text-center">
                  <select 
                    value={p.estado}
                    onChange={(e) => cambiarEstado(p.id, e.target.value)}
                    className={`text-sm font-semibold rounded-full px-3 py-1 border-0 outline-none cursor-pointer transform active:scale-95 transition-all
                      ${p.estado === 'Nuevo' ? 'bg-amber-100 text-amber-700' : 
                        p.estado === 'Contactado' ? 'bg-blue-100 text-blue-700' : 
                        'bg-emerald-100 text-emerald-700'}`}
                  >
                    <option value="Nuevo">Nuevo</option>
                    <option value="Contactado">Contactado</option>
                    <option value="Cerrado">Cerrado</option>
                  </select>
                </td>
                <td className="px-6 py-4 text-right">
                   <button onClick={() => setModalEliminar(p.id)} className="text-slate-400 cursor-pointer hover:text-red-500 hover:bg-red-50 rounded-md transition-all p-2"><Trash2 size={18} /></button>
                </td>
              </tr>
            )) : <tr><td colSpan={5} className="px-6 py-12 text-center text-slate-500">No hay prospectos en la base de datos.</td></tr>}
          </tbody>
        </table>
      </div>

      {modalEliminar && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 animate-in fade-in">
          <div className="bg-white p-6 rounded-xl shadow-xl max-w-sm w-full mx-4 border border-slate-200">
            <h3 className="text-xl font-bold text-slate-800 mb-2">¿Eliminar prospecto?</h3>
            <p className="text-slate-600 mb-6 text-sm">Esta acción borrará los datos del cliente de tu radar.</p>
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