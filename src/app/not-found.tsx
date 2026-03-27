import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <main className="relative h-screen w-full flex items-center justify-center">
      {/* OJO: Aquí estoy usando tu misma imagen del Home de fondo para mantener 
        la coherencia. Si tienes otra foto de infraestructura que quieras usar, 
        solo cambia el src.
      */}
      <Image
        src="/heronetworks.jpg"
        alt="Página no encontrada"
        fill
        className="object-cover opacity-20 grayscale pointer-events-none"
        priority
      />
      
      {/* Capa de color oscuro por encima de la imagen */}
      <div className="absolute inset-0 bg-gray-950/80 -z-10" />

      <div className="relative z-10 text-center px-4">
        <p className="text-base font-semibold text-[#1A73E8] tracking-widest uppercase mb-4">
          Error 404
        </p>
        <h1 className="mt-4 text-5xl font-black tracking-tight text-white sm:text-7xl mb-6">
          Página no encontrada
        </h1>
        <p className="mt-6 text-lg font-medium text-gray-400 sm:text-xl max-w-lg mx-auto mb-10 text-balance">
          Lo sentimos, no pudimos encontrar la ruta que está buscando. Es posible que haya sido movida o eliminada.
        </p>
        
        <div className="flex justify-center">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm font-semibold text-white hover:text-[#1A73E8] transition-colors group"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            Volver al Inicio
          </Link>
        </div>
      </div>
    </main>
  );
}