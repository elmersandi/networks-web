'use client';

import { useState, useMemo } from 'react';
import { Search, Filter, ShoppingCart, ChevronRight } from 'lucide-react';
// BLOQUE 0: IMPORTACION DEL NAVBAR (Asegúrate de que esta ruta sea correcta)
import Navbar from '@/src/components/Navbar'; 

// BLOQUE 1: INTERFACES Y DATOS DE PRUEBA
interface Subcategoria {
  id: string;
  nombre: string;
}

interface Categoria {
  id: string;
  nombre: string;
  subcategorias: Subcategoria[];
}

interface Producto {
  id: string;
  nombre: string;
  sku: string;
  precio: number;
  categoriaId: string;
  subcategoriaId: string;
  imagen: string;
  marca: string;
}

const categoriasMock: Categoria[] = [
  {
    id: 'c1', nombre: 'Redes y Conectividad',
    subcategorias: [
      { id: 's1', nombre: 'Switches' },
      { id: 's2', nombre: 'Routers' },
      { id: 's3', nombre: 'Cables UTP/Fibra' }
    ]
  },
  {
    id: 'c2', nombre: 'Servidores y Almacenamiento',
    subcategorias: [
      { id: 's4', nombre: 'Discos NAS' },
      { id: 's5', nombre: 'Memoria RAM ECC' }
    ]
  }
];

const productosMock: Producto[] = [
  { id: 'p1', nombre: 'Switch Cisco Catalyst 9200L', sku: 'C9200L-48P-4G', precio: 3450.00, categoriaId: 'c1', subcategoriaId: 's1', imagen: '', marca: 'Cisco' },
  { id: 'p2', nombre: 'Router Mikrotik CCR1009', sku: 'CCR1009-7G-1C', precio: 1850.00, categoriaId: 'c1', subcategoriaId: 's2', imagen: '', marca: 'Mikrotik' },
  { id: 'p3', nombre: 'Bobina Cable UTP Cat 6 LSZH', sku: 'UTP-C6-LSZH', precio: 450.00, categoriaId: 'c1', subcategoriaId: 's3', imagen: '', marca: 'CommScope' },
  { id: 'p4', nombre: 'Disco Duro WD Red Pro 8TB NAS', sku: 'WD8003FFBX', precio: 1200.00, categoriaId: 'c2', subcategoriaId: 's4', imagen: '', marca: 'Western Digital' },
  { id: 'p5', nombre: 'Memoria RAM HPE 32GB DDR4', sku: 'P00924-B21', precio: 890.00, categoriaId: 'c2', subcategoriaId: 's5', imagen: '', marca: 'HPE' },
  { id: 'p6', nombre: 'Switch TP-Link JetStream 24P', sku: 'TL-SG3428', precio: 580.00, categoriaId: 'c1', subcategoriaId: 's1', imagen: '', marca: 'TP-Link' },
];

export default function ProductosPage() {
  // BLOQUE 2: ESTADOS PARA FILTROS Y BUSQUEDA
  const [categoriaSel, setCategoriaSel] = useState<string>('');
  const [subcategoriaSel, setSubcategoriaSel] = useState<string>('');
  const [busqueda, setBusqueda] = useState<string>('');

  const subcategoriasDisponibles = useMemo(() => {
    if (!categoriaSel) return [];
    const cat = categoriasMock.find(c => c.id === categoriaSel);
    return cat ? cat.subcategorias : [];
  }, [categoriaSel]);

  // BLOQUE 3: LOGICA DE FILTRADO (BUSQUEDA COMPLETA)
  const productosFiltrados = useMemo(() => {
    return productosMock.filter(prod => {
      const coincideCat = categoriaSel === '' || prod.categoriaId === categoriaSel;
      const coincideSub = subcategoriaSel === '' || prod.subcategoriaId === subcategoriaSel;
      
      const termino = busqueda.toLowerCase();
      const catNombre = categoriasMock.find(c => c.id === prod.categoriaId)?.nombre.toLowerCase() || '';
      const subNombre = categoriasMock.find(c => c.id === prod.categoriaId)?.subcategorias.find(s => s.id === prod.subcategoriaId)?.nombre.toLowerCase() || '';

      const coincideBusqueda = prod.nombre.toLowerCase().includes(termino) || 
                               prod.sku.toLowerCase().includes(termino) ||
                               catNombre.includes(termino) ||
                               subNombre.includes(termino);
      
      return coincideCat && coincideSub && coincideBusqueda;
    });
  }, [categoriaSel, subcategoriaSel, busqueda]);

  const handleCategoriaChange = (id: string) => {
    setCategoriaSel(id);
    setSubcategoriaSel(''); 
  };

  return (
    <>
      {/* AQUI ESTA TU HEADER PUBLICO */}
      <Navbar /> 

      {/* BLOQUE 4: CONTENEDOR PRINCIPAL */}
      {/* Usamos pt-28 (112px) de Tailwind nativo para dejarle el espacio al Navbar superior */}
      <div className="bg-slate-50 min-h-screen font-sans pt-28 pb-12 relative z-0">
        
        <div className="max-w-[1600px] mx-auto w-full px-4 sm:px-6 md:px-8 flex flex-col lg:flex-row gap-8">
          
          {/* BLOQUE 5: CONTROLES MOVILES (DROPDOWNS) */}
          <div className="lg:hidden flex flex-col gap-4 mb-2">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Buscar por categoría, subcategoría o productos..." 
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="w-full bg-white border border-slate-200 p-3 pl-10 rounded-xl text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-slate-800 shadow-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <select 
                value={categoriaSel} 
                onChange={(e) => handleCategoriaChange(e.target.value)}
                className="w-full bg-white border border-slate-200 p-3 rounded-xl text-sm text-slate-700 outline-none focus:border-blue-500 shadow-sm appearance-none font-medium"
              >
                <option value="">Todas las Categorías</option>
                {categoriasMock.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                ))}
              </select>

              <select 
                value={subcategoriaSel} 
                onChange={(e) => setSubcategoriaSel(e.target.value)}
                disabled={!categoriaSel}
                className="w-full bg-white border border-slate-200 p-3 rounded-xl text-sm text-slate-700 outline-none focus:border-blue-500 shadow-sm appearance-none disabled:bg-slate-100 disabled:text-slate-400 font-medium transition-colors"
              >
                <option value="">Subcategorías</option>
                {subcategoriasDisponibles.map(sub => (
                  <option key={sub.id} value={sub.id}>{sub.nombre}</option>
                ))}
              </select>
            </div>
          </div>

          {/* BLOQUE 6: SIDEBAR ESCRITORIO (STICKY) */}
          <aside className="hidden lg:block w-72 shrink-0 sticky top-[120px] h-max max-h-[calc(100vh-140px)] overflow-y-auto pr-2 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-200 hover:[&::-webkit-scrollbar-thumb]:bg-slate-300">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <div className="flex items-center gap-2 font-bold text-slate-900 mb-6 pb-4 border-b border-slate-100">
                <Filter size={18} className="text-blue-600" /> Filtros del Catálogo
              </div>

              <div className="space-y-6">
                {categoriasMock.map(cat => (
                  <div key={cat.id} className="space-y-2">
                    <button 
                      onClick={() => handleCategoriaChange(cat.id === categoriaSel ? '' : cat.id)}
                      className={`w-full text-left font-bold text-sm transition-colors ${cat.id === categoriaSel ? 'text-blue-600' : 'text-slate-800 hover:text-blue-600'}`}
                    >
                      {cat.nombre}
                    </button>
                    
                    {cat.id === categoriaSel && (
                      <div className="pl-3 border-l-2 border-slate-100 space-y-1.5 mt-2">
                        {cat.subcategorias.map(sub => (
                          <button
                            key={sub.id}
                            onClick={() => setSubcategoriaSel(sub.id === subcategoriaSel ? '' : sub.id)}
                            className={`w-full text-left text-xs px-2 py-1.5 rounded-lg transition-all flex items-center justify-between ${sub.id === subcategoriaSel ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`}
                          >
                            {sub.nombre}
                            {sub.id === subcategoriaSel && <ChevronRight size={14} />}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </aside>

          {/* BLOQUE 7: GRILLA DE PRODUCTOS */}
          <main className="flex-1">
            
            <div className="hidden lg:flex items-center justify-between mb-6 bg-white p-2 pl-4 rounded-2xl shadow-sm border border-slate-200">
              <div className="flex items-center gap-3 flex-1">
                <Search className="text-slate-400" size={20} />
                <input 
                  type="text" 
                  placeholder="Buscar por categoría, subcategoría o productos..." 
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  className="w-full py-2 text-sm outline-none text-slate-800 placeholder:text-slate-400 font-medium bg-transparent"
                />
              </div>
              <div className="text-xs font-bold text-slate-400 bg-slate-100 px-3 py-1.5 rounded-lg ml-4">
                {productosFiltrados.length} resultados
              </div>
            </div>

            {/* GRID: 2 Movil -> 3 Laptop (lg) -> 4 Monitor (2xl) */}
            <div className="grid grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6">
              {productosFiltrados.map((prod) => (
                <div key={prod.id} className="bg-white rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-slate-200 flex flex-col overflow-hidden group cursor-pointer">
                  
                  <div className="aspect-square bg-slate-100 relative p-6 flex items-center justify-center">
                    <div className="w-16 h-16 bg-white rounded-xl shadow-sm flex items-center justify-center border border-slate-200 text-slate-400 group-hover:scale-110 transition-transform">
                      <ShoppingCart size={24} />
                    </div>
                    <span className="absolute top-3 left-3 bg-white/80 backdrop-blur-sm text-[9px] font-extrabold uppercase px-2 py-1 rounded-md text-slate-600 border border-slate-200/50">
                      {prod.marca}
                    </span>
                  </div>

                  <div className="p-4 sm:p-5 flex flex-col flex-1">
                    <p className="text-[10px] font-bold text-slate-400 mb-1 tracking-wider">{prod.sku}</p>
                    <h3 className="text-sm font-bold text-slate-900 leading-tight mb-3 flex-1 group-hover:text-blue-600 transition-colors">
                      {prod.nombre}
                    </h3>
                    
                    <div className="flex items-end justify-between mt-auto">
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Precio Ref.</p>
                        <p className="text-lg font-black text-slate-900">S/ {prod.precio.toFixed(2)}</p>
                      </div>
                      <button className="w-9 h-9 bg-slate-900 text-white rounded-xl flex items-center justify-center hover:bg-blue-600 transition-colors active:scale-95 shadow-md">
                        <ShoppingCart size={16} />
                      </button>
                    </div>
                  </div>

                </div>
              ))}
            </div>

            {productosFiltrados.length === 0 && (
              <div className="w-full bg-white border border-slate-200 border-dashed rounded-2xl p-12 text-center flex flex-col items-center justify-center mt-6">
                <Filter size={40} className="text-slate-300 mb-4" />
                <h3 className="text-lg font-bold text-slate-700">No se encontraron productos</h3>
                <p className="text-sm text-slate-500 mt-2">Intenta buscar con otros términos o cambia la categoría seleccionada.</p>
                <button 
                  onClick={() => { setBusqueda(''); setCategoriaSel(''); setSubcategoriaSel(''); }}
                  className="mt-6 text-sm font-bold text-blue-600 hover:text-blue-700 bg-blue-50 px-4 py-2 rounded-lg transition-colors"
                >
                  Limpiar todos los filtros
                </button>
              </div>
            )}

          </main>
        </div>
      </div>
    </>
  );
}