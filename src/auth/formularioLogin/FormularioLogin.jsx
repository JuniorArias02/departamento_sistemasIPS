import { useState } from "react";
import { loginUsuario } from "../../services/authService";
import { useApp } from "../../store/AppContext";
import Swal from "sweetalert2";
import { Eye, EyeOff, Smile } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { validarRutas } from "../../secure/validarRutas";
import { obtenerPermisos } from "../../services/permisos";
export default function FormularioLogin() {
  const navigate = useNavigate();
  const { login } = useApp();
  const [formData, setFormData] = useState({ usuario: "", contrasena: "" });
  const [verContrasena, setVerContrasena] = useState(false);
  const [loading, setLoading] = useState(false);


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);

    try {
      const data = await loginUsuario(formData);
      const permisosObtenidos = await obtenerPermisos(data.usuario.id);
      login(data.usuario, permisosObtenidos);
      validarRutas(navigate, permisosObtenidos);

    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: typeof error === "string" ? error : "Error en el inicio de sesión",
      });
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200 p-4">
      <div className="flex flex-col md:flex-row w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden">

        {/* IZQUIERDA: Imagen bonita y mensaje */}
        <div className="hidden md:flex md:w-1/2 items-center justify-center bg-blue-600 relative">
          <div className="z-10 text-white text-center p-8 backdrop-blur-sm bg-black/30 rounded-xl">
            <Smile className="w-32 h-32 mx-auto mb-6 " />
            <h3 className="text-3xl font-bold mb-2">Hola Bievenido!</h3>
            <p className="text-lg">al centro de formularios de la clinica</p>
          </div>
        </div>

        {/* DERECHA: Formulario */}
        <div className="w-full md:w-1/2 p-8 space-y-6 flex flex-col justify-center animate-fade-in">
          <form onSubmit={handleSubmit} className="w-full">
            <h2 className="text-3xl font-bold text-center text-blue-800 mb-6">
              Iniciar Sesión
            </h2>

            <div>
              <label htmlFor="usuario" className="block mb-1 text-gray-700 font-medium">
                Usuario
              </label>
              <input
                type="text"
                id="usuario"
                name="usuario"
                value={formData.usuario}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                placeholder="Ingresa tu usuario"
                required
                disabled={loading}
              />
            </div>

            <div className="relative">
              <label htmlFor="contrasena" className="block mb-1 text-gray-700 font-medium">
                Contraseña
              </label>
              <input
                type={verContrasena ? "text" : "password"}
                id="contrasena"
                name="contrasena"
                value={formData.contrasena}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                placeholder="********"
                required
                disabled={loading}
              />
              <div className="absolute inset-y-0 right-3 flex items-center top-[24px]">
                <button
                  type="button"
                  onClick={() => setVerContrasena(!verContrasena)}
                  className="text-gray-500 hover:text-blue-600 transition"
                  disabled={loading}
                >
                  {verContrasena ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Enlace para recuperar contraseña */}
            <div className="flex justify-end mt-1 mb-4">
              <a href="#" className="text-sm text-blue-600 hover:underline hover:font-medium transition">
                ¿Olvidaste tu contraseña?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Cargando..." : "Entrar"}
            </button>
          </form>
        </div>
      </div>
    </div>

  );
}
