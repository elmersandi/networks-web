'use client';

import { useState, useEffect } from 'react';
import { Users, CheckCircle2, Ban, ShieldAlert, ShieldCheck, Mail, Phone, Plus, Trash2, Edit2, X, Loader2, UserCog } from 'lucide-react';

type Usuario = {
  id: string;
  dni: string;
  nombre: string;
  email: string;
  telefono: string;
  rol: 'ADMIN' | 'VENDEDOR' | 'SOPORTE';
  estadoAcceso: 'PENDIENTE' | 'APROBADO' | 'BLOQUEADO';
  isVerificado: boolean;
};

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [cargando, setCargando] = useState(true);
  
  // Estados para el Modal de Crear/Editar
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cargandoForm, setCargandoForm] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);

  const formInicial = { id: '', dni: '', nombre: '', email: '', telefono: '', rol: 'VENDEDOR', estadoAcceso: 'APROBADO', password: '' };
  const [formData, setFormData] = useState(formInicial);

  const fetchUsuarios = async () => {
    try {
      const res = await fetch('/api/usuarios');
      const data = await res.json();
      if(Array.isArray(data)) setUsuarios(data);
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => { fetchUsuarios(); }, []);

  // Función para cambios rápidos en la tabla (Rol o Estado)
  const actualizarRapido = async (id: string, nuevoEstado: string, nuevoRol: string) => {
    try {
      const res = await fetch('/api/usuarios', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, estadoAcceso: nuevoEstado, rol: nuevoRol }),
      });
      if (res.ok) fetchUsuarios();
      else alert("Error al actualizar");
    } catch (error) { alert("Error de conexión"); }
  };

  // Función para Crear o Editar desde el Modal
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCargandoForm(true);
    try {
      const method = modoEdicion ? 'PATCH' : 'POST';
      const res = await fetch('/api/usuarios', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        fetchUsuarios();
        setIsModalOpen(false);
        setFormData(formInicial);
      } else {
        alert("Error al guardar. Verifica que el DNI o Email no estén repetidos.");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setCargandoForm(false);
    }
  };

  // Función para Eliminar
  const eliminarUsuario = async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar este usuario permanentemente?")) return;
    try {
      const res = await fetch(`/api/usuarios?id=${id}`, { method: 'DELETE' });
      if (res.ok) setUsuarios(prev => prev.filter(u => u.id !== id));
      else alert("Error al eliminar el usuario");
    } catch (error) { console.error(error); }
  };

  const abrirModalNuevo = () => {
    setModoEdicion(false);
    setFormData(formInicial);
    setIsModalOpen(true);
  };

  const abrirModalEditar = (user: Usuario) => {
    setModoEdicion(true);
    setFormData({ ...user, password: '' }); // El password se deja en blanco, si lo llena, se cambia
    setIsModalOpen(true);
  };

  return (
    <div className="admin-b2b space-y-8 relative transition-colors">
      
      {/* CABECERA */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#0F172A] dark:text-[#F3F4F6] flex items-center gap-2">
            Gestión de Personal
          </h1>
          <p className="text-[#64748B] dark:text-[#9CA3AF] mt-1 text-sm">Administra los accesos, roles y cuentas del equipo.</p>
        </div>
        <button onClick={abrirModalNuevo} className="flex items-center gap-2 bg-[#1D4ED8] text-white px-5 py-2.5 rounded-md font-medium hover:bg-[#1E40AF] transition-colors active:scale-95">
          <Plus size={18} /> Nuevo Integrante
        </button>
      </div>

      {/* TABLA PRINCIPAL */}
      <div className="bg-[#FFFFFF] dark:bg-[#121212] rounded-xl border border-[#E2E8F0] dark:border-[#262626] overflow-hidden transition-colors">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-[#64748B] dark:text-[#9CA3AF]">
            <thead className="bg-[#F8FAFC] dark:bg-[#121212] text-xs uppercase tracking-wider font-semibold text-[#64748B] dark:text-[#9CA3AF] border-b border-[#E2E8F0] dark:border-[#262626]">
              <tr>
                <th className="px-6 py-4">Personal</th>
                <th className="px-6 py-4">Contacto</th>
                <th className="px-6 py-4 text-center">Verificado OTP</th>
                <th className="px-6 py-4">Rol del Sistema</th>
                <th className="px-6 py-4 text-center">Estado de Acceso</th>
                <th className="px-6 py-4 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0] dark:divide-[#262626]">
              {cargando ? (
                <tr><td colSpan={6} className="text-center py-12 text-slate-400 dark:text-neutral-600"><Loader2 className="animate-spin mx-auto mb-2" size={24} />Cargando personal...</td></tr>
              ) : usuarios.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-12 text-slate-400 dark:text-neutral-500">No hay usuarios registrados aún.</td></tr>
              ) : (
                usuarios.map((user) => (
                  <tr key={user.id} className="hover:bg-[#F8FAFC] dark:hover:bg-[#121212] transition-colors">
                    
                    {/* PERSONAL */}
                    <td className="px-6 py-4">
                      <div className="font-bold text-[#0F172A] dark:text-[#F3F4F6] flex items-center gap-2">
                        {user.rol === 'ADMIN' && <UserCog size={14} className="text-blue-500"/>}
                        {user.nombre}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-neutral-400 mt-1 font-mono bg-slate-100 dark:bg-neutral-800 inline-block px-1.5 rounded">DNI: {user.dni}</div>
                    </td>

                    {/* CONTACTO */}
                    <td className="px-6 py-4 space-y-1">
                        <div className="flex items-center gap-2 text-xs hover:text-[#1D4ED8] transition-colors"><Mail size={14}/> {user.email}</div>
                      <div className="flex items-center gap-2 text-xs hover:text-[#1D4ED8] transition-colors"><Phone size={14}/> {user.telefono}</div>
                    </td>

                    {/* VERIFICADO OTP */}
                    <td className="px-6 py-4 text-center">
                      {user.isVerificado ? (
                        <span className="inline-flex items-center gap-1 text-[#16A34A] bg-green-50 dark:bg-[#121212] border border-[#E2E8F0] dark:border-[#262626] px-2 py-1 rounded-md text-[10px] font-semibold tracking-wider"><ShieldCheck size={14}/> SÍ</span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[#E02424] bg-red-50 dark:bg-[#121212] border border-[#E2E8F0] dark:border-[#262626] px-2 py-1 rounded-md text-[10px] font-semibold tracking-wider"><ShieldAlert size={14}/> NO</span>
                      )}
                    </td>

                    {/* ROL (Cambio Rápido) */}
                    <td className="px-6 py-4">
                      <select 
                        value={user.rol}
                        onChange={(e) => actualizarRapido(user.id, user.estadoAcceso, e.target.value)}
                        className="bg-[#F8FAFC] dark:bg-[#121212] border border-[#E2E8F0] dark:border-[#262626] text-xs font-semibold text-[#0F172A] dark:text-[#F3F4F6] rounded-md p-2 cursor-pointer outline-none transition-colors"
                      >
                        <option value="ADMIN">Admin (Total)</option>
                        <option value="VENDEDOR">Vendedor</option>
                        <option value="SOPORTE">Soporte Técnico</option>
                      </select>
                    </td>

                    {/* ESTADO */}
                    <td className="px-6 py-4 text-center">
                      {user.estadoAcceso === 'APROBADO' && <span className="text-[#16A34A] font-semibold text-[10px] tracking-wider bg-green-50 dark:bg-[#121212] px-3 py-1 rounded-full border border-[#E2E8F0] dark:border-[#262626]">APROBADO</span>}
                      {user.estadoAcceso === 'PENDIENTE' && <span className="text-[#F59E0B] font-semibold text-[10px] tracking-wider bg-amber-50 dark:bg-[#121212] px-3 py-1 rounded-full border border-[#E2E8F0] dark:border-[#262626]">PENDIENTE</span>}
                      {user.estadoAcceso === 'BLOQUEADO' && <span className="text-[#E02424] font-semibold text-[10px] tracking-wider bg-red-50 dark:bg-[#121212] px-3 py-1 rounded-full border border-[#E2E8F0] dark:border-[#262626]">BLOQUEADO</span>}
                    </td>

                    {/* ACCIONES */}
                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-1 sm:gap-2">
                        {user.estadoAcceso !== 'APROBADO' && (
                          <button onClick={() => actualizarRapido(user.id, 'APROBADO', user.rol)} className="p-1.5 text-[#16A34A] hover:bg-green-50 dark:hover:bg-[#121212] rounded-lg transition-colors" title="Aprobar Acceso"><CheckCircle2 size={16} /></button>
                        )}
                        {user.estadoAcceso !== 'BLOQUEADO' && (
                          <button onClick={() => actualizarRapido(user.id, 'BLOQUEADO', user.rol)} className="p-1.5 text-[#F59E0B] hover:bg-amber-50 dark:hover:bg-[#121212] rounded-lg transition-colors" title="Bloquear"><Ban size={16} /></button>
                        )}
                        <button onClick={() => abrirModalEditar(user)} className="p-1.5 text-[#1D4ED8] hover:bg-blue-50 dark:hover:bg-[#121212] rounded-lg transition-colors" title="Editar Datos"><Edit2 size={16} /></button>
                        <button onClick={() => eliminarUsuario(user.id)} className="p-1.5 text-[#E02424] hover:bg-red-50 dark:hover:bg-[#121212] rounded-lg transition-colors" title="Eliminar Permanente"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL CREAR/EDITAR USUARIO */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 dark:bg-black/60 backdrop-blur-[2px]">
          <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] border border-slate-200 dark:border-neutral-800">
            
            <div className="p-5 border-b border-slate-100 dark:border-neutral-800 bg-slate-50 dark:bg-neutral-950 flex justify-between items-center shrink-0">
              <h2 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Users size={18} className="text-blue-500"/> 
                {modoEdicion ? 'Editar Personal' : 'Registrar Nuevo Personal'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-rose-500 transition-colors"><X size={20}/></button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 dark:text-neutral-400 uppercase tracking-widest mb-1.5">Nombre Completo</label>
                  <input type="text" required value={formData.nombre} onChange={e=>setFormData({...formData, nombre: e.target.value})} placeholder="Ej: Juan Pérez" className="w-full bg-white dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 p-2.5 rounded-xl outline-none focus:border-blue-500 dark:focus:border-blue-500 text-sm dark:text-white transition-colors" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 dark:text-neutral-400 uppercase tracking-widest mb-1.5">DNI</label>
                  <input type="text" required value={formData.dni} onChange={e=>setFormData({...formData, dni: e.target.value})} placeholder="8 dígitos" maxLength={8} className="w-full bg-white dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 p-2.5 rounded-xl outline-none focus:border-blue-500 dark:focus:border-blue-500 text-sm font-mono dark:text-white transition-colors" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 dark:text-neutral-400 uppercase tracking-widest mb-1.5">Correo Electrónico</label>
                  <input type="email" required value={formData.email} onChange={e=>setFormData({...formData, email: e.target.value})} placeholder="correo@empresa.com" className="w-full bg-white dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 p-2.5 rounded-xl outline-none focus:border-blue-500 dark:focus:border-blue-500 text-sm dark:text-white transition-colors" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 dark:text-neutral-400 uppercase tracking-widest mb-1.5">Teléfono / WhatsApp</label>
                  <input type="text" required value={formData.telefono} onChange={e=>setFormData({...formData, telefono: e.target.value})} placeholder="999 888 777" className="w-full bg-white dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 p-2.5 rounded-xl outline-none focus:border-blue-500 dark:focus:border-blue-500 text-sm font-mono dark:text-white transition-colors" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 dark:text-neutral-400 uppercase tracking-widest mb-1.5">Rol en el Sistema</label>
                  <select required value={formData.rol} onChange={e=>setFormData({...formData, rol: e.target.value as "ADMIN" | "VENDEDOR" | "SOPORTE"})} className="w-full bg-white dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 p-2.5 rounded-xl outline-none focus:border-blue-500 dark:focus:border-blue-500 text-sm dark:text-white transition-colors">
                    <option value="ADMIN">Administrador (Acceso Total)</option>
                    <option value="VENDEDOR">Vendedor (CRM y Tienda)</option>
                    <option value="SOPORTE">Soporte Técnico</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 dark:text-neutral-400 uppercase tracking-widest mb-1.5">Estado de Cuenta</label>
                  <select required value={formData.estadoAcceso} onChange={e=>setFormData({...formData, estadoAcceso: e.target.value as "APROBADO" | "PENDIENTE" | "BLOQUEADO"})} className="w-full bg-white dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 p-2.5 rounded-xl outline-none focus:border-blue-500 dark:focus:border-blue-500 text-sm dark:text-white transition-colors">
                    <option value="APROBADO">Aprobado (Puede entrar)</option>
                    <option value="PENDIENTE">Pendiente (En revisión)</option>
                    <option value="BLOQUEADO">Bloqueado (No puede entrar)</option>
                  </select>
                </div>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 rounded-xl">
                <label className="block text-[10px] font-bold text-slate-500 dark:text-neutral-400 uppercase tracking-widest mb-1.5">
                  {modoEdicion ? 'Cambiar Contraseña (Dejar en blanco para mantener la actual)' : 'Contraseña Inicial (Obligatoria)'}
                </label>
                <input 
                  type="text" 
                  required={!modoEdicion} 
                  value={formData.password} 
                  onChange={e=>setFormData({...formData, password: e.target.value})} 
                  placeholder={modoEdicion ? "Escribe nueva clave si deseas cambiarla" : "Crea una clave temporal"} 
                  className="w-full bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-700 p-2.5 rounded-lg outline-none focus:border-blue-500 dark:focus:border-blue-500 text-sm dark:text-white transition-colors" 
                />
              </div>
              
              <div className="pt-4 border-t border-slate-100 dark:border-neutral-800 flex gap-3">
                <button type="button" onClick={()=>setIsModalOpen(false)} className="flex-1 bg-slate-100 dark:bg-neutral-800 hover:bg-slate-200 dark:hover:bg-neutral-700 py-3 rounded-xl font-bold text-slate-600 dark:text-neutral-300 transition-colors">Cancelar</button>
                <button type="submit" disabled={cargandoForm} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold transition-all disabled:opacity-50 shadow-lg shadow-blue-600/20">
                  {cargandoForm ? 'Guardando...' : modoEdicion ? 'Actualizar Personal' : 'Crear Usuario'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}