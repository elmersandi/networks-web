'use client';

import { useState } from 'react';
import { ShoppingCart, ShieldCheck, Truck, ArrowLeft, ChevronRight, Star } from 'lucide-react';
import Link from 'next/link';
import Navbar from '@/src/components/Navbar';

// BLOQUE 1: DATOS DE PRUEBA (MOCK)
// En producción, usarás params.id para hacer un fetch a tu API de Prisma.
const producto = {
  id: 'p1',
  nombre: 'Switch Cisco Catalyst 9200L 48 Puertos PoE+',
  sku: 'C9200L-48P-4G-E',
  precio: 3450.00,
  marca: 'Cisco',
  categoria: 'Redes y Conectividad',
  subcategoria: 'Switches',
  descripcion: 'Los switches de la serie Catalyst 9200 amplían el poder de las redes basadas en la intención y la innovación de hardware y software Catalyst 9000 a un conjunto más amplio de implementaciones.',
  imagenes: [
    '/api/placeholder/600/600',
    '/api/placeholder/600/601',
    '/api/placeholder/600/602'
  ],
  especificaciones: [
    { etiqueta: 'Puertos', valor: '48 Puertos RJ-45 10/100/1000' },
    { etiqueta: 'Capacidad de conmutación', valor: '176 Gbps' },
    { etiqueta: 'PoE Budget', valor: '740W' },
    { etiqueta: 'Memoria RAM', valor: '2 GB' }
  ]
};

const relacionados = [
  { id: 'p2', nombre: 'Router Mikrotik CCR1009', precio: 1850.00, marca: 'Mikrotik' },
  { id: 'p3', nombre: 'Bobina Cable UTP Cat 6', precio: 450.00, marca: 'CommScope' },
  { id: 'p6', nombre: 'Switch TP-Link JetStream', precio: 580.00, marca: 'TP-Link' },
  { id: 'p10', nombre: 'Patch Panel 24 Puertos Cat6', precio: 120.00, marca: 'Leviton' }
];

export default function ProductoDetallePage() {
  const [imgActiva, setImgActiva] = useState(0);

  return (
    <>
      <Navbar />
      
      <main className="bg-white min-h-screen pt-28 pb-20 font-sans">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* BLOQUE 2: BREADCRUMBS (NAVEGACION) */}
          <nav className="flex items-center gap-2 text-xs font-bold text-slate-400 mb-8 uppercase tracking-widest">
            <Link href="/productos" className="hover:text-blue-600 transition-colors">Productos</Link>
            <ChevronRight size={14} />
            <span className="text-slate-900">{producto.categoria}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
            
            {/* BLOQUE 3: GALERIA DE IMAGENES */}
            <div className="space-y-4">
              <div className="aspect-square bg-slate-50 rounded-3xl border border-slate-100 flex items-center justify-center overflow-hidden relative group">
                <div className="absolute top-4 left-4 bg-white px-3 py-1 rounded-full text-[10px] font-black text-slate-900 border border-slate-100 shadow-sm z-10">
                  {producto.marca}
                </div>
                <div className="w-full h-full bg-slate-200 animate-pulse flex items-center justify-center text-slate-400">
                  <ShoppingCart size={48} />
                </div>
              </div>
              
              <div className="grid grid-cols-4 gap-4">
                {producto.imagenes.map((img, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setImgActiva(idx)}
                    className={`aspect-square rounded-2xl border-2 transition-all overflow-hidden bg-slate-50 ${imgActiva === idx ? 'border-blue-600 shadow-md' : 'border-transparent hover:border-slate-200'}`}
                  >
                    <div className="w-full h-full bg-slate-200"></div>
                  </button>
                ))}
              </div>
            </div>

            {/* BLOQUE 4: INFORMACION DEL PRODUCTO */}
            <div className="flex flex-col">
              <div className="mb-6">
                <span className="text-blue-600 font-black text-xs uppercase tracking-[0.2em]">{producto.subcategoria}</span>
                <h1 className="text-3xl md:text-4xl font-black text-slate-900 mt-2 leading-tight">
                  {producto.nombre}
                </h1>
                <p className="text-slate-400 font-bold text-sm mt-3">SKU: {producto.sku}</p>
              </div>

              <div className="mb-8">
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Precio Referencial</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-black text-slate-900">S/ {producto.precio.toFixed(2)}</span>
                  <span className="text-slate-400 text-sm font-bold">+ IGV</span>
                </div>
              </div>

              <div className="space-y-4 mb-10">
                <p className="text-slate-600 leading-relaxed font-medium">
                  {producto.descripcion}
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                  <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <ShieldCheck className="text-blue-600" size={24} />
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Garantía</p>
                      <p className="text-xs font-bold text-slate-700">12 Meses de Fábrica</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <Truck className="text-blue-600" size={24} />
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Envío</p>
                      <p className="text-xs font-bold text-slate-700">Iquitos y Trujillo</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button className="flex-1 bg-blue-600 text-white font-black py-4 rounded-2xl hover:bg-blue-700 transition-all flex items-center justify-center gap-3 shadow-lg shadow-blue-600/20 active:scale-95">
                  <ShoppingCart size={20} /> Solicitar Cotización
                </button>
                <Link href="/contacto" className="flex-1 bg-slate-900 text-white font-black py-4 rounded-2xl hover:bg-slate-800 transition-all flex items-center justify-center gap-3 active:scale-95">
                  Hablar con un Asesor
                </Link>
              </div>
            </div>
          </div>

          {/* BLOQUE 5: ESPECIFICACIONES TECNICAS */}
          <section className="mb-20">
            <h2 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-3">
              <div className="w-1.5 h-6 bg-blue-600 rounded-full"></div>
              Ficha Técnica
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2 bg-slate-50 p-8 rounded-3xl border border-slate-100">
              {producto.especificaciones.map((esp, idx) => (
                <div key={idx} className="flex justify-between py-3 border-b border-slate-200/60 last:border-0">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{esp.etiqueta}</span>
                  <span className="text-xs font-black text-slate-800 text-right">{esp.valor}</span>
                </div>
              ))}
            </div>
          </section>

          {/* BLOQUE 6: PRODUCTOS RELACIONADOS */}
          <section>
            <h2 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-3">
              <div className="w-1.5 h-6 bg-blue-600 rounded-full"></div>
              Productos Relacionados
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {relacionados.map((rel) => (
                <Link 
                  key={rel.id} 
                  href={`/productos/${rel.id}`}
                  className="bg-white rounded-2xl border border-slate-200 p-4 hover:shadow-xl hover:-translate-y-1 transition-all group"
                >
                  <div className="aspect-square bg-slate-100 rounded-xl mb-4 flex items-center justify-center text-slate-300">
                    <ShoppingCart size={24} />
                  </div>
                  <p className="text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-widest">{rel.marca}</p>
                  <h3 className="text-sm font-black text-slate-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {rel.nombre}
                  </h3>
                  <p className="text-lg font-black text-slate-900">S/ {rel.precio.toFixed(2)}</p>
                </Link>
              ))}
            </div>
          </section>

        </div>
      </main>
    </>
  );
}