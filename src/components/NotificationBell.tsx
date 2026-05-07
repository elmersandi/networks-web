'use client';

import { useState, useEffect, useRef } from 'react';
import { Bell, FileText, DollarSign, Wrench, Info, CheckCheck } from 'lucide-react';
import Link from 'next/link';

// Interfaz para saber que forma tiene la notificacion que viene de la BD
interface Notificacion {
  id: string;
  titulo: string;
  mensaje: string;
  leido: boolean;
  tipo: string;
  enlace: string | null;
  createdAt: string;
}

export default function NotificationBell() {
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const menuRef = useRef<HTMLDivElement>(null);

  // BLOQUE 1: OBTENER DATOS AL CARGAR
  useEffect(() => {
    const fetchNotificaciones = async () => {
      try {
        const res = await fetch('/api/notificaciones');
        if (res.ok) {
          const data = await res.json();
          setNotificaciones(data);
          // Contamos cuantas tienen leido === false
          const noLeidas = data.filter((n: Notificacion) => !n.leido).length;
          setUnreadCount(noLeidas);
        }
      } catch (error) {
        console.error("Error obteniendo notificaciones", error);
      }
    };

    fetchNotificaciones();
    // Opcional: configurar un setInterval aqui si quieres que se actualice cada X minutos automaticamente
  }, []);

  // BLOQUE 2: CERRAR MENU AL HACER CLIC AFUERA
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // BLOQUE 3: MARCAR COMO LEIDAS AL ABRIR EL MENU
  const handleToggleMenu = async () => {
    const nuevoEstado = !isOpen;
    setIsOpen(nuevoEstado);

    // Si habia notificaciones sin leer y abrimos el menu, las marcamos como leidas en la BD
    if (nuevoEstado && unreadCount > 0) {
      setUnreadCount(0); // Actualizamos visualmente al instante
      
      // Actualizamos sus datos visuales para quitarles el color de "no leido"
      setNotificaciones(prev => prev.map(n => ({ ...n, leido: true })));

      try {
        await fetch('/api/notificaciones', { method: 'PATCH' });
      } catch (error) {
        console.error("Error al marcar como leidas");
      }
    }
  };

  // BLOQUE 4: SELECCIONAR ICONO SEGUN EL TIPO
  const getIcono = (tipo: string) => {
    switch (tipo) {
      case 'COTIZACION': return <FileText className="text-blue-500" size={18} />;
      case 'VENTA': return <DollarSign className="text-emerald-500" size={18} />;
      case 'SOPORTE': return <Wrench className="text-amber-500" size={18} />;
      default: return <Info className="text-slate-500" size={18} />;
    }
  };

  return (
    <div className="relative" ref={menuRef}>
      {/* BOTON DE LA CAMPANA */}
      <button 
        onClick={handleToggleMenu}
        className="relative p-2 text-slate-500 dark:text-neutral-400 hover:bg-slate-100 dark:hover:bg-neutral-800 rounded-full transition-colors focus:outline-none"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white shadow-sm ring-2 ring-white dark:ring-neutral-950">
            {unreadCount > 9 ? '+9' : unreadCount}
          </span>
        )}
      </button>

      {/* PANEL DESPLEGABLE */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-neutral-900 rounded-2xl shadow-xl border border-slate-200 dark:border-neutral-800 z-50 overflow-hidden">
          
          <div className="p-4 border-b border-slate-100 dark:border-neutral-800 flex items-center justify-between bg-slate-50 dark:bg-neutral-950">
            <h3 className="font-bold text-slate-800 dark:text-white text-sm flex items-center gap-2">
              <Bell size={16} className="text-blue-600" /> Notificaciones
            </h3>
            <span className="text-[10px] text-slate-500 font-medium flex items-center gap-1">
              <CheckCheck size={12} /> Al dia
            </span>
          </div>

          <div className="max-h-[400px] overflow-y-auto">
            {notificaciones.length === 0 ? (
              <div className="p-8 text-center text-sm text-slate-500 dark:text-neutral-500">
                No tienes notificaciones recientes.
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-neutral-800">
                {notificaciones.map((notif) => (
                  <Link 
                    key={notif.id} 
                    href={notif.enlace || '#'}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-start gap-3 p-4 hover:bg-slate-50 dark:hover:bg-neutral-800/50 transition-colors ${!notif.leido ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}
                  >
                    <div className="mt-0.5 bg-white dark:bg-neutral-800 p-2 rounded-full shadow-sm border border-slate-100 dark:border-neutral-700">
                      {getIcono(notif.tipo)}
                    </div>
                    <div>
                      <p className={`text-sm ${!notif.leido ? 'font-bold text-slate-900 dark:text-white' : 'font-medium text-slate-700 dark:text-neutral-300'}`}>
                        {notif.titulo}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-neutral-400 mt-0.5 leading-relaxed">
                        {notif.mensaje}
                      </p>
                      <p className="text-[10px] text-slate-400 dark:text-neutral-500 mt-2 font-medium">
                        {new Date(notif.createdAt).toLocaleDateString()} a las {new Date(notif.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
          
        </div>
      )}
    </div>
  );
}