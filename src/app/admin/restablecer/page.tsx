'use client';

import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Lock, Eye, EyeOff, Loader2, CheckCircle2, AlertCircle, KeyRound } from 'lucide-react';

function RestablecerForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token'); 
  const router = useRouter();

  const [nuevaClave, setNuevaClave] = useState('');
  const [confirmarClave, setConfirmarClave] = useState('');
  const [showNueva, setShowNueva] = useState(false);
  const [showConfirmar, setShowConfirmar] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // VALIDACIONES ESTRICTAS DE CONTRASEÑA
  const cumpleLongitud = nuevaClave.length >= 8 && nuevaClave.length <= 12;
  const cumpleMayusMinus = /(?=.*[a-z])(?=.*[A-Z])/.test(nuevaClave);
  const cumpleNumero = /(?=.*\d)/.test(nuevaClave);
  const cumpleEspecial = /(?=.*[\W_])/.test(nuevaClave);
  
  const esValida = cumpleLongitud && cumpleMayusMinus && cumpleNumero && cumpleEspecial;
  const coinciden = nuevaClave !== '' && nuevaClave === confirmarClave;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!esValida || !coinciden) {
      setError("Verifica que la contraseña cumpla los requisitos y coincida.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/usuarios/restablecer', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, nuevaClave }) 
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Error al restablecer la contraseña');
      }
      
      setSuccess(true);

      setTimeout(() => {
        router.push('/admin/login');
      }, 3000);

    } catch (err: unknown) {
      // Reemplazamos el "any" por una validación estricta de TypeScript
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Error al restablecer la contraseña. El enlace pudo haber expirado.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="text-center space-y-4 animate-in fade-in">
        <AlertCircle size={48} className="mx-auto text-rose-500" />
        <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Enlace de Recuperación Inválido</h2>
        <p className="text-sm text-slate-500 dark:text-neutral-400">El enlace está incompleto, no existe o ya expiró.</p>
        <div className="pt-4">
          <Link href="/admin/recuperar" className="text-blue-600 dark:text-blue-400 font-bold hover:underline text-sm">
            Solicitar un nuevo enlace
          </Link>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="text-center space-y-6 animate-in fade-in zoom-in duration-500">
        <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-900/20 rounded-full flex items-center justify-center mx-auto border border-emerald-100 dark:border-emerald-900/50">
          <CheckCircle2 size={40} className="text-emerald-600 dark:text-emerald-400" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight mb-2">¡Contraseña Actualizada!</h2>
          <p className="text-sm text-slate-500 dark:text-neutral-400 leading-relaxed">
            Tu clave ha sido cambiada exitosamente. Serás redirigido al panel de inicio en unos segundos...
          </p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 animate-in fade-in duration-300">
      
      {error && (
        <div className="p-3.5 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 rounded-xl flex items-start gap-2.5 text-rose-600 dark:text-rose-400 text-sm font-bold">
          <AlertCircle size={18} className="shrink-0 mt-0.5" />
          <p className="leading-tight">{error}</p>
        </div>
      )}

      {/* NUEVA CONTRASEÑA */}
      <div className="space-y-1.5">
        <label className="text-[10px] font-bold text-slate-500 dark:text-neutral-400 uppercase tracking-widest ml-1">Nueva Contraseña</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 dark:text-neutral-500">
            <Lock size={18} />
          </div>
          <input 
            type={showNueva ? "text" : "password"} 
            required 
            maxLength={12}
            value={nuevaClave} 
            onChange={(e) => setNuevaClave(e.target.value)}
            placeholder="Mínimo 8 caracteres" 
            className={`w-full bg-slate-50 dark:bg-neutral-950 border py-3.5 pl-11 pr-12 rounded-xl text-sm outline-none transition-all text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-neutral-600 ${nuevaClave.length > 0 ? (esValida ? 'border-emerald-500 dark:border-emerald-500 bg-white dark:bg-neutral-900' : 'border-rose-400 dark:border-rose-500 bg-white dark:bg-neutral-900') : 'border-slate-200 dark:border-neutral-800 focus:border-blue-500 dark:focus:border-blue-500'}`}
          />
          <button type="button" onClick={() => setShowNueva(!showNueva)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 dark:text-neutral-500 hover:text-slate-600 transition-colors">
            {showNueva ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {/* CAJITA DE VALIDACIÓN VISUAL */}
        {nuevaClave.length > 0 && (
          <div className="mt-2 grid grid-cols-2 gap-2 text-[10px] font-medium p-3 bg-slate-50 dark:bg-neutral-950/50 rounded-xl border border-slate-100 dark:border-neutral-800">
            <span className={`flex items-center gap-1 ${cumpleLongitud ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 dark:text-neutral-500'}`}><CheckCircle2 size={12} /> 8 a 12 caracteres</span>
            <span className={`flex items-center gap-1 ${cumpleMayusMinus ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 dark:text-neutral-500'}`}><CheckCircle2 size={12} /> Mayúscula y minúscula</span>
            <span className={`flex items-center gap-1 ${cumpleNumero ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 dark:text-neutral-500'}`}><CheckCircle2 size={12} /> Al menos un número</span>
            <span className={`flex items-center gap-1 ${cumpleEspecial ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 dark:text-neutral-500'}`}><CheckCircle2 size={12} /> Símbolo especial (!@#$%)</span>
          </div>
        )}
      </div>

      {/* CONFIRMAR CONTRASEÑA */}
      <div className="space-y-1.5 pt-2">
        <label className="text-[10px] font-bold text-slate-500 dark:text-neutral-400 uppercase tracking-widest ml-1">Confirmar Contraseña</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 dark:text-neutral-500">
            <Lock size={18} />
          </div>
          <input 
            type={showConfirmar ? "text" : "password"} 
            required 
            maxLength={12}
            value={confirmarClave} 
            onChange={(e) => setConfirmarClave(e.target.value)}
            placeholder="Repite tu nueva clave" 
            className={`w-full bg-slate-50 dark:bg-neutral-950 border py-3.5 pl-11 pr-12 rounded-xl text-sm outline-none transition-all text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-neutral-600 ${confirmarClave.length > 0 ? (coinciden ? 'border-emerald-500 focus:border-emerald-500' : 'border-rose-400 focus:border-rose-500') : 'border-slate-200 dark:border-neutral-800 focus:bg-white dark:focus:bg-neutral-900 focus:border-blue-500 dark:focus:border-blue-500'}`}
          />
          <button type="button" onClick={() => setShowConfirmar(!showConfirmar)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 dark:text-neutral-500 hover:text-slate-600 transition-colors">
            {showConfirmar ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>

      <button 
        type="submit" 
        disabled={loading || !esValida || !coinciden}
        className="b2b-primary w-full flex items-center justify-center gap-2 py-3.5 rounded-md transition-colors active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed mt-4"
      >
        {loading ? <Loader2 size={18} className="animate-spin" /> : 'Guardar Nueva Contraseña'}
      </button>
    </form>
  );
}

export default function RestablecerPage() {
  return (
    <div className="admin-auth-b2b min-h-screen flex flex-col justify-center items-center bg-[#F8FAFC] dark:bg-[#000000] p-4 transition-colors">
      <div className="b2b-surface w-full max-w-[420px] rounded-2xl p-8 sm:p-10 transition-colors">
        
        <div className="flex flex-col items-center mb-6 text-center">
          <div className="w-14 h-14 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-500 mb-4 border border-blue-100 dark:border-blue-900/50">
            <KeyRound size={28} strokeWidth={2.5} />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Crea una nueva clave</h1>
          <p className="text-sm font-medium text-slate-500 dark:text-neutral-400 mt-2">Asegúrate de que sea segura y fácil de recordar.</p>
        </div>

        <Suspense fallback={<div className="text-center py-4"><Loader2 className="animate-spin mx-auto text-blue-500" /></div>}>
          <RestablecerForm />
        </Suspense>

      </div>
    </div>
  );
}