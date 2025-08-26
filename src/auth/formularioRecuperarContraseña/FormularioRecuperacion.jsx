import { useState } from "react";
import { Eye, EyeOff, Mail, ArrowLeft, Lock, User, CheckCircle, Loader2 } from "lucide-react";
import { cambiarContrasena, generarCodigoRecuperacion, validarCodigoRecuperacion } from "../../services/usuario_service";

import Swal from "sweetalert2";

export default function FormularioRecuperacion({ onVolverAlLogin }) {
  const [paso, setPaso] = useState(1); // 1: Email, 2: Código, 3: Nueva contraseña, 4: Éxito
  const [formData, setFormData] = useState({
    usuario: "",
    codigo: "",
    nuevaContrasena: "",
    confirmarContrasena: ""
  });
  const [verContrasena, setVerContrasena] = useState(false);
  const [verConfirmarContrasena, setVerConfirmarContrasena] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEnviarCodigo = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await generarCodigoRecuperacion({ usuario: formData.usuario });
    setLoading(false);

    if (res.status) {
      setPaso(2);
      Swal.fire({
        icon: "success",
        title: "Código enviado",
        text: res.message || "Hemos enviado un código de verificación a tu correo",
        timer: 2000,
        showConfirmButton: false
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: res.message || "No pudimos enviar el código"
      });
    }
  };

  const handleVerificarCodigo = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await validarCodigoRecuperacion({
      usuario: formData.usuario,
      codigo: formData.codigo
    });
    setLoading(false);

    if (res.status) {
      setPaso(3);
      Swal.fire({
        icon: "success",
        title: "Código válido",
        timer: 1500,
        showConfirmButton: false
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Código inválido",
        text: res.message || "El código no es válido o expiró"
      });
    }
  };

  const handleCambiarContrasena = async (e) => {
    e.preventDefault();

    if (formData.nuevaContrasena !== formData.confirmarContrasena) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Las contraseñas no coinciden",
      });
      return;
    }

    setLoading(true);
    const res = await cambiarContrasena({
      usuario: formData.usuario,
      codigo: formData.codigo,
      nueva_contrasena: formData.nuevaContrasena
    });
    setLoading(false);

    if (res.status) {
      setPaso(4);
      Swal.fire({
        icon: "success",
        title: "Contraseña cambiada",
        text: res.message || "Ya puedes iniciar sesión con tu nueva contraseña",
        timer: 2000,
        showConfirmButton: false
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: res.message || "No se pudo cambiar la contraseña"
      });
    }
  };

  return (
    <div className="flex items-center justify-center">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-[0_10px_40px_-15px_rgba(0,0,0,0.2)] overflow-hidden border border-neutral-100">
        <div className="flex flex-col lg:flex-row h-full">
          {/* Sección derecha - Visual (animado) */}
          <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-600 to-violet-700 relative overflow-hidden order-2">
            <div className="absolute inset-0 bg-[url('https://assets.codepen.io/39255/internal/screenshots/separates/2023-abstract-wave-pattern.png')] bg-cover opacity-10 mix-blend-overlay"></div>
            <div className="z-10 text-white p-12 flex flex-col justify-between h-full">
              <div>
                <div className="w-14 h-14 bg-white/20 rounded-lg backdrop-blur flex items-center justify-center mb-8">
                  <Lock className="w-7 h-7 text-white" />
                </div>
                <h1 className="text-4xl font-bold mb-4">Recuperar Acceso</h1>
                <p className="text-lg text-white/90 leading-relaxed">
                  {paso === 1 && "Ingresa tu correo electrónico para recuperar tu contraseña."}
                  {paso === 2 && "Revisa tu bandeja de entrada y ingresa el código de verificación."}
                  {paso === 3 && "Establece una nueva contraseña segura para tu cuenta."}
                  {paso === 4 && "¡Contraseña actualizada correctamente! Ya puedes iniciar sesión."}
                </p>
              </div>
              <div className="flex items-center space-x-2 text-sm text-white/80">
                <Lock className="w-4 h-4" />
                <span>Proceso seguro y encriptado</span>
              </div>
            </div>
          </div>

          {/* Sección izquierda - Formulario (animado) */}
          <div className="w-full lg:w-1/2 p-10 flex flex-col justify-center order-1 relative">
            <button
              onClick={onVolverAlLogin}
              className="absolute top-6 left-6 flex items-center text-sm text-indigo-600 hover:text-indigo-800 transition-colors"
            >
              <ArrowLeft size={16} className="mr-1" />
              Volver al login
            </button>

            <div className="mb-8 text-center lg:text-left">
              <h2 className="text-3xl font-bold text-neutral-900 mb-2">
                {paso === 1 && "Recuperar contraseña"}
                {paso === 2 && "Verificar código"}
                {paso === 3 && "Nueva contraseña"}
                {paso === 4 && "¡Listo!"}
              </h2>
              <p className="text-neutral-500">
                {paso === 1 && "Te enviaremos un código a tu correo electrónico"}
                {paso === 2 && "Ingresa el código que recibiste"}
                {paso === 3 && "Crea una nueva contraseña segura"}
                {paso === 4 && "Tu contraseña ha sido restablecida correctamente"}
              </p>
            </div>

            {/* Indicador de progreso */}
            <div className="mb-8 flex justify-center">
              <div className="flex items-center">
                {[1, 2, 3, 4].map((step) => (
                  <div key={step} className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${paso >= step ? 'bg-indigo-600 text-white' : 'bg-neutral-200 text-neutral-400'
                      }`}>
                      {paso > step ? <CheckCircle size={16} /> : step}
                    </div>
                    {step < 4 && (
                      <div className={`w-12 h-1 mx-2 ${paso > step ? 'bg-indigo-600' : 'bg-neutral-200'}`}></div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Formulario paso 1: Email */}
            {paso === 1 && (
              <form onSubmit={handleEnviarCodigo} className="space-y-6 animate-fade-in-form-recuperar">
                <div className="space-y-1">
                  <label htmlFor="usuario" className="text-sm font-medium text-neutral-700">
                    ingrese su usuario
                  </label>
                  <div className="relative">
                    <input
                      type="usuario"
                      id="usuario"
                      name="usuario"
                      value={formData.usuario}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all placeholder:text-neutral-400"
                      placeholder="usuario@ejemplo.com"
                      required
                      disabled={loading}
                    />
                    <Mail className="w-5 h-5 text-neutral-400 absolute right-3 top-3.5" />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white py-3.5 rounded-lg hover:opacity-90 transition-opacity shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Enviando...</span>
                    </>
                  ) : (
                    <>
                      <Mail className="w-5 h-5" />
                      <span>Enviar código</span>
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Formulario paso 2: Código de verificación */}
            {paso === 2 && (
              <form onSubmit={handleVerificarCodigo} className="space-y-6 animate-fade-in-form-recuperar">
                <div className="space-y-1">
                  <label htmlFor="codigo" className="text-sm font-medium text-neutral-700">
                    Código de verificación
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="codigo"
                      name="codigo"
                      value={formData.codigo}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all placeholder:text-neutral-400 text-center tracking-widest font-mono"
                      placeholder="XXXXXX"
                      required
                      disabled={loading}
                      maxLength={6}
                    />
                  </div>
                  <p className="text-sm text-neutral-500 mt-2">
                    ¿No recibiste el código? <button type="button" className="text-indigo-600 hover:text-indigo-800">Reenviar</button>
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white py-3.5 rounded-lg hover:opacity-90 transition-opacity shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Verificando...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      <span>Verificar código</span>
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Formulario paso 3: Nueva contraseña */}
            {paso === 3 && (
              <form onSubmit={handleCambiarContrasena} className="space-y-6 animate-fade-in-form-recuperar">
                <div className="space-y-1">
                  <label htmlFor="nuevaContrasena" className="text-sm font-medium text-neutral-700">
                    Nueva contraseña
                  </label>
                  <div className="relative">
                    <input
                      type={verContrasena ? "text" : "password"}
                      id="nuevaContrasena"
                      name="nuevaContrasena"
                      value={formData.nuevaContrasena}
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

                <div className="space-y-1">
                  <label htmlFor="confirmarContrasena" className="text-sm font-medium text-neutral-700">
                    Confirmar contraseña
                  </label>
                  <div className="relative">
                    <input
                      type={verConfirmarContrasena ? "text" : "password"}
                      id="confirmarContrasena"
                      name="confirmarContrasena"
                      value={formData.confirmarContrasena}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all placeholder:text-neutral-400"
                      placeholder="••••••••"
                      required
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setVerConfirmarContrasena(!verConfirmarContrasena)}
                      className="absolute right-3 top-3.5 text-neutral-400 hover:text-indigo-600 transition-colors"
                      disabled={loading}
                    >
                      {verConfirmarContrasena ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white py-3.5 rounded-lg hover:opacity-90 transition-opacity shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Actualizando...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-5 h-5" />
                      <span>Cambiar contraseña</span>
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Paso 4: Confirmación */}
            {paso === 4 && (
              <div className="text-center animate-fade-in-form-recuperar">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-10 h-10 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-neutral-900 mb-4">¡Contraseña restablecida!</h3>
                <p className="text-neutral-500 mb-8">
                  Tu contraseña ha sido actualizada correctamente. Ahora puedes iniciar sesión con tu nueva contraseña.
                </p>
                <button
                  onClick={onVolverAlLogin}
                  className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white py-3.5 rounded-lg hover:opacity-90 transition-opacity shadow-md"
                >
                  Volver al inicio de sesión
                </button>
              </div>
            )}
          </div>
        </div>
      </div>


    </div>
  );
}