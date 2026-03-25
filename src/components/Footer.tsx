// Archivo: src/components/Footer.tsx
import Link from "next/link";
import { MapPin, Phone, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#0a0a0a] text-gray-400 py-12 md:py-16 border-t border-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          {/* Columna 1: Marca y Descripción */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="inline-block mb-4">
              <span className="text-2xl font-black text-white tracking-tight">
                Networks <span className="text-gray-600">Perú</span>
              </span>
            </Link>
            <p className="text-sm font-medium leading-relaxed max-w-sm">
              Infraestructura sólida, segura y escalable. Soluciones integrales en telecomunicaciones y TI para la Amazonía Peruana y a nivel nacional.
            </p>
          </div>

          {/* Columna 2: Enlaces Rápidos */}
          <div>
            <h4 className="text-white font-bold tracking-widest uppercase text-xs mb-6">Navegación</h4>
            <ul className="space-y-4 text-sm font-medium">
              <li><Link href="/servicios" className="hover:text-white transition-colors">Servicios TI</Link></li>
              <li><Link href="/productos" className="hover:text-white transition-colors">Catálogo de Hardware</Link></li>
              <li><Link href="/nosotros" className="hover:text-white transition-colors">La Empresa</Link></li>
              <li><Link href="/contacto" className="hover:text-white transition-colors">Contacto B2B</Link></li>
              <li><Link href="/admin" className="text-gray-600 hover:text-white transition-colors">Portal Administrativo</Link></li>
            </ul>
          </div>

          {/* Columna 3: Información de Contacto Real */}
          <div>
            <h4 className="text-white font-bold tracking-widest uppercase text-xs mb-6">Contacto</h4>
            <ul className="space-y-4 text-sm font-medium">
              <li className="flex items-start gap-3">
                <MapPin size={16} className="mt-0.5 text-gray-500" />
                <span>Calle Abtao 1350<br/>Iquitos, Loreto</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={16} className="text-gray-500" />
                <span>993 370 797 / 984 470 583</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={16} className="text-gray-500" />
                <span>cotizaciones@networksperu.com</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Línea divisoria y Copyright */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-medium">
          <p>&copy; {new Date().getFullYear()} NETWORKS & SYSTEMS PERÚ E.I.R.L. RUC: 20608774590. Todos los derechos reservados.</p>
          <div className="flex gap-4 text-gray-500">
            <span className="hover:text-white cursor-pointer transition-colors">Términos de Servicio</span>
            <span className="hover:text-white cursor-pointer transition-colors">Política de Privacidad</span>
          </div>
        </div>

      </div>
    </footer>
  );
}