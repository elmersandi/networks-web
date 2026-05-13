'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  User, Mail, Lock, Phone, CreditCard, ShieldCheck, 
  Eye, EyeOff, CheckCircle2, XCircle, Send, KeyRound 
} from 'lucide-react';

export default function RegistroPage() {
  const [cargando, setCargando] = useState(false);
  const [errorGlobal, setErrorGlobal] = useState('');
  
  // Variables del formulario base
  const [formData, setFormData] = useState({
    dni: '',
    telefono: '',
    nombre: '',
    email: '',
    password: ''
  });
  
  // Variables de Contraseñas
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // NUEVO: Variables para Verificación de Correo (OTP)
  const [codigoEnviado, setCodigoEnviado] = useState(false);
  const [cargandoCodigo, setCargandoCodigo] = useState(false);
  const [codigoInput, setCodigoInput] = useState('');
  const [verificado, setVerificado] = useState(false);

  // Validaciones en tiempo real
  const cumpleLongitud = formData.password.length >= 8 && formData.password.length <= 12;
  const cumpleMayusMinus = /(?=.*[a-z])(?=.*[A-Z])/.test(formData.password);
  const cumpleNumero = /(?=.*\d)/.test(formData.password);
  const cumpleEspecial = /(?=.*[\W_])/.test(formData.password);
  
  const esPasswordValido = cumpleLongitud && cumpleMayusMinus && cumpleNumero && cumpleEspecial;
  const contrasenasCoinciden = formData.password !== '' && formData.password === confirmPassword;

  // ----------------------------------------------------------------
  // FUNCIÓN 1: PEDIR EL CÓDIGO AL CORREO
  // ----------------------------------------------------------------
  const enviarCodigo = async () => {
    if (!formData.email) {
      setErrorGlobal('Por favor, ingresa un correo electrónico primero.');
      return;
    }
    setErrorGlobal('');
    setCargandoCodigo(true);

    try {
      // Llamada a la API que crearemos con Resend
      const res = await fetch('/api/auth/send-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email }),
      });

      if (res.ok) {
        setCodigoEnviado(true);
        alert("¡Código enviado! Revisa tu bandeja de entrada o carpeta de SPAM.");
      } else {
        setErrorGlobal('Hubo un error al enviar el código.');
      }
    } catch (error) {
      setErrorGlobal('Error de conexión al intentar enviar el código.');
    } finally {
      setCargandoCodigo(false);
    }
  };

  // ----------------------------------------------------------------
  // FUNCIÓN 2: VALIDAR EL CÓDIGO INGRESADO
  // ----------------------------------------------------------------
  const validarCodigo = async () => {
    if (codigoInput.length !== 6) {
      setErrorGlobal('El código debe tener exactamente 6 dígitos.');
      return;
    }
    
    // Por ahora, simulamos que el código es válido para que puedas probar el frontend.
    // (Luego lo conectaremos a la validación real en la base de datos).
    if (codigoInput) {
      setVerificado(true);
      setErrorGlobal('');
      alert("¡Correo verificado exitosamente!");
    }
  };

  // ----------------------------------------------------------------
  // FUNCIÓN 3: REGISTRO FINAL EN LA BASE DE DATOS
  // ----------------------------------------------------------------
  const handleRegistro = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorGlobal('');

    if (!verificado) {
      setErrorGlobal('Debes verificar tu correo antes de registrarte.');
      return;
    }
    if (!esPasswordValido) {
      setErrorGlobal('La contraseña no cumple con todos los requisitos de seguridad.');
      return;
    }
    if (!contrasenasCoinciden) {
      setErrorGlobal('Las contraseñas no coinciden. Verifícalas antes de continuar.');
      return;
    }

    setCargando(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        alert("¡Registro exitoso! Por favor, notifica al Administrador para que apruebe tu acceso.");
        window.location.href = "/admin/login";
      } else {
        const data = await res.json();
        setErrorGlobal(data.error || "Ocurrió un error en el servidor.");
      }
    } catch (error) {
      setErrorGlobal("Error de conexión. Verifica tu internet.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="admin-auth-b2b min-h-screen bg-[#F8FAFC] dark:bg-[#000000] flex flex-col justify-center items-center p-4 py-12 font-sans" style={{ fontFamily: 'var(--font-poppins), sans-serif' }}>
      
      <div className="b2b-surface max-w-xl w-full rounded-2xl overflow-hidden">
        
        {/* Cabecera */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white">
          <div className="flex items-center gap-2">
             <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white text-xs">N</div>
             <span className="font-bold text-slate-900 tracking-tight">Networks Perú</span>
          </div>
          <Link href="/admin/login" className="text-xs font-bold text-slate-500 hover:text-blue-600 transition-colors">
            Volver al Login
          </Link>
        </div>

        {/* Formulario */}
        <div className="p-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-slate-900">Solicitud de Acceso</h1>
            <p className="text-slate-500 text-sm mt-1">Regístrate como personal. Tu cuenta requerirá aprobación del Administrador.</p>
          </div>

          {/* Mensaje de Error Global */}
          {errorGlobal && (
            <div className="mb-6 p-3 bg-rose-50 border border-rose-200 text-rose-600 text-xs font-bold rounded-xl flex items-center gap-2">
              <XCircle size={16} /> {errorGlobal}
            </div>
          )}

          <form onSubmit={handleRegistro} className="space-y-5">
            {/* DNI Y CELULAR */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-widest">DNI *</label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input type="text" required maxLength={8} disabled={verificado}
                    value={formData.dni} onChange={(e) => setFormData({...formData, dni: e.target.value})}
                    placeholder="Número de DNI" className="w-full pl-9 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-blue-500 outline-none transition-all font-medium text-slate-700 disabled:opacity-60" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-widest">Celular *</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input type="text" required maxLength={9} disabled={verificado}
                    value={formData.telefono} onChange={(e) => setFormData({...formData, telefono: e.target.value})}
                    placeholder="999 888 777" className="w-full pl-9 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-blue-500 outline-none transition-all font-medium text-slate-700 disabled:opacity-60" />
                </div>
              </div>
            </div>

            {/* NOMBRE COMPLETO */}
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-widest">Nombre Completo *</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input type="text" required disabled={verificado}
                  value={formData.nombre} onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                  placeholder="Ej: Juan Pérez" className="w-full pl-9 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-blue-500 outline-none transition-all font-medium text-slate-700 disabled:opacity-60" />
              </div>
            </div>

            {/* SECCIÓN DE CORREO Y VERIFICACIÓN (OTP) */}
            <div className={`p-4 rounded-xl border transition-colors ${verificado ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-50 border-slate-200'}`}>
              <label className={`block text-xs font-bold mb-1.5 uppercase tracking-widest ${verificado ? 'text-emerald-700' : 'text-slate-500'}`}>
                {verificado ? 'Correo Verificado ✓' : 'Correo Corporativo *'}
              </label>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 ${verificado ? 'text-emerald-500' : 'text-slate-400'}`} size={16} />
                  <input type="email" required 
                    disabled={codigoEnviado || verificado}
                    value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="tu@correo.com" 
                    className={`w-full pl-9 pr-4 py-3 rounded-xl text-sm outline-none font-medium transition-all ${verificado ? 'bg-transparent text-emerald-800' : 'bg-white border border-slate-200 focus:border-blue-500 text-slate-700 disabled:bg-slate-100 disabled:text-slate-500'}`} />
                </div>
                
                {/* Botón para enviar código */}
                {!verificado && !codigoEnviado && (
                  <button type="button" onClick={enviarCodigo} disabled={cargandoCodigo || !formData.email}
                    className="b2b-primary whitespace-nowrap px-4 py-3 text-xs rounded-md transition-colors disabled:bg-slate-300 flex items-center justify-center gap-2">
                    {cargandoCodigo ? 'Enviando...' : <><Send size={14} /> Verificar Correo</>}
                  </button>
                )}
              </div>

              {/* Caja para ingresar el código */}
              {codigoEnviado && !verificado && (
                <div className="mt-4 pt-4 border-t border-slate-200 animate-in fade-in slide-in-from-top-2">
                  <label className="block text-xs font-bold text-slate-500 mb-1.5">INGRESA EL CÓDIGO DE 6 DÍGITOS</label>
                  <div className="flex gap-3">
                    <div className="relative flex-1">
                      <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                      <input type="text" maxLength={6}
                        value={codigoInput} onChange={(e) => setCodigoInput(e.target.value.replace(/\D/g, ''))} // Solo permite números
                        placeholder="000000" className="w-full pl-9 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold tracking-[0.2em] text-slate-700 outline-none focus:border-blue-500 text-center" />
                    </div>
                    <button type="button" onClick={validarCodigo} disabled={codigoInput.length !== 6}
                      className="b2b-primary px-6 py-3 text-xs rounded-md transition-colors disabled:bg-blue-300">
                      Validar
                    </button>
                  </div>
                  <button type="button" onClick={() => setCodigoEnviado(false)} className="text-[10px] font-bold text-blue-600 mt-2 hover:underline">
                    ¿Escribiste mal tu correo? Cambiar correo.
                  </button>
                </div>
              )}
            </div>

            {/* SECCIÓN DE CONTRASEÑAS */}
            <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-widest">Contraseña Segura *</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input 
                    type={showPassword ? "text" : "password"} 
                    required 
                    maxLength={12}
                    disabled={!verificado} // Bloqueado hasta que verifique el correo
                    value={formData.password} 
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    placeholder="Escribe tu contraseña" 
                    className={`w-full pl-9 pr-10 py-3 bg-white border rounded-xl text-sm outline-none transition-all font-medium text-slate-700 disabled:opacity-50 ${formData.password.length > 0 ? (esPasswordValido ? 'border-emerald-500 focus:ring-2 focus:ring-emerald-100' : 'border-rose-400 focus:ring-2 focus:ring-rose-100') : 'border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'}`} 
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} disabled={!verificado} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 disabled:opacity-50">
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                
                {/* Indicadores de Seguridad */}
                <div className="mt-2.5 grid grid-cols-2 gap-2 text-[10px] font-medium">
                  <span className={`flex items-center gap-1 ${cumpleLongitud ? 'text-emerald-600' : 'text-slate-400'}`}>
                    <CheckCircle2 size={12} /> 8 a 12 caracteres
                  </span>
                  <span className={`flex items-center gap-1 ${cumpleMayusMinus ? 'text-emerald-600' : 'text-slate-400'}`}>
                    <CheckCircle2 size={12} /> Mayúscula y minúscula
                  </span>
                  <span className={`flex items-center gap-1 ${cumpleNumero ? 'text-emerald-600' : 'text-slate-400'}`}>
                    <CheckCircle2 size={12} /> Al menos un número
                  </span>
                  <span className={`flex items-center gap-1 ${cumpleEspecial ? 'text-emerald-600' : 'text-slate-400'}`}>
                    <CheckCircle2 size={12} /> Símbolo especial (!@#$%)
                  </span>
                </div>
              </div>

              {/* CONFIRMAR CONTRASEÑA */}
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-widest">Confirmar Contraseña *</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input 
                    type={showConfirmPassword ? "text" : "password"} 
                    required 
                    maxLength={12}
                    disabled={!verificado}
                    value={confirmPassword} 
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repite la contraseña" 
                    className={`w-full pl-9 pr-10 py-3 bg-white border rounded-xl text-sm outline-none transition-all font-medium text-slate-700 disabled:opacity-50 ${confirmPassword.length > 0 ? (contrasenasCoinciden ? 'border-emerald-500 focus:ring-2 focus:ring-emerald-100' : 'border-rose-400 focus:ring-2 focus:ring-rose-100') : 'border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'}`} 
                  />
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} disabled={!verificado} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 disabled:opacity-50">
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {/* Mensaje de coincidencia */}
                {confirmPassword.length > 0 && (
                  <p className={`mt-1.5 text-[10px] font-bold ${contrasenasCoinciden ? 'text-emerald-600' : 'text-rose-500'}`}>
                    {contrasenasCoinciden ? 'Las contraseñas coinciden.' : 'Las contraseñas NO coinciden.'}
                  </p>
                )}
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex gap-3 items-start mt-4">
              <ShieldCheck className="text-blue-600 shrink-0 mt-0.5" size={20} />
              <p className="text-xs text-blue-800 font-medium leading-relaxed">
                Debes verificar tu correo para habilitar el registro. Luego de registrarte, notifica al Administrador para que apruebe tu acceso al sistema.
              </p>
            </div>

            <button 
              type="submit" 
              disabled={cargando || !verificado || !esPasswordValido || !contrasenasCoinciden}
              className="b2b-primary w-full py-3.5 rounded-md transition-colors mt-2 active:scale-95 disabled:bg-slate-300 disabled:cursor-not-allowed flex justify-center items-center gap-2"
            >
              {cargando ? 'Procesando registro...' : 'Enviar Solicitud de Registro'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}