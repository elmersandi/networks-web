'use client';

import { useState, useEffect } from 'react';
import { Search, Plus, Edit2, Trash2, ShoppingCart, X, Loader2, AlertTriangle, CheckCircle2, XCircle, Filter, MessageCircle } from 'lucide-react';

// =====================================================================
// TÍTULO: 1. TIPADO DE DATOS (INTERFACES)
// SUBTÍTULO: Incluye la estructura del JSON interno de detalles
// =====================================================================
type EstadoPedido = 'PENDIENTE' | 'CONFIRMADO' | 'CANCELADO';

interface DetalleItem {
  codigo: string;
  nombre: string;
  cantidad: number;
  precio: number;
}

interface Pedido { 
  id: string; 
  clienteNombre: string; 
  telefonoWa: string; 
  empresa?: string | null; 
  total: number; 
  estado: EstadoPedido; 
  detalles: DetalleItem[]; 
  createdAt: string;
}

export default function PedidosPage() {
  // =====================================================================
  // TÍTULO: 2. ESTADOS GLOBALES
  // =====================================================================
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [cargandoDatos, setCargandoDatos] = useState(true);
  
  const [busqueda, setBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState<EstadoPedido | 'TODOS'>('TODOS');

  // =====================================================================
  // TÍTULO: 3. ESTADOS DE MODALES
  // =====================================================================
  const [isModalCrudOpen, setIsModalCrudOpen] = useState(false);
  const [modoModal, setModoModal] = useState<'crear' | 'editar'>('crear');
  const [cargandoForm, setCargandoForm] = useState(false);

  const [modalEliminar, setModalEliminar] = useState({ isOpen: false, id: '', nombre: '' });
  const [alertaSistema, setAlertaSistema] = useState({ isOpen: false, mensaje: '', tipo: 'exito' });

  // Estado del Formulario
  const formInicial = { id: '', clienteNombre: '', telefonoWa: '', empresa: '', total: 0, estado: 'PENDIENTE' as EstadoPedido };
  const [formData, setFormData] = useState(formInicial);
  
  // Estado independiente para el array JSON dinámico de productos
  const [detallesCarrito, setDetallesCarrito] = useState<DetalleItem[]>([]);

  // =====================================================================
  // TÍTULO: 4. FUNCIONES DE LECTURA (GET)
  // =====================================================================
  const cargarDatos = async () => {
    setCargandoDatos(true);
    try {
      const res = await fetch('/api/pedidos');
      const data = await res.json();
      if (Array.isArray(data)) setPedidos(data);
    } catch (error) { 
      mostrarAlerta("Error al conectar con la base de datos.", "error");
    } finally { 
      setCargandoDatos(false); 
    }
  };

  useEffect(() => { cargarDatos(); }, []);

  const mostrarAlerta = (mensaje: string, tipo: 'exito' | 'error') => {
    setAlertaSistema({ isOpen: true, mensaje, tipo });
    setTimeout(() => setAlertaSistema({ isOpen: false, mensaje: '', tipo: 'exito' }), 4000);
  };

  // =====================================================================
  // TÍTULO: 5. BUSCADOR Y FILTRO
  // =====================================================================
  const pedidosFiltrados = pedidos.filter(ped => {
    const textoBusqueda = busqueda.toLowerCase();
    const coincideTexto = 
      ped.clienteNombre.toLowerCase().includes(textoBusqueda) ||
      ped.telefonoWa.includes(textoBusqueda) ||
      (ped.empresa && ped.empresa.toLowerCase().includes(textoBusqueda));
    const coincideEstado = filtroEstado === 'TODOS' || ped.estado === filtroEstado;
    return coincideTexto && coincideEstado;
  });

  // =====================================================================
  // TÍTULO: 6. LÓGICA DEL CARRITO DINÁMICO (JSON)
  // SUBTÍTULO: Permite agregar filas y auto-calcular el total
  // =====================================================================
  const agregarItem = () => {
    setDetallesCarrito([...detallesCarrito, { codigo: '', nombre: '', cantidad: 1, precio: 0 }]);
  };

  const actualizarItem = (index: number, campo: keyof DetalleItem, valor: string | number) => {
    const nuevosDetalles = [...detallesCarrito];
    nuevosDetalles[index] = { ...nuevosDetalles[index], [campo]: valor };
    setDetallesCarrito(nuevosDetalles);
    recalcularTotal(nuevosDetalles);
  };

  const removerItem = (index: number) => {
    const nuevosDetalles = [...detallesCarrito];
    nuevosDetalles.splice(index, 1);
    setDetallesCarrito(nuevosDetalles);
    recalcularTotal(nuevosDetalles);
  };

  const recalcularTotal = (items: DetalleItem[]) => {
    const sumatoria = items.reduce((sum, item) => sum + (Number(item.cantidad) * Number(item.precio)), 0);
    setFormData(prev => ({ ...prev, total: sumatoria }));
  };

  // =====================================================================
  // TÍTULO: 7. CONTROLADORES DE MODALES
  // =====================================================================
  const abrirModalCrear = () => {
    setModoModal('crear');
    setFormData(formInicial);
    setDetallesCarrito([{ codigo: '', nombre: '', cantidad: 1, precio: 0 }]); // Inicia con 1 fila vacía
    setIsModalCrudOpen(true);
  };

  const abrirModalEditar = (ped: Pedido) => {
    setModoModal('editar');
    setFormData({
      id: ped.id, clienteNombre: ped.clienteNombre, telefonoWa: ped.telefonoWa, 
      empresa: ped.empresa || '', total: ped.total, estado: ped.estado
    });
    // Carga el JSON guardado o una fila vacía si viene corrupto
    setDetallesCarrito(Array.isArray(ped.detalles) && ped.detalles.length > 0 ? ped.detalles : [{ codigo: '', nombre: '', cantidad: 1, precio: 0 }]);
    setIsModalCrudOpen(true);
  };

  // =====================================================================
  // TÍTULO: 8. FUNCIONES DE GUARDADO (POST, PUT, DELETE)
  // =====================================================================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCargandoForm(true);
    try {
      const metodo = modoModal === 'crear' ? 'POST' : 'PUT';
      const url = modoModal === 'crear' ? '/api/pedidos' : `/api/pedidos?id=${formData.id}`;

      // Empaquetamos los datos del formulario junto con el array del carrito
      const payload = { ...formData, detalles: detallesCarrito };

      const res = await fetch(url, { method: metodo, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });

      if (res.ok) {
        await cargarDatos();
        setIsModalCrudOpen(false);
        mostrarAlerta(modoModal === 'crear' ? "Pedido generado con éxito." : "Pedido actualizado.", "exito");
      } else { 
        mostrarAlerta("Error al procesar el pedido.", "error");
      }
    } catch (error) { 
      mostrarAlerta("Error de red al intentar guardar.", "error");
    } finally { 
      setCargandoForm(false); 
    }
  };

  const confirmarEliminar = (id: string, nombre: string) => setModalEliminar({ isOpen: true, id, nombre });

  const ejecutarEliminacion = async () => {
    try {
      const res = await fetch(`/api/pedidos?id=${modalEliminar.id}`, { method: 'DELETE' });
      if (res.ok) {
        setPedidos(p => p.filter(ped => ped.id !== modalEliminar.id));
        mostrarAlerta("Pedido eliminado.", "exito");
      } else {
        mostrarAlerta("No se puede eliminar el pedido.", "error");
      }
    } catch (error) { 
      mostrarAlerta("Error de conexión.", "error");
    } finally {
      setModalEliminar({ isOpen: false, id: '', nombre: '' });
    }
  };

  // UI Helper: Colores de Estado
  const getBadgeColor = (estado: EstadoPedido) => {
    switch(estado) {
      case 'PENDIENTE': return 'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800/50';
      case 'CONFIRMADO': return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-800/50';
      case 'CANCELADO': return 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:border-red-800/50';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  // =====================================================================
  // TÍTULO: 9. RENDERIZADO DE LA INTERFAZ
  // =====================================================================
  return (
    <div className="admin-b2b space-y-8 relative transition-colors">
      
      {/* CABECERA PRINCIPAL */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#0F172A] dark:text-[#F3F4F6]">Gestión de Pedidos</h1>
          <p className="text-[#64748B] dark:text-[#9CA3AF] mt-1 text-sm">Administra carritos generados desde la tienda y ventas directas.</p>
        </div>
        <button onClick={abrirModalCrear} className="cursor-pointer flex items-center justify-center gap-2 bg-[#1D4ED8] text-white px-5 py-2.5 rounded-md font-medium hover:bg-[#1E40AF] transition-colors shadow-sm">
          <Plus size={18} /> Pedido Manual
        </button>
      </div>

      {/* TABLA DE DATOS */}
      <div className="bg-[#FFFFFF] dark:bg-[#121212] border border-[#E2E8F0] dark:border-[#262626] rounded-xl overflow-hidden transition-colors shadow-sm">
        
        {/* Filtros */}
        <div className="p-4 border-b border-[#E2E8F0] dark:border-[#262626] bg-[#FFFFFF] dark:bg-[#121212] flex flex-col sm:flex-row items-center justify-between gap-4">
          <h2 className="text-sm font-bold text-[#0F172A] dark:text-[#F3F4F6] hidden lg:block">Registro de Ventas</h2>
          
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
            <div className="relative w-full sm:w-48">
              <Filter className="absolute left-3 top-2.5 text-[#64748B] dark:text-[#9CA3AF]" size={16} />
              <select value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value as EstadoPedido | 'TODOS')} className="w-full pl-9 pr-4 py-2 bg-[#FFFFFF] dark:bg-[#121212] border border-[#E2E8F0] dark:border-[#262626] rounded-md outline-none focus:border-[#1D4ED8] text-[#0F172A] dark:text-[#F3F4F6] text-sm cursor-pointer shadow-sm">
                <option value="TODOS">Todos los Estados</option>
                <option value="PENDIENTE">Pendientes</option>
                <option value="CONFIRMADO">Confirmados</option>
                <option value="CANCELADO">Cancelados</option>
              </select>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-2.5 text-[#64748B] dark:text-[#9CA3AF]" size={18} />
              <input type="text" placeholder="Buscar cliente o teléfono..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} className="w-full pl-10 pr-4 py-2 bg-[#FFFFFF] dark:bg-[#121212] border border-[#E2E8F0] dark:border-[#262626] rounded-md outline-none focus:border-[#1D4ED8] text-[#0F172A] dark:text-[#F3F4F6] text-sm shadow-sm" />
            </div>
          </div>
        </div>

        {/* Tabla */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead className="bg-[#F8FAFC] dark:bg-[#1A1A1A] border-b border-[#E2E8F0] dark:border-[#262626] text-xs font-semibold uppercase tracking-wider text-[#64748B] dark:text-[#9CA3AF]">
              <tr>
                <th className="px-6 py-4 font-semibold">Cliente / Empresa</th>
                <th className="px-6 py-4 font-semibold">Contacto (WA)</th>
                <th className="px-6 py-4 font-semibold text-center">Cant. Items</th>
                <th className="px-6 py-4 font-semibold text-right">Total a Pagar</th>
                <th className="px-6 py-4 font-semibold text-center">Estado</th>
                <th className="px-6 py-4 font-semibold text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-[#FFFFFF] dark:bg-[#121212]">
              {cargandoDatos ? (
                <tr><td colSpan={6} className="text-center py-12 text-[#64748B] dark:text-[#9CA3AF]"><Loader2 className="animate-spin mx-auto mb-2" size={24} />Cargando pedidos...</td></tr>
              ) : pedidosFiltrados.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-12 text-[#64748B] dark:text-[#9CA3AF]">No hay pedidos registrados en el sistema.</td></tr>
              ) : pedidosFiltrados.map((ped) => (
                <tr key={ped.id} className="hover:bg-[#F8FAFC] dark:hover:bg-[#262626]/30 transition-colors border-b border-[#E2E8F0] dark:border-[#262626] last:border-0">
                  <td className="px-6 py-4 border-none">
                    <div className="font-bold text-[#0F172A] dark:text-[#F3F4F6]">{ped.clienteNombre}</div>
                    <div className="text-xs text-[#64748B] dark:text-[#9CA3AF] mt-0.5">{ped.empresa || '-'}</div>
                  </td>
                  <td className="px-6 py-4 border-none">
                    <div className="flex items-center gap-1.5 text-sm font-medium text-[#0F172A] dark:text-[#F3F4F6]">
                      <MessageCircle size={14} className="text-[#059669]"/> {ped.telefonoWa}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center border-none font-medium">
                    {Array.isArray(ped.detalles) ? ped.detalles.reduce((acc, curr) => acc + Number(curr.cantidad), 0) : 0} unid.
                  </td>
                  <td className="px-6 py-4 text-right font-bold text-[#0F172A] dark:text-[#F3F4F6] font-mono border-none text-base">
                    S/ {ped.total.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-center border-none">
                    <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md border ${getBadgeColor(ped.estado)}`}>
                      {ped.estado}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center border-none">
                    <div className="flex justify-center gap-2">
                      <button onClick={() => abrirModalEditar(ped)} className="cursor-pointer p-1.5 text-[#1D4ED8] hover:bg-blue-50 dark:hover:bg-[#262626] rounded-md transition-colors"><Edit2 size={16} /></button>
                      <button onClick={() => confirmarEliminar(ped.id, ped.clienteNombre)} className="cursor-pointer p-1.5 text-[#DC2626] hover:bg-red-50 dark:hover:bg-[#262626] rounded-md transition-colors"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* =====================================================================
          TÍTULO: MODAL CRUD (CON CARRITO DINÁMICO)
      ===================================================================== */}
      {isModalCrudOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#FFFFFF] dark:bg-[#121212] rounded-xl w-full max-w-4xl flex flex-col max-h-[90vh] border border-[#E2E8F0] dark:border-[#262626] shadow-2xl overflow-hidden">
            
            <div className="flex justify-between items-center p-5 border-b border-[#E2E8F0] dark:border-[#262626] bg-[#F8FAFC] dark:bg-[#1A1A1A] shrink-0">
              <h2 className="font-bold text-[#0F172A] dark:text-[#F3F4F6] flex items-center gap-2">
                <ShoppingCart size={20} className="text-[#1D4ED8]"/> 
                {modoModal === 'crear' ? 'Registrar Pedido Manual' : 'Gestión de Pedido'}
              </h2>
              <button onClick={() => setIsModalCrudOpen(false)} className="cursor-pointer text-[#64748B] hover:text-[#DC2626] transition-colors"><X size={20} /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
              <div className="p-6 overflow-y-auto flex-1 space-y-8">
                
                {/* BLOQUE 1: Datos del Cliente */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-bold text-[#64748B] dark:text-[#9CA3AF] uppercase tracking-widest mb-1.5">Cliente / Razón Social *</label>
                    <input type="text" required value={formData.clienteNombre} onChange={e=>setFormData({...formData, clienteNombre: e.target.value})} placeholder="Ej: Tech Solutions SAC" className="w-full bg-[#FFFFFF] dark:bg-[#000000] border border-[#E2E8F0] dark:border-[#262626] p-3 rounded-md outline-none text-sm" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-[#64748B] dark:text-[#9CA3AF] uppercase tracking-widest mb-1.5">WhatsApp *</label>
                    <input type="tel" required value={formData.telefonoWa} onChange={e=>setFormData({...formData, telefonoWa: e.target.value})} placeholder="999..." className="w-full bg-[#FFFFFF] dark:bg-[#000000] border border-[#E2E8F0] dark:border-[#262626] p-3 rounded-md outline-none font-mono text-sm" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-[#64748B] dark:text-[#9CA3AF] uppercase tracking-widest mb-1.5">Estado del Pedido *</label>
                    <select required value={formData.estado} onChange={e=>setFormData({...formData, estado: e.target.value as EstadoPedido})} className="w-full bg-[#FFFFFF] dark:bg-[#000000] border border-[#E2E8F0] dark:border-[#262626] p-3 rounded-md outline-none font-bold text-sm cursor-pointer">
                      <option value="PENDIENTE">🟠 Pendiente</option>
                      <option value="CONFIRMADO">🟢 Confirmado</option>
                      <option value="CANCELADO">🔴 Cancelado</option>
                    </select>
                  </div>
                </div>

                {/* BLOQUE 2: Constructor de Carrito (JSON Array) */}
                <div className="border border-[#E2E8F0] dark:border-[#262626] rounded-lg overflow-hidden">
                  <div className="bg-[#F8FAFC] dark:bg-[#1A1A1A] p-3 border-b border-[#E2E8F0] dark:border-[#262626] flex justify-between items-center">
                    <h3 className="text-xs font-bold text-[#1D4ED8] uppercase tracking-wider">Productos a Facturar</h3>
                    <button type="button" onClick={agregarItem} className="text-xs font-bold bg-[#1D4ED8] text-white px-3 py-1.5 rounded flex items-center gap-1 hover:bg-[#1E40AF] transition-colors"><Plus size={14}/> Fila</button>
                  </div>
                  
                  <div className="p-4 space-y-3 bg-[#FFFFFF] dark:bg-[#121212]">
                    {/* Encabezados de la grilla interna (Ocultos en móvil) */}
                    <div className="hidden sm:grid grid-cols-12 gap-3 text-[10px] font-bold text-[#64748B] uppercase tracking-widest px-1">
                      <div className="col-span-2">SKU / Código</div>
                      <div className="col-span-5">Producto</div>
                      <div className="col-span-2 text-center">Cant.</div>
                      <div className="col-span-2 text-right">P. Unitario</div>
                      <div className="col-span-1"></div>
                    </div>

                    {detallesCarrito.map((item, index) => (
                      <div key={index} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center bg-[#F8FAFC] sm:bg-transparent dark:bg-[#1A1A1A] sm:dark:bg-transparent p-3 sm:p-0 rounded-md sm:rounded-none border sm:border-0 border-[#E2E8F0] dark:border-[#262626]">
                        <div className="col-span-1 sm:col-span-2">
                          <label className="sm:hidden text-[10px] font-bold text-[#64748B] uppercase mb-1 block">SKU</label>
                          <input type="text" value={item.codigo} onChange={e=>actualizarItem(index, 'codigo', e.target.value.toUpperCase())} placeholder="Ej: CAM-001" className="w-full bg-[#FFFFFF] dark:bg-[#000000] border border-[#E2E8F0] dark:border-[#262626] p-2 rounded outline-none font-mono text-xs" />
                        </div>
                        <div className="col-span-1 sm:col-span-5">
                          <label className="sm:hidden text-[10px] font-bold text-[#64748B] uppercase mb-1 block">Producto</label>
                          <input type="text" value={item.nombre} onChange={e=>actualizarItem(index, 'nombre', e.target.value)} placeholder="Nombre del equipo..." className="w-full bg-[#FFFFFF] dark:bg-[#000000] border border-[#E2E8F0] dark:border-[#262626] p-2 rounded outline-none text-xs" />
                        </div>
                        <div className="col-span-1 sm:col-span-2">
                          <label className="sm:hidden text-[10px] font-bold text-[#64748B] uppercase mb-1 block">Cantidad</label>
                          <input type="number" min="1" value={item.cantidad} onChange={e=>actualizarItem(index, 'cantidad', Number(e.target.value))} className="w-full bg-[#FFFFFF] dark:bg-[#000000] border border-[#E2E8F0] dark:border-[#262626] p-2 rounded outline-none text-center font-mono text-xs" />
                        </div>
                        <div className="col-span-1 sm:col-span-2">
                          <label className="sm:hidden text-[10px] font-bold text-[#64748B] uppercase mb-1 block">P. Unitario</label>
                          <input type="number" step="0.01" value={item.precio} onChange={e=>actualizarItem(index, 'precio', Number(e.target.value))} className="w-full bg-[#FFFFFF] dark:bg-[#000000] border border-[#E2E8F0] dark:border-[#262626] p-2 rounded outline-none text-right font-mono text-xs" />
                        </div>
                        <div className="col-span-1 sm:col-span-1 flex justify-end sm:justify-center mt-2 sm:mt-0">
                          <button type="button" onClick={() => removerItem(index)} className="p-2 text-[#DC2626] hover:bg-red-50 dark:hover:bg-[#262626] rounded-md transition-colors"><Trash2 size={16}/></button>
                        </div>
                      </div>
                    ))}
                    
                    {detallesCarrito.length === 0 && (
                      <p className="text-center text-xs text-[#64748B] py-4">No hay productos en este pedido. Haz clic en &quot;+ Fila&quot; para agregar.</p>
                    )}
                  </div>
                  
                  {/* Totalizador */}
                  <div className="bg-[#1E293B] dark:bg-[#000000] p-4 text-right flex flex-col items-end border-t border-[#E2E8F0] dark:border-[#262626]">
                    <span className="text-[#94A3B8] text-[10px] uppercase font-bold tracking-widest">Total Calculado</span>
                    <span className="text-2xl font-mono font-bold text-white">S/ {formData.total.toFixed(2)}</span>
                  </div>
                </div>

              </div>

              {/* Botones Fijos Abajo */}
              <div className="p-4 border-t border-[#E2E8F0] dark:border-[#262626] bg-[#F8FAFC] dark:bg-[#1A1A1A] shrink-0 flex gap-3">
                <button type="button" onClick={()=>setIsModalCrudOpen(false)} className="cursor-pointer flex-1 bg-[#FFFFFF] dark:bg-[#000000] border border-[#E2E8F0] dark:border-[#262626] hover:bg-[#E2E8F0] dark:hover:bg-[#262626] py-3 rounded-md font-medium text-[#0F172A] dark:text-[#F3F4F6] transition-colors">
                  Cancelar
                </button>
                <button type="submit" disabled={cargandoForm || detallesCarrito.length === 0} className="cursor-pointer flex-[2] bg-[#1D4ED8] hover:bg-[#1E40AF] text-white py-3 rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2">
                  {cargandoForm ? <Loader2 size={16} className="animate-spin" /> : <ShoppingCart size={16} />}
                  {cargandoForm ? 'Guardando...' : (modoModal === 'crear' ? 'Confirmar y Guardar Pedido' : 'Actualizar Pedido')}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* MODAL DE CONFIRMACIÓN DE ELIMINAR */}
      {modalEliminar.isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#FFFFFF] dark:bg-[#121212] rounded-xl w-full max-w-sm overflow-hidden border border-[#E2E8F0] dark:border-[#262626] shadow-2xl p-6 text-center">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4"><AlertTriangle size={32} className="text-[#DC2626]" /></div>
            <h3 className="text-xl font-bold text-[#0F172A] dark:text-[#F3F4F6] mb-2">¿Eliminar Pedido?</h3>
            <p className="text-[#64748B] dark:text-[#9CA3AF] text-sm mb-6">Borrarás el registro de venta de <strong>{modalEliminar.nombre}</strong> permanentemente.</p>
            <div className="flex gap-3">
              <button onClick={() => setModalEliminar({ isOpen: false, id: '', nombre: '' })} className="cursor-pointer flex-1 bg-[#F8FAFC] dark:bg-[#000000] border border-[#E2E8F0] dark:border-[#262626] hover:bg-[#E2E8F0] py-3 rounded-md font-medium text-[#0F172A] dark:text-[#F3F4F6]">Cancelar</button>
              <button onClick={ejecutarEliminacion} className="cursor-pointer flex-1 bg-[#DC2626] hover:bg-[#991B1B] text-white py-3 rounded-md font-medium">Sí, eliminar</button>
            </div>
          </div>
        </div>
      )}

      {/* SISTEMA DE ALERTAS GLOBALES (TOAST) */}
      {alertaSistema.isOpen && (
        <div className="fixed bottom-6 right-6 z-[70] animate-in slide-in-from-bottom-5 fade-in duration-300">
          <div className={`flex items-center gap-3 px-6 py-4 rounded-lg shadow-xl border ${alertaSistema.tipo === 'exito' ? 'bg-[#059669] border-[#047857]' : 'bg-[#DC2626] border-[#991B1B]'} text-white`}>
            {alertaSistema.tipo === 'exito' ? <CheckCircle2 size={24} /> : <XCircle size={24} />}
            <span className="font-medium">{alertaSistema.mensaje}</span>
            <button onClick={() => setAlertaSistema({ ...alertaSistema, isOpen: false })} className="cursor-pointer ml-2 hover:opacity-75 transition-opacity"><X size={18} /></button>
          </div>
        </div>
      )}

    </div>
  );
}