// Archivo: src/app/servicios/page.tsx
import Navbar from "../../components/Navbar";
import { Network, Server, ShieldCheck, ArrowRight, Check, Wrench, FileText } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function ServiciosPage() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans selection:bg-gray-950 selection:text-white">
      
      {/* 1. NAVEGACIÓN UNIVERSAL */}
      <Navbar />

      {/* 2. CABECERA CORPORATIVA (Estilo Editorial) */}
      <header className="bg-white pt-32 pb-20 md:pt-40 md:pb-24 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="max-w-3xl">
            <h1 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">
              Catálogo de Servicios Integrales
            </h1>
            <h2 className="text-5xl md:text-6xl font-black text-gray-950 tracking-tight leading-tight mb-8 text-balance">
              Infraestructura tecnológica diseñada para la continuidad operativa.
            </h2>
            <p className="text-xl text-gray-600 font-medium leading-relaxed max-w-2xl text-pretty">
              Desarrollamos ecosistemas de red robustos, centros de datos escalables y políticas de seguridad perimetral para empresas que no pueden permitirse tiempos de inactividad en la Amazonía.
            </p>
          </div>
        </div>
      </header>

      <main className="flex flex-col">
        
        {/* 3. BLOQUE DE SERVICIOS (Grid Asimétrico / Bento Box) */}
        <section className="py-24 bg-gray-50 border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* SERVICIO 1: Redes y Fibra Óptica (Tarjeta Grande) */}
              <div className="bg-white p-10 md:p-12 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-14 h-14 bg-gray-950 rounded-none flex items-center justify-center mb-8">
                  <Network className="text-white" size={28} strokeWidth={1.5} />
                </div>
                <h3 className="text-3xl font-black text-gray-950 tracking-tight mb-4">
                  Cableado Estructurado y Fibra Óptica
                </h3>
                <p className="text-base text-gray-600 leading-relaxed mb-8 font-medium">
                  Diseñamos e implementamos topologías de red escalables. Desde el tendido de fibra óptica multimodo/monomodo hasta el cableado estructurado bajo normativas ANSI/TIA.
                </p>
                <div className="space-y-4 pt-6 border-t border-gray-100">
                  <div className="flex items-start gap-3">
                    <Check className="text-gray-950 mt-1 shrink-0" size={18} />
                    <p className="text-sm text-gray-700 font-bold">Certificación de puntos de red (Fluke Networks).</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="text-gray-950 mt-1 shrink-0" size={18} />
                    <p className="text-sm text-gray-700 font-bold">Empalmes de fibra óptica por fusión de alta precisión.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="text-gray-950 mt-1 shrink-0" size={18} />
                    <p className="text-sm text-gray-700 font-bold">Despliegue de redes LAN/WAN, GPON y Wireless de alta densidad.</p>
                  </div>
                </div>
              </div>

              {/* COLUMNA DERECHA (Servicios 2 y 3 Apilados) */}
              <div className="flex flex-col gap-8">
                
                {/* SERVICIO 2: Data Center */}
                <div className="bg-white p-10 md:p-12 border border-gray-200 shadow-sm hover:shadow-md transition-shadow flex-1">
                  <div className="w-12 h-12 bg-gray-100 rounded-none flex items-center justify-center mb-6 border border-gray-200">
                    <Server className="text-gray-950" size={24} strokeWidth={1.5} />
                  </div>
                  <h3 className="text-2xl font-black text-gray-950 tracking-tight mb-3">
                    Centros de Datos y Racks
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed mb-6 font-medium">
                    Centralización y protección de su información crítica. Instalamos gabinetes de comunicaciones, servidores físicos y sistemas de energía ininterrumpida (UPS).
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2 text-sm text-gray-700 font-bold"><Check size={16} className="text-gray-400"/> Peinado y ordenamiento de Patch Panels.</li>
                    <li className="flex items-center gap-2 text-sm text-gray-700 font-bold"><Check size={16} className="text-gray-400"/> Virtualización de servidores operativos.</li>
                  </ul>
                </div>

                {/* SERVICIO 3: Ciberseguridad */}
                <div className="bg-gray-950 p-10 md:p-12 border border-gray-800 shadow-sm hover:shadow-md transition-shadow flex-1">
                  <div className="w-12 h-12 bg-gray-800 rounded-none flex items-center justify-center mb-6">
                    <ShieldCheck className="text-white" size={24} strokeWidth={1.5} />
                  </div>
                  <h3 className="text-2xl font-black text-white tracking-tight mb-3">
                    Seguridad y Soporte TI
                  </h3>
                  <p className="text-sm text-gray-400 leading-relaxed mb-6 font-medium">
                    Implementamos firewalls perimetrales y políticas de acceso restrictivo. Brindamos soporte técnico Help Desk para mantener la operatividad de sus usuarios.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2 text-sm text-gray-300 font-bold"><Check size={16} className="text-gray-600"/> Configuración de Firewalls Corporativos.</li>
                    <li className="flex items-center gap-2 text-sm text-gray-300 font-bold"><Check size={16} className="text-gray-600"/> Mantenimiento preventivo y correctivo.</li>
                  </ul>
                </div>

              </div>
            </div>

          </div>
        </section>

        {/* 4. BLOQUE DE METODOLOGÍA (Proceso de Trabajo B2B) */}
        <section className="py-24 bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-black text-gray-950 tracking-tight mb-4">Metodología de Implementación</h2>
              <p className="text-lg text-gray-600 font-medium">Cómo abordamos cada proyecto para garantizar resultados precisos.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 divide-y md:divide-y-0 md:divide-x divide-gray-200">
              <div className="p-6 md:p-8 text-center md:text-left">
                <FileText className="text-gray-300 mb-6 mx-auto md:mx-0" size={40} strokeWidth={1} />
                <h4 className="text-xl font-bold text-gray-950 mb-3">1. Levantamiento</h4>
                <p className="text-sm text-gray-600 font-medium leading-relaxed">Auditoría en sitio. Evaluamos planos, infraestructura actual y necesidades reales de ancho de banda y seguridad de su empresa.</p>
              </div>
              <div className="p-6 md:p-8 text-center md:text-left">
                <Wrench className="text-gray-300 mb-6 mx-auto md:mx-0" size={40} strokeWidth={1} />
                <h4 className="text-xl font-bold text-gray-950 mb-3">2. Ejecución</h4>
                <p className="text-sm text-gray-600 font-medium leading-relaxed">Instalación bajo cronograma estricto. Uso de materiales normados y mano de obra calificada para evitar interrupciones operativas.</p>
              </div>
              <div className="p-6 md:p-8 text-center md:text-left">
                <ShieldCheck className="text-gray-300 mb-6 mx-auto md:mx-0" size={40} strokeWidth={1} />
                <h4 className="text-xl font-bold text-gray-950 mb-3">3. Certificación</h4>
                <p className="text-sm text-gray-600 font-medium leading-relaxed">Pruebas de estrés y certificación de puntos. Entrega de dossier de calidad, planos As-Built y garantías documentadas.</p>
              </div>
            </div>
          </div>
        </section>

        {/* 5. CALL TO ACTION FINAL (Barra Inferior de Acción) */}
        <section className="bg-gray-50 py-16 border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <h2 className="text-2xl font-black text-gray-950 tracking-tight mb-2">Inicie la optimización de su red hoy.</h2>
              <p className="text-gray-600 font-medium">Agende una visita técnica o solicite una cotización preliminar.</p>
            </div>
            <Link 
              href="/contacto" 
              className="w-full md:w-auto flex items-center justify-center gap-2 bg-gray-950 text-white px-8 py-4 font-bold tracking-widest uppercase hover:bg-gray-800 transition-colors shrink-0"
            >
              Contactar a Ingeniería <ArrowRight size={18} />
            </Link>
          </div>
        </section>

      </main>
    </div>
  );
}