import { useState, useEffect } from "react";
import { loginUsuario } from "../../services/auth_service";
import { useApp } from "../../store/AppContext";
import Swal from "sweetalert2";
import { Eye, EyeOff, Hospital, Shield, User, LogIn, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { validarRutas } from "../../secure/validarRutas";
import { obtenerPermisos } from "../../services/permisos_services";
import getVersion from "../../../version";
import FormularioRecuperacion from "../formularioRecuperarContraseña/FormularioRecuperacion";

export default function FormularioLogin() {
  const navigate = useNavigate();
  const { login } = useApp();
  const [formData, setFormData] = useState({ usuario: "", contrasena: "" });
  const [verContrasena, setVerContrasena] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mostrarRecuperacion, setMostrarRecuperacion] = useState(false);
  const [bloqueadoHasta, setBloqueadoHasta] = useState(null);
  const [tiempoRestante, setTiempoRestante] = useState(0);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    if (!bloqueadoHasta) return;

    const interval = setInterval(() => {
      const segundos = Math.max(0, Math.floor((bloqueadoHasta - Date.now()) / 1000));
      setTiempoRestante(segundos);

      if (segundos <= 0) {
        clearInterval(interval);
        setBloqueadoHasta(null);
        setTiempoRestante(0);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [bloqueadoHasta]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading || bloqueadoHasta) return;

    setLoading(true);

    try {
      const data = await loginUsuario(formData);

      if (data.usuario) {
        const permisosObtenidos = await obtenerPermisos(data.usuario.id);
        login(data.usuario, permisosObtenidos);
        validarRutas(navigate, permisosObtenidos);
      } else {
        throw data;
      }
    } catch (error) {
      if (error?.status === "bloqueado") {
        const segundos = error.tiempo_restante;
        setBloqueadoHasta(Date.now() + segundos * 1000);
        Swal.fire({
          icon: "error",
          title: "Acceso bloqueado",
          html: `Demasiados intentos fallidos.`,
          confirmButtonColor: "#6366f1"
        });
      } else if (error?.status === "error") {
        Swal.fire({
          icon: "warning",
          title: "Credenciales incorrectas",
          text: `Intentos restantes: ${error.intentos_restantes ?? "N/A"}`,
          confirmButtonColor: "#f59e0b"
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: typeof error === "string" ? error : "Error en el inicio de sesión",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const formatTiempo = (segundos) => {
    const min = String(Math.floor(segundos / 60)).padStart(2, "0");
    const sec = String(segundos % 60).padStart(2, "0");
    return `${min}:${sec}`;
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 p-4">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-[0_10px_40px_-15px_rgba(0,0,0,0.2)] overflow-hidden border border-neutral-100 relative">

        {/* Contenedor para el formulario de login */}
        <div className={`transition-all duration-500 ease-in-out ${mostrarRecuperacion ? 'opacity-0 absolute inset-0 -translate-x-full' : 'opacity-100'}`}>
          <div className="flex flex-col lg:flex-row h-full">
            {/* Sección izquierda - Visual */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-600 to-violet-700 relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('https://assets.codepen.io/39255/internal/screenshots/separates/2023-abstract-wave-pattern.png')] bg-cover opacity-10 mix-blend-overlay"></div>
              <div className="z-10 text-white p-12 flex flex-col justify-between h-full">
                <div>
                  <div className="w-14 h-14 bg-white/20 rounded-lg backdrop-blur flex items-center justify-center mb-8">
                    <Hospital className="w-7 h-7 text-white" />
                  </div>
                  <h1 className="text-4xl font-bold mb-4">Bienvenido al Portal</h1>
                  <p className="text-lg text-white/90 leading-relaxed">
                    Accede al sistema centralizado de gestión de formularios Generales.
                  </p>
                </div>
                <div className="flex items-center space-x-2 text-sm text-white/80">
                  <Shield className="w-4 h-4" />
                  <span>Cumplimiento con la privacidad garantizado</span>
                </div>
              </div>
            </div>

            {/* Sección derecha - Formulario */}
            <div className="w-full lg:w-1/2 p-10 flex flex-col justify-center">
              <div className="mb-8 text-center lg:text-left">
                <h2 className="text-3xl font-bold text-neutral-900 mb-2">Iniciar Sesión</h2>
                <p className="text-neutral-500">Ingresa tus credenciales para acceder</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-1">
                  <label htmlFor="usuario" className="text-sm font-medium text-neutral-700">
                    Nombre de usuario
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="usuario"
                      name="usuario"
                      value={formData.usuario}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all placeholder:text-neutral-400"
                      placeholder="usuario@house"
                      required
                      disabled={loading}  
                    />
                    <User className="w-5 h-5 text-neutral-400 absolute right-3 top-3.5" />
                  </div>
                </div>  

                <div className="space-y-1">
                  <label htmlFor="contrasena" className="text-sm font-medium text-neutral-700">
                    Contraseña
                  </label>
                  <div className="relative">
                    <input
                      type={verContrasena ? "text" : "password"}
                      id="contrasena"
                      name="contrasena"
                      value={formData.contrasena}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all placeholder:text-neutral-400"
                      placeholder="••••••••"
                      required
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setVerContrasena(!verContrasena)}
                      className="absolute right-3 top-3.5 text-neutral-400 hover:text-indigo-600 transition-colors"
                      disabled={loading}
                    >
                      {verContrasena ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 rounded border-neutral-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-neutral-700">
                      Recordar sesión
                    </label>
                  </div>
                  <button
                    type="button"
                    onClick={() => setMostrarRecuperacion(true)}
                    className="text-sm font-medium text-indigo-600 hover:text-indigo-500 transition-colors"
                  >
                    ¿Olvidaste tu contraseña?
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loading || !!bloqueadoHasta}
                  className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white py-3.5 rounded-lg hover:opacity-90 transition-opacity shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Verificando...</span>
                    </>
                  ) : bloqueadoHasta ? (
                    <>
                      <span> {formatTiempo(tiempoRestante)}</span>
                    </>
                  ) : (
                    <>
                      <LogIn className="w-5 h-5" />
                      <span>Acceder al sistema</span>
                    </>
                  )}
                </button>

              </form>

              <div className="mt-8 text-center text-sm text-neutral-500">
                <p>¿No tienes una cuenta? <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors">Contacta al administrador</a></p>
              </div>
              <div className="text-center text-xs text-neutral-400 mt-4">
                v{getVersion().version} • {getVersion().releaseDate}
              </div>
            </div>
          </div>
        </div>

        {/* Contenedor para el formulario de recuperación */}
        <div className={`transition-all duration-500 ease-in-out ${mostrarRecuperacion ? 'opacity-100' : 'opacity-0 absolute inset-0 translate-x-full pointer-events-none'}`}>
          {mostrarRecuperacion && (
            <FormularioRecuperacion onVolverAlLogin={() => setMostrarRecuperacion(false)} />
          )}
        </div>
      </div>
    </div>
  );
}