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
        <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Resumen Operativo</h2>
        <p className="text-gray-500 mt-1 text-sm">Métricas principales de N&S Perú al día de hoy.</p>
      </div>

      {/* TARJETAS DE RESUMEN - Estilo Flat Corporativo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Tarjeta Azul - Equipos */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 border-l-4 border-l-blue-600 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Equipos en Almacén</p>
            <h3 className="text-3xl font-bold text-gray-900">{cargando ? "-" : data.totalEquipos}</h3>
          </div>
          <Server size={32} className="text-gray-300" strokeWidth={1.5} />
        </div>

        {/* Tarjeta Verde - Servicios */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 border-l-4 border-l-emerald-600 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Servicios Activos</p>
            <h3 className="text-3xl font-bold text-gray-900">{cargando ? "-" : data.totalServicios}</h3>
          </div>
          <Wrench size={32} className="text-gray-300" strokeWidth={1.5} />
        </div>

        {/* Tarjeta Amarilla - Prospectos */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 border-l-4 border-l-amber-500 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Prospectos Nuevos</p>
            <h3 className="text-3xl font-bold text-gray-900">{cargando ? "-" : data.prospectosNuevos}</h3>
          </div>
          <Users size={32} className="text-gray-300" strokeWidth={1.5} />
        </div>

      </div>

      {/* SECCIÓN DE ACTIVIDAD RECIENTE */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-5 border-b border-gray-200 flex justify-between items-center bg-gray-50">
          <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
            <Activity size={18} className="text-gray-500" /> Últimos Prospectos Recibidos
          </h3>
          <Link href="/admin/prospectos" className="text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-1">
            Ver todos <ArrowRight size={16} />
          </Link>
        </div>
        <div className="p-0">
          <table className="w-full text-left">
            <tbody className="divide-y divide-gray-100">
              {cargando ? (
                <tr><td className="px-6 py-8 text-center text-gray-400 text-sm">Cargando datos...</td></tr>
              ) : data.ultimosProspectos.length > 0 ? (
                data.ultimosProspectos.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-semibold text-gray-900 text-sm">{p.nombre}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{p.email}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 max-w-md truncate">
                      {p.mensaje}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="bg-gray-100 border border-gray-200 text-gray-700 text-xs font-bold px-2.5 py-1 rounded">
                        {p.estado}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td className="px-6 py-8 text-center text-gray-500 text-sm">No hay prospectos recientes.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}