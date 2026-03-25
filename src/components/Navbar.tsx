// Archivo: src/components/Navbar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "./Logo"; // Usamos ruta relativa por si el alias está fallando

export default function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <nav className={`w-full z-50 transition-all duration-300 ${isHome ? "absolute top-0 bg-transparent" : "bg-gray-950 sticky top-0 shadow-md"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 md:h-24 flex items-center justify-between">
        
        <Link href="/" className={`px-3 py-2 rounded-lg transition-all ${isHome ? "bg-white/95 backdrop-blur-md shadow-sm" : "bg-white/10 backdrop-blur-md border border-white/10 hover:bg-white/20"}`}>
          <Logo textClassName="text-xl md:text-2xl" />
        </Link>
        
        <div className="hidden md:flex items-center gap-6 lg:gap-8 font-bold text-sm lg:text-base drop-shadow-md">
          <Link href="/servicios" className={`transition-colors ${pathname === "/servicios" ? "text-[#E65C00]" : "text-white hover:text-[#E65C00]"}`}>Servicios</Link>
          <Link href="/productos" className={`transition-colors ${pathname === "/productos" ? "text-[#E65C00]" : "text-white hover:text-[#E65C00]"}`}>Productos</Link>
          <Link href="/nosotros" className={`transition-colors ${pathname === "/nosotros" ? "text-[#E65C00]" : "text-white hover:text-[#E65C00]"}`}>La Empresa</Link>
          <Link href="/contacto" className={`transition-colors ${pathname === "/contacto" ? "text-[#E65C00]" : "text-white hover:text-[#E65C00]"}`}>Contacto</Link>
          <Link href="/admin" className="text-gray-400 hover:text-white transition-colors">Administración</Link>
        </div>

      </div>
    </nav>
  );
}