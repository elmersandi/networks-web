// Archivo: src/app/nosotros/page.tsx
import Navbar from "../../components/Navbar";
import { Target, Eye, MapPin, ShieldCheck, Award, Zap, Building2 } from "lucide-react";

export default function NosotrosPage() {
  return (
    <div className="min-h-screen bg-white font-sans selection:bg-gray-900 selection:text-white">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-24 md:py-32">
        
        {/* TÍTULO PRINCIPAL (Sobrio y directo) */}
        <div className="mb-16 md:mb-24">
          <h1 className="text-5xl md:text-7xl font-black text-black tracking-tighter mb-6 leading-tight">
            Más que cables. <br className="hidden md:block" />
            Socios estratégicos.
          </h1>
          <p className="text-xl text-gray-500 max-w-2xl font-medium leading-relaxed">
            Conoce el ADN de Networks & Systems Perú EIRL. Operamos desde Loreto con estándares de ingeniería de clase mundial.
          </p>
        </div>

        {/* ESTRUCTURA BENTO FLAT (Sin sombras raras, solo bordes y contraste) */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 auto-rows-[minmax(220px,auto)]">
          
          {/* MISIÓN (Bloque Oscuro) */}
          <div className="md:col-span-2 md:row-span-2 bg-[#0a0a0a] rounded-2xl p-10 md:p-12 flex flex-col justify-center">
            <Target className="text-white mb-8" size={40} strokeWidth={1.5} />
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-4">
              Nuestra Misión
            </h2>
            <p className="text-gray-400 text-lg leading-relaxed font-medium">
              Proveer soluciones integrales e innovadoras en telecomunicaciones y TI. Nos comprometemos a entregar infraestructura sólida, segura y escalable que optimice los procesos de nuestros clientes, respaldada por ingeniería real y vocación de servicio B2B.
            </p>
          </div>

          {/* VISIÓN (Bloque Claro) */}
          <div className="md:col-span-2 md:row-span-1 bg-white border border-gray-200 rounded-2xl p-10 flex flex-col justify-center">
            <Eye className="text-black mb-6" size={32} strokeWidth={1.5} />
            <h2 className="text-2xl font-bold text-black tracking-tight mb-2">Nuestra Visión</h2>
            <p className="text-gray-600 font-medium leading-relaxed">
              Consolidarnos como el socio tecnológico líder en la Amazonía Peruana y a nivel nacional, impulsando la transformación digital de las empresas.
            </p>
          </div>

          {/* RUC (Bloque Claro) */}
          <div className="md:col-span-1 md:row-span-1 bg-white border border-gray-200 rounded-2xl p-8 flex flex-col justify-center">
            <Building2 className="text-black mb-5" size={28} strokeWidth={1.5} />
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Razón Social</p>
            <p className="text-lg font-bold text-black leading-tight mb-4">NETWORKS & SYSTEMS PERÚ E.I.R.L.</p>
            <div className="inline-block bg-gray-100 px-3 py-1.5 rounded-md text-sm font-bold text-gray-900 w-fit border border-gray-200">
              RUC: 20608774590
            </div>
          </div>

          {/* OPERACIONES (Bloque Claro) */}
          <div className="md:col-span-1 md:row-span-1 bg-white border border-gray-200 rounded-2xl p-8 flex flex-col justify-center">
            <MapPin className="text-black mb-5" size={28} strokeWidth={1.5} />
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Operaciones</p>
            <p className="text-2xl font-bold text-black leading-tight">Iquitos,<br/>Loreto, Perú</p>
          </div>

        </div>

        {/* VALORES CORPORATIVOS (Minimalista, blanco y negro) */}
        <div className="mt-32">
          <div className="flex items-center gap-4 mb-12">
            <Award className="text-black" size={32} strokeWidth={1.5} />
            <h3 className="text-3xl font-bold text-black tracking-tight">Nuestros Pilares Éticos</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 border-t border-gray-200 pt-12">
            <div>
              <ShieldCheck className="text-black mb-5" size={28} strokeWidth={1.5} />
              <h4 className="text-xl font-bold text-black mb-3">Integridad Técnica</h4>
              <p className="text-gray-600 font-medium leading-relaxed">Asesoramos con la verdad. No vendemos equipos innecesarios, implementamos lo que tu red realmente exige.</p>
            </div>
            <div>
              <Zap className="text-black mb-5" size={28} strokeWidth={1.5} />
              <h4 className="text-xl font-bold text-black mb-3">Innovación Continua</h4>
              <p className="text-gray-600 font-medium leading-relaxed">Nuestros ingenieros se capacitan constantemente en las últimas normativas de fibra y ciberseguridad.</p>
            </div>
            <div>
              <Target className="text-black mb-5" size={28} strokeWidth={1.5} />
              <h4 className="text-xl font-bold text-black mb-3">Excelencia Operativa</h4>
              <p className="text-gray-600 font-medium leading-relaxed">Cada empalme, cada rack y cada servidor se configura bajo estándares internacionales estrictos.</p>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}