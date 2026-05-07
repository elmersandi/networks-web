'use client'

import { useState, useEffect } from "react";
import Navbar from "../components/Navbar"; 
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowRight, CheckCircle, Shield, Server, Network, 
  MessageCircle, FileText, ChevronRight, Zap, Globe, Users,
  LucideIcon 
} from "lucide-react";

// --- TIPADO ESTRICTO (PROHIBIDO 'ANY') ---
interface Slide {
  title: string;
  subtitle: string;
  img: string;
}

interface ServiceCardProps {
  icon: LucideIcon;
  title: string;
  desc: string;
  points: string[];
  color: string;
}

const SLIDES: Slide[] = [
  {
    title: "Conectividad Crítica para la Amazonía.",
    subtitle: "Infraestructura de red diseñada para resistir y rendir en los entornos más exigentes.",
    img: "/heronetworks.jpg" // Asegúrate de que este archivo esté en /public
  },
  {
    title: "Ciberseguridad Nivel Corporativo.",
    subtitle: "Protegemos el ADN digital de su empresa con auditorías y blindaje perimetral.",
    img: "/ciberseguridad.jpg" // Si no existe, cámbialo por heronetworks.jpg temporalmente
  }
];

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === SLIDES.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-[#f4f7ff] font-['Montserrat',sans-serif] selection:bg-[#0052CC] selection:text-white overflow-x-hidden">
      <Navbar />

      {/* --- HERO SECTION: ADAPTABLE A TODAS LAS PANTALLAS --- */}
      <section className="relative h-[85vh] lg:h-screen min-h-[600px] w-full overflow-hidden bg-[#000d1a]">
        <AnimatePresence mode="wait">
          <motion.div 
            key={currentSlide}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2 }}
            className="absolute inset-0"
          >
            <Image 
              src={SLIDES[currentSlide].img} 
              alt="Infraestructura" 
              fill 
              className="object-cover opacity-30 grayscale-[20%]"
              priority
            />
          </motion.div>
        </AnimatePresence>

        <div className="absolute inset-0 bg-gradient-to-r from-[#001a41] via-[#001a41]/80 to-transparent z-10" />

        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-8 h-full flex flex-col justify-center">
          <motion.div 
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="max-w-4xl"
          >
            <div className="flex items-center gap-2 mb-4 md:mb-6 px-3 py-1 bg-blue-600/20 border border-blue-500/30 rounded-full w-fit backdrop-blur-md">
              <Zap size={12} className="text-blue-400" />
              <span className="text-blue-100 text-[9px] md:text-[10px] font-bold uppercase tracking-widest">Operativa Iquitos 2026</span>
            </div>
            
            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-8xl font-black text-white leading-[1.1] mb-6 tracking-tighter text-balance">
              {SLIDES[currentSlide].title}
            </h1>
            
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-blue-100/70 mb-8 md:mb-12 max-w-2xl leading-relaxed font-medium text-pretty">
              {SLIDES[currentSlide].subtitle}
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/contacto" className="w-full sm:w-auto bg-[#0052CC] hover:bg-[#0041a3] text-white font-bold px-8 py-4 rounded-xl transition-all shadow-xl flex items-center justify-center gap-2 group text-sm md:text-base">
                COTIZAR AHORA <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/servicios" className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white font-bold px-8 py-4 rounded-xl backdrop-blur-md border border-white/20 transition-all text-center text-sm md:text-base">
                NUESTROS SERVICIOS
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- SECCIÓN DE SERVICIOS: GRID RESPONSIVO --- */}
      <section className="py-16 md:py-24 bg-[#001a41] text-white px-4 sm:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12 md:mb-20 text-center md:text-left">
            <h2 className="text-3xl md:text-5xl font-black mb-4 tracking-tight">Ingeniería de Redes.</h2>
            <div className="h-1.5 w-20 bg-blue-500 mx-auto md:mx-0"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
            <ServiceCard 
              icon={Network} 
              title="Cableado Estructurado" 
              desc="Certificación Fluke en Cat 6A y Fibra Óptica para empresas."
              points={["Certificación Oficial", "Peinado de Racks"]}
              color="border-blue-500"
            />
            <ServiceCard 
              icon={Shield} 
              title="Seguridad de Datos" 
              desc="Blindaje perimetral y auditorías para prevenir ataques críticos."
              points={["Firewalls Fortinet", "VLANs Seguras"]}
              color="border-orange-500"
            />
            <ServiceCard 
              icon={Server} 
              title="Soporte IT 24/7" 
              desc="Mantenimiento preventivo y mesa de ayuda local en Iquitos."
              points={["Atención en sitio", "Monitoreo Proactivo"]}
              color="border-white"
            />
          </div>
        </div>
      </section>

      {/* --- FORMULARIO: ADAPTABLE A TABLETS Y MÓVILES --- */}
      <section className="py-16 md:py-24 bg-white px-4 sm:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-[#001a41] rounded-3xl overflow-hidden shadow-2xl flex flex-col lg:flex-row">
            {/* Texto decorativo */}
            <div className="lg:w-1/2 p-8 md:p-16 flex flex-col justify-center bg-gradient-to-br from-[#001a41] to-[#002b6b]">
              <h2 className="text-3xl md:text-4xl font-black text-white mb-6 leading-tight">¿Hablamos de su próximo proyecto?</h2>
              <p className="text-blue-100/60 mb-8 text-sm md:text-base">Un especialista evaluará su requerimiento sin costo adicional.</p>
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-blue-100 text-xs md:text-sm font-bold">
                  <CheckCircle size={18} className="text-blue-400" /> Presupuesto en 24 horas.
                </div>
                <div className="flex items-center gap-3 text-blue-100 text-xs md:text-sm font-bold">
                  <CheckCircle size={18} className="text-blue-400" /> Garantía de satisfacción total.
                </div>
              </div>
            </div>

            {/* Campos del formulario */}
            <div className="lg:w-1/2 bg-white p-8 md:p-16">
              <form className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Servicio</label>
                    <select className="w-full border-b-2 border-slate-100 py-3 text-sm focus:border-blue-600 outline-none transition-all font-bold text-slate-900">
                      <option>Networking</option>
                      <option>Ciberseguridad</option>
                      <option>Fibra Óptica</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">WhatsApp</label>
                    <input type="tel" placeholder="999 888 777" className="w-full border-b-2 border-slate-100 py-3 text-sm focus:border-blue-600 outline-none transition-all font-bold text-slate-900 placeholder:text-slate-200" />
                  </div>
                </div>
                <button className="w-full bg-[#0052CC] text-white font-black py-5 rounded-2xl hover:bg-blue-700 transition-all shadow-lg active:scale-95 text-sm md:text-base">
                  ENVIAR SOLICITUD
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* --- WHATSAPP FLOAT --- */}
      <Link 
        href="https://wa.me/51993370797" 
        className="fixed bottom-6 right-6 md:bottom-10 md:right-10 bg-[#25D366] text-white p-3 md:p-4 rounded-full shadow-2xl hover:scale-110 transition-transform z-50 flex items-center justify-center group"
      >
        <MessageCircle size={28} className="md:w-8 md:h-8" />
      </Link>
    </div>
  );
}

// --- SUBCOMPONENTE DE SERVICIO (REUTILIZABLE) ---
function ServiceCard({ icon: Icon, title, desc, points, color }: ServiceCardProps) {
  return (
    <div className={`p-8 md:p-10 bg-white/5 border-t-4 ${color} rounded-br-[2.5rem] hover:bg-white/10 transition-all flex flex-col h-full`}>
      <div className="mb-6 text-blue-400">
        <Icon size={36} strokeWidth={1.5} />
      </div>
      <h3 className="text-xl md:text-2xl font-bold mb-3 tracking-tight">{title}</h3>
      <p className="text-blue-100/60 text-xs md:text-sm leading-relaxed mb-8 flex-grow">{desc}</p>
      <ul className="space-y-3">
        {points.map((p, i) => (
          <li key={i} className="flex items-center gap-2 text-[9px] md:text-[10px] font-bold uppercase text-blue-200">
            <CheckCircle size={12} className="text-blue-500" /> {p}
          </li>
        ))}
      </ul>
    </div>
  );
}