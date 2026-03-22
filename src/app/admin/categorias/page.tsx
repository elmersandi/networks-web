"use client";

import { useState, useEffect } from "react";
import { Search, Pencil, Trash2, Link as LinkIcon } from "lucide-react";

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
    <div className="max-w-6xl mx-auto relative">
      <h2 className="text-3xl font-bold text-slate-800 mb-8">Categorías de Productos</h2>

      <div className="flex flex-col md:flex-row gap-8">
        {/* FORMULARIO */}
        <div className="w-full md:w-1/3">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 sticky top-6">
            <h3 className="text-lg font-semibold mb-4 text-slate-800">Añadir nueva categoría</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nombre</label>
                {/* Agregado text-slate-800 para que la letra se vea */}
                <input 
                  type="text" 
                  value={nombre}
                  onChange={(e) => { setNombre(e.target.value); generarSlug(e.target.value); }}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-slate-800 focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-1">
                  <LinkIcon size={14} /> Slug
                </label>
                <input 
                  type="text" 
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md bg-slate-50 text-slate-600 text-sm outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Descripción</label>
                <textarea 
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-slate-800 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                />
              </div>
              {/* Botón con efecto de hundimiento (active:scale-95) */}
              <button type="submit" className="w-full cursor-pointer transform active:scale-95 transition-all bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 font-medium">
                Añadir nueva categoría
              </button>
            </form>
          </div>
        </div>

        {/* TABLA */}
        <div className="w-full md:w-2/3">
          <div className="flex justify-between items-center mb-4">
            <div className="relative w-64">
              <input type="text" placeholder="Buscar..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-md text-slate-800 text-sm outline-none" />
              <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-sm font-semibold text-slate-700">Nombre</th>
                  <th className="px-6 py-3 text-sm font-semibold text-slate-700">Slug</th>
                  <th className="px-6 py-3 text-sm font-semibold text-slate-700 text-center">Cant.</th>
                  <th className="px-6 py-3 text-sm font-semibold text-slate-700 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-sm">
                {cargando ? (
                  <tr><td colSpan={4} className="px-6 py-8 text-center text-slate-400">Cargando categorías...</td></tr>
                ) : categoriasFiltradas.length > 0 ? (
                  categoriasFiltradas.map((cat) => (
                    <tr key={cat.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 text-slate-800 font-medium">{cat.nombre}</td>
                      <td className="px-6 py-4 text-slate-500 font-mono text-xs">{cat.slug}</td>
                      <td className="px-6 py-4 text-center">
                        {/* Aquí leemos el contador real desde la base de datos */}
                        <span className="bg-slate-100 px-2.5 py-1 rounded-full font-semibold text-slate-600">
                          {cat._count?.productos || 0}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button className="p-1.5 cursor-pointer text-blue-600 hover:bg-blue-50 rounded-md transition-colors"><Pencil size={16} /></button>
                          <button 
                            onClick={() => setCategoriaAEliminar(cat.id)} // Abre el modal
                            className="p-1.5 cursor-pointer text-red-600 hover:bg-red-50 rounded-md transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan={4} className="px-6 py-12 text-center text-slate-500">No hay categorías.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* MODAL PERSONALIZADO DE ELIMINACIÓN */}
      {categoriaAEliminar && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 animate-in fade-in duration-200">
          <div className="bg-white p-6 rounded-xl shadow-xl max-w-sm w-full mx-4 border border-slate-200">
            <h3 className="text-xl font-bold text-slate-800 mb-2">¿Eliminar categoría?</h3>
            <p className="text-slate-600 mb-6 text-sm">Esta acción no se puede deshacer y podría afectar a los equipos registrados bajo esta categoría.</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setCategoriaAEliminar(null)} className="px-4 py-2 cursor-pointer text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">Cancelar</button>
              <button onClick={confirmarEliminacion} className="px-4 py-2 cursor-pointer text-sm font-medium bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-sm">Sí, eliminar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}