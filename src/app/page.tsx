// Archivo: src/app/page.tsx
import Navbar from "../components/Navbar"; // Ajusta la ruta si es necesario (@/components/Navbar)
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Shield, Server, Network, MessageCircle, FileText, ChevronRight } from "lucide-react";

export default function Home() {
  return (
    <div className="bg-white font-sans selection:bg-[#1A73E8] selection:text-white relative">
      <Navbar />

      {/* 1. HERO SECTION (El Gancho) */}
      <section className="relative w-full h-[85vh] bg-[#0a0a0a] flex items-center pt-20">
        <Image
          src="/heronetworks.jpg"
          alt="Infraestructura Networks Perú"
          fill
          className="object-cover opacity-30 grayscale"
          priority
        />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 w-full">
          <div className="max-w-3xl">
            <div className="inline-block bg-[#1A73E8] text-white font-bold px-3 py-1 text-xs uppercase tracking-widest mb-6">
              Ingeniería de Redes en Loreto
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white tracking-tighter leading-[1.1] mb-6">
              Conectividad sin interrupciones para tu empresa.
            </h1>
            <p className="text-xl text-gray-400 font-medium leading-relaxed mb-10 max-w-2xl">
              Soluciones integrales en redes, ciberseguridad y soporte técnico a medida para asegurar la operatividad de su negocio.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/contacto" className="bg-[#1A73E8] hover:bg-[#155DB1] text-white font-bold py-4 px-8 text-center transition-colors flex items-center justify-center gap-2">
                Solicitar Cotización <ArrowRight size={20} />
              </Link>
              <Link href="/servicios" className="bg-white text-black hover:bg-gray-100 font-bold py-4 px-8 text-center transition-colors">
                Ver Servicios
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4. SECCIÓN DE PARTNERS (Marcas que dan autoridad) */}
      <section className="bg-white border-b border-gray-200 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <p className="text-center text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">Tecnología respaldada por líderes mundiales</p>
          <div className="flex flex-wrap justify-center items-center gap-12 opacity-60 grayscale">
            {/* Como no tenemos los logos en imagen, usamos tipografía pesada para simularlos */}
            <span className="text-2xl font-black tracking-tighter">CISCO</span>
            <span className="text-2xl font-bold tracking-tight">UBIQUITI</span>
            <span className="text-2xl font-black tracking-widest">MIKROTIK</span>
            <span className="text-2xl font-bold">FORTINET</span>
            <span className="text-2xl font-black italic">FURUKAWA</span>
          </div>
        </div>
      </section>

      {/* AGREGADO: MÉTRICAS DE CONFIANZA */}
      <section className="bg-[#0a0a0a] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-3 gap-8 divide-y md:divide-y-0 md:divide-x divide-gray-800 text-center">
          <div className="p-4">
            <p className="text-4xl font-black text-[#1A73E8] mb-2">+5 Años</p>
            <p className="text-gray-400 font-bold uppercase tracking-wider text-sm">Experiencia en la Amazonía</p>
          </div>
          <div className="p-4">
            <p className="text-4xl font-black text-[#E65C00] mb-2">100%</p>
            <p className="text-gray-400 font-bold uppercase tracking-wider text-sm">Garantía de Certificación</p>
          </div>
          <div className="p-4">
            <p className="text-4xl font-black text-white mb-2">24/7</p>
            <p className="text-gray-400 font-bold uppercase tracking-wider text-sm">Soporte Técnico de Emergencia</p>
          </div>
        </div>
      </section>

      {/* 3. SERVICIOS ESPECIALIZADOS */}
      <section className="py-24 bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="mb-16">
            <h2 className="text-4xl font-black text-black tracking-tight mb-4">Especialistas en infraestructura.</h2>
            <p className="text-lg text-gray-600 max-w-2xl font-medium">Resolvemos los problemas críticos de su red para que usted se enfoque en su negocio.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 border border-gray-200 hover:border-[#1A73E8] transition-colors group">
              <Network className="text-black mb-6 group-hover:text-[#1A73E8] transition-colors" size={40} strokeWidth={1.5} />
              <h3 className="text-xl font-bold text-black mb-3">Instalación y Cableado</h3>
              <p className="text-gray-600 mb-6 text-sm leading-relaxed">Implementación de cableado estructurado bajo normativas y tendido de fibra óptica para cero latencia.</p>
              <ul className="space-y-2 mb-8 text-sm font-medium text-gray-700">
                <li className="flex gap-2"><CheckCircle2 size={16} className="text-[#1A73E8]" /> Trabajos limpios y rotulados.</li>
                <li className="flex gap-2"><CheckCircle2 size={16} className="text-[#1A73E8]" /> Certificación de puntos.</li>
              </ul>
            </div>

            <div className="bg-white p-8 border border-gray-200 hover:border-[#E65C00] transition-colors group">
              <Shield className="text-black mb-6 group-hover:text-[#E65C00] transition-colors" size={40} strokeWidth={1.5} />
              <h3 className="text-xl font-bold text-black mb-3">Auditorías de Red y Seguridad</h3>
              <p className="text-gray-600 mb-6 text-sm leading-relaxed">Análisis profundo de vulnerabilidades, optimización de tráfico y configuración de firewalls perimetrales.</p>
              <ul className="space-y-2 mb-8 text-sm font-medium text-gray-700">
                <li className="flex gap-2"><CheckCircle2 size={16} className="text-[#E65C00]" /> Detección de cuellos de botella.</li>
                <li className="flex gap-2"><CheckCircle2 size={16} className="text-[#E65C00]" /> Políticas de restricción.</li>
              </ul>
            </div>

            <div className="bg-white p-8 border border-gray-200 hover:border-black transition-colors group">
              <Server className="text-black mb-6" size={40} strokeWidth={1.5} />
              <h3 className="text-xl font-bold text-black mb-3">Mantenimiento y Soporte</h3>
              <p className="text-gray-600 mb-6 text-sm leading-relaxed">Mesa de ayuda (Help Desk) local en Iquitos. Mantenimiento preventivo de gabinetes y servidores.</p>
              <ul className="space-y-2 mb-8 text-sm font-medium text-gray-700">
                <li className="flex gap-2"><CheckCircle2 size={16} className="text-black" /> Planes mensuales.</li>
                <li className="flex gap-2"><CheckCircle2 size={16} className="text-black" /> Respuesta ante caídas.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CATÁLOGO DE PRODUCTOS (Modo Vitrina) */}
      <section className="py-24 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div>
              <h2 className="text-4xl font-black text-black tracking-tight mb-4">Catálogo de Hardware.</h2>
              <p className="text-lg text-gray-600 font-medium">Equipos industriales para proyectos de alta demanda.</p>
            </div>
            <Link href="/productos" className="flex items-center gap-2 font-bold text-[#1A73E8] hover:text-[#155DB1] transition-colors">
              Ver catálogo completo <ChevronRight size={20} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Categoría 1 */}
            <div className="bg-gray-50 border border-gray-200 p-8 flex flex-col md:flex-row gap-8 items-center">
              <div className="w-24 h-24 bg-white border border-gray-200 flex items-center justify-center shrink-0">
                <Server size={40} className="text-gray-400" strokeWidth={1} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-black mb-2">Servidores y Racks</h3>
                <p className="text-gray-600 text-sm mb-4">Gabinetes de comunicaciones, ordenadores y servidores formato Rack/Torre.</p>
                <div className="flex gap-4">
                  <button className="text-sm font-bold text-[#1A73E8] flex items-center gap-1 hover:underline"><FileText size={16} /> Ficha Técnica</button>
                  <Link href="/contacto" className="text-sm font-bold text-black hover:underline">Cotizar Equipo</Link>
                </div>
              </div>
            </div>

            {/* Categoría 2 */}
            <div className="bg-gray-50 border border-gray-200 p-8 flex flex-col md:flex-row gap-8 items-center">
              <div className="w-24 h-24 bg-white border border-gray-200 flex items-center justify-center shrink-0">
                <Network size={40} className="text-gray-400" strokeWidth={1} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-black mb-2">Networking Avanzado</h3>
                <p className="text-gray-600 text-sm mb-4">Routers empresariales, Switches Administrables L2/L3 y Antenas de Radioenlace.</p>
                <div className="flex gap-4">
                  <button className="text-sm font-bold text-[#1A73E8] flex items-center gap-1 hover:underline"><FileText size={16} /> Ficha Técnica</button>
                  <Link href="/contacto" className="text-sm font-bold text-black hover:underline">Cotizar Equipo</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. CASOS DE ÉXITO / PRUEBA SOCIAL */}
      <section className="py-24 bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 className="text-4xl font-black text-black tracking-tight mb-16 text-center">Respaldados por la industria local.</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white p-8 border border-gray-200 shadow-sm relative">
              <span className="text-6xl text-gray-200 absolute top-4 left-4 font-serif">&quot;</span>
              <p className="text-gray-700 font-medium leading-relaxed relative z-10 mb-6 italic">
                &quot;Instalamos nuestra red de fibra óptica con Networks Perú. Lo que más destacamos es su tiempo de respuesta. Al estar en Iquitos, el soporte técnico llega el mismo día, algo imposible con proveedores de la capital.&quot;
              </p>
              <div>
                <p className="font-bold text-black">Gerencia de Operaciones</p>
                <p className="text-sm text-gray-500">Empresa Logística Amazónica</p>
              </div>
            </div>
            <div className="bg-white p-8 border border-gray-200 shadow-sm relative">
              <span className="text-6xl text-gray-200 absolute top-4 left-4 font-serif">&quot;</span>
              <p className="text-gray-700 font-medium leading-relaxed relative z-10 mb-6 italic">
                &quot;El reordenamiento de nuestro gabinete de servidores fue impecable. Ahora nuestra red es estable y la auditoría de seguridad nos salvó de varias vulnerabilidades que no conocíamos.&quot;
              </p>
              <div>
                <p className="font-bold text-black">Jefatura de Sistemas</p>
                <p className="text-sm text-gray-500">Clínica Local Iquitos</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CTA FINAL: FORMULARIO INTELIGENTE DE COTIZACIÓN */}
      <section className="py-24 bg-[#0a0a0a]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-4xl font-black text-white tracking-tight mb-6">Inicie su proyecto hoy.</h2>
          <p className="text-gray-400 text-lg mb-10 font-medium">
            ¿Es una oficina, una planta industrial o un proyecto de múltiples sedes? Cuéntenos los detalles básicos y un ingeniero evaluará su caso sin compromiso.
          </p>
          <div className="bg-white p-8 text-left">
            <form className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="text-xs font-bold text-black uppercase tracking-wider block mb-2">Tipo de Inmueble</label>
                <select className="w-full border border-gray-300 bg-white text-black p-3 focus:outline-none focus:border-[#1A73E8]">
                  <option>Oficina Administrativa</option>
                  <option>Almacén / Bodega</option>
                  <option>Clínica / Hospital</option>
                  <option>Hotel / Comercio</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-black uppercase tracking-wider block mb-2">Puntos de Red / Usuarios</label>
                <select className="w-full border border-gray-300 bg-white text-black p-3 focus:outline-none focus:border-[#1A73E8]">
                  <option>Menos de 20</option>
                  <option>20 a 50 puntos</option>
                  <option>Más de 50 puntos</option>
                  <option>No estoy seguro</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-black uppercase tracking-wider block mb-2">Urgencia</label>
                <select className="w-full border border-gray-300 bg-white text-black p-3 focus:outline-none focus:border-[#1A73E8]">
                  <option>Emergencia (Red caída)</option>
                  <option>Lo antes posible</option>
                  <option>Planificación (Próximo mes)</option>
                </select>
              </div>
              <div className="md:col-span-3">
                <button type="button" className="w-full bg-[#1A73E8] hover:bg-[#155DB1] text-white font-bold uppercase tracking-widest py-4 transition-colors">
                  Avanzar a Cotización Completa
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* BOTÓN FLOTANTE DE WHATSAPP (Fijo en la esquina inferior derecha) */}
      <a
        href="https://wa.me/51993370797?text=Hola,%20necesito%20soporte%20técnico%20para%20mi%20empresa."
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:bg-[#1EBE53] hover:scale-110 transition-all z-50 flex items-center justify-center group"
        aria-label="Contactar por WhatsApp"
      >
        <MessageCircle size={32} />
        {/* Tooltip pequeño que aparece al pasar el mouse */}
        <span className="absolute right-16 bg-black text-white text-xs font-bold px-3 py-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          Soporte Rápido
        </span>
      </a>

    </div>
  );
}