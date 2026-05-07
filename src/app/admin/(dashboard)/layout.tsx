'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { signOut, SessionProvider, useSession } from 'next-auth/react';
import {
  LayoutDashboard, Package, Tags, Wrench, Users,
  ShoppingCart, Search, Menu, X, User, Settings, LogOut, ChevronDown, UserCog, Globe
} from 'lucide-react';

// BLOQUE 1: IMPORTACION DEL COMPONENTE DE NOTIFICACIONES
// Importamos la campana interactiva que se conectara a la base de datos
// para mostrar alertas en tiempo real al usuario.
import NotificationBell from '@/src/components/NotificationBell';

// BLOQUE 2: ESTRUCTURA DE NAVEGACION
// Definicion de los enlaces del menu lateral (sidebar), organizados por grupos funcionales.
const navItems = [
  { group: 'Menu', items: [{ name: 'Dashboard', href: '/admin', icon: LayoutDashboard }] },
  { group: 'Tienda Web', items: [
      { name: 'Inventario', href: '/admin/inventario', icon: Package },
      { name: 'Categorías', href: '/admin/categorias', icon: Tags },
  ]},
  { group: 'Operaciones', items: [
      { name: 'Servicios', href: '/admin/servicios', icon: Wrench },
      { name: 'Prospectos', href: '/admin/prospectos', icon: Users },
      { name: 'Pedidos', href: '/admin/pedidos', icon: ShoppingCart },
  ]},
  { group: 'Administración', items: [{ name: 'Personal', href: '/admin/usuarios', icon: UserCog }] },
];

function AdminDashboardInner({ children }: { children: React.ReactNode }) {
  // BLOQUE 3: ESTADOS LOCALES DEL LAYOUT
  // Controlan la apertura de menus desplegables (sidebar en movil y menu de usuario).
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const pathname = usePathname();
  const isActive = (href: string) => pathname === href;

  // BLOQUE 4: GESTION DE SESION
  // Obtenemos los datos del usuario logueado para mostrar su nombre e iniciales.
  const { data: session } = useSession();
  const nombreUsuario = session?.user?.name || "Cargando...";
  const iniciales = session?.user?.name ? session.user.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase() : "NP";

  return (
    <div className="h-screen w-full flex bg-slate-50 dark:bg-[#0a0a0a] text-slate-900 dark:text-neutral-200 antialiased overflow-hidden transition-colors">

      {/* BLOQUE 5: OVERLAY MOVIL */}
      {/* Fondo oscuro desenfocado que aparece detras del menu lateral en pantallas pequeñas */}
      {isMobileSidebarOpen && <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden" onClick={() => setIsMobileSidebarOpen(false)} />}

      {/* BLOQUE 6: BARRA LATERAL (SIDEBAR) */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-neutral-950 p-5 flex flex-col border-r border-slate-200 dark:border-neutral-800 transform transition-all duration-300 ease-in-out lg:translate-x-0 lg:static lg:block shrink-0 h-full ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between pb-6 mb-2 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white shadow-sm">N</div>
            <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">Networks<span className="text-blue-600 dark:text-blue-500">Perú</span></span>
          </div>
          <button onClick={() => setIsMobileSidebarOpen(false)} className="lg:hidden text-slate-400 hover:text-slate-900 dark:hover:text-white"><X size={20} /></button>
        </div>

        <nav className="flex-1 space-y-6 pt-2 overflow-y-auto pr-2 pb-4 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-200 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-700 hover:[&::-webkit-scrollbar-thumb]:bg-blue-500">
          {navItems.map((group) => (
            <div key={group.group} className="space-y-1.5">
              <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-neutral-500 px-3 mb-2">{group.group}</h2>
              {group.items.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link key={item.name} href={item.href} onClick={() => setIsMobileSidebarOpen(false)}
                    className={`flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all group ${active ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20' : 'text-slate-500 dark:text-neutral-400 hover:bg-slate-100 dark:hover:bg-neutral-900 hover:text-slate-900 dark:hover:text-white'}`}>
                    <item.icon size={18} className={`shrink-0 ${active ? 'text-white' : 'text-slate-400 dark:text-neutral-500 group-hover:text-slate-600 dark:group-hover:text-neutral-300'}`} />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>
      </aside>

      {/* BLOQUE 7: CONTENEDOR PRINCIPAL */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        
        {/* BLOQUE 8: CABECERA (HEADER) */}
        <header className="z-40 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-md border-b border-slate-200 dark:border-neutral-800 flex items-center justify-between p-4 px-6 shrink-0 h-[73px] transition-colors">
          <div className="flex items-center gap-4 flex-1">
            <button onClick={() => setIsMobileSidebarOpen(true)} className="lg:hidden text-slate-500 hover:text-slate-900 dark:hover:text-white p-1"><Menu size={22} /></button>
            <div className="relative w-full max-w-md hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input type="text" placeholder="Buscar..." className="w-full bg-slate-100 dark:bg-neutral-900 border-transparent p-2.5 pl-10 text-sm rounded-xl focus:bg-white dark:focus:bg-neutral-950 focus:border-blue-500 dark:focus:border-blue-500 focus:ring-1 focus:ring-blue-100 dark:focus:ring-blue-900/30 outline-none transition-all placeholder:text-slate-400 text-slate-700 dark:text-neutral-200" />
            </div>
          </div>

          {/* ACCIONES SUPERIORES */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            <Link href="/" target="_blank" className="flex items-center gap-2 p-2 px-3 text-sm font-bold text-slate-500 dark:text-neutral-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-colors">
              <Globe size={18} />
              <span className="hidden sm:inline">Ver Tienda</span>
            </Link>

            <div className="w-px h-6 bg-slate-200 dark:bg-neutral-800 mx-1"></div>

            {/* BLOQUE 9: COMPONENTE DE CAMPANA DINAMICO */}
            {/* Reemplazamos el boton estatico anterior por el componente interactivo */}
            <NotificationBell />

            {/* BLOQUE 10: MENU DE USUARIO Y PERFIL */}
            <div className="relative">
              <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="flex items-center gap-2.5 p-1.5 px-3 hover:bg-slate-100 dark:hover:bg-neutral-900 rounded-full transition-colors active:scale-95 border border-slate-200 dark:border-neutral-800">
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs">{iniciales}</div>
                <div className="text-left hidden md:block">
                  <p className="text-xs font-bold text-slate-900 dark:text-neutral-100 max-w-[120px] truncate">{nombreUsuario}</p>
                </div>
                <ChevronDown size={14} className={`text-slate-400 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
              </button>

              {isProfileOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setIsProfileOpen(false)}></div>
                  <div className="absolute right-0 top-full mt-2 z-20 w-56 bg-white dark:bg-neutral-900 border border-slate-100 dark:border-neutral-800 rounded-2xl shadow-xl p-2 animate-in fade-in zoom-in-95 duration-150 origin-top-right">
                    <Link href="/admin/perfil" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-3 p-2.5 text-sm rounded-lg text-slate-700 dark:text-neutral-300 hover:bg-slate-100 dark:hover:bg-neutral-800"><User size={16} className="text-slate-400" /> Mi Perfil</Link>
                    <Link href="/admin/ajustes" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-3 p-2.5 text-sm rounded-lg text-slate-700 dark:text-neutral-300 hover:bg-slate-100 dark:hover:bg-neutral-800"><Settings size={16} className="text-slate-400" /> Ajustes</Link>
                    <div className="border-t border-slate-100 dark:border-neutral-800 my-2"></div>
                    <button onClick={() => signOut({ callbackUrl: '/admin/login' })} className="flex items-center gap-3 w-full p-2.5 text-sm font-bold rounded-lg text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors">
                      <LogOut size={16} /> Cerrar Sesión
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* BLOQUE 11: AREA PRINCIPAL DE CONTENIDO */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-200 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-700 hover:[&::-webkit-scrollbar-thumb]:bg-blue-600 transition-colors">
          {children}
        </main>
      </div>
    </div>
  );
}

// BLOQUE 12: EXPORTACION DEL LAYOUT
// Envuelve toda la aplicacion del panel de control con el proveedor de sesion de NextAuth.
export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AdminDashboardInner>{children}</AdminDashboardInner>
    </SessionProvider>
  );
}