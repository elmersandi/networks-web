'use client'

import { useState, useEffect } from "react";
import Navbar from "../components/Navbar"; 
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowRight, CheckCircle, Shield, Server, Network, 
  MessageCircle, Zap, LucideIcon 
} from "lucide-react";

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
}

const SLIDES: Slide[] = [
  {
    title: "Conectividad Crítica para la Amazonía.",
    subtitle: "Infraestructura de red diseñada para resistir y rendir en los entornos más exigentes.",
    img: "/heronetworks.jpg" 
  },
  {
    title: "Ciberseguridad Nivel Corporativo.",
    subtitle: "Protegemos el ADN digital de su empresa con auditorías y blindaje perimetral.",
    img: "/ciberseguridad.jpg" 
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
    <div className="bg-[#F8FAFC] font-sans selection:bg-[#1D4ED8] selection:text-white overflow-x-hidden">
      <Navbar />

      {/* --- HERO SECTION --- */}
      <section className="relative h-[85vh] lg:h-screen min-h-[600px] w-full overflow-hidden bg-[#000000]">
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
              className="object-cover opacity-30 grayscale-[30%]"
              priority
            />
          </motion.div>
        </AnimatePresence>

        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/80 to-[#121212] md:bg-gradient-to-r md:from-black md:to-transparent z-10" />

        <div className="relative z-20 max-w-7xl mx-auto px-6 h-full flex flex-col justify-center items-center md:items-start text-center md:text-left">
          <motion.div 
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="max-w-4xl flex flex-col items-center md:items-start"
          >
            {/* Etiqueta centrada en móvil */}
            <div className="flex items-center gap-2 mb-6 px-3 py-1 bg-[#121212] border border-[#262626] rounded-full w-fit">
              <Zap size={12} className="text-[#1D4ED8]" />
              <span className="text-[#9CA3AF] text-[10px] font-bold uppercase tracking-widest">Operativa Iquitos 2026</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-[#F3F4F6] leading-[1.1] mb-6 tracking-tight">
              {SLIDES[currentSlide].title}
            </h1>
            
            <p className="text-base md:text-xl text-[#9CA3AF] mb-10 max-w-2xl leading-relaxed font-medium">
              {SLIDES[currentSlide].subtitle}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Link href="/contacto" className="bg-[#1D4ED8] hover:bg-[#1E40AF] text-white font-bold px-10 py-4 rounded-md transition-colors flex items-center justify-center gap-2 group text-sm md:text-base">
                COTIZAR AHORA <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/servicios" className="bg-transparent hover:bg-[#121212] text-[#F3F4F6] font-bold px-10 py-4 rounded-md border border-[#262626] transition-colors text-center text-sm md:text-base">
                NUESTROS SERVICIOS
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- SECCIÓN DE SERVICIOS --- */}
      <section className="py-20 bg-[#121212] border-y border-[#262626] px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-[#F3F4F6] mb-4 tracking-tight">Ingeniería de Redes.</h2>
            <div className="h-1 w-20 bg-[#1D4ED8] mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ServiceCard 
              icon={Network} 
              title="Cableado Estructurado" 
              desc="Certificación Fluke en Cat 6A y Fibra Óptica para empresas."
              points={["Certificación Oficial", "Peinado de Racks"]}
            />
            <ServiceCard 
              icon={Shield} 
              title="Seguridad de Datos" 
              desc="Blindaje perimetral y auditorías para prevenir ataques críticos."
              points={["Firewalls Fortinet", "VLANs Seguras"]}
            />
            <ServiceCard 
              icon={Server} 
              title="Soporte IT 24/7" 
              desc="Mantenimiento preventivo y mesa de ayuda local en Iquitos."
              points={["Atención en sitio", "Monitoreo Proactivo"]}
            />
          </div>
        </div>
      </section>

      {/* --- FORMULARIO --- */}
      <section className="py-20 bg-[#F8FAFC] px-6">
        <div className="max-w-5xl mx-auto">
          <div className="bg-[#FFFFFF] rounded-2xl border border-[#E2E8F0] overflow-hidden flex flex-col lg:flex-row shadow-sm">
            
            <div className="lg:w-1/2 p-10 md:p-16 flex flex-col justify-center bg-[#121212] text-center lg:text-left items-center lg:items-start">
              <h2 className="text-3xl font-bold text-[#F3F4F6] mb-6">¿Hablamos de su proyecto?</h2>
              <p className="text-[#9CA3AF] mb-8 text-sm md:text-base">Evaluación técnica sin costo adicional.</p>
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-[#F3F4F6] text-sm font-medium">
                  <CheckCircle size={18} className="text-[#16A34A]" /> Presupuesto en 24 horas.
                </div>
              </div>
            </div>

            <div className="lg:w-1/2 bg-[#FFFFFF] p-10 md:p-16">
              <form className="space-y-6">
                <div className="space-y-6">
                  <div>
                    <label className="text-xs font-bold text-[#64748B] uppercase tracking-widest block mb-2">Servicio</label>
                    <select className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-md py-3 px-4 text-sm outline-none focus:border-[#1D4ED8] font-medium text-[#0F172A]">
                      <option>Networking</option>
                      <option>Ciberseguridad</option>
                      <option>Fibra Óptica</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-[#64748B] uppercase tracking-widest block mb-2">WhatsApp</label>
                    <input type="tel" placeholder="999 888 777" className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-md py-3 px-4 text-sm outline-none focus:border-[#1D4ED8] font-medium text-[#0F172A]" />
                  </div>
                </div>
                <button type="button" className="w-full bg-[#1D4ED8] hover:bg-[#1E40AF] text-white font-bold py-4 rounded-md transition-all mt-4">
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
        className="fixed bottom-6 right-6 bg-[#16A34A] text-white p-4 rounded-full shadow-lg hover:scale-110 transition-transform z-50"
      >
        <MessageCircle size={24} />
      </Link>
    </div>
  );
}

function ServiceCard({ icon: Icon, title, desc, points }: ServiceCardProps) {
  return (
    <div className="p-8 bg-[#000000] border border-[#262626] rounded-xl hover:border-[#1D4ED8] transition-all flex flex-col items-center text-center group">
      <div className="mb-6 bg-[#121212] w-14 h-14 rounded-lg flex items-center justify-center border border-[#262626] group-hover:border-[#1D4ED8]/50 transition-colors">
        <Icon size={28} className="text-[#1D4ED8]" />
      </div>
      <h3 className="text-xl font-bold text-[#F3F4F6] mb-3">{title}</h3>
      <p className="text-[#9CA3AF] text-sm leading-relaxed mb-6">{desc}</p>
      <ul className="space-y-2">
        {points.map((p, i) => (
          <li key={i} className="flex items-center justify-center gap-2 text-[10px] font-bold uppercase text-[#F3F4F6]">
            <CheckCircle size={12} className="text-[#16A34A]" /> {p}
          </li>
        ))}
      </ul>
    </div>
  );
}