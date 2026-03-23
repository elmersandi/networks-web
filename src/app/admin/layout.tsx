"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, Tags, Wrench, Users, Settings, LogOut } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const menu = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/admin" },
    { name: "Inventario", icon: Package, path: "/admin/inventario" },
    { name: "Categorías", icon: Tags, path: "/admin/categorias" },
    { name: "Servicios", icon: Wrench, path: "/admin/servicios" },
    { name: "Prospectos", icon: Users, path: "/admin/prospectos" },
    { name: "Ajustes", icon: Settings, path: "/admin/ajustes" },
  ];

  return (
    // Aquí usamos un div normal, porque el <html> y <body> ya los pone el RootLayout
    <div className="flex h-screen bg-gray-50 text-gray-900">

      {/* SIDEBAR CORPORATIVO: Negro profundo (neutral-950) */}
      <aside className="w-64 bg-neutral-950 text-neutral-300 flex flex-col shadow-xl z-10">
        <div className="p-6 border-b border-neutral-800">
          {/* Título con colores corporativos universales sólidos (Cero brillo) */}
          <h1 className="text-2xl font-extrabold tracking-tight flex items-center gap-1">
            <span className="text-[#1A73E8]">Networks</span> {/* Azul corporativo estándar */}
            <span className="text-[#E65C00]">Perú</span> {/* Naranja sólido y mate */}
          </h1>
          {/* Subtítulo oficial */}
          <p className="text-[10px] font-bold text-neutral-500 mt-1.5 tracking-widest uppercase">
            Panel Administrativo
          </p>
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {menu.map((item) => {
            const activo = pathname === item.path;
            return (
              <Link key={item.name} href={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors
                  ${activo
                    ? "bg-blue-600 text-white shadow-sm"
                    : "hover:bg-neutral-800 hover:text-white"
                  }`}
              >
                <item.icon size={18} className={activo ? "text-white" : "text-neutral-400"} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-neutral-800">
          <button className="flex items-center gap-3 px-3 py-2 w-full rounded-md text-sm font-medium text-red-400 hover:bg-neutral-800 hover:text-red-300 transition-colors">
            <LogOut size={18} />
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* ÁREA PRINCIPAL */}
      <main className="flex-1 overflow-y-auto p-8">
        {children}
      </main>
    </div>
  );
}