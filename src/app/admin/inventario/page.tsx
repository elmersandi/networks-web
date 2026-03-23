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
        <div>
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Inventario de Equipos</h2>
          <p className="text-sm text-gray-500 mt-1">Gestiona el hardware y stock del almacén.</p>
        </div>
        <div className="bg-blue-50 text-blue-700 border border-blue-200 px-4 py-2 rounded-md text-sm font-bold flex items-center gap-2 shadow-sm">
          <Cpu size={18} /> {productos.length} Equipos registrados
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* FORMULARIO */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 sticky top-6">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-gray-900">
              <Plus size={20} className="text-blue-600" /> Registrar Equipo
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Nombre del Equipo</label>
                <input type="text" value={nombre} onChange={e => setNombre(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Marca</label>
                  <input type="text" value={marca} onChange={e => setMarca(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Stock</label>
                  <input type="number" value={stock} onChange={e => setStock(e.target.value === "" ? "" : parseInt(e.target.value))} className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white" min="0" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Categoría</label>
                <select value={categoriaId} onChange={e => setCategoriaId(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white" required>
                  <option value="">Seleccionar...</option>
                  {categorias.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Especificaciones</label>
                <textarea value={descripcion} onChange={e => setDescripcion(e.target.value)} rows={4} placeholder="Frecuencia, puertos..." className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white resize-none" />
              </div>
              <button type="submit" className="w-full cursor-pointer transform active:scale-95 transition-all bg-blue-600 text-white py-2.5 rounded-md font-bold hover:bg-blue-700 shadow-sm mt-2">
                Guardar Equipo
              </button>
            </form>
          </div>
        </div>

        {/* LISTA DE EQUIPOS */}
        <div className="lg:col-span-2 space-y-4">
          <div className="relative">
            <input type="text" placeholder="Buscar por nombre o marca..." value={busqueda} onChange={e => setBusqueda(e.target.value)} className="w-full pl-10 pr-4 py-2.5 border border-gray-300 text-gray-900 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-white shadow-sm" />
            <Search className="absolute left-3.5 top-3 text-gray-400" size={18} />
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">Equipo</th>
                  <th className="px-6 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">Categoría</th>
                  <th className="px-6 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Stock</th>
                  <th className="px-6 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {cargando ? (
                  <tr><td colSpan={4} className="px-6 py-12 text-center text-gray-400 text-sm">Cargando inventario...</td></tr>
                ) : filtrados.length > 0 ? (
                  filtrados.map((prod) => (
                    <tr key={prod.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-50 border border-gray-100 rounded-md flex flex-shrink-0 items-center justify-center text-gray-500">
                            <Server size={18} />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 text-sm">{prod.nombre}</p>
                            <p className="text-xs text-gray-500 mt-0.5">{prod.marca || "Sin marca"}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 bg-gray-50 border border-gray-200 text-gray-700 rounded shadow-sm">
                          <Tag size={12} className="text-gray-400" /> {prod.categoria?.nombre}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`font-mono text-sm font-bold ${prod.stock < 5 ? 'text-red-700 bg-red-50 border border-red-200 px-2.5 py-1 rounded shadow-sm' : 'text-gray-900'}`}>
                          {prod.stock}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                         <button onClick={() => setEquipoAEliminar(prod.id)} className="text-gray-400 cursor-pointer hover:text-red-600 hover:bg-red-50 rounded-md transition-all p-2">
                           <Trash2 size={18} />
                         </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan={4} className="px-6 py-12 text-center text-gray-500 text-sm">No hay equipos guardados.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* MODAL PERSONALIZADO DE ELIMINACIÓN */}
      {equipoAEliminar && (
        <div className="fixed inset-0 bg-neutral-900/60 flex items-center justify-center z-50 animate-in fade-in duration-200 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full mx-4 border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-2">¿Eliminar equipo?</h3>
            <p className="text-gray-500 mb-6 text-sm">El equipo será removido permanentemente del almacén. Esta acción no se puede deshacer.</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setEquipoAEliminar(null)} className="px-4 py-2 cursor-pointer text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-md transition-colors">Cancelar</button>
              <button onClick={confirmarEliminacion} className="px-4 py-2 cursor-pointer text-sm font-bold bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors shadow-sm">Sí, eliminar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}