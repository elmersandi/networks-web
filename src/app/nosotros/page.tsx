// Archivo: src/app/nosotros/page.tsx
import Navbar from "../../components/Navbar";
import Image from "next/image";

const team = [
  {
    name: 'Ing. Carlos Mendoza',
    role: 'Gerente de Operaciones y Proyectos',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=600&auto=format&fit=crop', // Aumenté la resolución (w=600) para el formato grande
    bio: 'Especialista en infraestructura de fibra óptica con más de 10 años de experiencia en la Amazonía.',
  },
  {
    name: 'Ing. Luis Sánchez',
    role: 'Jefe de Ciberseguridad y Redes',
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=600&auto=format&fit=crop',
    bio: 'Certificado en Cisco (CCNA/CCNP) y Fortinet. Experto en auditorías de seguridad perimetral.',
  },
  {
    name: 'Téc. Jorge Ramírez',
    role: 'Líder de Soporte Técnico (Help Desk)',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=600&auto=format&fit=crop',
    bio: 'Encargado de la respuesta rápida en sitio para contingencias corporativas 24/7 en Iquitos.',
  },
]

export default function Nosotros() {
  return (
    <div className="font-sans selection:bg-[#1A73E8] selection:text-white">
      <Navbar />
      
      {/* CABECERA SIMPLE */}
      <div className="bg-[#0a0a0a] pt-32 pb-20 px-6 sm:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-6">La Empresa</h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto font-medium">Conozca al equipo de ingenieros y especialistas que garantizan la estabilidad de las comunicaciones en Loreto.</p>
        </div>
      </div>

      {/* SECCIÓN DEL EQUIPO (MODELO 2 - TAILWIND UI) */}
      <section className="py-24 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="mb-16 max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-black text-gray-950 tracking-tight mb-4">Ingeniería respaldada por talento local.</h2>
            <p className="text-lg text-gray-600 font-medium">No dependemos de terceros en Lima. Nuestro equipo núcleo está capacitado para resolver problemas críticos directamente en su sede.</p>
          </div>
          
          <div className="grid grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
            {team.map((person) => (
              <div key={person.name} className="group">
                {/* Contenedor de la Imagen (Formato Rectangular Vertical) */}
                <div className="relative w-full aspect-[3/4] mb-6 overflow-hidden bg-gray-100">
                  <Image 
                    src={person.image} 
                    alt={person.name} 
                    fill 
                    className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500" 
                  />
                </div>
                {/* Textos alineados a la izquierda y estructurados */}
                <h3 className="text-xl font-black text-gray-950">{person.name}</h3>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 mt-1">{person.role}</p>
                <p className="text-base text-gray-600 leading-relaxed font-medium">{person.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECCIÓN DE PILARES */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl font-black text-gray-950 tracking-tight mb-16 text-center">Nuestros Pilares Éticos</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-gray-200">
            <div className="px-6 py-4">
              <h3 className="text-lg font-bold text-gray-950 mb-3">Integridad Técnica</h3>
              <p className="text-sm text-gray-600 font-medium">Asesoramos con la verdad. No vendemos equipos innecesarios, implementamos lo que su red realmente exige.</p>
            </div>
            <div className="px-6 py-4">
              <h3 className="text-lg font-bold text-gray-950 mb-3">Innovación Continua</h3>
              <p className="text-sm text-gray-600 font-medium">Nuestros ingenieros se capacitan constantemente en las últimas normativas de fibra y ciberseguridad.</p>
            </div>
            <div className="px-6 py-4">
              <h3 className="text-lg font-bold text-gray-950 mb-3">Excelencia Operativa</h3>
              <p className="text-sm text-gray-600 font-medium">Cada empalme, cada rack y cada servidor se configura bajo estrictos estándares internacionales (ANSI/TIA).</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}