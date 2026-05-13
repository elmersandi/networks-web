'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Package, Wrench, Briefcase, ShoppingCart, ArrowUpRight, Loader2, MessageCircle, Target, CalendarDays, ExternalLink, Users } from 'lucide-react';

// =====================================================================
// TÍTULO: 1. TIPADO DE DATOS (INTERFACES)
// SUBTÍTULO: Definiciones estrictas para evitar errores (Cero any)
// =====================================================================
interface DashboardStats {
  counts: {
    productos: number;
    servicios: number;
    prospectos: number;
    pedidos: number;
  };
  ultimosProspectos: {
    id: string;
    nombre: string;
    empresa?: string | null;
    ruc?: string | null;
    email: string;
    telefono: string;
    requerimiento: string;
    estado: string;
    createdAt: string;
  }[];
}

interface StatCardProps {
  title: string;
  count: number | string;
  icon: React.ElementType; 
  bgClass: string;     // Clase para el fondo clarito
  textClass: string;   // Clase para el ícono color fuerte
  description: string;
  route: string;
}

export default function DashboardPage() {
  // =====================================================================
  // TÍTULO: 2. ESTADOS Y NAVEGACIÓN
  // =====================================================================
  const [data, setData] = useState<DashboardStats | null>(null);
  const [cargando, setCargando] = useState(true);
  const [errorConexion, setErrorConexion] = useState(false);
  const router = useRouter();

  // =====================================================================
  // TÍTULO: 3. LÓGICA DE CARGA EN TIEMPO REAL
  // =====================================================================
  const cargarEstadisticas = async () => {
    try {
      setCargando(true);
      setErrorConexion(false);
      const res = await fetch('/api/dashboard');
      if (!res.ok) throw new Error("Fallo en API");
      const stats = await res.json();
      setData(stats);
    } catch (error) {
      console.error("Error al refrescar dashboard:", error);
      setErrorConexion(true);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarEstadisticas();
    const intervalo = setInterval(cargarEstadisticas, 60000); // Se actualiza solo cada minuto
    return () => clearInterval(intervalo);
  }, []);

  // =====================================================================
  // TÍTULO: 4. COMPONENTE REUTILIZABLE: TARJETA ESTADÍSTICA
  // SUBTÍTULO: Efectos hover corporativos y contraste de colores perfecto
  // =====================================================================
  const StatCard = ({ title, count, icon: Icon, bgClass, textClass, description, route }: StatCardProps) => (
    <div 
      onClick={() => router.push(route)}
      className="group relative bg-[#FFFFFF] dark:bg-[#121212] p-6 rounded-2xl border border-[#E2E8F0] dark:border-[#262626] shadow-sm hover:shadow-xl hover:border-[#1D4ED8] transition-all duration-300 cursor-pointer active:scale-95 overflow-hidden flex flex-col justify-between h-full"
    >
      <div className="flex justify-between items-start z-10">
        <div>
          <p className="text-[10px] font-bold text-[#64748B] dark:text-[#9CA3AF] uppercase tracking-widest">{title}</p>
          <h3 className="text-5xl font-extrabold mt-3 text-[#0F172A] dark:text-[#F3F4F6] font-mono tracking-tight">
            {cargando ? <Loader2 className="animate-spin text-[#1D4ED8]" size={32}/> : count}
          </h3>
        </div>
        {/* Aquí aplicamos el fondo claro y el texto oscuro para que resalte perfecto */}
        <div className={`p-4 rounded-xl ${bgClass} group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
          <Icon className={textClass} size={30} strokeWidth={2.5} />
        </div>
      </div>
      
      <div className="mt-5 border-t border-[#E2E8F0] dark:border-[#262626] pt-4 flex items-center justify-between z-10">
        <p className="text-xs text-[#64748B] dark:text-[#9CA3AF] group-hover:text-[#1D4ED8] transition-colors">{description}</p>
        <div className="flex items-center text-[11px] font-bold text-[#1D4ED8] opacity-0 group-hover:opacity-100 transition-opacity">
          GESTIONAR <ExternalLink size={13} className="ml-1" />
        </div>
      </div>

      {/* Círculo decorativo de fondo */}
      <div className={`absolute -right-6 -bottom-6 w-24 h-24 rounded-full ${bgClass} opacity-50 group-hover:scale-150 transition-transform duration-500`}></div>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* =====================================================================
          TÍTULO: 5. CABECERA PRINCIPAL
      ===================================================================== */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#0F172A] dark:text-[#F3F4F6]">Dashboard Operativo</h1>
          <p className="text-[#64748B] dark:text-[#9CA3AF] mt-1 text-sm">Resumen gerencial de Networks Perú en tiempo real.</p>
        </div>
        <div className="flex items-center gap-3">
          {cargando && <span className="text-xs text-[#64748B] flex items-center gap-1.5"><Loader2 size={14} className="animate-spin"/> Actualizando...</span>}
          <button onClick={cargarEstadisticas} className="cursor-pointer text-xs font-bold bg-[#F8FAFC] dark:bg-[#1A1A1A] border border-[#E2E8F0] dark:border-[#262626] text-[#0F172A] dark:text-[#F3F4F6] px-4 py-2 rounded-md hover:bg-[#E2E8F0] dark:hover:bg-[#262626] transition-colors">
            Refrescar Datos
          </button>
        </div>
      </div>

      {/* =====================================================================
          TÍTULO: 6. GRILLA DE TARJETAS ESTADÍSTICAS B2B
          SUBTÍTULO: Colores explícitos (fondo 100 y texto 600) para contraste perfecto
      ===================================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard 
          title="Catálogo Activo" 
          count={data?.counts.productos || 0} 
          icon={Package} 
          bgClass="bg-blue-100 dark:bg-blue-900/30" 
          textClass="text-blue-600 dark:text-blue-400"
          description="Equipos en Inventario"
          route="/admin/inventario"
        />
        <StatCard 
          title="Oferta de Servicios" 
          count={data?.counts.servicios || 0} 
          icon={Wrench} 
          bgClass="bg-purple-100 dark:bg-purple-900/30" 
          textClass="text-purple-600 dark:text-purple-400"
          description="Soluciones Corporativas"
          route="/admin/servicios"
        />
        <StatCard 
          title="Bandeja CRM B2B" 
          count={data?.counts.prospectos || 0} 
          icon={Target} 
          bgClass="bg-orange-100 dark:bg-orange-900/30" 
          textClass="text-orange-600 dark:text-orange-400"
          description="Leads y Oportunidades"
          route="/admin/prospectos"
        />
        <StatCard 
          title="Pedidos Confirmados" 
          count={data?.counts.pedidos || 0} 
          icon={ShoppingCart} 
          bgClass="bg-emerald-100 dark:bg-emerald-900/30" 
          textClass="text-emerald-600 dark:text-emerald-400"
          description="Ventas Registradas"
          route="/admin/pedidos"
        />
      </div>

      {/* =====================================================================
          TÍTULO: 7. SECCIÓN CRM: ÚLTIMOS LEADS
      ===================================================================== */}
      <div className="bg-[#FFFFFF] dark:bg-[#121212] rounded-2xl border border-[#E2E8F0] dark:border-[#262626] overflow-hidden shadow-sm">
        
        <div className="p-5 border-b border-[#E2E8F0] dark:border-[#262626] flex justify-between items-center bg-[#F8FAFC] dark:bg-[#1A1A1A]">
          <h2 className="font-bold text-[#0F172A] dark:text-[#F3F4F6] flex items-center gap-2.5">
            <Briefcase size={20} className="text-[#1D4ED8]"/> 
            Últimos Leads Entrantes
          </h2>
          <button 
            onClick={() => router.push('/admin/prospectos')} 
            className="cursor-pointer text-xs font-bold bg-[#FFFFFF] dark:bg-[#000000] border border-[#E2E8F0] dark:border-[#262626] text-[#1D4ED8] px-4 py-2 rounded-md hover:border-[#1D4ED8] transition-colors flex items-center gap-1.5"
          >
            Ir al CRM Completo <ArrowUpRight size={14}/>
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead className="bg-[#F8FAFC] dark:bg-[#1A1A1A] text-[10px] uppercase font-bold text-[#64748B] dark:text-[#9CA3AF] tracking-widest border-b border-[#E2E8F0] dark:border-[#262626]">
              <tr>
                <th className="px-6 py-4">Empresa / Razón Social</th>
                <th className="px-6 py-4">Cliente de Contacto</th>
                <th className="px-6 py-4">Teléfono (WhatsApp)</th>
                <th className="px-6 py-4">Requerimiento</th>
                <th className="px-6 py-4 text-center">Estado</th>
                <th className="px-6 py-4 text-right">Fecha Ingreso</th>
              </tr>
            </thead>
            <tbody className="bg-[#FFFFFF] dark:bg-[#121212]">
              {cargando ? (
                <tr><td colSpan={6} className="px-6 py-16 text-center text-[#64748B]"><Loader2 className="animate-spin mx-auto mb-2" size={24} />Cargando leads recientes...</td></tr>
              ) : errorConexion ? (
                <tr><td colSpan={6} className="px-6 py-16 text-center text-[#DC2626] font-medium">Error de conexión con la base de datos. Intenta refrescar.</td></tr>
              ) : data?.ultimosProspectos.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-16 text-center text-[#64748B]"><Users size={24} className="mx-auto mb-3 opacity-50"/>La bandeja de entrada está vacía.</td></tr>
              ) : data?.ultimosProspectos.map((pros) => (
                <tr key={pros.id} className="hover:bg-[#F8FAFC] dark:hover:bg-[#1A1A1A] transition-colors border-b border-[#E2E8F0] dark:border-[#262626] last:border-none">
                  <td className="px-6 py-4 font-bold text-[#0F172A] dark:text-[#F3F4F6]">
                    {pros.empresa || pros.nombre}
                    <div className="text-[10px] text-[#64748B] dark:text-[#9CA3AF] font-mono mt-1 border border-[#E2E8F0] dark:border-[#262626] inline-block px-1.5 py-0.5 rounded bg-[#F8FAFC] dark:bg-[#000000]">
                      {pros.ruc ? `RUC: ${pros.ruc}` : 'PERSONA NATURAL'}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-[#0F172A] dark:text-[#F3F4F6] font-medium">
                    {pros.nombre}
                    <div className="text-xs text-[#64748B] mt-0.5">{pros.email}</div>
                  </td>
                  <td className="px-6 py-4 border-none font-mono">
                    <div className="flex items-center gap-1.5 text-sm font-medium text-[#0F172A] dark:text-[#F3F4F6]">
                      <MessageCircle size={15} className="text-[#059669]"/> {pros.telefono}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-[#0F172A] dark:text-[#F3F4F6] font-medium text-sm truncate max-w-[200px]">
                    {pros.requerimiento}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-[10px] font-bold uppercase bg-blue-50 text-blue-700 border border-blue-100 dark:bg-blue-900/20 dark:border-blue-800/50">
                      ● {pros.estado}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right text-[#0F172A] dark:text-[#F3F4F6] font-mono text-xs flex items-center gap-1.5 justify-end">
                    <CalendarDays size={13} className="text-[#64748B]"/> {new Date(pros.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}