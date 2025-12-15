import { useState, useEffect } from "react";
import { useApp } from "../../../../store/AppContext";
import { crearPersonal, listarCargo } from "../../../../services/personal_services";
import {
  UserPlus,
  User,
  IdCard,
  Phone,
  Briefcase,
  Building,
  Save,
  ArrowLeft
} from 'lucide-react';
import Swal from 'sweetalert2';

export default function CrearPersonalVista() {
  const { usuario } = useApp();
  const [cargos, setCargos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    cedula: "",
    telefono: "",
    cargo_id: "",
    proceso: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  useEffect(() => {
    const cargarCargos = async () => {
      const data = await listarCargo();
      setCargos(data);
    };

    cargarCargos();
  }, []);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const datos = {
        ...formData,
        usuario_id: usuario.id
      };

      const response = await crearPersonal(datos);

      if (response.data.status) {
        await Swal.fire({
          icon: 'success',
          title: '¡Éxito!',
          text: response.data.message,
          confirmButtonColor: '#2563eb',
          confirmButtonText: 'Aceptar'
        });

        // Reset form
        setFormData({
          nombre: "",
          cedula: "",
          telefono: "",
          cargo_id: ""
        });
      } else {
        if (response.data.faltantes) {
          const camposFaltantes = response.data.faltantes.join(', ');
          await Swal.fire({
            icon: 'error',
            title: 'Campos incompletos',
            text: `Faltan los siguientes campos: ${camposFaltantes}`,
            confirmButtonColor: '#dc2626',
            confirmButtonText: 'Entendido'
          });
        } else {
          await Swal.fire({
            icon: 'error',
            title: 'Error',
            text: response.data.message,
            confirmButtonColor: '#dc2626',
            confirmButtonText: 'Entendido'
          });
        }
      }
    } catch (error) {
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error al conectar con el servidor',
        confirmButtonColor: '#dc2626',
        confirmButtonText: 'Entendido'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 rounded-lg bg-blue-100 text-blue-600">
            <UserPlus size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Crear Personal</h1>
            <p className="text-gray-600">Registra nuevo personal en el sistema</p>
          </div>
        </div>

        {/* Formulario */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Campo Nombre */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <User size={16} />
                Nombre Completo *
              </label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ingresa el nombre completo"
                required
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none mt-6">
                <User size={18} className="text-gray-400" />
              </div>
            </div>

            {/* Campo Cédula */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <IdCard size={16} />
                Cédula *
              </label>
              <input
                type="text"
                name="cedula"
                value={formData.cedula}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ingresa el número de cédula"
                required
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none mt-6">
                <IdCard size={18} className="text-gray-400" />
              </div>
            </div>

            {/* Campo Teléfono */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Phone size={16} />
                Teléfono *
              </label>
              <input
                type="tel"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ingresa el número de teléfono"
                required
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none mt-6">
                <Phone size={18} className="text-gray-400" />
              </div>
            </div>

            {/* Campo Cargo */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Briefcase size={16} />
                Cargo *
              </label>

              <select
                name="cargo_id"
                value={formData.cargo_id}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Seleccione un cargo</option>
                {cargos.map((cargo) => (
                  <option key={cargo.id} value={cargo.id}>
                    {cargo.nombre}
                  </option>
                ))}
              </select>

              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none mt-6">
                <Briefcase size={18} className="text-gray-400" />
              </div>
            </div>



            {/* Botones */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => window.history.back()}
                className="flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                <ArrowLeft size={18} />
                Volver
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    Guardar Personal
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}