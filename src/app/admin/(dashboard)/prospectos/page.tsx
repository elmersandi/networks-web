'use client';

import { useState, useEffect } from 'react';
import { Search, Plus, Edit2, Trash2, Briefcase, X, Loader2, AlertTriangle, CheckCircle2, XCircle, Filter } from 'lucide-react';

// =====================================================================
// TÍTULO: 1. TIPADO DE DATOS (INTERFACES)
// SUBTÍTULO: Estructura exacta basada en el modelo Prospecto de Prisma
// =====================================================================
type EstadoProspecto = 'NUEVO' | 'CONTACTADO' | 'COTIZADO' | 'CERRADO';

interface Prospecto { 
  id: string; 
  nombre: string; 
  empresa?: string | null; 
  ruc?: string | null; 
  email: string; 
  telefono: string; 
  requerimiento: string; 
  mensaje?: string | null; 
  estado: EstadoProspecto; 
  createdAt: string;
}

interface ProspectoFormData {
  id: string; 
  nombre: string; 
  empresa: string; 
  ruc: string; 
  email: string; 
  telefono: string; 
  requerimiento: string; 
  mensaje: string; 
  estado: EstadoProspecto;
}

export default function ProspectosPage() {
  // =====================================================================
  // TÍTULO: 2. ESTADOS GLOBALES DE LA PANTALLA
  // =====================================================================
  const [prospectos, setProspectos] = useState<Prospecto[]>([]);
  const [cargandoDatos, setCargandoDatos] = useState(true);
  
  // Estados para Búsqueda y Filtro Combinado
  const [busqueda, setBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState<EstadoProspecto | 'TODOS'>('TODOS');

  // =====================================================================
  // TÍTULO: 3. ESTADOS DE MODALES Y FORMULARIOS
  // =====================================================================
  const [isModalCrudOpen, setIsModalCrudOpen] = useState(false);
  const [modoModal, setModoModal] = useState<'crear' | 'editar'>('crear');
  const [cargandoForm, setCargandoForm] = useState(false);

  const [modalEliminar, setModalEliminar] = useState({ isOpen: false, id: '', nombre: '' });
  const [alertaSistema, setAlertaSistema] = useState({ isOpen: false, mensaje: '', tipo: 'exito' });

  const formInicial: ProspectoFormData = { 
    id: '', nombre: '', empresa: '', ruc: '', email: '', telefono: '', requerimiento: '', mensaje: '', estado: 'NUEVO' 
  };
  const [formData, setFormData] = useState<ProspectoFormData>(formInicial);

  // =====================================================================
  // TÍTULO: 4. FUNCIONES DE LECTURA (GET)
  // =====================================================================
  const cargarDatos = async () => {
    setCargandoDatos(true);
    try {
      const res = await fetch('/api/prospectos');
      const data = await res.json();
      if (Array.isArray(data)) setProspectos(data);
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
  // TÍTULO: 5. BUSCADOR Y FILTRO EN TIEMPO REAL
  // SUBTÍTULO: Filtra por Nombre, Empresa, RUC combinado con el Estado
  // =====================================================================
  const prospectosFiltrados = prospectos.filter(pros => {
    const textoBusqueda = busqueda.toLowerCase();
    const coincideTexto = 
      pros.nombre.toLowerCase().includes(textoBusqueda) ||
      (pros.empresa && pros.empresa.toLowerCase().includes(textoBusqueda)) ||
      (pros.ruc && pros.ruc.includes(textoBusqueda));
    
    const coincideEstado = filtroEstado === 'TODOS' || pros.estado === filtroEstado;
    
    return coincideTexto && coincideEstado;
  });

  // =====================================================================
  // TÍTULO: 6. CONTROLADORES DE MODALES
  // =====================================================================
  const abrirModalCrear = () => {
    setModoModal('crear');
    setFormData(formInicial);
    setIsModalCrudOpen(true);
  };

  const abrirModalEditar = (pros: Prospecto) => {
    setModoModal('editar');
    setFormData({
      id: pros.id, 
      nombre: pros.nombre, 
      empresa: pros.empresa || '', 
      ruc: pros.ruc || '', 
      email: pros.email, 
      telefono: pros.telefono, 
      requerimiento: pros.requerimiento, 
      mensaje: pros.mensaje || '', 
      estado: pros.estado
    });
    setIsModalCrudOpen(true);
  };

  // =====================================================================
  // TÍTULO: 7. FUNCIONES DE GUARDADO Y ELIMINACIÓN (POST, PUT, DELETE)
  // =====================================================================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCargandoForm(true);
    try {
      const metodo = modoModal === 'crear' ? 'POST' : 'PUT';
      const url = modoModal === 'crear' ? '/api/prospectos' : `/api/prospectos?id=${formData.id}`;

      const res = await fetch(url, { 
        method: metodo, 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify(formData) 
      });

      if (res.ok) {
        await cargarDatos();
        setIsModalCrudOpen(false);
        mostrarAlerta(modoModal === 'crear' ? "Prospecto registrado." : "Prospecto actualizado.", "exito");
      } else { 
        const errorData = await res.json().catch(() => ({}));
        mostrarAlerta(errorData.error || "Error al guardar el prospecto.", "error");
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
      const res = await fetch(`/api/prospectos?id=${modalEliminar.id}`, { method: 'DELETE' });
      if (res.ok) {
        setProspectos(p => p.filter(pros => pros.id !== modalEliminar.id));
        mostrarAlerta("Prospecto eliminado.", "exito");
      } else {
        mostrarAlerta("No se puede eliminar el prospecto.", "error");
      }
    } catch (error) { 
      mostrarAlerta("Error al intentar eliminar.", "error");
    } finally {
      setModalEliminar({ isOpen: false, id: '', nombre: '' });
    }
  };

  // Helper para pintar badges de colores según el estado
  const getBadgeColor = (estado: EstadoProspecto) => {
    switch(estado) {
      case 'NUEVO': return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800/50';
      case 'CONTACTADO': return 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:border-orange-800/50';
      case 'COTIZADO': return 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:border-purple-800/50';
      case 'CERRADO': return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-800/50';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  // =====================================================================
  // TÍTULO: 8. RENDERIZADO DE LA INTERFAZ (UI)
  // =====================================================================
  return (
    <div className="admin-b2b space-y-8 relative transition-colors">
      
      {/* CABECERA PRINCIPAL */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#0F172A] dark:text-[#F3F4F6]">CRM de Prospectos B2B</h1>
          <p className="text-[#64748B] dark:text-[#9CA3AF] mt-1 text-sm">Controla tu embudo de ventas: atiende nuevos leads, envía cotizaciones corporativas y cierra proyectos exitosos.</p>
        </div>
        <button onClick={abrirModalCrear} className="cursor-pointer flex items-center justify-center gap-2 bg-[#1D4ED8] text-white px-5 py-2.5 rounded-md font-medium hover:bg-[#1E40AF] transition-colors shadow-sm">
          <Plus size={18} /> Nuevo Prospecto
        </button>
      </div>

      {/* TABLA PRINCIPAL DE DATOS */}
      <div className="bg-[#FFFFFF] dark:bg-[#121212] border border-[#E2E8F0] dark:border-[#262626] rounded-xl overflow-hidden transition-colors shadow-sm">
        
        {/* BARRA DE HERRAMIENTAS: Buscador + Filtro */}
        <div className="p-4 border-b border-[#E2E8F0] dark:border-[#262626] bg-[#FFFFFF] dark:bg-[#121212] flex flex-col sm:flex-row items-center justify-between gap-4">
          <h2 className="text-sm font-bold text-[#0F172A] dark:text-[#F3F4F6] hidden lg:block">Bandeja de Entrada</h2>
          
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
            {/* Filtro Dropdown */}
            <div className="relative w-full sm:w-48">
              <Filter className="absolute left-3 top-2.5 text-[#64748B] dark:text-[#9CA3AF]" size={16} />
              <select 
                value={filtroEstado} 
                onChange={(e) => setFiltroEstado(e.target.value as EstadoProspecto | 'TODOS')}
                className="w-full pl-9 pr-4 py-2 bg-[#FFFFFF] dark:bg-[#121212] border border-[#E2E8F0] dark:border-[#262626] rounded-md outline-none focus:border-[#1D4ED8] text-[#0F172A] dark:text-[#F3F4F6] text-sm cursor-pointer shadow-sm"
              >
                <option value="TODOS">Todos los Estados</option>
                <option value="NUEVO">Nuevos</option>
                <option value="CONTACTADO">Contactados</option>
                <option value="COTIZADO">Cotizados</option>
                <option value="CERRADO">Cerrados</option>
              </select>
            </div>

            {/* Buscador de Texto */}
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-2.5 text-[#64748B] dark:text-[#9CA3AF]" size={18} />
              <input type="text" placeholder="Buscar empresa o RUC..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} className="w-full pl-10 pr-4 py-2 bg-[#FFFFFF] dark:bg-[#121212] border border-[#E2E8F0] dark:border-[#262626] rounded-md outline-none focus:border-[#1D4ED8] text-[#0F172A] dark:text-[#F3F4F6] text-sm shadow-sm" />
            </div>
          </div>
        </div>

        {/* Estructura de la Tabla */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead className="bg-[#F8FAFC] dark:bg-[#1A1A1A] border-b border-[#E2E8F0] dark:border-[#262626] text-xs font-semibold uppercase tracking-wider text-[#64748B] dark:text-[#9CA3AF]">
              <tr>
                <th className="px-6 py-4 font-semibold">Empresa / Cliente</th>
                <th className="px-6 py-4 font-semibold">Contacto</th>
                <th className="px-6 py-4 font-semibold">Requerimiento</th>
                <th className="px-6 py-4 font-semibold text-center">Estado</th>
                <th className="px-6 py-4 font-semibold text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-[#FFFFFF] dark:bg-[#121212]">
              {cargandoDatos ? (
                <tr><td colSpan={5} className="text-center py-12 text-[#64748B] dark:text-[#9CA3AF] border-b border-[#E2E8F0] dark:border-[#262626]"><Loader2 className="animate-spin mx-auto mb-2" size={24} />Cargando CRM...</td></tr>
              ) : prospectosFiltrados.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-12 text-[#64748B] dark:text-[#9CA3AF] border-b border-[#E2E8F0] dark:border-[#262626]">{busqueda || filtroEstado !== 'TODOS' ? 'No se encontraron prospectos con esos filtros.' : 'No hay prospectos en la bandeja.'}</td></tr>
              ) : prospectosFiltrados.map((pros) => (
                <tr key={pros.id} className="hover:bg-[#F8FAFC] dark:hover:bg-[#262626]/30 transition-colors border-b border-[#E2E8F0] dark:border-[#262626] last:border-0">
                  <td className="px-6 py-4 border-none">
                    <div className="font-bold text-[#0F172A] dark:text-[#F3F4F6] flex items-center gap-2">
                      <Briefcase size={14} className="text-[#1D4ED8]"/> {pros.empresa || pros.nombre}
                    </div>
                    <div className="text-xs text-[#64748B] dark:text-[#9CA3AF] mt-1">{pros.ruc ? `RUC: ${pros.ruc}` : `Atención: ${pros.nombre}`}</div>
                  </td>
                  <td className="px-6 py-4 border-none">
                    <div className="text-sm font-medium text-[#0F172A] dark:text-[#F3F4F6]">{pros.telefono}</div>
                    <div className="text-xs text-[#64748B] dark:text-[#9CA3AF] mt-0.5">{pros.email}</div>
                  </td>
                  <td className="px-6 py-4 text-[#0F172A] dark:text-[#F3F4F6] font-medium text-sm truncate max-w-[200px] border-none">
                    {pros.requerimiento}
                  </td>
                  <td className="px-6 py-4 text-center border-none">
                    <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md border ${getBadgeColor(pros.estado)}`}>
                      {pros.estado}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center border-none">
                    <div className="flex justify-center gap-2">
                      <button onClick={() => abrirModalEditar(pros)} className="cursor-pointer p-1.5 text-[#1D4ED8] hover:bg-blue-50 dark:hover:bg-[#262626] rounded-md transition-colors"><Edit2 size={16} /></button>
                      <button onClick={() => confirmarEliminar(pros.id, pros.nombre)} className="cursor-pointer p-1.5 text-[#DC2626] hover:bg-red-50 dark:hover:bg-[#262626] rounded-md transition-colors"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* =====================================================================
          TÍTULO: MODAL DE FORMULARIO (CREAR / EDITAR CRM)
          SUBTÍTULO: Formulario de entrada de datos puro, sin subida de imágenes
      ===================================================================== */}
      {isModalCrudOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#FFFFFF] dark:bg-[#121212] rounded-xl w-full max-w-3xl flex flex-col max-h-[90vh] border border-[#E2E8F0] dark:border-[#262626] shadow-2xl overflow-hidden">
            
            <div className="flex justify-between items-center p-5 border-b border-[#E2E8F0] dark:border-[#262626] bg-[#F8FAFC] dark:bg-[#1A1A1A] shrink-0">
              <h2 className="font-bold text-[#0F172A] dark:text-[#F3F4F6] flex items-center gap-2">
                <Briefcase size={20} className="text-[#1D4ED8]"/> 
                {modoModal === 'crear' ? 'Registrar Oportunidad (Lead)' : 'Actualizar Ficha de Prospecto'}
              </h2>
              <button onClick={() => setIsModalCrudOpen(false)} className="cursor-pointer text-[#64748B] hover:text-[#DC2626] transition-colors"><X size={20} /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
              <div className="p-6 overflow-y-auto flex-1">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  
                  {/* Columna Izquierda: Datos del Cliente */}
                  <div className="space-y-5">
                    <h3 className="text-xs font-bold text-[#1D4ED8] uppercase tracking-wider mb-2 border-b border-[#E2E8F0] dark:border-[#262626] pb-2">Datos del Cliente</h3>
                    
                    <div>
                      <label className="block text-[10px] font-bold text-[#64748B] dark:text-[#9CA3AF] uppercase tracking-widest mb-1.5">Nombre Completo *</label>
                      <input type="text" required value={formData.nombre} onChange={e=>setFormData({...formData, nombre: e.target.value})} placeholder="Ej: Juan Pérez" className="w-full bg-[#FFFFFF] dark:bg-[#000000] border border-[#E2E8F0] dark:border-[#262626] p-3 rounded-md outline-none text-[#0F172A] dark:text-[#F3F4F6] text-sm" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-[#64748B] dark:text-[#9CA3AF] uppercase tracking-widest mb-1.5">Empresa</label>
                        <input type="text" value={formData.empresa} onChange={e=>setFormData({...formData, empresa: e.target.value})} placeholder="Razón Social" className="w-full bg-[#FFFFFF] dark:bg-[#000000] border border-[#E2E8F0] dark:border-[#262626] p-3 rounded-md outline-none text-[#0F172A] dark:text-[#F3F4F6] text-sm" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-[#64748B] dark:text-[#9CA3AF] uppercase tracking-widest mb-1.5">RUC</label>
                        <input type="text" value={formData.ruc} onChange={e=>setFormData({...formData, ruc: e.target.value})} placeholder="20..." className="w-full bg-[#FFFFFF] dark:bg-[#000000] border border-[#E2E8F0] dark:border-[#262626] p-3 rounded-md outline-none text-[#0F172A] dark:text-[#F3F4F6] text-sm font-mono" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-[#64748B] dark:text-[#9CA3AF] uppercase tracking-widest mb-1.5">Teléfono / WhatsApp *</label>
                        <input type="tel" required value={formData.telefono} onChange={e=>setFormData({...formData, telefono: e.target.value})} placeholder="999..." className="w-full bg-[#FFFFFF] dark:bg-[#000000] border border-[#E2E8F0] dark:border-[#262626] p-3 rounded-md outline-none text-[#0F172A] dark:text-[#F3F4F6] text-sm font-mono" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-[#64748B] dark:text-[#9CA3AF] uppercase tracking-widest mb-1.5">Email *</label>
                        <input type="email" required value={formData.email} onChange={e=>setFormData({...formData, email: e.target.value})} placeholder="correo@empresa.com" className="w-full bg-[#FFFFFF] dark:bg-[#000000] border border-[#E2E8F0] dark:border-[#262626] p-3 rounded-md outline-none text-[#0F172A] dark:text-[#F3F4F6] text-sm" />
                      </div>
                    </div>
                  </div>

                  {/* Columna Derecha: Oportunidad y Estado */}
                  <div className="space-y-5">
                    <h3 className="text-xs font-bold text-[#1D4ED8] uppercase tracking-wider mb-2 border-b border-[#E2E8F0] dark:border-[#262626] pb-2">Información del Negocio</h3>
                    
                    <div className="bg-[#F8FAFC] dark:bg-[#1A1A1A] p-4 rounded-md border border-[#E2E8F0] dark:border-[#262626]">
                      <label className="block text-[10px] font-bold text-[#64748B] dark:text-[#9CA3AF] uppercase tracking-widest mb-2">Estado de la Venta *</label>
                      <select required value={formData.estado} onChange={e=>setFormData({...formData, estado: e.target.value as EstadoProspecto})} className="w-full bg-[#FFFFFF] dark:bg-[#000000] border border-[#E2E8F0] dark:border-[#262626] p-3 rounded-md outline-none text-[#0F172A] dark:text-[#F3F4F6] text-sm font-bold cursor-pointer focus:border-[#1D4ED8]">
                        <option value="NUEVO">🔵 NUEVO (Lead Entrante)</option>
                        <option value="CONTACTADO">🟠 CONTACTADO (En Conversación)</option>
                        <option value="COTIZADO">🟣 COTIZADO (Propuesta Enviada)</option>
                        <option value="CERRADO">🟢 CERRADO (Venta Ganada/Finalizada)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-[#64748B] dark:text-[#9CA3AF] uppercase tracking-widest mb-1.5">Asunto / Requerimiento *</label>
                      <input type="text" required value={formData.requerimiento} onChange={e=>setFormData({...formData, requerimiento: e.target.value})} placeholder="Ej: Cotización de Cableado, Proyecto CCTV..." className="w-full bg-[#FFFFFF] dark:bg-[#000000] border border-[#E2E8F0] dark:border-[#262626] p-3 rounded-md outline-none text-[#0F172A] dark:text-[#F3F4F6] text-sm font-medium" />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-[#64748B] dark:text-[#9CA3AF] uppercase tracking-widest mb-1.5">Mensaje o Notas Internas</label>
                      <textarea value={formData.mensaje} onChange={e=>setFormData({...formData, mensaje: e.target.value})} placeholder="Detalles de lo conversado o notas enviadas desde la web..." className="w-full bg-[#FFFFFF] dark:bg-[#000000] border border-[#E2E8F0] dark:border-[#262626] p-3 rounded-md outline-none text-[#0F172A] dark:text-[#F3F4F6] text-sm min-h-[120px] resize-none"></textarea>
                    </div>
                  </div>

                </div>
              </div>

              {/* Botones Fijos Abajo */}
              <div className="p-4 border-t border-[#E2E8F0] dark:border-[#262626] bg-[#F8FAFC] dark:bg-[#1A1A1A] shrink-0 flex gap-3">
                <button type="button" onClick={()=>setIsModalCrudOpen(false)} className="cursor-pointer flex-1 bg-[#FFFFFF] dark:bg-[#000000] border border-[#E2E8F0] dark:border-[#262626] hover:bg-[#E2E8F0] dark:hover:bg-[#262626] py-3 rounded-md font-medium text-[#0F172A] dark:text-[#F3F4F6] transition-colors">
                  Cancelar
                </button>
                <button type="submit" disabled={cargandoForm} className="cursor-pointer flex-[2] bg-[#1D4ED8] hover:bg-[#1E40AF] text-white py-3 rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2">
                  {cargandoForm ? <Loader2 size={16} className="animate-spin" /> : null}
                  {cargandoForm ? 'Guardando...' : (modoModal === 'crear' ? 'Guardar Prospecto' : 'Actualizar Ficha')}
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
            <h3 className="text-xl font-bold text-[#0F172A] dark:text-[#F3F4F6] mb-2">¿Eliminar Lead?</h3>
            <p className="text-[#64748B] dark:text-[#9CA3AF] text-sm mb-6">Borrarás el contacto de <strong>{modalEliminar.nombre}</strong> de forma permanente.</p>
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