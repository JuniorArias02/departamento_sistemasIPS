import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import {
  crearDispositivoMedico,
  actualizarDispositivoMedico,
} from "../../../services/dispositivo_medicos";
import { useApp } from "../../../store/AppContext";
import { Save, Loader2, FileDown } from "lucide-react";
import BackPage from "../components/BackPage";
import { useLocation } from "react-router-dom";

export default function FormularioDispositivoMedicos() {
  const { usuario } = useApp();
  const location = useLocation();

  const dispositivoEdit = location.state?.dispositivo;

  useEffect(() => {
    if (dispositivoEdit) {
      setFormData(dispositivoEdit);
    }
  }, [dispositivoEdit]);

  const [formData, setFormData] = useState({
    descripcion: "",
    marca: "",
    serie: "",
    presentacion_comercial: "",
    registro_sanitario: "",
    clasificacion_riesgo: "",
    vida_util: "",
    lote: "",
    fecha_vencimiento: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);

    const datosConUsuario = {
      ...formData,
      creado_por: usuario?.id,
    };
    try {
      if (dispositivoEdit?.id) {
        // Editar
        await actualizarDispositivoMedico(dispositivoEdit.id, datosConUsuario);
        Swal.fire({
          icon: "success",
          title: "¡Actualizado!",
          text: "Dispositivo actualizado correctamente",
          timer: 2000,
          showConfirmButton: false,
        });
      } else {
        // Crear nuevo
        await crearDispositivoMedico(datosConUsuario);
        Swal.fire({
          icon: "success",
          title: "¡Éxito!",
          text: "Dispositivo registrado correctamente",
          timer: 2000,
          showConfirmButton: false,
        });
      }
    } catch (error) {
      console.error("Error al guardar:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message,
        timer: 2000,
        showConfirmButton: false,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl mx-auto p-4 sm:p-6 md:p-8 bg-white rounded-2xl space-y-6"
    >
      <h2 className="text-2xl font-semibold text-center text-black">
        Formulario Dispositivo Médico
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {Object.keys(formData).map((campo) => (
          <div key={campo} className="flex flex-col gap-1">
            <label
              htmlFor={campo}
              className="text-sm font-medium text-gray-700 capitalize"
            >
              {campo.replace(/_/g, " ")}
            </label>

            <input
              type={campo === "fecha_vencimiento" ? "date" : "text"}
              id={campo}
              name={campo}
              value={formData[campo]}
              onChange={handleChange}
              className="bg-gray-100 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={campo.replace(/_/g, " ")}
            />
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center">
        <BackPage isEdit={!!dispositivoEdit} />
        <button
          type="submit"
          disabled={loading}
          className={`bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition duration-200 flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              Guardando...
            </>
          ) : (
            <>
              <Save size={20} />
              Registrar
            </>
          )}
        </button>
      </div>
    </form>
  );
}
