'use client';

import { useState, useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { signOut, SessionProvider, useSession } from 'next-auth/react';
import {
  LayoutDashboard, Package, Tags, Wrench, Users,
  ShoppingCart, Search, Menu, X, User, Settings, LogOut, ChevronDown, UserCog, Globe,
  FolderOpen, FileText, Briefcase, Loader2
} from 'lucide-react';

// =====================================================================
// BLOQUE 1: IMPORTACION DEL COMPONENTE DE NOTIFICACIONES
// =====================================================================
import NotificationBell from '@/src/components/NotificationBell';

// =====================================================================
// BLOQUE 2: ESTRUCTURA DE NAVEGACION (MENU LATERAL)
// =====================================================================
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

// Tipos estrictos para el buscador
interface ApiProducto { nombre: string; sku: string; }
interface ApiProspecto { nombre: string; empresa: string | null; }

function AdminDashboardInner({ children }: { children: React.ReactNode }) {
  // =====================================================================
  // BLOQUE 3: ESTADOS DEL LAYOUT Y NAVEGACIÓN
  // =====================================================================
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const isActive = (href: string) => pathname === href;

  // =====================================================================
  // BLOQUE 4: GESTION DE SESION
  // =====================================================================
  const { data: session } = useSession();
  const nombreUsuario = session?.user?.name || "Cargando...";
  const iniciales = session?.user?.name ? session.user.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase() : "NP";

  // =====================================================================
  // BLOQUE 5: RELOJ EN TIEMPO REAL (ZONA HORARIA PERÚ)
  // =====================================================================
  const [fechaHora, setFechaHora] = useState<string>('');
  
  useEffect(() => {
    const actualizarReloj = () => {
      const opciones: Intl.DateTimeFormatOptions = {
        timeZone: 'America/Lima',
        weekday: 'short', day: '2-digit', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true
      };
      let fechaString = new Date().toLocaleString('es-PE', opciones);
      fechaString = fechaString.charAt(0).toUpperCase() + fechaString.slice(1);
      setFechaHora(fechaString);
    };
    
    actualizarReloj(); 
    const intervalo = setInterval(actualizarReloj, 1000); 
    return () => clearInterval(intervalo);
  }, []);

  // =====================================================================
  // BLOQUE 6: MOTOR DE BÚSQUEDA INTELIGENTE CON AUTOCOMPLETADO
  // =====================================================================
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchResults, setSearchResults] = useState<{type: string, label: string, url: string}[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);

  // Cierra el buscador si hacemos clic afuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Lógica de filtrado dinámico al escribir (Fix de rendimiento aplicado aquí)
  useEffect(() => {
    // Ya no hacemos setState aquí si está vacío, solo abortamos.
    if (searchQuery.trim().length < 2) return;

    const buscarDatos = async () => {
      setIsSearching(true);
      setShowDropdown(true);
      const q = searchQuery.toLowerCase();

      // 1. Búsqueda en rutas internas
      const rutasEstaticas = [
        { type: 'Sección', label: 'Dashboard Principal', url: '/admin' },
        { type: 'Sección', label: 'Inventario (Productos)', url: '/admin/inventario' },
        { type: 'Sección', label: 'Categorías', url: '/admin/categorias' },
        { type: 'Sección', label: 'Servicios', url: '/admin/servicios' },
        { type: 'Sección', label: 'Prospectos (CRM)', url: '/admin/prospectos' },
        { type: 'Sección', label: 'Pedidos Web', url: '/admin/pedidos' },
        { type: 'Configuración', label: 'Personal y Usuarios', url: '/admin/usuarios' },
        { type: 'Configuración', label: 'Mi Perfil', url: '/admin/perfil' },
        { type: 'Configuración', label: 'Ajustes Generales', url: '/admin/ajustes' },
      ];
      let resultados = rutasEstaticas.filter(r => r.label.toLowerCase().includes(q));

      // 2. Búsqueda en Base de Datos
      try {
        const [resProd, resPros] = await Promise.all([
          fetch('/api/productos').then(r => r.json()).catch(() => []),
          fetch('/api/prospectos').then(r => r.json()).catch(() => [])
        ]);

        if (Array.isArray(resProd)) {
          const prodsFilt = resProd.filter((p: ApiProducto) => p.nombre.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q))
                                   .map((p: ApiProducto) => ({ type: 'Producto', label: `[${p.sku}] ${p.nombre}`, url: '/admin/inventario' }));
          resultados = [...resultados, ...prodsFilt];
        }
        if (Array.isArray(resPros)) {
          const prosFilt = resPros.filter((p: ApiProspecto) => p.nombre.toLowerCase().includes(q) || (p.empresa && p.empresa.toLowerCase().includes(q)))
                                   .map((p: ApiProspecto) => ({ type: 'Cliente/Lead', label: p.empresa || p.nombre, url: '/admin/prospectos' }));
          resultados = [...resultados, ...prosFilt];
        }
      } catch (e) { console.error("Error buscando:", e) }

      setSearchResults(resultados.slice(0, 8));
      setIsSearching(false);
    };

    const timeoutId = setTimeout(buscarDatos, 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const ejecutarBusqueda = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchResults.length > 0) {
      router.push(searchResults[0].url);
      setShowDropdown(false);
      setSearchQuery('');
    }
  };

  const seleccionarResultado = (url: string) => {
    router.push(url);
    setShowDropdown(false);
    setSearchQuery('');
  };

  // Manejador del input optimizado (El reset se hace aquí, no en el useEffect)
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    if (value.trim().length < 2) {
      setSearchResults([]);
      setShowDropdown(false);
    } else {
      setShowDropdown(true);
    }
  };

  return (
    <div className="admin-b2b h-screen w-full flex bg-[#F8FAFC] dark:bg-[#000000] text-[#0F172A] dark:text-[#F3F4F6] antialiased overflow-hidden transition-colors">

      {/* BLOQUE 7: OVERLAY MOVIL */}
      {isMobileSidebarOpen && <div className="fixed inset-0 z-50 bg-black/60 lg:hidden cursor-pointer" onClick={() => setIsMobileSidebarOpen(false)} />}

      {/* BLOQUE 8: BARRA LATERAL (SIDEBAR) */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#FFFFFF] dark:bg-[#121212] p-5 flex flex-col border-r border-[#E2E8F0] dark:border-[#262626] transform transition-all duration-300 ease-in-out lg:translate-x-0 lg:static lg:block shrink-0 h-full ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between pb-6 mb-2 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#1D4ED8] flex items-center justify-center font-bold text-white">N</div>
            <span className="text-xl font-extrabold tracking-tight text-[#0F172A] dark:text-[#F3F4F6]">Networks<span className="text-[#1D4ED8]">Perú</span></span>
          </div>
          <button onClick={() => setIsMobileSidebarOpen(false)} className="lg:hidden text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"><X size={20} /></button>
        </div>

        <nav className="flex-1 space-y-6 pt-2 overflow-y-auto pr-2 pb-4 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-200 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-700 hover:[&::-webkit-scrollbar-thumb]:bg-blue-500">
          {navItems.map((group) => (
            <div key={group.group} className="space-y-1.5">
              <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-neutral-500 px-3 mb-2">{group.group}</h2>
              {group.items.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link key={item.name} href={item.href} onClick={() => setIsMobileSidebarOpen(false)}
                    className={`flex items-center gap-3.5 px-3.5 py-2.5 rounded-lg text-sm font-semibold transition-all group cursor-pointer ${active ? 'bg-[#1D4ED8] text-white' : 'text-[#64748B] dark:text-[#9CA3AF] hover:bg-[#F8FAFC] dark:hover:bg-[#121212] hover:text-[#0F172A] dark:hover:text-[#F3F4F6]'}`}>
                    <item.icon size={18} className={`shrink-0 ${active ? 'text-white' : 'text-slate-400 dark:text-neutral-500 group-hover:text-slate-600 dark:group-hover:text-neutral-300'}`} />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>
      </aside>

      {/* BLOQUE 9: CONTENEDOR PRINCIPAL */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        
        {/* BLOQUE 10: CABECERA (HEADER) CON BUSCADOR DINÁMICO */}
        <header className="z-40 bg-[#FFFFFF] dark:bg-[#121212] border-b border-[#E2E8F0] dark:border-[#262626] flex items-center justify-between p-4 px-6 shrink-0 h-[73px] transition-colors gap-4">
          
          <div className="flex items-center gap-4 flex-1">
            <button onClick={() => setIsMobileSidebarOpen(true)} className="lg:hidden text-slate-500 hover:text-slate-900 dark:hover:text-white p-1 cursor-pointer"><Menu size={22} /></button>
            
            {/* COMPONENTE DE BÚSQUEDA */}
            <div className="relative w-full max-w-sm hidden sm:block" ref={searchRef}>
              <form onSubmit={ejecutarBusqueda} className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input 
                  type="text" 
                  placeholder="Buscar módulos, clientes, equipos..." 
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onFocus={() => searchQuery.length >= 2 && setShowDropdown(true)}
                  className="w-full bg-[#F8FAFC] dark:bg-[#1A1A1A] border border-[#E2E8F0] dark:border-[#262626] p-2 pl-9 text-xs rounded-lg outline-none transition-all placeholder:text-[#64748B] text-[#0F172A] dark:text-[#F3F4F6] focus:border-[#1D4ED8]" 
                />
              </form>

              {/* Menú Desplegable de Resultados */}
              {showDropdown && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-[#FFFFFF] dark:bg-[#121212] border border-[#E2E8F0] dark:border-[#262626] shadow-xl rounded-lg overflow-hidden z-50 max-h-80 overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-200">
                  {isSearching ? (
                    <div className="p-4 text-center text-xs text-[#64748B] flex items-center justify-center gap-2">
                      <Loader2 className="animate-spin" size={14}/> Buscando coincidencias...
                    </div>
                  ) : searchResults.length > 0 ? (
                    <div className="py-2">
                      {searchResults.map((res, index) => (
                        <div 
                          key={index} 
                          onClick={() => seleccionarResultado(res.url)}
                          className="px-4 py-2.5 hover:bg-[#F8FAFC] dark:hover:bg-[#1A1A1A] cursor-pointer flex items-center gap-3 transition-colors border-b border-[#E2E8F0] dark:border-[#262626] last:border-0"
                        >
                          <div className="p-1.5 rounded bg-blue-50 text-[#1D4ED8] dark:bg-blue-900/30 dark:text-blue-400">
                            {res.type === 'Sección' ? <FolderOpen size={14}/> : res.type === 'Producto' ? <Package size={14}/> : res.type === 'Cliente/Lead' ? <Briefcase size={14}/> : <FileText size={14}/>}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-[#0F172A] dark:text-[#F3F4F6]">{res.label}</p>
                            <p className="text-[10px] text-[#64748B] dark:text-[#9CA3AF] uppercase">{res.type}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 text-center text-xs text-[#64748B]">
                      No se encontraron resultados para &quot;{searchQuery}&quot;
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* ACCIONES SUPERIORES DERECHAS */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            
            {/* RELOJ EN TIEMPO REAL (COMPACTO) */}
            <div className="hidden xl:flex items-center text-[10px] font-bold tracking-wider text-[#64748B] dark:text-[#9CA3AF] bg-[#F8FAFC] dark:bg-[#1A1A1A] px-2.5 py-1.5 rounded-md border border-[#E2E8F0] dark:border-[#262626]">
              {fechaHora || "Cargando..."}
            </div>

            <Link href="/" target="_blank" className="flex items-center gap-1.5 p-1.5 px-2 text-xs font-bold text-[#64748B] dark:text-[#9CA3AF] hover:text-[#1D4ED8] hover:bg-[#F8FAFC] dark:hover:bg-[#121212] rounded-lg transition-colors cursor-pointer">
              <Globe size={16} />
              <span className="hidden sm:inline">Tienda</span>
            </Link>

            <div className="w-px h-5 bg-slate-200 dark:bg-neutral-800 mx-0.5"></div>

            {/* CAMPANA DE NOTIFICACIONES */}
            <div className="cursor-pointer hover:opacity-75 transition-opacity flex items-center justify-center">
              <NotificationBell />
            </div>

            {/* MENU DE USUARIO Y PERFIL */}
            <div className="relative ml-1">
              <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="flex items-center gap-2 p-1 hover:bg-[#F8FAFC] dark:hover:bg-[#121212] rounded-full transition-colors active:scale-95 cursor-pointer">
                <div className="w-8 h-8 rounded-full bg-[#1D4ED8] text-white flex items-center justify-center font-bold text-[11px] shadow-sm border border-blue-600">{iniciales}</div>
                <div className="text-left hidden md:block mr-1">
                  <p className="text-[11px] font-bold text-[#0F172A] dark:text-[#F3F4F6] max-w-[100px] truncate">{nombreUsuario}</p>
                </div>
                <ChevronDown size={14} className={`text-[#64748B] transition-transform ${isProfileOpen ? 'rotate-180' : ''} hidden sm:block`} />
              </button>

              {isProfileOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setIsProfileOpen(false)}></div>
                  <div className="absolute right-0 top-full mt-2 z-20 w-56 bg-[#FFFFFF] dark:bg-[#121212] border border-[#E2E8F0] dark:border-[#262626] rounded-xl p-2 animate-in fade-in zoom-in-95 duration-150 origin-top-right shadow-2xl">
                    <Link href="/admin/perfil" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-3 p-2.5 text-xs font-bold rounded-md text-[#64748B] dark:text-[#9CA3AF] hover:bg-[#F8FAFC] dark:hover:bg-[#1A1A1A] cursor-pointer transition-colors"><User size={15} /> Mi Perfil</Link>
                    <Link href="/admin/ajustes" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-3 p-2.5 text-xs font-bold rounded-md text-[#64748B] dark:text-[#9CA3AF] hover:bg-[#F8FAFC] dark:hover:bg-[#1A1A1A] cursor-pointer transition-colors"><Settings size={15} /> Ajustes Globales</Link>
                    <div className="border-t border-[#E2E8F0] dark:border-[#262626] my-1.5"></div>
                    <button onClick={() => signOut({ callbackUrl: '/admin/login' })} className="flex items-center gap-3 w-full p-2.5 text-xs font-bold rounded-md text-[#DC2626] hover:bg-red-50 dark:hover:bg-[#262626] transition-colors cursor-pointer">
                      <LogOut size={15} /> Cerrar Sesión
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* BLOQUE 11: AREA PRINCIPAL DE CONTENIDO */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-[#CBD5E1] dark:[&::-webkit-scrollbar-thumb]:bg-[#404040] hover:[&::-webkit-scrollbar-thumb]:bg-[#1D4ED8] transition-colors">
          {children}
        </main>
      </div>
    </div>
  );
}

// =====================================================================
// BLOQUE 12: EXPORTACION DEL LAYOUT
// =====================================================================
export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AdminDashboardInner>{children}</AdminDashboardInner>
    </SessionProvider>
  );
}