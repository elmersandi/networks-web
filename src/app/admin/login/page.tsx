'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Loader2, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError("Credenciales incorrectas o usuario bloqueado.");
        setLoading(false);
      } else {
        // Redirigir al dashboard si todo sale bien
        router.push('/admin');
        router.refresh();
      }
    } catch (err) {
      setError("Error de conexión con el servidor.");
      setLoading(false);
    }
  };

  return (
    <div className="admin-auth-b2b min-h-screen flex flex-col justify-center items-center bg-[#F8FAFC] dark:bg-[#000000] p-4 transition-colors">

      {/* TARJETA PRINCIPAL */}
      <div className="b2b-surface w-full max-w-[420px] rounded-2xl p-8 sm:p-10 transition-colors">

        {/* LOGO Y TÍTULO */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 bg-[#1D4ED8] rounded-xl flex items-center justify-center text-white font-black text-2xl mb-4">
            N
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Networks<span className="text-blue-600 dark:text-blue-500">Perú</span>
          </h1>
          <p className="text-sm font-medium text-slate-500 dark:text-neutral-400 mt-1">Portal Administrativo B2B</p>
        </div>

        {/* MENSAJE DE ERROR */}
        {error && (
          <div className="mb-6 p-3.5 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 rounded-xl flex items-start gap-2.5 text-rose-600 dark:text-rose-400 text-sm font-bold">
            <AlertCircle size={18} className="shrink-0 mt-0.5" />
            <p className="leading-tight">{error}</p>
          </div>
        )}

        {/* FORMULARIO */}
        <form onSubmit={handleLogin} className="space-y-5">

          {/* CAMPO CORREO */}
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

          {/* CAMPO CONTRASEÑA */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-end ml-1">
              <label className="text-[10px] font-bold text-slate-500 dark:text-neutral-400 uppercase tracking-widest">Contraseña</label>
              <Link href="/admin/recuperar" className="text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline">
                ¿Olvidaste tu clave?
              </Link>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 dark:text-neutral-500">
                <Lock size={18} />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 py-3.5 pl-11 pr-12 rounded-xl text-sm outline-none focus:bg-white dark:focus:bg-neutral-900 focus:border-blue-500 dark:focus:border-blue-500 transition-all text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-neutral-600"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 dark:text-neutral-500 hover:text-slate-600 dark:hover:text-neutral-300 transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* BOTÓN DE INGRESO */}
          <button
            type="submit"
            disabled={loading || !email || !password}
            className="b2b-primary w-full flex items-center justify-center gap-2 py-3.5 rounded-md transition-colors active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed mt-2"
          >
            {loading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <>Ingresar al Sistema <ArrowRight size={18} /></>
            )}
          </button>
        </form>
      </div>

      {/* FOOTER DEL LOGIN */}
      <div className="mt-8 text-center text-sm font-medium text-slate-500 dark:text-neutral-400">
        ¿Eres nuevo empleado?{' '}
        <Link href="/admin/registro" className="text-blue-600 dark:text-blue-400 font-bold hover:underline">
          Solicita acceso aquí
        </Link>
      </div>

    </div>
  );
}