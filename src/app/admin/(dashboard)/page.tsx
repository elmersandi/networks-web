'use client';

import { useState, useEffect } from 'react';
import { Users, Package, Wrench, ShoppingCart } from 'lucide-react';

export default function DashboardPage() {
  const [stats, setStats] = useState({ productos: 0, categorias: 0, servicios: 0, prospectos: 0, pedidos: 0 });

  useEffect(() => {
    // Aquí hacemos las peticiones a la BD real para contar
    const fetchStats = async () => {
      try {
        const resProd = await fetch('/api/productos');
        const dataProd = await resProd.json();
        
        const resCat = await fetch('/api/categorias');
        const dataCat = await resCat.json();

        setStats(prevStats => ({
          ...prevStats,
          productos: Array.isArray(dataProd) ? dataProd.length : 0,
          categorias: Array.isArray(dataCat) ? dataCat.length : 0,
        }));
      } catch (error) {
        console.error("Error al cargar stats:", error);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="space-y-8 transition-colors">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Dashboard</h1>
        <p className="text-slate-500 dark:text-neutral-400 mt-1 text-sm">Resumen operativo de Networks Perú.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* TARJETA 1 */}
        <div className="bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-slate-200 dark:border-neutral-800 shadow-sm transition-colors">
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center mb-4"><Package size={20} /></div>
          <h3 className="text-3xl font-bold text-slate-900 dark:text-white">{stats.productos}</h3>
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-neutral-500 mt-1">Productos</p>
        </div>
        
        {/* TARJETA 2 */}
        <div className="bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-slate-200 dark:border-neutral-800 shadow-sm transition-colors">
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center mb-4"><Wrench size={20} /></div>
          <h3 className="text-3xl font-bold text-slate-900 dark:text-white">{stats.servicios}</h3>
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-neutral-500 mt-1">Servicios</p>
        </div>
        
        {/* TARJETA 3 */}
        <div className="bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-slate-200 dark:border-neutral-800 shadow-sm transition-colors">
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center mb-4"><Users size={20} /></div>
          <h3 className="text-3xl font-bold text-slate-900 dark:text-white">{stats.prospectos}</h3>
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-neutral-500 mt-1">Prospectos CRM</p>
        </div>
        
        {/* TARJETA 4 */}
        <div className="bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-slate-200 dark:border-neutral-800 shadow-sm transition-colors">
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center mb-4"><ShoppingCart size={20} /></div>
          <h3 className="text-3xl font-bold text-slate-900 dark:text-white">{stats.pedidos}</h3>
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-neutral-500 mt-1">Pedidos Web</p>
        </div>
      </div>

      {/* SECCIÓN DE TABLA */}
      <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-2xl shadow-sm overflow-hidden transition-colors">
        <div className="p-5 border-b border-slate-100 dark:border-neutral-800 flex justify-between items-center transition-colors">
          <h2 className="text-sm font-bold text-slate-800 dark:text-white">Últimos Prospectos</h2>
        </div>
        <div className="p-8 text-center text-slate-400 dark:text-neutral-500 text-sm">
          Aún no hay prospectos registrados.
        </div>
      </div>
    </div>
  );
}