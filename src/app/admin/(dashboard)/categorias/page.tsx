'use client';

import { useState, useEffect } from 'react';
import { Search, Plus, Edit2, Trash2, Tags, X, Loader2, AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';

// =====================================================================
// TÍTULO: TIPADO DE DATOS (INTERFACES)
// Define la estructura exacta de lo que viene de la base de datos (Prisma)
// =====================================================================
interface Categoria { 
  id: string; 
  nombre: string; 
  slug: string; 
  descripcion: string | null; 
  _count?: { productos: number }; 
}

export default function CategoriasPage() {
  // =====================================================================
  // TÍTULO: ESTADOS GLOBALES (VARIABLES EN MEMORIA)
  // Aquí guardamos los datos de la tabla, la búsqueda y el estado de carga
  // =====================================================================
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [cargandoDatos, setCargandoDatos] = useState(true);
  const [busqueda, setBusqueda] = useState('');

  // =====================================================================
  // TÍTULO: ESTADOS PARA MODALES DE INTERFAZ (UI)
  // Controlan las ventanas emergentes nativas
  // =====================================================================
  const [isModalCrudOpen, setIsModalCrudOpen] = useState(false);
  const [modoModal, setModoModal] = useState<'crear' | 'editar'>('crear');
  const [cargandoForm, setCargandoForm] = useState(false);
  
  const [modalEliminar, setModalEliminar] = useState({ isOpen: false, id: '', nombre: '' });
  const [alertaSistema, setAlertaSistema] = useState({ isOpen: false, mensaje: '', tipo: 'exito' });

  const formInicial = { id: '', nombre: '', slug: '', descripcion: '' };
  const [formData, setFormData] = useState(formInicial);

  // =====================================================================
  // TÍTULO: LÓGICA DE AUTO-SLUG
  // Genera URLs amigables automáticamente
  // =====================================================================
  const manejarCambioNombre = (texto: string) => {
    const slugGenerado = texto.toLowerCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[\W_]+/g, "-");
    setFormData({ ...formData, nombre: texto, slug: slugGenerado });
  };

  // =====================================================================
  // TÍTULO: LÓGICA DE OBTENCIÓN DE DATOS (READ)
  // Llama a la API al cargar la página
  // =====================================================================
  const cargarCategorias = async () => {
    setCargandoDatos(true);
    try {
      const res = await fetch('/api/categorias');
      const data = await res.json();
      if(Array.isArray(data)) setCategorias(data);
    } catch(e) { 
      console.error(e); 
      mostrarAlerta("Error al conectar con la base de datos", "error");
    } finally { 
      setCargandoDatos(false); 
    }
  };

  useEffect(() => { cargarCategorias(); }, []);

  const mostrarAlerta = (mensaje: string, tipo: 'exito' | 'error') => {
    setAlertaSistema({ isOpen: true, mensaje, tipo });
    setTimeout(() => setAlertaSistema({ isOpen: false, mensaje: '', tipo: 'exito' }), 4000);
  };

  // =====================================================================
  // TÍTULO: LÓGICA DEL BUSCADOR SECUNDARIO
  // =====================================================================
  const categoriasFiltradas = categorias.filter(cat => 
    cat.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  // =====================================================================
  // TÍTULO: LÓGICA DE APERTURA DE MODALES CRUD (CREAR / EDITAR)
  // =====================================================================
  const abrirModalCrear = () => {
    setModoModal('crear');
    setFormData(formInicial);
    setIsModalCrudOpen(true);
  };

  const abrirModalEditar = (cat: Categoria) => {
    setModoModal('editar');
    setFormData({
      id: cat.id,
      nombre: cat.nombre,
      slug: cat.slug,
      descripcion: cat.descripcion || ''
    });
    setIsModalCrudOpen(true);
  };

  // =====================================================================
  // TÍTULO: LÓGICA DE GUARDADO (CREATE & UPDATE)
  // =====================================================================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); 
    setCargandoForm(true);
    try {
      const metodo = modoModal === 'crear' ? 'POST' : 'PUT';
      const url = modoModal === 'crear' ? '/api/categorias' : `/api/categorias?id=${formData.id}`;
      
      const res = await fetch(url, { 
        method: metodo, 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify(formData) 
      });
      
      if(res.ok) { 
        await cargarCategorias();
        setIsModalCrudOpen(false); 
        mostrarAlerta(modoModal === 'crear' ? "Categoría creada con éxito." : "Categoría actualizada correctamente.", "exito");
      } else { 
        const errorData = await res.json().catch(() => ({}));
        mostrarAlerta(errorData.error || "Error al guardar. Verifica que el nombre o slug no estén repetidos.", "error");
      }
    } catch(error) {
      console.error(error);
      mostrarAlerta("Error de red al intentar guardar.", "error");
    } finally {
      setCargandoForm(false);
    }
  };

  // =====================================================================
  // TÍTULO: LÓGICA DE ELIMINACIÓN (DELETE)
  // =====================================================================
  const confirmarEliminar = (id: string, nombre: string) => {
    setModalEliminar({ isOpen: true, id, nombre });
  };

  const ejecutarEliminacion = async () => {
    try {
      const res = await fetch(`/api/categorias?id=${modalEliminar.id}`, { 
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: modalEliminar.id })
      }); 
      
      if(res.ok) {
        setCategorias(p => p.filter(c => c.id !== modalEliminar.id)); 
        mostrarAlerta("Categoría eliminada del sistema.", "exito");
      } else {
        const errorData = await res.json().catch(() => ({}));
        mostrarAlerta(errorData.error || "No se puede eliminar una categoría que ya tiene productos.", "error");
      }
    } catch (error) {
      console.error(error);
      mostrarAlerta("Error al intentar eliminar.", "error");
    } finally {
      setModalEliminar({ isOpen: false, id: '', nombre: '' });
    }
  };

  return (
    <div className="admin-b2b space-y-8 relative transition-colors">
      
      {/* =====================================================================
          TÍTULO: INTERFAZ - CABECERA DE LA PÁGINA
      ===================================================================== */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#0F172A] dark:text-[#F3F4F6]">Categorías</h1>
          <p className="text-[#64748B] dark:text-[#9CA3AF] mt-1 text-sm">Gestiona las familias y clasificaciones de tu catálogo.</p>
        </div>
        <button onClick={abrirModalCrear} className="cursor-pointer flex items-center justify-center gap-2 bg-[#1D4ED8] text-white px-5 py-2.5 rounded-md font-medium hover:bg-[#1E40AF] transition-colors active:scale-95 shadow-sm">
          <Plus size={18} /> Nueva Categoría
        </button>
      </div>

      {/* =====================================================================
          TÍTULO: INTERFAZ - CONTENEDOR PRINCIPAL (BUSCADOR + TABLA)
      ===================================================================== */}
      <div className="bg-[#FFFFFF] dark:bg-[#121212] border border-[#E2E8F0] dark:border-[#262626] rounded-xl overflow-hidden transition-colors shadow-sm">
        
        {/* BARRA DEL BUSCADOR SECUNDARIO */}
        <div className="p-4 border-b border-[#E2E8F0] dark:border-[#262626] bg-[#FFFFFF] dark:bg-[#121212] flex flex-col sm:flex-row items-center justify-between gap-4">
          <h2 className="text-sm font-bold text-[#0F172A] dark:text-[#F3F4F6] hidden sm:block">Todas las Categorías</h2>
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-2.5 text-[#64748B] dark:text-[#9CA3AF]" size={18} />
            <input 
              type="text" 
              placeholder="Buscar categoría por nombre..." 
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#FFFFFF] dark:bg-[#121212] border border-[#E2E8F0] dark:border-[#262626] rounded-md outline-none focus:border-[#1D4ED8] dark:focus:border-[#1D4ED8] text-[#0F172A] dark:text-[#F3F4F6] text-sm transition-colors shadow-sm"
            />
          </div>
        </div>

        {/* TABLA RESPONSIVA */}
        <div className="overflow-x-auto">
          {/* Se añade border-collapse para que las filas interactúen mejor */}
          <table className="w-full text-left text-sm border-collapse">
            <thead className="bg-[#F8FAFC] dark:bg-[#1A1A1A] border-b border-[#E2E8F0] dark:border-[#262626] text-xs font-semibold uppercase tracking-wider text-[#64748B] dark:text-[#9CA3AF]">
              <tr>
                <th className="px-6 py-4 font-semibold">Nombre de Categoría</th>
                <th className="px-6 py-4 font-semibold">Descripción</th>
                <th className="px-6 py-4 font-semibold">URL (Slug)</th>
                <th className="px-6 py-4 font-semibold text-center">Productos</th>
                <th className="px-6 py-4 font-semibold text-center">Acciones</th>
              </tr>
            </thead>
            {/* Se quita el divide-y para controlar el borde desde la fila (tr) */}
            <tbody className="bg-[#FFFFFF] dark:bg-[#121212]">
              {cargandoDatos ? (
                <tr><td colSpan={5} className="text-center py-12 text-[#64748B] dark:text-[#9CA3AF] border-b border-[#E2E8F0] dark:border-[#262626]"><Loader2 className="animate-spin mx-auto mb-2" size={24} />Cargando base de datos...</td></tr>
              ) : categoriasFiltradas.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-12 text-[#64748B] dark:text-[#9CA3AF] border-b border-[#E2E8F0] dark:border-[#262626]">{busqueda ? 'No hay resultados para tu búsqueda.' : 'Sin categorías registradas.'}</td></tr>
              ) : categoriasFiltradas.map((cat) => (
                <tr key={cat.id} className="hover:bg-[#F8FAFC] dark:hover:bg-[#262626]/30 transition-colors border-b border-[#E2E8F0] dark:border-[#262626] last:border-0">
                  {/* Se asegura que los 'td' no tengan borde individual que cause doble línea */}
                  <td className="px-6 py-4 font-bold text-[#0F172A] dark:text-[#F3F4F6] flex items-center gap-3 border-none">
                    <Tags size={16} className="text-[#1D4ED8]" />
                    {cat.nombre}
                  </td>
                  <td className="px-6 py-4 text-[#64748B] dark:text-[#9CA3AF] text-sm truncate max-w-[200px] border-none">
                    {cat.descripcion || <span className="italic text-[#64748B]/50 dark:text-[#9CA3AF]/50">-</span>}
                  </td>
                  <td className="px-6 py-4 border-none">
                    <span className="text-[#64748B] dark:text-[#9CA3AF] font-mono text-xs bg-[#F8FAFC] dark:bg-[#000000] border border-[#E2E8F0] dark:border-[#262626] px-2.5 py-1 rounded">/{cat.slug}</span>
                  </td>
                  <td className="px-6 py-4 text-center font-bold text-[#0F172A] dark:text-[#F3F4F6] border-none">
                    {cat._count?.productos || 0}
                  </td>
                  <td className="px-6 py-4 text-center border-none">
                    <div className="flex justify-center gap-2">
                      <button onClick={() => abrirModalEditar(cat)} className="cursor-pointer p-1.5 text-[#1D4ED8] hover:bg-blue-50 dark:hover:bg-[#262626] rounded-md transition-colors" title="Editar"><Edit2 size={16} /></button>
                      <button onClick={() => confirmarEliminar(cat.id, cat.nombre)} className="cursor-pointer p-1.5 text-[#DC2626] hover:bg-red-50 dark:hover:bg-[#262626] rounded-md transition-colors" title="Eliminar"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* =====================================================================
          TÍTULO: INTERFAZ - MODAL DE CRUD (CREAR Y EDITAR)
      ===================================================================== */}
      {isModalCrudOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#FFFFFF] dark:bg-[#121212] rounded-xl w-full max-w-md overflow-hidden border border-[#E2E8F0] dark:border-[#262626] shadow-2xl">
            
            <div className="p-5 border-b border-[#E2E8F0] dark:border-[#262626] bg-[#F8FAFC] dark:bg-[#1A1A1A] flex justify-between items-center">
              <h2 className="font-bold text-[#0F172A] dark:text-[#F3F4F6] flex items-center gap-2">
                <Tags size={18} className="text-[#1D4ED8]"/> 
                {modoModal === 'crear' ? 'Nueva Categoría' : 'Editar Categoría'}
              </h2>
              <button onClick={()=>setIsModalCrudOpen(false)} className="cursor-pointer text-[#64748B] hover:text-[#DC2626] transition-colors"><X size={20}/></button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-[10px] font-bold text-[#64748B] dark:text-[#9CA3AF] uppercase tracking-widest mb-1.5">Nombre de la Categoría *</label>
                <input 
                  type="text" 
                  required 
                  value={formData.nombre} 
                  onChange={e => manejarCambioNombre(e.target.value)} 
                  placeholder="Ej: Servidores" 
                  className="w-full bg-[#FFFFFF] dark:bg-[#000000] border border-[#E2E8F0] dark:border-[#262626] focus:border-[#1D4ED8] dark:focus:border-[#1D4ED8] p-3 rounded-md outline-none text-sm text-[#0F172A] dark:text-[#F3F4F6] transition-colors" 
                />
              </div>
              
              <div>
                <label className="block text-[10px] font-bold text-[#64748B] dark:text-[#9CA3AF] uppercase tracking-widest mb-1.5">Descripción (Opcional)</label>
                <textarea 
                  value={formData.descripcion} 
                  onChange={e => setFormData({...formData, descripcion: e.target.value})} 
                  placeholder="Detalle de la categoría..." 
                  className="w-full bg-[#FFFFFF] dark:bg-[#000000] border border-[#E2E8F0] dark:border-[#262626] focus:border-[#1D4ED8] dark:focus:border-[#1D4ED8] p-3 rounded-md outline-none text-sm text-[#0F172A] dark:text-[#F3F4F6] resize-none h-20 transition-colors"
                ></textarea>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-[#64748B] dark:text-[#9CA3AF] uppercase tracking-widest mb-1.5">URL Amigable (Slug) *</label>
                <input 
                  type="text" 
                  required
                  value={formData.slug} 
                  onChange={e => setFormData({...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-')})}
                  className="w-full bg-[#F8FAFC] dark:bg-[#121212] border border-[#E2E8F0] dark:border-[#262626] focus:border-[#1D4ED8] dark:focus:border-[#1D4ED8] p-3 rounded-md outline-none text-[#64748B] dark:text-[#9CA3AF] font-mono text-xs transition-colors" 
                />
                <p className="text-[10px] text-[#64748B] dark:text-[#9CA3AF] mt-1.5">Ruta web: /categoria/{formData.slug || '...'}</p>
              </div>
              
              <div className="pt-4 border-t border-[#E2E8F0] dark:border-[#262626] flex gap-3">
                <button type="button" onClick={()=>setIsModalCrudOpen(false)} className="cursor-pointer flex-1 bg-[#F8FAFC] dark:bg-[#000000] border border-[#E2E8F0] dark:border-[#262626] hover:bg-[#E2E8F0] dark:hover:bg-[#262626] py-3 rounded-md font-medium text-[#0F172A] dark:text-[#F3F4F6] transition-colors">
                  Cancelar
                </button>
                <button type="submit" disabled={cargandoForm} className="cursor-pointer flex-1 bg-[#1D4ED8] hover:bg-[#1E40AF] text-white py-3 rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                  {cargandoForm && <Loader2 size={16} className="animate-spin" />}
                  {cargandoForm ? 'Guardando...' : (modoModal === 'crear' ? 'Guardar Categoría' : 'Actualizar')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =====================================================================
          TÍTULO: INTERFAZ - MODAL NATIVO DE ELIMINACIÓN
      ===================================================================== */}
      {modalEliminar.isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#FFFFFF] dark:bg-[#121212] rounded-xl w-full max-w-sm overflow-hidden border border-[#E2E8F0] dark:border-[#262626] shadow-2xl p-6 text-center">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle size={32} className="text-[#DC2626]" />
            </div>
            <h3 className="text-xl font-bold text-[#0F172A] dark:text-[#F3F4F6] mb-2">¿Eliminar Categoría?</h3>
            <p className="text-[#64748B] dark:text-[#9CA3AF] text-sm mb-6">
              Estás a punto de borrar <strong>{modalEliminar.nombre}</strong>. Esta acción no se puede deshacer y fallará si tiene productos enlazados.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setModalEliminar({ isOpen: false, id: '', nombre: '' })} className="cursor-pointer flex-1 bg-[#F8FAFC] dark:bg-[#000000] border border-[#E2E8F0] dark:border-[#262626] hover:bg-[#E2E8F0] dark:hover:bg-[#262626] py-3 rounded-md font-medium text-[#0F172A] dark:text-[#F3F4F6] transition-colors">
                Cancelar
              </button>
              <button onClick={ejecutarEliminacion} className="cursor-pointer flex-1 bg-[#DC2626] hover:bg-[#991B1B] text-white py-3 rounded-md font-medium transition-colors">
                Sí, eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          TÍTULO: INTERFAZ - ALERTAS DEL SISTEMA (TOAST)
      ===================================================================== */}
      {alertaSistema.isOpen && (
        <div className="fixed bottom-6 right-6 z-[70] animate-in slide-in-from-bottom-5 fade-in duration-300">
          <div className={`flex items-center gap-3 px-6 py-4 rounded-lg shadow-xl border ${alertaSistema.tipo === 'exito' ? 'bg-[#059669] border-[#047857]' : 'bg-[#DC2626] border-[#991B1B]'} text-white`}>
            {alertaSistema.tipo === 'exito' ? <CheckCircle2 size={24} /> : <XCircle size={24} />}
            <span className="font-medium">{alertaSistema.mensaje}</span>
            <button onClick={() => setAlertaSistema({ ...alertaSistema, isOpen: false })} className="cursor-pointer ml-2 hover:opacity-75 transition-opacity">
              <X size={18} />
            </button>
          </div>
        </div>
      )}

    </div>
  );
}