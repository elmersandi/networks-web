import Link from 'next/link';
import { LayoutDashboard, Server, Tags, Users, Wrench, Settings, LogOut } from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Menú Lateral (Sidebar) */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col hidden md:flex">
        {/* Cabecera del Sidebar */}
        <div className="h-20 flex items-center justify-center border-b border-slate-800">
          <div className="text-center">
            <h1 className="text-xl font-bold">N&S Panel Admin</h1>
            <p className="text-xs text-slate-400 mt-1">TELECOMUNICACIONES B2B</p>
          </div>
        </div>

        {/* Enlaces de Navegación */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          <Link href="/admin" className="flex items-center gap-3 px-3 py-2 text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg transition-colors">
            <LayoutDashboard size={20} />
            Dashboard
          </Link>
          <Link href="/admin/inventario" className="flex items-center gap-3 px-3 py-2 text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg transition-colors">
            <Server size={20} />
            Inventario
          </Link>
          <Link href="/admin/categorias" className="flex items-center gap-3 px-3 py-2 text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg transition-colors">
            <Tags size={20} />
            Categorías
          </Link>
          <Link href="/admin/servicios" className="flex items-center gap-3 px-3 py-2 text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg transition-colors">
            <Wrench size={20} />
            Servicios
          </Link>
          <Link href="/admin/prospectos" className="flex items-center gap-3 px-3 py-2 text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg transition-colors">
            <Users size={20} />
            Prospectos
          </Link>
          <Link href="/admin/ajustes" className="flex items-center gap-3 px-3 py-2 text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg transition-colors">
            <Settings size={20} />
            Ajustes
          </Link>
        </nav>

        {/* Botón de Salida */}
        <div className="p-4 border-t border-slate-800">
          <button className="flex w-full items-center gap-3 px-3 py-2 text-red-400 hover:bg-slate-800 hover:text-red-300 rounded-lg transition-colors">
            <LogOut size={20} />
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Área Principal de Contenido (Aquí cargará el page.tsx) */}
      <main className="flex-1 flex flex-col">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}