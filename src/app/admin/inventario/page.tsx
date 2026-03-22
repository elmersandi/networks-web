"use client";

import { useState, useEffect } from "react";
import { Search, Plus, Server, Tag, Trash2, Cpu } from "lucide-react";

export default function InventarioPage() {
  const [productos, setProductos] = useState<any[]>([]);
  const [categorias, setCategorias] = useState<any[]>([]);
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState("");

  const [nombre, setNombre] = useState("");
  const [marca, setMarca] = useState("");
  const [stock, setStock] = useState<number | "">(""); 
  const [categoriaId, setCategoriaId] = useState("");
  const [descripcion, setDescripcion] = useState("");

  // Estado para el Modal de Inventario
  const [equipoAEliminar, setEquipoAEliminar] = useState<string | null>(null);

  const fetchData = async () => {
    setCargando(true);
    try {
      const [resProd, resCat] = await Promise.all([
        fetch("/api/productos"),
        fetch("/api/categorias")
      ]);
      if (resProd.ok) {
        const dataProd = await resProd.json();
        setProductos(Array.isArray(dataProd) ? dataProd : []);
      }
      if (resCat.ok) {
        const dataCat = await resCat.json();
        setCategorias(Array.isArray(dataCat) ? dataCat : []);
      }
    } catch (error) {
      console.error("Error cargando:", error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("/api/productos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, marca, stock: Number(stock) || 0, categoriaId, descripcion }),
    });
    setNombre(""); setMarca(""); setStock(""); setCategoriaId(""); setDescripcion(""); 
    fetchData();
  };

  // Función que se dispara desde el modal
  const confirmarEliminacion = async () => {
    if (equipoAEliminar) {
      await fetch(`/api/productos?id=${equipoAEliminar}`, { method: "DELETE" });
      setEquipoAEliminar(null);
      fetchData();
    }
  };

  const filtrados = productos.filter(p => 
    p.nombre.toLowerCase().includes(busqueda.toLowerCase()) || 
    p.marca?.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto space-y-8 relative">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-slate-800">Inventario de Equipos</h2>
        <div className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2">
          <Cpu size={18} /> {productos.length} Equipos en total
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* FORMULARIO */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 sticky top-6">
            <h3 className="text-lg font-semibold mb-6 flex items-center gap-2 text-slate-800">
              <Plus size={20} className="text-blue-600" /> Registrar Equipo
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Nombre del Equipo</label>
                <input type="text" value={nombre} onChange={e => setNombre(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800 outline-none focus:ring-2 focus:ring-blue-500" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Marca</label>
                  <input type="text" value={marca} onChange={e => setMarca(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800 outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Stock</label>
                  <input type="number" value={stock} onChange={e => setStock(e.target.value === "" ? "" : parseInt(e.target.value))} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800 outline-none focus:ring-2 focus:ring-blue-500" min="0" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Categoría</label>
                <select value={categoriaId} onChange={e => setCategoriaId(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800 outline-none focus:ring-2 focus:ring-blue-500 bg-white" required>
                  <option value="">Seleccionar...</option>
                  {categorias.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Especificaciones Técnicas</label>
                {/* Aumentado a 5 rows para más comodidad */}
                <textarea value={descripcion} onChange={e => setDescripcion(e.target.value)} rows={5} placeholder="Frecuencia, puertos, capacidad..." className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800 outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
              </div>
              <button type="submit" className="w-full cursor-pointer transform active:scale-95 transition-all bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 shadow-md">
                Guardar Equipo
              </button>
            </form>
          </div>
        </div>

        {/* LISTA DE EQUIPOS */}
        <div className="lg:col-span-2 space-y-4">
          <div className="relative">
            <input type="text" placeholder="Buscar por nombre o marca..." value={busqueda} onChange={e => setBusqueda(e.target.value)} className="w-full pl-12 pr-4 py-3 border border-slate-300 text-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" />
            <Search className="absolute left-4 top-3.5 text-slate-400" size={20} />
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-slate-600 uppercase">Equipo</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-600 uppercase">Categoría</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-600 uppercase text-center">Stock</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-600 uppercase text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {cargando ? (
                  <tr><td colSpan={4} className="px-6 py-12 text-center text-slate-400">Cargando inventario...</td></tr>
                ) : filtrados.length > 0 ? (
                  filtrados.map((prod) => (
                    <tr key={prod.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-500"><Server size={20} /></div>
                          <div>
                            <p className="font-bold text-slate-800">{prod.nombre}</p>
                            <p className="text-xs text-slate-500">{prod.marca || "Sin marca"}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-1 bg-slate-100 text-slate-700 rounded-md">
                          <Tag size={12} /> {prod.categoria?.nombre}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`font-mono font-bold ${prod.stock < 5 ? 'text-red-500 bg-red-50 px-2 py-1 rounded' : 'text-slate-700'}`}>{prod.stock}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                         <button onClick={() => setEquipoAEliminar(prod.id)} className="text-slate-400 cursor-pointer hover:text-red-500 hover:bg-red-50 rounded-md transition-all p-2">
                           <Trash2 size={18} />
                         </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan={4} className="px-6 py-12 text-center text-slate-500">No hay equipos guardados.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* MODAL PERSONALIZADO DE ELIMINACIÓN */}
      {equipoAEliminar && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 animate-in fade-in duration-200">
          <div className="bg-white p-6 rounded-xl shadow-xl max-w-sm w-full mx-4 border border-slate-200">
            <h3 className="text-xl font-bold text-slate-800 mb-2">¿Eliminar equipo?</h3>
            <p className="text-slate-600 mb-6 text-sm">El equipo será removido permanentemente del almacén.</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setEquipoAEliminar(null)} className="px-4 py-2 cursor-pointer text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">Cancelar</button>
              <button onClick={confirmarEliminacion} className="px-4 py-2 cursor-pointer text-sm font-medium bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-sm">Sí, eliminar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}