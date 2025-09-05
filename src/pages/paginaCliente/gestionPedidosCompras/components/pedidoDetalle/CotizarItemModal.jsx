import { useState, useEffect } from "react";
import {
  X,
  DollarSign,
  Calendar,
  Building,
  Save,
  ClipboardList
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { buscarProveedor } from "../../../../../services/cp_proveedor_services";
import { crearCotizacion } from "../../../../../services/cp_cotizaciones_services";
import Swal from "sweetalert2";
export const CotizarItemModal = ({ open, onClose, item, onSave }) => {
  const [proveedorId, setProveedorId] = useState("");
  const [fechaCotizacion, setFechaCotizacion] = useState("");
  const [precio, setPrecio] = useState("");
  const [search, setSearch] = useState("");
  const [proveedores, setProveedores] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = {
      item_pedido_id: item.id,
      proveedor_id: proveedorId,
      fecha_solicitud_cotizacion: fechaCotizacion,
      precio: parseFloat(precio),
    };

    const res = await crearCotizacion(form);

    if (res.success) {
      if (onSave) onSave(res);

      Swal.fire({
        icon: "success",
        title: "Cotización creada",
        text: "La cotización se registró correctamente",
        timer: 2000,
        showConfirmButton: false,
      });

      onClose();
    } else {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: res.message || "Ocurrió un problema al crear la cotización",
        confirmButtonColor: "#3085d6",
      });
    }
  };


  useEffect(() => {
    const fetchProveedores = async () => {
      if (search.trim().length < 2) {
        setProveedores([]);
        return;
      }
      const data = await buscarProveedor(search);
      setProveedores(data);
    };

    const timeout = setTimeout(fetchProveedores, 400);
    return () => clearTimeout(timeout);
  }, [search]);



  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Fondo oscuro con blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
          >
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 relative">
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-1 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                >
                  <X size={20} className="text-white" />
                </button>

                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/10 rounded-lg">
                    <ClipboardList size={24} className="text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-white">
                      Cotizar Ítem
                    </h2>
                    <p className="text-blue-100 text-sm mt-1">
                      {item?.nombre || "Producto seleccionado"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Formulario */}
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <Building size={16} className="text-blue-600" />
                    Proveedor
                  </label>
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Buscar proveedor por nombre o NIT"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-100"
                  />
                  <select
                    value={proveedorId}
                    onChange={(e) => setProveedorId(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-300"
                  >
                    <option value="">Seleccione un proveedor</option>
                    {proveedores.map((prov) => (
                      <option key={prov.id} value={prov.id}>
                        {prov.nombre} - {prov.nit}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Fecha */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <Calendar size={16} className="text-blue-600" />
                    Fecha de solicitud
                  </label>
                  <input
                    type="date"
                    value={fechaCotizacion}
                    onChange={(e) => setFechaCotizacion(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-300"
                  />
                </div>

                {/* Precio */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <DollarSign size={16} className="text-blue-600" />
                    Precio
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">
                      $
                    </span>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={precio}
                      onChange={(e) => setPrecio(e.target.value)}
                      required
                      placeholder="0.00"
                      className="w-full pl-8 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-300"
                    />
                  </div>
                </div>

                {/* Botones */}
                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                  <motion.button
                    type="button"
                    onClick={onClose}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-6 py-3 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors duration-200"
                  >
                    Cancelar
                  </motion.button>
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl transition-all duration-200 flex items-center gap-2"
                  >
                    <Save size={16} />
                    Guardar Cotización
                  </motion.button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};