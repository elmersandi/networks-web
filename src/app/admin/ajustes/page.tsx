"use client";

import { useState } from "react";
import { Save, Building2, Mail, Phone, MapPin, ShieldCheck } from "lucide-react";

export default function AjustesPage() {
  const [guardando, setGuardando] = useState(false);

  // Simulamos guardar la configuración
  const handleGuardar = (e: React.FormEvent) => {
    e.preventDefault();
    setGuardando(true);
    setTimeout(() => {
      setGuardando(false);
      alert("¡Configuración guardada exitosamente!");
    }, 1000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 relative">
      
      {/* HEADER */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Ajustes del Sistema</h2>
        <p className="text-sm text-gray-500 mt-1">Administra la información pública y credenciales de N&S Perú.</p>
      </div>

      <form onSubmit={handleGuardar} className="space-y-8">
        
        {/* TARJETA: INFORMACIÓN DE LA EMPRESA */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200 bg-gray-50">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Building2 size={20} className="text-blue-600" /> Datos de la Empresa
            </h3>
            <p className="text-sm text-gray-500 mt-1">Esta información aparecerá en la página web pública y en las cotizaciones.</p>
          </div>
          
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Razón Social</label>
              <input type="text" defaultValue="N&S Perú - Telecomunicaciones B2B" className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">RUC</label>
              <input type="text" defaultValue="20000000000" className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 flex items-center gap-1"><Mail size={14}/> Correo Principal</label>
              <input type="email" defaultValue="contacto@nsperu.com" className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 flex items-center gap-1"><Phone size={14}/> Teléfono de Contacto</label>
              <input type="text" defaultValue="+51 999 999 999" className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 flex items-center gap-1"><MapPin size={14}/> Dirección Física</label>
              <input type="text" defaultValue="Av. Principal 123, Iquitos, Perú" className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white" />
            </div>
          </div>
        </div>

        {/* TARJETA: SEGURIDAD */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200 bg-gray-50">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <ShieldCheck size={20} className="text-emerald-600" /> Seguridad de la Cuenta
            </h3>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Usuario Administrador</label>
              <input type="text" defaultValue="admin_ns" disabled className="w-full px-3 py-2 border border-gray-200 bg-gray-50 rounded-md text-gray-500 outline-none cursor-not-allowed" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Nueva Contraseña</label>
              <input type="password" placeholder="••••••••" className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white" />
            </div>
          </div>
        </div>

        {/* BOTÓN GUARDAR */}
        <div className="flex justify-end">
          <button 
            type="submit" 
            disabled={guardando}
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-md font-bold hover:bg-blue-700 shadow-sm transition-all transform active:scale-95 disabled:opacity-70"
          >
            {guardando ? "Guardando..." : <><Save size={18} /> Guardar Cambios</>}
          </button>
        </div>

      </form>
    </div>
  );
}