"use client";

import { useState, useEffect } from "react";
import { Search, Pencil, Trash2, Link as LinkIcon, Tags } from "lucide-react";

export default function CategoriasPage() {
  const [categorias, setCategorias] = useState<any[]>([]);
  const [cargando, setCargando] = useState(true);
  const [nombre, setNombre] = useState("");
  const [slug, setSlug] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [busqueda, setBusqueda] = useState("");
  
  // Estado para nuestro Modal personalizado
  const [categoriaAEliminar, setCategoriaAEliminar] = useState<string | null>(null);

  const generarSlug = (texto: string) => {
    const s = texto.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-").replace(/^-+|-+$/g, "");
    setSlug(s);
  };

  const fetchCategorias = async () => {
    setCargando(true);
    try {
      const res = await fetch("/api/categorias");
      if (res.ok) {
        const data = await res.json();
        setCategorias(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => { fetchCategorias(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("/api/categorias", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, slug, descripcion }),
    });
    setNombre(""); setSlug(""); setDescripcion("");
    fetchCategorias(); 
  };

  // Función que se dispara desde el modal
  const confirmarEliminacion = async () => {
    if (categoriaAEliminar) {
      await fetch(`/api/categorias?id=${categoriaAEliminar}`, { method: "DELETE" });
      setCategoriaAEliminar(null); // Cerramos el modal
      fetchCategorias(); // Recargamos la tabla
    }
  };

  const categoriasFiltradas = categorias.filter((cat) =>
    cat.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto relative space-y-8">
      
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Categorías de Productos</h2>
          <p className="text-sm text-gray-500 mt-1">Administra las clasificaciones para el inventario de equipos.</p>
        </div>
        <div className="bg-blue-50 text-blue-700 border border-blue-200 px-4 py-2 rounded-md text-sm font-bold flex items-center gap-2 shadow-sm">
          <Tags size={18} /> {categorias.length} Categorías
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* FORMULARIO */}
        <div className="w-full md:w-1/3">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 sticky top-6">
            <h3 className="text-lg font-bold mb-6 text-gray-900">Añadir nueva categoría</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Nombre</label>
                <input 
                  type="text" 
                  value={nombre}
                  onChange={(e) => { setNombre(e.target.value); generarSlug(e.target.value); }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                  <LinkIcon size={14} /> Slug URL
                </label>
                <input 
                  type="text" 
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-md bg-gray-50 text-gray-500 text-sm outline-none cursor-not-allowed"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Descripción</label>
                <textarea 
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white resize-none"
                />
              </div>
              <button type="submit" className="w-full cursor-pointer transform active:scale-95 transition-all bg-blue-600 text-white px-4 py-2.5 rounded-md hover:bg-blue-700 font-bold shadow-sm mt-2">
                Añadir Categoría
              </button>
            </form>
          </div>
        </div>

        {/* TABLA */}
        <div className="w-full md:w-2/3 space-y-4">
          <div className="relative">
            <input type="text" placeholder="Buscar categoría..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-sm bg-white" />
            <Search className="absolute left-3.5 top-3 text-gray-400" size={18} />
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">Nombre</th>
                  <th className="px-6 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">Slug</th>
                  <th className="px-6 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Cant.</th>
                  <th className="px-6 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {cargando ? (
                  <tr><td colSpan={4} className="px-6 py-12 text-center text-gray-400">Cargando categorías...</td></tr>
                ) : categoriasFiltradas.length > 0 ? (
                  categoriasFiltradas.map((cat) => (
                    <tr key={cat.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-gray-900 font-semibold">{cat.nombre}</td>
                      <td className="px-6 py-4 text-gray-500 font-mono text-xs">{cat.slug}</td>
                      <td className="px-6 py-4 text-center">
                        <span className="bg-gray-100 border border-gray-200 px-2.5 py-1 rounded font-semibold text-gray-700">
                          {cat._count?.productos || 0}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button className="p-1.5 cursor-pointer text-blue-600 hover:bg-blue-50 rounded-md transition-colors"><Pencil size={16} /></button>
                          <button 
                            onClick={() => setCategoriaAEliminar(cat.id)}
                            className="p-1.5 cursor-pointer text-red-600 hover:bg-red-50 rounded-md transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan={4} className="px-6 py-12 text-center text-gray-500">No hay categorías.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* MODAL PERSONALIZADO DE ELIMINACIÓN */}
      {categoriaAEliminar && (
        <div className="fixed inset-0 bg-neutral-900/60 flex items-center justify-center z-50 animate-in fade-in duration-200 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full mx-4 border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-2">¿Eliminar categoría?</h3>
            <p className="text-gray-500 mb-6 text-sm">Esta acción no se puede deshacer y podría afectar a los equipos registrados bajo esta categoría.</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setCategoriaAEliminar(null)} className="px-4 py-2 cursor-pointer text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-md transition-colors">Cancelar</button>
              <button onClick={confirmarEliminacion} className="px-4 py-2 cursor-pointer text-sm font-bold bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors shadow-sm">Sí, eliminar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}