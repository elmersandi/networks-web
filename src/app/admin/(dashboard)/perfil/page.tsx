'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { User, Mail, Camera, Image as ImageIcon, Moon, Sun, Save, ShieldCheck, Settings, FileText, CheckCircle2, Bell } from 'lucide-react';
import ImageUpload from '@/src/components/ImageUpload';
import Image from 'next/image';

export default function PerfilPage() {
  const { data: session } = useSession();

  // BLOQUE 1: ESTADO PRINCIPAL
  // Aqui definimos todas las variables que controlaran la informacion en pantalla.
  // Se ha removido recibirWA para manejar unicamente notificaciones por correo.
  const [datos, setDatos] = useState({
    nombre: '', telefono: '', bio: '', dni: '', email: '', rol: '', imagen: '', portada: '',
    recibirEmail: true
  });

  const [darkMode, setDarkMode] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [mensajeExito, setMensajeExito] = useState(false);

  // BLOQUE 2: CARGA INICIAL DE DATOS
  // Este efecto se ejecuta una sola vez al montar el componente. Llama a la API
  // para obtener la informacion del usuario y rellenar el estado.
  useEffect(() => {
    const cargarPerfil = async () => {
      try {
        const res = await fetch('/api/usuarios/perfil');
        if (res.ok) {
          const data = await res.json();
          setDatos({
            nombre: data.nombre || '', 
            telefono: data.telefono || '', 
            bio: data.bio || '',
            dni: data.dni || '', 
            email: data.email || '', 
            rol: data.rol || '',
            imagen: data.imagen || '',
            portada: data.portada || '',
            recibirEmail: data.recibirEmail ?? true
          });

          if (data.temaOscuro) {
            setDarkMode(true);
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
          } else {
            setDarkMode(false);
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
          }
        }
      } catch (error) {
        console.error("Error al cargar datos");
      } finally {
        setCargando(false);
      }
    };
    cargarPerfil();
  }, []);

  // BLOQUE 3: CONTROL DEL MODO OSCURO
  // Funcion independiente para cambiar entre modo claro y oscuro, 
  // actualizando la clase del documento, el almacenamiento local y la base de datos.
  const toggleDarkMode = async () => {
    const nuevoEstado = !darkMode;
    setDarkMode(nuevoEstado);

    if (nuevoEstado) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }

    try {
      await fetch('/api/usuarios/preferencias', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ temaOscuro: nuevoEstado }),
      });
    } catch (error) {
      console.error("Error guardando tema en BD");
    }
  };

  // BLOQUE 4: GUARDAR PERFIL
  // Envia el estado actual (datos) al backend para ser procesado y almacenado.
  // Muestra un mensaje temporal de exito si la operacion es correcta.
  const handleActualizar = async () => {
    setGuardando(true);
    setMensajeExito(false);
    try {
      const res = await fetch('/api/usuarios/perfil', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos),
      });

      if (res.ok) {
        setMensajeExito(true);
        setTimeout(() => setMensajeExito(false), 3000);
      }
    } catch (error) {
      alert("Error al actualizar");
    } finally {
      setGuardando(false);
    }
  };

  const iniciales = datos.nombre ? datos.nombre.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : "NP";
  const esAdmin = datos.rol === 'ADMIN';

  if (cargando) return <div className="p-8 text-center text-[#64748B] dark:text-[#9CA3AF] font-bold">Cargando tu información...</div>;

  return (
    <div className="admin-b2b max-w-4xl mx-auto space-y-6 pb-10 transition-colors">

      {/* BLOQUE 5: INTERFAZ - PORTADA Y AVATAR */}
      {/* Contenedor principal superior que maneja la visualizacion y carga de las dos imagenes principales */}
      <div className="bg-[#FFFFFF] dark:bg-[#121212] rounded-xl border border-[#E2E8F0] dark:border-[#262626] overflow-hidden transition-colors">

        <div className="h-44 bg-[#121212] dark:bg-[#121212] relative">
          {datos.portada && (
            <Image
              src={datos.portada}
              alt="Portada del usuario"
              fill
              className="object-cover"
            />
          )}
          <div className="absolute bottom-4 right-4 z-10">
            <ImageUpload
              value={[datos.portada].filter(Boolean)}
              onChange={(url: string) => setDatos(prev => ({ ...prev, portada: url }))}
              onRemove={() => setDatos(prev => ({ ...prev, portada: '' }))}
              hidePreview
            />
          </div>
        </div>

        <div className="px-8 pb-8">
          <div className="relative -mt-16 mb-4 flex items-end justify-between">
            <div className="relative">
              <div className="w-32 h-32 rounded-full border-4 border-white dark:border-[#121212] bg-[#F8FAFC] dark:bg-[#121212] overflow-hidden flex items-center justify-center text-4xl font-bold text-[#1D4ED8] relative">
                {datos.imagen ? (
                  <Image src={datos.imagen} alt="Foto de perfil" fill className="object-cover" />
                ) : (
                  iniciales
                )}
              </div>

              <ImageUpload
                value={[datos.imagen].filter(Boolean)}
                onChange={(url: string) => setDatos(prev => ({ ...prev, imagen: url }))}
                onRemove={() => setDatos(prev => ({ ...prev, imagen: '' }))}
                hidePreview
                isAvatar
              />
            </div>

            <div className="flex items-center gap-3 mb-2">
              <span className="px-4 py-1.5 bg-blue-50 dark:bg-[#121212] text-[#1D4ED8] rounded-full text-xs font-semibold border border-[#E2E8F0] dark:border-[#262626] flex items-center gap-1">
                <ShieldCheck size={14} /> Acceso Verificado
              </span>
            </div>
          </div>

          <h1 className="text-2xl font-bold text-[#0F172A] dark:text-[#F3F4F6]">{datos.nombre}</h1>
          <p className="text-[#64748B] dark:text-[#9CA3AF] font-medium text-sm mt-1">Rol en sistema: <span className="font-bold text-[#1D4ED8]">{datos.rol}</span> • Networks Perú</p>
        </div>
      </div>

      {/* BLOQUE 6: INTERFAZ - FORMULARIO DE DATOS */}
      {/* Estructura de grilla para separar la informacion personal de las configuraciones tecnicas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Columna Izquierda: Datos Personales */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white dark:bg-neutral-900 p-8 rounded-3xl shadow-sm border border-slate-200 dark:border-neutral-800 space-y-6 transition-colors">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <User className="text-blue-600 dark:text-blue-500" size={20} /> Información del Personal
              </h2>
              {mensajeExito && <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1"><CheckCircle2 size={14} /> Guardado</span>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 dark:text-neutral-500 uppercase tracking-widest">Nombre Público</label>
                <input type="text" value={datos.nombre} onChange={(e) => setDatos({ ...datos, nombre: e.target.value })} className="w-full bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 p-3 rounded-xl text-sm focus:bg-white dark:focus:bg-neutral-900 focus:border-blue-500 dark:focus:border-blue-500 outline-none transition-all dark:text-white" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 dark:text-neutral-500 uppercase tracking-widest">Celular / WhatsApp</label>
                <input type="text" value={datos.telefono} onChange={(e) => setDatos({ ...datos, telefono: e.target.value })} className="w-full bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 p-3 rounded-xl text-sm focus:bg-white dark:focus:bg-neutral-900 focus:border-blue-500 dark:focus:border-blue-500 outline-none transition-all dark:text-white" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 dark:text-neutral-500 uppercase tracking-widest">Biografía Breve</label>
              <textarea value={datos.bio} onChange={(e) => setDatos({ ...datos, bio: e.target.value })} placeholder="Cuéntanos un poco sobre tu rol..." rows={3} className="w-full bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 p-3 rounded-xl text-sm focus:bg-white dark:focus:bg-neutral-900 focus:border-blue-500 dark:focus:border-blue-500 outline-none transition-all resize-none dark:text-white"></textarea>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button onClick={handleActualizar} disabled={guardando} className="bg-slate-900 dark:bg-blue-600 text-white font-bold px-8 py-3.5 rounded-xl hover:bg-blue-600 dark:hover:bg-blue-700 transition-all flex items-center gap-2 text-sm shadow-lg active:scale-95 disabled:opacity-50">
                <Save size={18} /> {guardando ? 'Guardando...' : 'Actualizar Perfil'}
              </button>
            </div>
          </div>
        </div>

        {/* Columna Derecha: Configuraciones y Ficha Tecnica */}
        <div className="space-y-6">
          
          <div className="bg-white dark:bg-neutral-900 p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-neutral-800 transition-colors">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Settings size={18} className="text-blue-600 dark:text-blue-500" /> Apariencia
            </h2>

            <div className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-neutral-950 rounded-2xl border border-slate-100 dark:border-neutral-800">
              <div className="flex items-center gap-3">
                {darkMode ? <Moon size={18} className="text-indigo-400" /> : <Sun size={18} className="text-amber-500" />}
                <span className="text-xs font-bold text-slate-700 dark:text-neutral-300">Modo Oscuro</span>
              </div>
              <button
                onClick={toggleDarkMode}
                className={`w-12 h-6 rounded-full transition-all relative ${darkMode ? 'bg-blue-600' : 'bg-slate-300 dark:bg-neutral-700'}`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${darkMode ? 'left-7' : 'left-1'}`} />
              </button>
            </div>
          </div>

          {/* BLOQUE 7: INTERFAZ - NOTIFICACIONES OMNICANAL */}
          {/* Se mantiene unicamente el control para alertas por correo electronico */}
          <div className="bg-white dark:bg-neutral-900 p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-neutral-800 transition-colors">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Bell size={18} className="text-blue-600 dark:text-blue-500" /> Centro de Notificaciones
            </h2>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-neutral-950 rounded-2xl border border-slate-100 dark:border-neutral-800 transition-colors">
                <div className="flex items-center gap-3">
                  <Mail size={18} className="text-slate-500 dark:text-neutral-400" />
                  <span className="text-xs font-bold text-slate-700 dark:text-neutral-300">Alertas al Correo</span>
                </div>
                <button 
                  type="button"
                  onClick={() => setDatos(prev => ({...prev, recibirEmail: !prev.recibirEmail}))}
                  className={`w-11 h-6 rounded-full transition-all relative ${datos.recibirEmail ? 'bg-blue-600' : 'bg-slate-300 dark:bg-neutral-700'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${datos.recibirEmail ? 'left-6' : 'left-1'}`} />
                </button>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-neutral-900 border border-blue-100 dark:border-neutral-800 p-6 rounded-3xl transition-colors">
            <div className="flex items-center gap-2 text-blue-700 dark:text-blue-400 font-bold text-sm mb-4">
              <FileText size={18} /> Ficha Técnica
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-[9px] font-bold text-blue-400 uppercase tracking-widest block mb-1">DNI Registrado</label>
                {esAdmin ? (
                  <input type="text" value={datos.dni} onChange={(e) => setDatos({ ...datos, dni: e.target.value })} className="w-full bg-white dark:bg-neutral-950 border border-blue-200 dark:border-neutral-800 p-2 rounded-lg text-xs outline-none focus:border-blue-500 dark:focus:border-blue-500 dark:text-white transition-colors" />
                ) : (
                  <div className="text-xs font-bold text-slate-700 dark:text-neutral-300">{datos.dni}</div>
                )}
              </div>
              <div>
                <label className="text-[9px] font-bold text-blue-400 uppercase tracking-widest block mb-1">Correo Corporativo</label>
                {esAdmin ? (
                  <input type="email" value={datos.email} onChange={(e) => setDatos({ ...datos, email: e.target.value })} className="w-full bg-white dark:bg-neutral-950 border border-blue-200 dark:border-neutral-800 p-2 rounded-lg text-xs outline-none focus:border-blue-500 dark:focus:border-blue-500 dark:text-white transition-colors" />
                ) : (
                  <div className="text-xs font-bold text-slate-700 dark:text-neutral-300 break-words">{datos.email}</div>
                )}
              </div>
            </div>

            {esAdmin ? (
              <p className="text-[10px] text-amber-600 dark:text-amber-500 leading-relaxed font-medium mt-4 pt-4 border-t border-blue-100/50 dark:border-neutral-800">
                Como Administrador, puedes editar tu DNI y Correo. Si cambias tu correo, deberás volver a iniciar sesión.
              </p>
            ) : (
              <p className="text-[10px] text-blue-600/70 dark:text-neutral-500 leading-relaxed font-medium mt-4 pt-4 border-t border-blue-100/50 dark:border-neutral-800">
                Estos datos son gestionados por el Administrador.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}