'use client';

import { useState, useEffect } from 'react';
import { Plus, ShoppingCart, Phone, Building2, Eye, Trash2, X, Loader2, ExternalLink, PackageOpen, CheckCircle2, Clock } from 'lucide-react';

// Interfaces basadas en tu modelo de Prisma
interface DetallePedido {
  codigo: string;
  nombre: string;
  cantidad: number;
  precio: number;
}

interface Pedido {
  id: string;
  clienteNombre: string;
  telefonoWa: string;
  empresa: string | null;
  total: number;
  estado: string;
  detalles: DetallePedido[] | string; // Prisma a veces devuelve el JSON como string, hay que parsearlo
  createdAt?: string;
}

export default function PedidosPage() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [cargandoDatos, setCargandoDatos] = useState(true);
  
  // Modal para ver el detalle de los productos
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState<Pedido | null>(null);

  const cargarDatos = async () => {
    try {
      const res = await fetch('/api/pedidos');
      
      // EL ESCUDO: Si la respuesta no es OK (ej. un 404), detenemos todo antes de que truene
      if (!res.ok) {
        setCargandoDatos(false);
        return; 
      }
      
      const data = await res.json();
      if (Array.isArray(data)) setPedidos(data);
    } catch (error) {
      console.error("Error de conexión:", error);
    } finally {
      setCargandoDatos(false);
    }
  };
  useEffect(() => { cargarDatos(); }, []);

  const eliminarPedido = async (id: string) => {
    if (!confirm("¿Eliminar este pedido del sistema? Esto no repondrá el stock automáticamente.")) return;
    try {
      const res = await fetch(`/api/pedidos?id=${id}`, { method: 'DELETE' });
      if (res.ok) setPedidos(prev => prev.filter(p => p.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  // Parsea el JSON de detalles de forma segura
  const getDetalles = (detalles: DetallePedido[] | string): DetallePedido[] => {
    if (typeof detalles === 'string') {
      try { return JSON.parse(detalles); } catch (e) { return []; }
    }
    return detalles || [];
  };

  const getColorEstado = (estado: string) => {
    switch (estado) {
      case 'PENDIENTE': return 'bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800';
      case 'COMPLETADO': return 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800';
      case 'CANCELADO': return 'bg-rose-50 text-rose-600 border-rose-200 dark:bg-rose-900/20 dark:text-rose-400 dark:border-rose-800';
      default: return 'bg-slate-50 text-slate-600 border-slate-200 dark:bg-neutral-800 dark:text-neutral-400 dark:border-neutral-700';
    }
  };

  return (
    <div className="space-y-8 relative transition-colors">
      
      {/* CABECERA */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Pedidos Web y WhatsApp</h1>
          <p className="text-slate-500 dark:text-neutral-400 mt-1 text-sm">Carritos generados desde la tienda y ventas directas.</p>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold shadow-sm hover:bg-blue-700 transition-all active:scale-95">
          <Plus size={18} /> Pedido Manual
        </button>
      </div>

      {/* TABLA PRINCIPAL */}
      <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-2xl shadow-sm overflow-hidden transition-colors">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 dark:bg-neutral-950 border-b border-slate-200 dark:border-neutral-800 text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-neutral-500">
              <tr>
                <th className="px-6 py-4">Cliente / Empresa</th>
                <th className="px-6 py-4">WhatsApp</th>
                <th className="px-6 py-4 text-center">Cant. Productos</th>
                <th className="px-6 py-4 text-right">Total a Pagar</th>
                <th className="px-6 py-4 text-center">Estado</th>
                <th className="px-6 py-4 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-neutral-800">
              {cargandoDatos ? (
                <tr><td colSpan={6} className="text-center py-12 text-slate-400 dark:text-neutral-600"><Loader2 className="animate-spin mx-auto mb-2" size={24} />Cargando pedidos...</td></tr>
              ) : pedidos.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-16 text-slate-400 dark:text-neutral-500">
                    <ShoppingCart size={40} className="mx-auto mb-3 opacity-20" />
                    No hay pedidos registrados en el sistema.
                  </td>
                </tr>
              ) : pedidos.map((p) => {
                const items = getDetalles(p.detalles);
                const cantidadTotal = items.reduce((acc, item) => acc + item.cantidad, 0);

                return (
                  <tr key={p.id} className="hover:bg-slate-50/50 dark:hover:bg-neutral-800/50 transition-colors">
                    
                    {/* CLIENTE Y EMPRESA */}
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900 dark:text-white">{p.clienteNombre}</div>
                      {p.empresa && (
                        <div className="text-xs text-slate-500 dark:text-neutral-400 flex items-center gap-1 mt-1">
                          <Building2 size={12} /> {p.empresa}
                        </div>
                      )}
                    </td>

                    {/* WHATSAPP (Clickeable) */}
                    <td className="px-6 py-4">
                      <a href={`https://wa.me/51${p.telefonoWa.replace(/\D/g,'')}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1.5 rounded-lg border border-emerald-100 dark:border-emerald-900/50 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-colors">
                        <Phone size={14} /> {p.telefonoWa} <ExternalLink size={10} />
                      </a>
                    </td>

                    {/* CANTIDAD DE PRODUCTOS */}
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-neutral-300 bg-slate-100 dark:bg-neutral-800 px-2 py-1 rounded-md">
                        <PackageOpen size={14} /> {cantidadTotal} items
                      </span>
                    </td>

                    {/* TOTAL */}
                    <td className="px-6 py-4 text-right font-bold text-slate-900 dark:text-white text-base">
                      S/ {p.total.toFixed(2)}
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
                        <button onClick={() => setPedidoSeleccionado(p)} className="p-1.5 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-md transition-colors" title="Ver Recibo">
                          <Eye size={18} />
                        </button>
                        <button onClick={() => eliminarPedido(p.id)} className="p-1.5 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-md transition-colors">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: VER DETALLE DEL PEDIDO (RECIBO) */}
      {pedidoSeleccionado && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 dark:bg-black/60 backdrop-blur-[2px]">
          <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh] border border-slate-200 dark:border-neutral-800">
            
            <div className="p-5 border-b border-slate-100 dark:border-neutral-800 bg-slate-50 dark:bg-neutral-950 flex justify-between items-center shrink-0">
              <div>
                <h2 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">Detalle de Pedido</h2>
                <p className="text-[10px] text-slate-500 dark:text-neutral-400 mt-0.5 font-mono">ID: {pedidoSeleccionado.id}</p>
              </div>
              <button onClick={() => setPedidoSeleccionado(null)} className="text-slate-400 hover:text-rose-500 transition-colors"><X size={20}/></button>
            </div>
            
            <div className="p-6 overflow-y-auto space-y-6">
              {/* Info del Cliente */}
              <div className="bg-slate-50 dark:bg-neutral-950 p-4 rounded-xl border border-slate-100 dark:border-neutral-800">
                <h3 className="text-xs font-bold text-slate-500 dark:text-neutral-400 uppercase tracking-widest mb-3">Datos del Cliente</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm"><span className="text-slate-500 dark:text-neutral-400">Nombre:</span><span className="font-bold text-slate-900 dark:text-white">{pedidoSeleccionado.clienteNombre}</span></div>
                  {pedidoSeleccionado.empresa && <div className="flex justify-between text-sm"><span className="text-slate-500 dark:text-neutral-400">Empresa:</span><span className="font-bold text-slate-900 dark:text-white">{pedidoSeleccionado.empresa}</span></div>}
                  <div className="flex justify-between text-sm"><span className="text-slate-500 dark:text-neutral-400">WhatsApp:</span><span className="font-mono text-slate-900 dark:text-white">{pedidoSeleccionado.telefonoWa}</span></div>
                  <div className="flex justify-between text-sm items-center"><span className="text-slate-500 dark:text-neutral-400">Estado:</span><span className={`text-xs px-2 py-0.5 rounded font-bold ${getColorEstado(pedidoSeleccionado.estado)}`}>{pedidoSeleccionado.estado}</span></div>
                </div>
              </div>

              {/* Lista de Productos (El JSON parseado) */}
              <div>
                <h3 className="text-xs font-bold text-slate-500 dark:text-neutral-400 uppercase tracking-widest mb-3">Productos Seleccionados</h3>
                <div className="space-y-3">
                  {getDetalles(pedidoSeleccionado.detalles).map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center border-b border-slate-100 dark:border-neutral-800 pb-3 last:border-0 last:pb-0">
                      <div>
                        <p className="font-bold text-sm text-slate-900 dark:text-white">{item.nombre}</p>
                        <p className="text-[10px] text-slate-500 dark:text-neutral-400 font-mono">SKU: {item.codigo} • Cant: {item.cantidad} x S/ {item.precio.toFixed(2)}</p>
                      </div>
                      <div className="font-bold text-slate-800 dark:text-neutral-200">
                        S/ {(item.cantidad * item.precio).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total final */}
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/50 p-4 rounded-xl flex justify-between items-center">
                <span className="font-bold text-blue-800 dark:text-blue-400">TOTAL A COBRAR</span>
                <span className="text-xl font-black text-blue-700 dark:text-blue-300">S/ {pedidoSeleccionado.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}