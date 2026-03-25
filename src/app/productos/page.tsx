// Archivo: src/app/productos/page.tsx
import Navbar from "../../components/Navbar";
import { Server, Router, Cable, Shield, Cpu, RadioReceiver, ArrowUpRight } from "lucide-react";

export default function ProductosPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] font-sans selection:bg-[#E65C00] selection:text-white">
      
      {/* NAVEGACIÓN UNIVERSAL */}
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-24 md:py-32">
        
        {/* CABECERA MODO OSCURO */}
        <div className="mb-20 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-300 text-sm font-bold uppercase tracking-widest mb-6">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Stock Corporativo
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-6">
            Hardware <br className="hidden md:block" />
            <span className="text-gray-500">Grado Industrial.</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl font-medium">
            Suministramos el equipamiento que sostiene la carga de trabajo de las empresas más exigentes. 
          </p>
        </div>

        {/* GRILLA "DARK GLASSMORPHISM" */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Producto 1 */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-md hover:bg-white/10 hover:border-white/20 transition-all duration-300 group cursor-pointer relative overflow-hidden flex flex-col h-full">
              <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowUpRight className="text-gray-400" size={24} />
              </div>
              <Server className="text-gray-300 group-hover:text-white transition-colors mb-8" size={48} strokeWidth={1} />
              <div className="flex-grow">
                <h2 className="text-2xl font-bold text-white mb-3">Servidores Datacenter</h2>
                <p className="text-gray-400 font-medium text-sm leading-relaxed mb-6">
                  Equipos rackeables y formato torre para virtualización, bases de datos SQL y almacenamiento masivo (NAS/SAN).
                </p>
              </div>
              <div className="pt-6 border-t border-white/10 mt-auto">
                <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">Catálogo Core</span>
              </div>
            </div>

            {/* Producto 2 */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-md hover:bg-white/10 hover:border-white/20 transition-all duration-300 group cursor-pointer relative overflow-hidden flex flex-col h-full">
              <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowUpRight className="text-gray-400" size={24} />
              </div>
              <Cable className="text-gray-300 group-hover:text-blue-400 transition-colors mb-8" size={48} strokeWidth={1} />
              <div className="flex-grow">
                <h2 className="text-2xl font-bold text-white mb-3">Fibra Óptica & Cobre</h2>
                <p className="text-gray-400 font-medium text-sm leading-relaxed mb-6">
                  Bobinas monomodo/multimodo, patch cords, cajas NAP, ODFs y cableado UTP Cat 6/6A para infraestructura certificada.
                </p>
              </div>
              <div className="pt-6 border-t border-white/10 mt-auto">
                <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">Infraestructura</span>
              </div>
            </div>

            {/* Producto 3 */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-md hover:bg-white/10 hover:border-white/20 transition-all duration-300 group cursor-pointer relative overflow-hidden flex flex-col h-full">
              <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowUpRight className="text-gray-400" size={24} />
              </div>
              <Router className="text-gray-300 group-hover:text-orange-400 transition-colors mb-8" size={48} strokeWidth={1} />
              <div className="flex-grow">
                <h2 className="text-2xl font-bold text-white mb-3">Networking Avanzado</h2>
                <p className="text-gray-400 font-medium text-sm leading-relaxed mb-6">
                  Switches gestionables L2/L3, routers empresariales y puntos de acceso Wi-Fi 6 de alta densidad para entornos corporativos.
                </p>
              </div>
              <div className="pt-6 border-t border-white/10 mt-auto">
                <span className="text-xs font-bold text-orange-400 uppercase tracking-widest">Conectividad</span>
              </div>
            </div>

            {/* Producto 4 */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-md hover:bg-white/10 hover:border-white/20 transition-all duration-300 group cursor-pointer relative overflow-hidden flex flex-col h-full">
              <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowUpRight className="text-gray-400" size={24} />
              </div>
              <Shield className="text-gray-300 group-hover:text-emerald-400 transition-colors mb-8" size={48} strokeWidth={1} />
              <div className="flex-grow">
                <h2 className="text-2xl font-bold text-white mb-3">Seguridad Perimetral</h2>
                <p className="text-gray-400 font-medium text-sm leading-relaxed mb-6">
                  Appliance de Firewalls (UTM/NGFW), licencias de protección contra intrusos y sistemas de videovigilancia IP.
                </p>
              </div>
              <div className="pt-6 border-t border-white/10 mt-auto">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Ciberseguridad</span>
              </div>
            </div>

            {/* Producto 5 */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-md hover:bg-white/10 hover:border-white/20 transition-all duration-300 group cursor-pointer relative overflow-hidden flex flex-col h-full">
              <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowUpRight className="text-gray-400" size={24} />
              </div>
              <Cpu className="text-gray-300 group-hover:text-white transition-colors mb-8" size={48} strokeWidth={1} />
              <div className="flex-grow">
                <h2 className="text-2xl font-bold text-white mb-3">Gabinetes y Racks</h2>
                <p className="text-gray-400 font-medium text-sm leading-relaxed mb-6">
                  Racks de piso, gabinetes de pared, organizadores horizontales/verticales, bandejas y PDU (Regletas de energía).
                </p>
              </div>
              <div className="pt-6 border-t border-white/10 mt-auto">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Estructuras</span>
              </div>
            </div>

            {/* Producto 6 */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-md hover:bg-white/10 hover:border-white/20 transition-all duration-300 group cursor-pointer relative overflow-hidden flex flex-col h-full">
              <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowUpRight className="text-gray-400" size={24} />
              </div>
              <RadioReceiver className="text-gray-300 group-hover:text-orange-400 transition-colors mb-8" size={48} strokeWidth={1} />
              <div className="flex-grow">
                <h2 className="text-2xl font-bold text-white mb-3">Enlaces Inalámbricos</h2>
                <p className="text-gray-400 font-medium text-sm leading-relaxed mb-6">
                  Antenas sectoriales, radios PtP y PtMP para transmisión de datos a largas distancias en zonas de difícil acceso.
                </p>
              </div>
              <div className="pt-6 border-t border-white/10 mt-auto">
                <span className="text-xs font-bold text-orange-400 uppercase tracking-widest">RF & Wireless</span>
              </div>
            </div>

        </div>
      </main>
    </div>
  );
}