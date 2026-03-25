// Archivo: src/app/contacto/page.tsx
import Navbar from "../../components/Navbar";
import Image from "next/image";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

export default function ContactoPage() {
  return (
    <div className="min-h-screen bg-white font-sans selection:bg-[#1A73E8] selection:text-white">
      
      {/* NAVEGACIÓN UNIVERSAL */}
      <Navbar />

      {/* CABECERA SOBRIA */}
      <div className="relative w-full h-[40vh] bg-black">
        <Image 
          src="/heronetworks.jpg" 
          alt="Fondo de Contacto Networks Perú"
          fill
          className="object-cover opacity-40" 
          priority
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 pt-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Contacto Corporativo</h1>
          <p className="text-lg text-gray-200">Ingeniería y soporte técnico a su disposición.</p>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 relative -mt-16 pb-24 z-10">
        
        {/* TARJETAS DE INFORMACIÓN (Estilo Flat, Alto Contraste) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 bg-white border border-gray-200 shadow-sm mb-12">
          
          <div className="p-8 flex flex-col items-center text-center border-b lg:border-b-0 lg:border-r border-gray-200">
            <MapPin size={28} className="text-black mb-4" strokeWidth={1.5} />
            <h3 className="text-sm font-bold text-black uppercase tracking-wider mb-2">Oficina Central</h3>
            <p className="text-gray-600 text-sm">Calle Abtao 1350<br />Iquitos, Maynas, Loreto</p>
          </div>

          <div className="p-8 flex flex-col items-center text-center border-b lg:border-b-0 lg:border-r border-gray-200">
            <Phone size={28} className="text-[#1A73E8] mb-4" strokeWidth={1.5} />
            <h3 className="text-sm font-bold text-black uppercase tracking-wider mb-2">Teléfonos</h3>
            <p className="text-gray-600 text-sm">993 370 797<br />984 470 583</p>
          </div>

          <div className="p-8 flex flex-col items-center text-center border-b md:border-b-0 md:border-r border-gray-200">
            <Clock size={28} className="text-[#E65C00] mb-4" strokeWidth={1.5} />
            <h3 className="text-sm font-bold text-black uppercase tracking-wider mb-2">Horario</h3>
            <p className="text-gray-600 text-sm">Lunes - Sábado<br />08:00 AM - 06:00 PM</p>
          </div>

          <div className="p-8 flex flex-col items-center text-center">
            <Mail size={28} className="text-black mb-4" strokeWidth={1.5} />
            <h3 className="text-sm font-bold text-black uppercase tracking-wider mb-2">Correo</h3>
            <p className="text-gray-600 text-sm">cotizaciones@<br />networksperu.com</p>
          </div>

        </div>

        {/* BLOQUE INFERIOR (Formulario + Mapa sin luces ni brillos) */}
        <div className="flex flex-col lg:flex-row border border-gray-200 shadow-sm bg-white overflow-hidden">
          
          {/* FORMULARIO B2B */}
          <div className="w-full lg:w-1/2 p-8 md:p-12">
            <h2 className="text-3xl font-bold text-black mb-2">Solicitar Cotización</h2>
            <p className="text-gray-600 text-sm mb-8">
              Complete los datos de su empresa para evaluar su proyecto.
            </p>

            <form className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs font-bold text-black uppercase tracking-wider block mb-2">Nombre Completo *</label>
                  <input 
                    type="text" 
                    required
                    placeholder="Ej. Ing. Carlos Mendoza" 
                    className="w-full bg-white border border-gray-300 text-black placeholder-gray-400 px-4 py-3 focus:outline-none focus:border-[#1A73E8] focus:ring-1 focus:ring-[#1A73E8] rounded-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-black uppercase tracking-wider block mb-2">Empresa / RUC *</label>
                  <input 
                    type="text" 
                    required
                    placeholder="Ej. Constructora Selva SAC" 
                    className="w-full bg-white border border-gray-300 text-black placeholder-gray-400 px-4 py-3 focus:outline-none focus:border-[#1A73E8] focus:ring-1 focus:ring-[#1A73E8] rounded-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs font-bold text-black uppercase tracking-wider block mb-2">Correo Electrónico *</label>
                  <input 
                    type="email" 
                    required
                    placeholder="gerencia@empresa.com" 
                    className="w-full bg-white border border-gray-300 text-black placeholder-gray-400 px-4 py-3 focus:outline-none focus:border-[#1A73E8] focus:ring-1 focus:ring-[#1A73E8] rounded-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-black uppercase tracking-wider block mb-2">Celular / Teléfono *</label>
                  <input 
                    type="tel" 
                    required
                    placeholder="999 888 777" 
                    className="w-full bg-white border border-gray-300 text-black placeholder-gray-400 px-4 py-3 focus:outline-none focus:border-[#1A73E8] focus:ring-1 focus:ring-[#1A73E8] rounded-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-black uppercase tracking-wider block mb-2">Requerimiento Principal *</label>
                <select 
                  required
                  className="w-full bg-white border border-gray-300 text-black px-4 py-3 focus:outline-none focus:border-[#1A73E8] focus:ring-1 focus:ring-[#1A73E8] rounded-none appearance-none cursor-pointer"
                >
                  <option value="" className="text-gray-400">Seleccione un servicio...</option>
                  <option value="redes">Redes y Cableado Estructurado</option>
                  <option value="fibra">Instalación de Fibra Óptica</option>
                  <option value="servidores">Implementación de Servidores/Racks</option>
                  <option value="seguridad">Equipos de Seguridad (Firewalls)</option>
                  <option value="soporte">Soporte TI / Mantenimiento</option>
                  <option value="otro">Otro (Especificar en el detalle)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-black uppercase tracking-wider block mb-2">Detalle del Proyecto</label>
                <textarea 
                  rows={4}
                  placeholder="Describa brevemente su requerimiento..." 
                  className="w-full bg-white border border-gray-300 text-black placeholder-gray-400 px-4 py-3 focus:outline-none focus:border-[#1A73E8] focus:ring-1 focus:ring-[#1A73E8] rounded-none resize-none"
                ></textarea>
              </div>

              <button 
                type="submit" 
                className="w-full bg-[#1A73E8] text-white font-bold tracking-widest uppercase py-4 mt-4 hover:bg-[#155DB1] transition-colors rounded-none"
              >
                Enviar Solicitud
              </button>
            </form>
          </div>

          {/* MAPA */}
          <div className="w-full lg:w-1/2 min-h-[400px] bg-gray-100 relative border-t lg:border-t-0 lg:border-l border-gray-200">
            <iframe 
              src="https://maps.google.com/maps?q=-3.75261,-73.25959&hl=es&z=17&output=embed" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen={false} 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title="Ubicación Networks Perú - Iquitos"
              className="absolute inset-0"
            ></iframe>
          </div>

        </div>
      </main>
    </div>
  );
}