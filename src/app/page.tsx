// Archivo: src/app/page.tsx
'use client' // Necesario para componentes que usan estado o eventos, como el botón flotante

import Navbar from "../components/Navbar"; 
import Image from "next/image";
import Link from "next/link";
// Usamos iconos de Lucide-React que son más técnicos y limpios
import { ArrowRight, CheckCircle, Shield, Server, Network, MessageCircle, FileText, ChevronRight } from "lucide-react";

export default function Home() {
  return (
    <div className="bg-gray-50 font-sans selection:bg-[#1A73E8] selection:text-white relative">
      <Navbar />

      {/* 1. HERO SECTION (Fusión Ganadora: Oscuro + UI Moderna) */}
      {/* OPTIMIZACIÓN: Aumentamos el padding-top (pt-24 md:pt-32) para que el Logo no tape el texto */}
      <section className="relative w-full min-h-[90vh] bg-[#0a0a0a] flex items-center pt-24 md:pt-32 pb-24 overflow-hidden">
        <Image 
          src="/heronetworks.jpg" 
          alt="Infraestructura Networks Perú"
          fill
          className="object-cover opacity-25 grayscale pointer-events-none" 
          priority
        />

        {/* Efecto de luz de fondo sutil (Colores Corporativos sobre oscuro) */}
        <div aria-hidden="true" className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl pointer-events-none">
          <div
            style={{
              clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
            className="relative left-[calc(50%-11rem)] aspect-1155/678 w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#1A73E8] to-[#E65C00] opacity-15 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 w-full">
          <div className="max-w-4xl flex flex-col items-start text-left">
            
            {/* AGREGADO 1: Banner Informacional (Estilo Prueba - Adaptado a oscuro) */}
            <div className="mb-10 flex sm:justify-center">
              <div className="relative rounded-full px-4 py-1.5 text-sm/6 text-gray-300 ring-1 ring-gray-800 hover:ring-gray-700 transition-all cursor-pointer bg-black/30 backdrop-blur-sm">
                Descubra nuestra nueva sede en Iquitos.{' '}
                <Link href="/nosotros" className="font-semibold text-[#1A73E8]">
                  <span aria-hidden="true" className="absolute inset-0" />
                  Leer más <span aria-hidden="true">&rarr;</span>
                </Link>
              </div>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white tracking-tighter leading-[1.05] mb-8 text-balance">
              Conectividad sin interrupciones para su empresa.
            </h1>
            <p className="text-xl text-gray-300 font-medium leading-relaxed mb-12 max-w-3xl text-pretty">
              Soluciones integrales en redes corporativas, ciberseguridad y soporte técnico a medida para asegurar la operatividad de su negocio en la Amazonía.
            </p>

            {/* AGREGADO 2: Botones side-by-side (Alineación y Diseño de la prueba - Adaptado a oscuro) */}
            <div className="flex items-center justify-center gap-x-6">
              <Link
                href="/contacto"
                className="rounded-md bg-[#1A73E8] px-8 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-[#155DB1] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1A73E8]"
              >
                Solicitar Cotización
              </Link>
              <Link href="/servicios" className="text-sm font-semibold text-white flex items-center gap-2 hover:text-[#1A73E8] transition-colors group">
                Ver servicios <ArrowRight size={16} className="text-gray-400 group-hover:text-[#1A73E8] transition-colors" />
              </Link>
            </div>

          </div>
        </div>

        {/* Efecto de luz de fondo inferior */}
        <div aria-hidden="true" className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl pointer-events-none">
          <div
            style={{
              clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
            className="relative left-[calc(50%+3rem)] aspect-1155/678 w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#1A73E8] to-[#E65C00] opacity-15 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
          />
        </div>
      </section>

      {/* -- RESTO DE SECCIONES (Se mantienen igual para el embudo de ventas) -- */}

      {/* 4. SECCIÓN DE PARTNERS (Marcas que dan autoridad) */}
      <section className="bg-white border-b border-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <p className="text-center text-xs font-bold text-gray-400 uppercase tracking-widest mb-8">Tecnología respaldada por líderes mundiales</p>
          <div className="flex flex-wrap justify-center items-center gap-12 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
            <span className="text-2xl font-black tracking-tighter text-gray-900">CISCO</span>
            <span className="text-2xl font-bold tracking-tight text-gray-800">UBIQUITI</span>
            <span className="text-2xl font-black tracking-widest text-gray-900">MIKROTIK</span>
            <span className="text-2xl font-bold text-gray-800">FORTINET</span>
            <span className="text-2xl font-black italic text-gray-900">FURUKAWA</span>
          </div>
        </div>
      </section>

      {/* AGREGADO DE TESIS: MÉTRICAS DE CONFIANZA */}
      <section className="bg-[#0a0a0a] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-3 gap-8 divide-y md:divide-y-0 md:divide-x divide-gray-800 text-center">
          <div className="p-4 flex flex-col items-center justify-center">
            <p className="text-4xl font-black text-[#1A73E8] mb-2">+5 Años</p>
            <p className="text-gray-400 font-bold uppercase tracking-wider text-sm">Experiencia en la Amazonía</p>
          </div>
          <div className="p-4 flex flex-col items-center justify-center">
            <p className="text-4xl font-black text-[#E65C00] mb-2">100%</p>
            <p className="text-gray-400 font-bold uppercase tracking-wider text-sm">Garantía de Certificación</p>
          </div>
          <div className="p-4 flex flex-col items-center justify-center">
            <p className="text-4xl font-black text-white mb-2">24/7</p>
            <p className="text-gray-400 font-bold uppercase tracking-wider text-sm">Soporte Técnico de Emergencia</p>
          </div>
        </div>
      </section>

      {/* 3. SERVICIOS ESPECIALIZADOS */}
      <section className="py-24 bg-gray-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="mb-16 max-w-2xl">
            <h2 className="text-4xl font-black text-gray-950 tracking-tight mb-4">Especialistas en infraestructura crítica.</h2>
            <p className="text-lg text-gray-600 font-medium">Resolvemos los cuellos de botella de su red para que usted se enfoque en la rentabilidad de su negocio.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 border border-gray-100 hover:border-[#1A73E8] transition-all hover:shadow-lg group">
              <Network className="text-gray-900 mb-6 group-hover:text-[#1A73E8] transition-colors" size={40} strokeWidth={1.2} />
              <h3 className="text-xl font-bold text-gray-950 mb-3">Instalación y Cableado</h3>
              <p className="text-gray-600 mb-6 text-sm leading-relaxed">Implementación de cableado estructurado Cat 6/6A bajo normativas internacionales y tendido de fibra óptica multimodo/monomodo.</p>
              <ul className="space-y-2 mb-8 text-sm font-medium text-gray-700">
                <li className="flex gap-2"><CheckCircle size={16} className="text-[#1A73E8]" /> Trabajos limpios y rotulados ANSI/TIA.</li>
                <li className="flex gap-2"><CheckCircle size={16} className="text-[#1A73E8]" /> Certificación de puntos de red.</li>
              </ul>
            </div>

            <div className="bg-white p-8 border border-gray-100 hover:border-[#E65C00] transition-all hover:shadow-lg group">
              <Shield className="text-gray-900 mb-6 group-hover:text-[#E65C00] transition-colors" size={40} strokeWidth={1.2} />
              <h3 className="text-xl font-bold text-gray-950 mb-3">Auditorías de Red y Seguridad</h3>
              <p className="text-gray-600 mb-6 text-sm leading-relaxed">Análisis profundo de vulnerabilidades perimetrales, optimización de tráfico de datos y configuración avanzada de firewalls corporativos.</p>
              <ul className="space-y-2 mb-8 text-sm font-medium text-gray-700">
                <li className="flex gap-2"><CheckCircle size={16} className="text-[#E65C00]" /> Detección de intrusos (IPS/IDS).</li>
                <li className="flex gap-2"><CheckCircle size={16} className="text-[#E65C00]" /> Políticas de restricción y control.</li>
              </ul>
            </div>

            <div className="bg-white p-8 border border-gray-100 hover:border-black transition-all hover:shadow-lg group">
              <Server className="text-gray-900 mb-6" size={40} strokeWidth={1.2} />
              <h3 className="text-xl font-bold text-gray-950 mb-3">Mantenimiento y Help Desk</h3>
              <p className="text-gray-600 mb-6 text-sm leading-relaxed">Mesa de ayuda local en Iquitos. Mantenimiento preventivo/correctivo de gabinetes de comunicaciones, servidores y racks.</p>
              <ul className="space-y-2 mb-8 text-sm font-medium text-gray-700">
                <li className="flex gap-2"><CheckCircle size={16} className="text-black" /> Planes de mantenimiento mensuales.</li>
                <li className="flex gap-2"><CheckCircle size={16} className="text-black" /> Respuesta rápida ante incidentes.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CATÁLOGO DE PRODUCTOS (Modo Vitrina Corporativa) */}
      <section className="py-24 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div>
              <h2 className="text-4xl font-black text-gray-950 tracking-tight mb-4">Catálogo de Hardware Industrial.</h2>
              <p className="text-lg text-gray-600 font-medium max-w-xl">Equipamiento robusto seleccionado por nuestros ingenieros para garantizar el máximo rendimiento.</p>
            </div>
            <Link href="/productos" className="flex items-center gap-2 font-bold text-[#1A73E8] hover:text-[#155DB1] transition-colors group shrink-0">
              Ver catálogo completo <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Categoría 1 */}
            <div className="bg-gray-50 border border-gray-100 p-8 flex flex-col md:flex-row gap-8 items-center hover:shadow-md transition-shadow">
              <div className="w-24 h-24 bg-white border border-gray-100 flex items-center justify-center shrink-0 shadow-inner">
                <Server size={40} className="text-gray-300" strokeWidth={1} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-950 mb-2">Servidores y Racks</h3>
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">Gabinetes de comunicaciones certificado, ordenadores y servidores formato Rack o Torre para alta disponibilidad.</p>
                <div className="flex gap-4">
                  <button className="text-sm font-bold text-[#1A73E8] flex items-center gap-1.5 hover:underline"><FileText size={16}/> Ficha Técnica (PDF)</button>
                  <Link href="/contacto" className="text-sm font-bold text-gray-900 hover:underline">Solicitar Cotización</Link>
                </div>
              </div>
            </div>

            {/* Categoría 2 */}
            <div className="bg-gray-50 border border-gray-100 p-8 flex flex-col md:flex-row gap-8 items-center hover:shadow-md transition-shadow">
              <div className="w-24 h-24 bg-white border border-gray-100 flex items-center justify-center shrink-0 shadow-inner">
                <Network size={40} className="text-gray-300" strokeWidth={1} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-950 mb-2">Networking Avanzado</h3>
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">Routers empresariales, Switches Administrables L2/L3 de alta densidad y Antenas de Radioenlace de largo alcance.</p>
                <div className="flex gap-4">
                  <button className="text-sm font-bold text-[#1A73E8] flex items-center gap-1.5 hover:underline"><FileText size={16}/> Ficha Técnica (PDF)</button>
                  <Link href="/contacto" className="text-sm font-bold text-gray-900 hover:underline">Solicitar Cotización</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. PRUEBA SOCIAL: RESPALDO LOCAL */}
      <section className="py-24 bg-gray-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 className="text-4xl font-black text-gray-950 tracking-tight mb-16 text-center">Respaldados por la industria local.</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="bg-white p-9 border border-gray-100 shadow-sm relative">
              <span className="text-8xl text-gray-100 absolute -top-2 left-4 font-serif pointer-events-none">&quot;</span>
              <p className="text-gray-700 font-medium leading-relaxed relative z-10 mb-6 italic text-pretty">
                &quot;Instalamos nuestra red de fibra óptica con Networks Perú. Lo que más destacamos es su tiempo de respuesta. Al estar en Iquitos, el soporte técnico llega el mismo día, algo imposible con proveedores de la capital.&quot;
              </p>
              <div className="flex items-center gap-4">
                <div className="size-10 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-500">LA</div>
                <div>
                  <p className="font-bold text-gray-950">Gerencia de Operaciones</p>
                  <p className="text-sm text-gray-500">Empresa Logística Amazónica</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-9 border border-gray-100 shadow-sm relative">
              <span className="text-8xl text-gray-100 absolute -top-2 left-4 font-serif pointer-events-none">&quot;</span>
              <p className="text-gray-700 font-medium leading-relaxed relative z-10 mb-6 italic text-pretty">
                &quot;El reordenamiento de nuestro gabinete de servidores fue impecable. Ahora nuestra red es estable y la auditoría de seguridad nos salvó de varias vulnerabilidades críticas que no conocíamos.&quot;
              </p>
              <div className="flex items-center gap-4">
                <div className="size-10 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-500">CL</div>
                <div>
                  <p className="font-bold text-gray-950">Jefatura de Sistemas</p>
                  <p className="text-sm text-gray-500">Clínica Local Iquitos</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CTA FINAL: FORMULARIO INTELIGENTE DE COTIZACIÓN */}
      <section className="py-24 bg-[#0a0a0a]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-4xl font-black text-white tracking-tight mb-6 text-balance leading-tight">Inicie su proyecto de infraestructura hoy mismo.</h2>
          <p className="text-gray-300 text-lg mb-12 font-medium max-w-2xl mx-auto text-pretty">
            ¿Es una oficina administrativa, una planta industrial o un proyecto de múltiples sedes? Cuéntenos los detalles básicos y un ingeniero evaluará su caso sin compromiso.
          </p>
          <div className="bg-white p-10 text-left shadow-2xl">
            <form className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <label className="text-xs font-bold text-gray-950 uppercase tracking-widest block mb-2.5">Tipo de Inmueble</label>
                <select className="w-full border border-gray-200 bg-white text-gray-950 p-3.5 focus:outline-none focus:border-[#1A73E8] focus:ring-1 focus:ring-[#1A73E8] transition-colors">
                  <option>Oficina Administrativa</option>
                  <option>Almacén / Bodega Industrial</option>
                  <option>Clínica / Centro de Salud</option>
                  <option>Hotel / Complejo Comercial</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-950 uppercase tracking-widest block mb-2.5">Puntos de Red / Usuarios</label>
                <select className="w-full border border-gray-200 bg-white text-gray-950 p-3.5 focus:outline-none focus:border-[#1A73E8] focus:ring-1 focus:ring-[#1A73E8] transition-colors">
                  <option>Menos de 20</option>
                  <option>20 a 50 puntos</option>
                  <option>Más de 50 puntos</option>
                  <option>No estoy seguro</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-950 uppercase tracking-widest block mb-2.5">Urgencia del Proyecto</label>
                <select className="w-full border border-gray-200 bg-white text-gray-950 p-3.5 focus:outline-none focus:border-[#1A73E8] focus:ring-1 focus:ring-[#1A73E8] transition-colors">
                  <option>Emergencia (Red corporativa caída)</option>
                  <option>Lo antes posible (Expansión)</option>
                  <option>Planificación (Próximo mes/trimestre)</option>
                </select>
              </div>
              <div className="md:col-span-3 mt-4">
                <button type="button" className="w-full bg-[#1A73E8] hover:bg-[#155DB1] text-white font-bold uppercase tracking-widest py-4.5 transition-colors shadow-md">
                  Avanzar a Cotización Completa
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* BOTÓN FLOTANTE DE WHATSAPP (Fijo en la esquina inferior derecha) */}
      <a 
        href="https://wa.me/51993370797?text=Hola,%20necesito%20soporte%20técnico%20para%20mi%20empresa%20en%20Iquitos." 
        target="_blank" 
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:bg-[#1EBE53] hover:scale-110 transition-all z-50 flex items-center justify-center group"
        aria-label="Contactar a Networks Perú por WhatsApp para Soporte"
      >
        <MessageCircle size={32} strokeWidth={1.5} />
        {/* Tooltip pequeño que aparece al pasar el mouse */}
        <span className="absolute right-20 bg-gray-950 text-white text-xs font-bold px-4 py-2.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-lg">
          Soporte Técnico Rápido
        </span>
      </a>

    </div>
  );
}