// Archivo: src/app/contacto/page.tsx
import Navbar from "../../components/Navbar";
import Image from "next/image";
import { MapPin, Phone, Mail, Clock, ChevronDown } from "lucide-react";

export default function ContactoPage() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans selection:bg-[#1A73E8] selection:text-white">

      {/* NAVEGACIÓN */}
      <Navbar />

      {/* CABECERA */}
      <div className="relative w-full h-[40vh] bg-black">
        <Image
          src="/heronetworks.jpg"
          alt="Fondo de Contacto Networks Perú"
          fill
          className="object-cover opacity-40 grayscale"
          priority
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 pt-16">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">Contacto Corporativo</h1>
          <p className="text-lg text-gray-300 font-medium">Ingeniería y soporte técnico a su disposición.</p>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 relative -mt-16 pb-24 z-10">

        {/* TARJETAS SUPERIORES (Estilo Flat Monocromático) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 bg-white border border-gray-200 shadow-sm mb-12">

          <div className="p-8 flex flex-col items-center text-center border-b lg:border-b-0 lg:border-r border-gray-200">
            <MapPin size={28} className="text-gray-950 mb-4" strokeWidth={1.5} />
            <h3 className="text-sm font-bold text-gray-950 uppercase tracking-widest mb-2">Oficina Central</h3>
            <p className="text-gray-600 text-sm font-medium">Calle Abtao 1350<br />Iquitos, Loreto</p>
          </div>

          <div className="p-8 flex flex-col items-center text-center border-b lg:border-b-0 lg:border-r border-gray-200">
            <Phone size={28} className="text-gray-950 mb-4" strokeWidth={1.5} />
            <h3 className="text-sm font-bold text-gray-950 uppercase tracking-widest mb-2">Teléfonos</h3>
            <p className="text-gray-600 text-sm font-medium">993 370 797<br />984 470 583</p>
          </div>

          <div className="p-8 flex flex-col items-center text-center border-b md:border-b-0 md:border-r border-gray-200">
            <Clock size={28} className="text-gray-950 mb-4" strokeWidth={1.5} />
            <h3 className="text-sm font-bold text-gray-950 uppercase tracking-widest mb-2">Horario</h3>
            <p className="text-gray-600 text-sm font-medium">Lunes - Sábado<br />08:00 AM - 06:00 PM</p>
          </div>

          <div className="p-8 flex flex-col items-center text-center">
            <Mail size={28} className="text-gray-950 mb-4" strokeWidth={1.5} />
            <h3 className="text-sm font-bold text-gray-950 uppercase tracking-widest mb-2">Correo</h3>
            <p className="text-gray-600 text-sm font-medium">cotizaciones@<br />networksperu.com</p>
          </div>

        </div>

        {/* MAPA EXACTO */}
        <div className="w-full h-[350px] bg-gray-200 border border-gray-200 shadow-sm mb-12 relative">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3981.246419080708!2d-73.25055048524021!3d-3.756550797266714!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x91ea11ccf28a2a07%3A0x6335193eb77efb6d!2sCa.%20Abtao%201350%2C%20Iquitos%2016002!5e0!3m2!1ses!2spe!4v1711550000000!5m2!1ses!2spe"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen={false}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Ubicación Networks Perú - Calle Abtao 1350"
            className="absolute inset-0 grayscale hover:grayscale-0 transition-all duration-700"
          ></iframe>
        </div>

        {/* GRID INFERIOR: FORMULARIO + FAQs (Lado a lado) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

          {/* COLUMNA IZQUIERDA: FORMULARIO */}
          <div className="bg-white p-8 md:p-10 border border-gray-200 shadow-sm h-fit">
            <h2 className="text-2xl font-black text-gray-950 mb-8 tracking-tight">Solicitar Cotización</h2>

            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs font-bold text-gray-950 uppercase tracking-widest block mb-2">Nombre Completo *</label>
                  <input type="text" required className="w-full bg-transparent border-b-2 border-gray-200 text-gray-950 py-2 focus:outline-none focus:border-gray-950 transition-colors" />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-950 uppercase tracking-widest block mb-2">Empresa / RUC *</label>
                  <input type="text" required className="w-full bg-transparent border-b-2 border-gray-200 text-gray-950 py-2 focus:outline-none focus:border-gray-950 transition-colors" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs font-bold text-gray-950 uppercase tracking-widest block mb-2">Correo Corporativo *</label>
                  <input type="email" required className="w-full bg-transparent border-b-2 border-gray-200 text-gray-950 py-2 focus:outline-none focus:border-gray-950 transition-colors" />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-950 uppercase tracking-widest block mb-2">Celular / Teléfono *</label>
                  <input type="tel" required className="w-full bg-transparent border-b-2 border-gray-200 text-gray-950 py-2 focus:outline-none focus:border-gray-950 transition-colors" />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-950 uppercase tracking-widest block mb-2">Requerimiento Principal *</label>
                <select required defaultValue="" className="w-full bg-transparent border-b-2 border-gray-200 text-gray-950 py-2 focus:outline-none focus:border-gray-950 transition-colors appearance-none cursor-pointer font-medium">
                  <option value="" disabled className="text-gray-400"></option>
                  <option value="redes">Redes y Cableado Estructurado</option>
                  <option value="fibra">Instalación de Fibra Óptica</option>
                  <option value="servidores">Implementación de Servidores/Racks</option>
                  <option value="seguridad">Auditoría / Equipos de Seguridad</option>
                  <option value="soporte">Mantenimiento Preventivo</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-950 uppercase tracking-widest block mb-2">Detalle del Proyecto</label>
                <textarea rows={3} className="w-full bg-transparent border-b-2 border-gray-200 text-gray-950 py-2 focus:outline-none focus:border-gray-950 transition-colors resize-none"></textarea>
              </div>

              <button type="submit" className="w-full bg-gray-950 text-white font-bold tracking-widest uppercase py-4 mt-4 hover:bg-gray-800 transition-colors">
                Enviar a Ingeniería
              </button>
            </form>
          </div>

          {/* COLUMNA DERECHA: FAQs ACORDEÓN */}
          <div className="h-fit">
            <h2 className="text-2xl font-black text-gray-950 mb-8 tracking-tight">Preguntas Frecuentes</h2>
            <div className="space-y-4">

              {/* Acordeón 1 */}
              <details className="group bg-white border border-gray-200 p-6 shadow-sm cursor-pointer [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex justify-between items-center font-bold text-gray-950">
                  <span>¿En cuánto tiempo atienden una emergencia?</span>
                  <span className="transition group-open:rotate-180">
                    <ChevronDown size={20} className="text-gray-500" />
                  </span>
                </summary>
                <p className="text-gray-600 text-sm mt-4 leading-relaxed font-medium">
                  Para clientes con contrato de soporte en Iquitos, nuestro tiempo de respuesta en sitio (SLA) es menor a 4 horas. Para atención remota, respondemos en menos de 30 minutos.
                </p>
              </details>

              {/* Acordeón 2 */}
              <details className="group bg-white border border-gray-200 p-6 shadow-sm cursor-pointer [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex justify-between items-center font-bold text-gray-950">
                  <span>¿Otorgan garantía por los trabajos de cableado?</span>
                  <span className="transition group-open:rotate-180">
                    <ChevronDown size={20} className="text-gray-500" />
                  </span>
                </summary>
                <p className="text-gray-600 text-sm mt-4 leading-relaxed font-medium">
                  Sí. Todos nuestros tendidos de red de cobre (Cat 6/6A) y fibra óptica pasan por pruebas de certificación. Entregamos garantía de hasta 10 años sobre la infraestructura física.
                </p>
              </details>

              {/* Acordeón 3 */}
              <details className="group bg-white border border-gray-200 p-6 shadow-sm cursor-pointer [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex justify-between items-center font-bold text-gray-950">
                  <span>¿Venden hardware especializado suelto?</span>
                  <span className="transition group-open:rotate-180">
                    <ChevronDown size={20} className="text-gray-500" />
                  </span>
                </summary>
                <p className="text-gray-600 text-sm mt-4 leading-relaxed font-medium">
                  Nuestro enfoque son los proyectos integrales (llave en mano). Sin embargo, proveemos equipos (Routers, Switches Cisco/Fortinet) a departamentos TI locales que buscan stock inmediato.
                </p>
              </details>

              {/* Acordeón 4 */}
              <details className="group bg-white border border-gray-200 p-6 shadow-sm cursor-pointer [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex justify-between items-center font-bold text-gray-950">
                  <span>¿Realizan auditorías de seguridad perimetral?</span>
                  <span className="transition group-open:rotate-180">
                    <ChevronDown size={20} className="text-gray-500" />
                  </span>
                </summary>
                <p className="text-gray-600 text-sm mt-4 leading-relaxed font-medium">
                  Totalmente. Evaluamos el estado de su red, detectamos vulnerabilidades críticas y recomendamos mejoras en la arquitectura de firewalls para cumplir normativas ISO.
                </p>
              </details>

            </div>
          </div>

        </div>
      </main>
    </div>
  );
}