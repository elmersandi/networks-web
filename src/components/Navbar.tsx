// Archivo: src/components/Navbar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

const navigation = [
  { name: 'Inicio', href: '/' },
  { name: 'Servicios', href: '/servicios' },
  { name: 'Productos', href: '/productos' },
  { name: 'La Empresa', href: '/nosotros' },
  { name: 'Contacto', href: '/contacto' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-16">
          
          {/* LOGO */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center gap-1">
              <span className="text-xl font-black tracking-tight text-[#1A73E8]">Networks</span>
              <span className="text-xl font-black tracking-tight text-[#E65C00]">Perú</span>
            </Link>
          </div>

          {/* MENÚ DE ESCRITORIO */}
          <div className="hidden md:flex h-full items-center space-x-8">
            {navigation.map((link) => {
              const isActive = pathname === link.href;
              
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`relative h-full flex items-center text-sm font-extrabold transition-colors ${
                    isActive ? 'text-[#1A73E8]' : 'text-gray-900 hover:text-[#1A73E8]'
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-[3px] bg-[#1A73E8] rounded-t-md"></span>
                  )}
                </Link>
              );
            })}
            
            {/* BOTÓN DE ADMINISTRACIÓN */}
            <div className="flex items-center h-full pl-6 border-l border-gray-300">
              <Link
                href="/admin"
                className="text-sm font-semibold text-gray-400 hover:text-gray-900 transition-colors"
              >
                Administración
              </Link>
            </div>
          </div>

          {/* BOTÓN MENÚ MÓVIL */}
          <div className="flex items-center md:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-900 hover:text-[#1A73E8] focus:outline-none"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* MENÚ DESPLEGABLE MÓVIL */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 shadow-xl">
          <div className="px-4 pt-2 pb-6 space-y-1">
            {navigation.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-3 py-3 rounded-md text-base font-extrabold ${
                    isActive
                      ? 'bg-[#1A73E8]/10 text-[#1A73E8] border-l-4 border-[#1A73E8]'
                      : 'text-gray-900 hover:bg-gray-50 hover:text-[#1A73E8]'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-3 mt-4 text-base font-semibold text-gray-400 hover:bg-gray-50 hover:text-gray-900"
            >
              Administración
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}