// Archivo: src/app/servicios/page.tsx
import Navbar from "../../components/Navbar";
import { Network, Server, ShieldCheck, ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function ServiciosPage() {
  return (
    <div className="min-h-screen bg-white font-sans selection:bg-[#1A73E8] selection:text-white">
      
      {/* NAVEGACIÓN UNIVERSAL */}
      <Navbar />

      {/* CABECERA MINIMALISTA Y PESADA */}
      <header className="bg-white pt-32 pb-16 md:pt-40 md:pb-24 border-b border-gray-100 relative overflow-hidden">
        {/* Efecto de luz de fondo sutil */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center relative z-10">
          <h1 className="text-5xl md:text-7xl font-black text-gray-950 tracking-tighter mb-6">
            Ingeniería que <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1A73E8] to-[#E65C00]">
              impulsa tu empresa.
            </span>
          </h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto font-medium leading-relaxed">
            No solo instalamos cables; diseñamos ecosistemas tecnológicos robustos para que tu operación en Loreto nunca se detenga.
          </p>
        </div>
      </header>

      <main className="flex flex-col">
        
        {/* SERVICIO 1: TEXTO IZQUIERDA / VISUAL DERECHA */}
        <section className="py-24 border-b border-gray-100 bg-white relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex flex-col lg:flex-row items-center gap-16">
              
              {/* Contenido (Izquierda) */}
              <div className="w-full lg:w-1/2 space-y-8">
                <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center border border-blue-100 shadow-sm">
                  <Network className="text-blue-600" size={32} />
                </div>
                <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">
                  Infraestructura de Redes y Fibra Óptica
                </h2>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Diseñamos e implementamos topologías de red escalables. Desde el tendido de fibra óptica hasta el cableado estructurado bajo normativas internacionales, garantizamos velocidades de transmisión sin cuellos de botella.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3 text-gray-700 font-medium">
                    <CheckCircle2 className="text-[#E65C00]" size={20} /> Certificación de puntos de red.
                  </li>
                  <li className="flex items-center gap-3 text-gray-700 font-medium">
                    <CheckCircle2 className="text-[#E65C00]" size={20} /> Empalmes de fibra óptica (Fusión).
                  </li>
                  <li className="flex items-center gap-3 text-gray-700 font-medium">
                    <CheckCircle2 className="text-[#E65C00]" size={20} /> Despliegue de redes GPON y Wireless.
                  </li>
                </ul>
              </div>

              {/* Visual (Derecha) - Simulando un esquema técnico */}
              <div className="w-full lg:w-1/2 relative h-[400px] bg-gray-50 rounded-3xl border border-gray-200 overflow-hidden group">
                {/* Cuadrícula de ingeniería */}
                <div className="absolute inset-0 bg-[linear-gradient(#e5e7eb_1px,transparent_1px),linear-gradient(90deg,#e5e7eb_1px,transparent_1px)] bg-[size:20px_20px] opacity-50"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-64 h-64 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-all duration-700"></div>
                  <Network className="text-blue-600 relative z-10 group-hover:scale-110 transition-transform duration-700 drop-shadow-2xl" size={120} strokeWidth={1} />
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* SERVICIO 2: VISUAL IZQUIERDA / TEXTO DERECHA (INVERTIDO) */}
        <section className="py-24 border-b border-gray-100 bg-gray-50 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex flex-col lg:flex-row-reverse items-center gap-16">
              
              {/* Contenido (Derecha) */}
              <div className="w-full lg:w-1/2 space-y-8">
                <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center border border-orange-100 shadow-sm">
                  <Server className="text-[#E65C00]" size={32} />
                </div>
                <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">
                  Centro de Datos y Servidores
                </h2>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Centralizamos tu información. Armamos e instalamos gabinetes de comunicaciones (Racks), configuramos servidores físicos y desplegamos sistemas de almacenamiento masivo y respaldos automatizados.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3 text-gray-700 font-medium">
                    <CheckCircle2 className="text-blue-600" size={20} /> Ordenamiento de Racks (Patch Panels).
                  </li>
                  <li className="flex items-center gap-3 text-gray-700 font-medium">
                    <CheckCircle2 className="text-blue-600" size={20} /> Virtualización de servidores (Proxmox/VMware).
                  </li>
                  <li className="flex items-center gap-3 text-gray-700 font-medium">
                    <CheckCircle2 className="text-blue-600" size={20} /> Sistemas de refrigeración y UPS.
                  </li>
                </ul>
              </div>

              {/* Visual (Izquierda) */}
              <div className="w-full lg:w-1/2 relative h-[400px] bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-sm group">
                <div className="absolute inset-0 bg-[linear-gradient(#e5e7eb_1px,transparent_1px),linear-gradient(90deg,#e5e7eb_1px,transparent_1px)] bg-[size:20px_20px] opacity-50"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-64 h-64 bg-orange-500/10 rounded-full blur-3xl group-hover:bg-orange-500/20 transition-all duration-700"></div>
                  <Server className="text-[#E65C00] relative z-10 group-hover:scale-110 transition-transform duration-700 drop-shadow-2xl" size={120} strokeWidth={1} />
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* SERVICIO 3: TEXTO IZQUIERDA / VISUAL DERECHA */}
        <section className="py-24 bg-white relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex flex-col lg:flex-row items-center gap-16">
              
              {/* Contenido (Izquierda) */}
              <div className="w-full lg:w-1/2 space-y-8">
                <div className="w-16 h-16 bg-gray-900 rounded-2xl flex items-center justify-center shadow-sm">
                  <ShieldCheck className="text-white" size={32} />
                </div>
                <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">
                  Ciberseguridad y Soporte TI
                </h2>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Tu red es tan fuerte como su eslabón más débil. Implementamos firewalls perimetrales, políticas de acceso restrictivo y brindamos soporte de mesa de ayuda (Help Desk) para mantener la operatividad de tus usuarios.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3 text-gray-700 font-medium">
                    <CheckCircle2 className="text-gray-900" size={20} /> Configuración de Firewalls (Fortinet/MikroTik).
                  </li>
                  <li className="flex items-center gap-3 text-gray-700 font-medium">
                    <CheckCircle2 className="text-gray-900" size={20} /> Auditoría de vulnerabilidades en la red local.
                  </li>
                  <li className="flex items-center gap-3 text-gray-700 font-medium">
                    <CheckCircle2 className="text-gray-900" size={20} /> Mantenimiento preventivo de hardware.
                  </li>
                </ul>
              </div>

              {/* Visual (Derecha) */}
              <div className="w-full lg:w-1/2 relative h-[400px] bg-gray-950 rounded-3xl overflow-hidden shadow-2xl group">
                {/* Estilo oscuro tipo terminal */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl group-hover:bg-emerald-500/20 transition-all duration-700"></div>
                  <ShieldCheck className="text-emerald-400 relative z-10 group-hover:scale-110 transition-transform duration-700 drop-shadow-[0_0_30px_rgba(52,211,153,0.3)]" size={120} strokeWidth={1} />
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* CALL TO ACTION FINAL */}
        <section className="py-20 bg-[#1A73E8]">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">¿Listo para modernizar tu infraestructura?</h2>
            <Link href="/contacto" className="inline-flex items-center justify-center gap-3 bg-white text-[#1A73E8] px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-50 transition-all shadow-xl active:scale-95 group">
              Solicitar Cotización <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </section>

      </main>
    </div>
  );
}