"use client";

import { useState, useEffect } from "react";
import { Server, Users, Wrench, ArrowRight, Activity } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const [data, setData] = useState({
    totalEquipos: 0,
    totalServicios: 0,
    prospectosNuevos: 0,
    ultimosProspectos: [] as any[]
  });
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await fetch("/api/dashboard");
        if (res.ok) {
          const dashboardData = await res.json();
          setData(dashboardData);
        }
      } catch (error) {
        console.error("Error cargando dashboard:", error);
      } finally {
        setCargando(false);
      }
    };
    fetchDashboard();
  }, []);

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-slate-800">Hola, Administrador</h2>
        <p className="text-slate-500 mt-1">Este es el resumen de operaciones de N&S Perú hoy.</p>
      </div>

      {/* TARJETAS DE RESUMEN */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center gap-4">
          <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
            <Server size={28} />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-500 uppercase">Equipos en Almacén</p>
            <h3 className="text-3xl font-bold text-slate-800">{cargando ? "-" : data.totalEquipos}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center gap-4">
          <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center">
            <Wrench size={28} />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-500 uppercase">Servicios Activos</p>
            <h3 className="text-3xl font-bold text-slate-800">{cargando ? "-" : data.totalServicios}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-amber-200 flex items-center gap-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-2 h-full bg-amber-400"></div>
          <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-lg flex items-center justify-center">
            <Users size={28} />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-500 uppercase">Prospectos Nuevos</p>
            <h3 className="text-3xl font-bold text-slate-800">{cargando ? "-" : data.prospectosNuevos}</h3>
          </div>
        </div>
      </div>

      {/* SECCIÓN DE ACTIVIDAD RECIENTE */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-200 flex justify-between items-center">
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Activity size={20} className="text-blue-600" /> Últimos Prospectos Recibidos
          </h3>
          <Link href="/admin/prospectos" className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1">
            Ver todos <ArrowRight size={16} />
          </Link>
        </div>
        <div className="p-0">
          <table className="w-full text-left">
            <tbody className="divide-y divide-slate-100">
              {cargando ? (
                <tr><td className="px-6 py-8 text-center text-slate-400">Cargando datos...</td></tr>
              ) : data.ultimosProspectos.length > 0 ? (
                data.ultimosProspectos.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-800">{p.nombre}</p>
                      <p className="text-sm text-slate-500">{p.email}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 max-w-md truncate">
                      {p.mensaje}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="bg-amber-100 text-amber-700 text-xs font-bold px-3 py-1 rounded-full">
                        {p.estado}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td className="px-6 py-8 text-center text-slate-500">No hay prospectos recientes.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}