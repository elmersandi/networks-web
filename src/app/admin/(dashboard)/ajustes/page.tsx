'use client';

import { useState } from 'react';
import { Lock, Bell, Smartphone, Mail, ShieldAlert, KeyRound, CheckCircle2, Eye, EyeOff, XCircle } from 'lucide-react';

export default function AjustesPage() {
  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });

  const [claveActual, setClaveActual] = useState('');
  const [nuevaClave, setNuevaClave] = useState('');
  const [confirmarClave, setConfirmarClave] = useState('');

  const [showActual, setShowActual] = useState(false);
  const [showNueva, setShowNueva] = useState(false);
  const [showConfirmar, setShowConfirmar] = useState(false);

  const cumpleLongitud = nuevaClave.length >= 8 && nuevaClave.length <= 12;
  const cumpleMayusMinus = /(?=.*[a-z])(?=.*[A-Z])/.test(nuevaClave);
  const cumpleNumero = /(?=.*\d)/.test(nuevaClave);
  const cumpleEspecial = /(?=.*[\W_])/.test(nuevaClave);
  
  const esPasswordValido = cumpleLongitud && cumpleMayusMinus && cumpleNumero && cumpleEspecial;
  const contrasenasCoinciden = nuevaClave !== '' && nuevaClave === confirmarClave;

  const handleCambioPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensaje({ tipo: '', texto: '' });

    if (!esPasswordValido || !contrasenasCoinciden) {
      setMensaje({ tipo: 'error', texto: 'Verifica los requisitos de la nueva contraseña.' });
      return;
    }

    setCargando(true);
    try {
      const res = await fetch('/api/usuarios/password', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ claveActual, nuevaClave }),
      });

      const data = await res.json();

      if (res.ok) {
        setMensaje({ tipo: 'exito', texto: '¡Contraseña actualizada con éxito!' });
        setClaveActual('');
        setNuevaClave('');
        setConfirmarClave('');
      } else {
        setMensaje({ tipo: 'error', texto: data.error || 'Error al actualizar.' });
      }
    } catch (error) {
      setMensaje({ tipo: 'error', texto: 'Error de conexión con el servidor.' });
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 transition-colors">
      <div className="mb-2">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Seguridad y Notificaciones</h1>
        <p className="text-slate-500 dark:text-neutral-400 text-sm mt-1">Administra tus credenciales y canales de comunicación.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* SEGURIDAD: CAMBIO DE CLAVE */}
        <div className="bg-white dark:bg-neutral-900 p-8 rounded-3xl shadow-sm border border-slate-200 dark:border-neutral-800 space-y-6 transition-colors">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <KeyRound className="text-blue-600 dark:text-blue-500" size={20} /> Cambio de Contraseña
          </h2>

          {/* MENSAJES DE ALERTA */}
          {mensaje.texto && (
            <div className={`p-3 text-xs font-bold rounded-xl flex items-center gap-2 ${mensaje.tipo === 'error' ? 'bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/50' : 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/50'}`}>
              {mensaje.tipo === 'error' ? <XCircle size={16} /> : <CheckCircle2 size={16} />}
              {mensaje.texto}
            </div>
          )}
          
          <form onSubmit={handleCambioPassword} className="space-y-4">
            
            {/* CLAVE ACTUAL */}
            <div className="space-y-1.5 text-xs">
              <label className="font-bold text-slate-500 dark:text-neutral-400 uppercase tracking-widest">Clave Actual</label>
              <div className="relative">
                <input 
                  type={showActual ? "text" : "password"} 
                  value={claveActual} onChange={(e) => setClaveActual(e.target.value)} required
                  placeholder="Ingresa tu clave actual" 
                  className="w-full bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 py-3 pl-4 pr-10 rounded-xl outline-none focus:bg-white dark:focus:bg-neutral-900 focus:border-blue-500 dark:focus:border-blue-500 transition-all text-sm dark:text-white dark:placeholder:text-neutral-600" 
                />
                <button type="button" onClick={() => setShowActual(!showActual)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-neutral-500 hover:text-slate-600 dark:hover:text-neutral-300">
                  {showActual ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* NUEVA CLAVE */}
            <div className="space-y-1.5 text-xs">
              <label className="font-bold text-slate-500 dark:text-neutral-400 uppercase tracking-widest">Nueva Contraseña</label>
              <div className="relative">
                <input 
                  type={showNueva ? "text" : "password"} 
                  value={nuevaClave} onChange={(e) => setNuevaClave(e.target.value)} required maxLength={12}
                  placeholder="Crea una nueva clave" 
                  className={`w-full bg-slate-50 dark:bg-neutral-950 border py-3 pl-4 pr-10 rounded-xl outline-none transition-all text-sm dark:text-white dark:placeholder:text-neutral-600 ${nuevaClave.length > 0 ? (esPasswordValido ? 'border-emerald-500 dark:border-emerald-500 bg-white dark:bg-neutral-900' : 'border-rose-400 dark:border-rose-500 bg-white dark:bg-neutral-900') : 'border-slate-200 dark:border-neutral-800 focus:border-blue-500 dark:focus:border-blue-500'}`} 
                />
                <button type="button" onClick={() => setShowNueva(!showNueva)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-neutral-500 hover:text-slate-600 dark:hover:text-neutral-300">
                  {showNueva ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {nuevaClave.length > 0 && (
                <div className="mt-2 grid grid-cols-2 gap-2 text-[10px] font-medium p-2 bg-slate-50 dark:bg-neutral-950 rounded-lg border border-slate-100 dark:border-neutral-800">
                  <span className={`flex items-center gap-1 ${cumpleLongitud ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 dark:text-neutral-500'}`}><CheckCircle2 size={12} /> 8 a 12 caracteres</span>
                  <span className={`flex items-center gap-1 ${cumpleMayusMinus ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 dark:text-neutral-500'}`}><CheckCircle2 size={12} /> Mayúscula y minúscula</span>
                  <span className={`flex items-center gap-1 ${cumpleNumero ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 dark:text-neutral-500'}`}><CheckCircle2 size={12} /> Al menos un número</span>
                  <span className={`flex items-center gap-1 ${cumpleEspecial ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 dark:text-neutral-500'}`}><CheckCircle2 size={12} /> Símbolo especial (!@#$%)</span>
                </div>
              )}
            </div>

            {/* CONFIRMAR CLAVE */}
            <div className="space-y-1.5 text-xs">
              <label className="font-bold text-slate-500 dark:text-neutral-400 uppercase tracking-widest">Confirmar Clave</label>
              <div className="relative">
                <input 
                  type={showConfirmar ? "text" : "password"} 
                  value={confirmarClave} onChange={(e) => setConfirmarClave(e.target.value)} required maxLength={12}
                  placeholder="Repite la nueva clave" 
                  className={`w-full bg-slate-50 dark:bg-neutral-950 border py-3 pl-4 pr-10 rounded-xl outline-none transition-all text-sm dark:text-white dark:placeholder:text-neutral-600 ${confirmarClave.length > 0 ? (contrasenasCoinciden ? 'border-emerald-500 dark:border-emerald-500 bg-white dark:bg-neutral-900' : 'border-rose-400 dark:border-rose-500 bg-white dark:bg-neutral-900') : 'border-slate-200 dark:border-neutral-800 focus:border-blue-500 dark:focus:border-blue-500'}`} 
                />
                <button type="button" onClick={() => setShowConfirmar(!showConfirmar)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-neutral-500 hover:text-slate-600 dark:hover:text-neutral-300">
                  {showConfirmar ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={cargando || !esPasswordValido || !contrasenasCoinciden || !claveActual}
              className="w-full bg-slate-900 dark:bg-blue-600 text-white font-bold py-3.5 rounded-xl hover:bg-blue-600 dark:hover:bg-blue-500 transition-all text-sm mt-4 disabled:bg-slate-300 dark:disabled:bg-neutral-800 dark:disabled:text-neutral-500 disabled:cursor-not-allowed"
            >
              {cargando ? 'Guardando cambios...' : 'Actualizar Seguridad'}
            </button>
          </form>
        </div>

        {/* CENTRO DE ALERTAS */}
        <div className="bg-white dark:bg-neutral-900 p-8 rounded-3xl shadow-sm border border-slate-200 dark:border-neutral-800 space-y-6 transition-colors">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Bell className="text-blue-600 dark:text-blue-500" size={20} /> Centro de Alertas
          </h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-neutral-950 rounded-2xl border border-slate-100 dark:border-neutral-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center shrink-0">
                  <Mail size={18} />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800 dark:text-white">Alertas por Correo</p>
                  <p className="text-[10px] text-slate-500 dark:text-neutral-400 font-medium">Recibe tickets y reportes en tu Gmail.</p>
                </div>
              </div>
              <div className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked className="sr-only peer" />
                <div className="w-11 h-6 bg-slate-200 dark:bg-neutral-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 dark:after:border-neutral-600 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 dark:peer-checked:bg-blue-500"></div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-neutral-950 rounded-2xl border border-slate-100 dark:border-neutral-800 opacity-60">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center shrink-0">
                  <Smartphone size={18} />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800 dark:text-white">Alertas WhatsApp</p>
                  <p className="text-[10px] text-slate-500 dark:text-neutral-400 font-medium">Cotizaciones enviadas al instante.</p>
                </div>
              </div>
              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-1 rounded-md">Próximamente</span>
            </div>
          </div>
          
          <div className="p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900/50 rounded-2xl flex gap-3 mt-4">
            <ShieldAlert className="text-amber-600 dark:text-amber-500 shrink-0" size={20} />
            <p className="text-[11px] text-amber-800 dark:text-amber-200/80 font-medium leading-relaxed">
              Como Administrador, recibirás notificaciones de seguridad críticas (intentos fallidos de login) de forma obligatoria.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}