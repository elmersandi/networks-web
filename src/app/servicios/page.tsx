'use client';

import React from 'react';
import { 
  Network, 
  Server, 
  ShieldAlert, 
  Cctv, 
  Cpu, 
  Wifi, 
  CheckCircle2, 
  ArrowRight,
  Headset
} from 'lucide-react';
import Link from 'next/link';
import Navbar from '@/src/components/Navbar';

// BLOQUE 1: ESTRUCTURA DE DATOS DE SERVICIOS
// Definimos los servicios principales que ofrece Networks Perú.
const servicios = [
  {
    id: 's1',
    titulo: 'Infraestructura de Redes',
    descripcion: 'Diseño e implementación de cableado estructurado, fibra óptica y certificación de puntos de red para empresas.',
    icon: Network,
    detalles: ['Cableado Cat 6 y 6A', 'Fibra Óptica OM3/OM4', 'Certificación Fluke']
  },
  {
    id: 's2',
    titulo: 'Soluciones Datacenter',
    descripcion: 'Montaje de racks, configuración de servidores, virtualización y sistemas de almacenamiento masivo (NAS/SAN).',
    icon: Server,
    detalles: ['Virtualización Proxmox/VMware', 'Gestión de Almacenamiento', 'Sistemas UPS']
  },
  {
    id: 's3',
    titulo: 'Ciberseguridad Perimetral',
    descripcion: 'Protección de datos mediante firewalls avanzados, VPNs seguras y políticas de control de acceso.',
    icon: ShieldAlert,
    detalles: ['Firewalls Fortinet/pfSense', 'VPN Corporativas', 'Auditoría de Red']
  },
  {
    id: 's4',
    titulo: 'Sistemas de Videovigilancia',
    descripcion: 'Instalación de cámaras IP de alta resolución con analítica de video y monitoreo remoto centralizado.',
    icon: Cctv,
    detalles: ['Cámaras Térmicas', 'Reconocimiento Facial', 'Grabación en Nube']
  },
  {
    id: 's5',
    titulo: 'Mantenimiento Preventivo',
    descripcion: 'Planes de soporte técnico programado para garantizar que su hardware opere siempre al 100%.',
    icon: Cpu,
    detalles: ['Limpieza de Hardware', 'Optimización de SO', 'Soporte 24/7']
  },
  {
    id: 's6',
    titulo: 'Soluciones Inalámbricas',
    descripcion: 'Implementación de redes Wi-Fi de alta densidad para oficinas, hoteles y plantas industriales.',
    icon: Wifi,
    detalles: ['Redes Mesh', 'Controladoras Wi-Fi', 'Estudios de Cobertura']
  }
];

export default function ServiciosPage() {
  return (
    <>
      <Navbar />
      
      <main className="bg-white min-h-screen pt-28 pb-20 font-sans">
        
        {/* BLOQUE 2: HERO SECTION (CABECERA) */}
        {/* Basado en tu captura, usamos tipografía pesada y un diseño limpio. */}
        <section className="max-w-7xl mx-auto px-6 md:px-12 mb-20">
          <span className="text-blue-600 font-black text-xs uppercase tracking-[0.3em] mb-4 block">
            Catálogo de Servicios Integrales
          </span>
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 leading-[1.1] mb-8 max-w-4xl">
            Infraestructura tecnológica diseñada para la continuidad operativa.
          </h1>
          <p className="text-lg md:text-xl text-slate-500 max-w-3xl leading-relaxed font-medium">
            Desarrollamos ecosistemas de red robustos, centros de datos escalables y políticas de seguridad perimetral para empresas que no pueden permitirse tiempos de inactividad en la Amazonía.
          </p>
        </section>

        {/* BLOQUE 3: GRILLA DE SERVICIOS (RESPONSIVA) */}
        {/* 1 col en movil, 2 en tablet, 3 en escritorio. */}
        <section className="max-w-7xl mx-auto px-4 md:px-12 mb-32">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {servicios.map((servicio) => (
              <div 
                key={servicio.id} 
                className="group bg-slate-50 border border-slate-100 p-10 rounded-[2.5rem] hover:bg-white hover:shadow-2xl hover:shadow-blue-600/10 hover:-translate-y-2 transition-all duration-500 cursor-default"
              >
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-8 shadow-sm group-hover:bg-blue-600 transition-colors duration-500">
                  <servicio.icon size={28} className="text-blue-600 group-hover:text-white transition-colors" />
                </div>
                
                <h3 className="text-2xl font-black text-slate-900 mb-4">{servicio.titulo}</h3>
                <p className="text-slate-500 font-medium leading-relaxed mb-8 text-sm">
                  {servicio.descripcion}
                </p>

                <ul className="space-y-3">
                  {servicio.detalles.map((detalle, idx) => (
                    <li key={idx} className="flex items-center gap-3 text-xs font-bold text-slate-700">
                      <CheckCircle2 size={16} className="text-blue-600" />
                      {detalle}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* BLOQUE 4: SECCION DE CONFIANZA (DIFERENCIADORES) */}
        <section className="bg-slate-900 py-24">
          <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-5xl font-black text-white leading-tight mb-8">
                Expertos en tecnología con despliegue regional.
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <p className="text-4xl font-black text-blue-500">100%</p>
                  <p className="text-white font-bold text-sm">Disponibilidad de Servicio</p>
                </div>
                <div className="space-y-2">
                  <p className="text-4xl font-black text-blue-500">+150</p>
                  <p className="text-white font-bold text-sm">Proyectos Ejecutados</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white/5 backdrop-blur-lg border border-white/10 p-10 rounded-[3rem]">
              <h4 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                <Headset className="text-blue-500" /> Soporte Especializado
              </h4>
              <p className="text-slate-400 font-medium mb-8">
                Contamos con personal certificado en Iquitos y Trujillo para atención inmediata en sitio. Reducimos el tiempo de respuesta ante fallos críticos de infraestructura.
              </p>
              <Link 
                href="/contacto" 
                className="inline-flex items-center gap-3 bg-blue-600 text-white font-black px-8 py-4 rounded-2xl hover:bg-blue-700 transition-all active:scale-95"
              >
                Solicitar Diagnóstico <ArrowRight size={20} />
              </Link>
            </div>
          </div>
        </section>

      </main>
    </>
  );
}