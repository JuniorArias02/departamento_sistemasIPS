import React, { useEffect, useState } from "react";
import { listarSedes } from "../../../../services/sedes_service";
import { crearAgendaMantenimiento } from "../../../../services/mantenimiento_services";
import { X, Calendar, Clock, Building, Edit3, FileText, Save, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useApp } from "../../../../store/AppContext";
const ModalCrearMantenimiento = ({ fecha, hora, onClose }) => {
  const { usuario: usuarioContext } = useApp();
  const [sedes, setSedes] = useState([]);
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [sedeId, setSedeId] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const cargarSedes = async () => {
    try {
      const data = await listarSedes();
      setSedes(data);
    } catch (err) {
      console.error("Error al cargar sedes", err);
      setError("Error al cargar las sedes");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    cargarSedes();
  }, []);

  const handleGuardar = async () => {
    if (!titulo) {
      setError("El título es obligatorio");
      return;
    }
    if (!sedeId) {
      setError("Debes seleccionar una sede");
      return;
    }

    setError("");

    const fechaCompleta = new Date(`${fecha.toDateString()} ${hora}`);
    const fechaAgendada = fechaCompleta.toISOString().slice(0, 19).replace("T", " ");

    try {
      await crearAgendaMantenimiento({
        titulo,
        descripcion,
        sede_id: parseInt(sedeId),
        fecha_agendada: fechaAgendada,
        usuario_id: usuarioContext?.id,
      });

      onClose(); // Cierra modal si todo bien
    } catch (err) {
      setError(err?.error || "Error al crear el mantenimiento");
    }
  };
  return (
    <div className="fixed inset-0  flex justify-center items-center z-50 ">
      <motion.div
        className="bg-white rounded-xl p-6 w-[90vw] max-w-md shadow-2xl border border-white/10"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", damping: 20 }}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <Edit3 className="text-[#5D0EC0]" size={20} />
            <span>Nuevo Mantenimiento</span>
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Información de fecha/hora */}
        <div className="flex items-center gap-4 mb-6 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2 text-gray-700">
            <Calendar size={18} className="text-[#4E24CE]" />
            <span>{fecha.toLocaleDateString('es', { weekday: 'long', day: 'numeric', month: 'long' })}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-700">
            <Clock size={18} className="text-[#5D0EC0]" />
            <span>{hora}</span>
          </div>
        </div>

        {/* Formulario */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
              <Edit3 size={16} className="text-gray-500" />
              Título del mantenimiento
            </label>
            <input
              type="text"
              placeholder="Ej: Revisión de equipos"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5D0EC0] focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
              <FileText size={16} className="text-gray-500" />
              Descripción (opcional)
            </label>
            <textarea
              placeholder="Detalles del mantenimiento..."
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              rows={3}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5D0EC0] focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
              <Building size={16} className="text-gray-500" />
              Sede
            </label>
            {isLoading ? (
              <div className="p-3 bg-gray-100 rounded-lg animate-pulse">Cargando sedes...</div>
            ) : (
              <select
                value={sedeId}
                onChange={(e) => setSedeId(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5D0EC0] focus:border-transparent appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiM2QzI4QzgiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBjbGFzcz0ibHVjaWRlIGx1Y2lkZS1jaGV2cm9uLWRvd24iPjxwYXRoIGQ9Im03IDE1IDUgNSA1LTUiLz48L3N2Zz4=')] bg-no-repeat bg-[center_right_1rem]"
              >
                <option value="">Selecciona una sede</option>
                {sedes.map((sede) => (
                  <option key={sede.id} value={sede.id}>
                    {sede.nombre}
                  </option>
                ))}
              </select>
            )}
          </div>

          {error && (
            <motion.div
              className="flex items-center gap-2 p-3 bg-red-50 text-red-600 rounded-lg"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <AlertCircle size={18} />
              <span>{error}</span>
            </motion.div>
          )}

          <div className="flex justify-end gap-3 pt-4">
            <motion.button
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium transition-colors flex items-center gap-2"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              Cancelar
            </motion.button>
            <motion.button
              onClick={handleGuardar}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#4E24CE] to-[#5D0EC0] text-white font-medium transition-colors flex items-center gap-2 shadow-md hover:shadow-lg"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              disabled={!titulo || !sedeId}
            >
              <Save size={18} />
              <span>Guardar Mantenimiento</span>
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ModalCrearMantenimiento;