'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowLeft, Loader2, CheckCircle2, AlertCircle, KeyRound } from 'lucide-react';

export default function RecuperarPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleRecover = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/usuarios/recuperar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Error al procesar la solicitud');
      }
      
      setSuccess(true);
    } catch (err: unknown) {
      // Reemplazamos el "any" por una validación estricta de TypeScript
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Ocurrió un error al conectar con el servidor.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-slate-50 dark:bg-[#0a0a0a] p-4 transition-colors">
      
      <div className="w-full max-w-[420px] bg-white dark:bg-neutral-900 rounded-3xl shadow-xl dark:shadow-2xl dark:shadow-black/50 border border-slate-200 dark:border-neutral-800 p-8 sm:p-10 transition-colors">
        
        {/* LOGO Y TÍTULO */}
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="w-14 h-14 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-500 mb-4 border border-blue-100 dark:border-blue-900/50">
            <KeyRound size={28} strokeWidth={2.5} />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Recuperar Acceso
          </h1>
          <p className="text-sm font-medium text-slate-500 dark:text-neutral-400 mt-2 leading-relaxed">
            {success 
              ? "Revisa tu bandeja de entrada" 
              : "Ingresa tu correo corporativo y te enviaremos instrucciones."}
          </p>
        </div>

        {/* PANTALLA DE ÉXITO */}
        {success ? (
          <div className="space-y-6 animate-in fade-in zoom-in duration-500">
            <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-900/50 rounded-2xl flex flex-col items-center text-center gap-3">
              <CheckCircle2 size={32} className="text-emerald-600 dark:text-emerald-400" />
              <p className="text-sm text-emerald-800 dark:text-emerald-300 font-medium leading-relaxed">
                Hemos enviado un enlace de recuperación seguro a:<br/>
                <span className="font-bold">{email}</span>
              </p>
            </div>
            <Link href="/admin/login" className="w-full flex items-center justify-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold py-3.5 rounded-xl transition-all shadow-lg hover:opacity-90 active:scale-[0.98]">
              Volver al Login
            </Link>
          </div>
        ) : (
          /* FORMULARIO DE RECUPERACIÓN */
          <form onSubmit={handleRecover} className="space-y-5 animate-in fade-in duration-300">
            
            {error && (
              <div className="p-3.5 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 rounded-xl flex items-start gap-2.5 text-rose-600 dark:text-rose-400 text-sm font-bold">
                <AlertCircle size={18} className="shrink-0 mt-0.5" />
                <p className="leading-tight">{error}</p>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 dark:text-neutral-400 uppercase tracking-widest ml-1">Correo Electrónico</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 dark:text-neutral-500">
                  <Mail size={18} />
                </div>
                <input 
                  type="email" 
                  required 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ejemplo@networksperu.com" 
                  className="w-full bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 py-3.5 pl-11 pr-4 rounded-xl text-sm outline-none focus:bg-white dark:focus:bg-neutral-900 focus:border-blue-500 dark:focus:border-blue-500 transition-all text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-neutral-600"
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading || !email}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-blue-600/20 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                'Enviar código de acceso'
              )}
            </button>
            
            <div className="pt-4 text-center">
              <Link href="/admin/login" className="inline-flex items-center gap-1.5 text-sm font-bold text-slate-500 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                <ArrowLeft size={16} /> Volver atrás
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}