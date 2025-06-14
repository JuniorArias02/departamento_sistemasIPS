import { LogOut, Menu, X,Cpu ,Bell ,User  } from "lucide-react";
import { useApp } from "../../../store/AppContext";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { motion, AnimatePresence } from "framer-motion";
import { PERMISOS } from "../../../secure/permisos/permisos";
import { RUTAS } from "../../../const/routers/routers";

export default function Navbar({ toggleSidebar, sidebarOpen }) {
  const navigate = useNavigate();
  const { usuario, logout, permisos } = useApp();

  const handleLogout = () => {
    Swal.fire({
      title: "¿Quieres cerrar sesión?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, salir",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        logout();
        navigate(RUTAS.LOGIN);
      }
    });
  };

  return (
    <>
      <nav className="bg-gradient-to-r from-indigo-700 to-violet-800 text-white px-6 py-3 shadow-lg flex justify-between items-center border-b border-white/10">
        {/* Parte izquierda */}
        <div className="flex items-center gap-5">
          {permisos.includes(PERMISOS.INGRESAR_SIDEBAR_ADMIN) && toggleSidebar && (
            <motion.button
              onClick={toggleSidebar}
              className="z-50 p-1 rounded-lg hover:bg-white/10 transition-colors"
              title={sidebarOpen ? "Cerrar menú" : "Abrir menú"}
              whileTap={{ scale: 0.9 }}
              aria-label="Toggle sidebar"
            >
              <motion.div
                animate={{
                  rotate: sidebarOpen ? 180 : 0
                }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 15
                }}
              >
                {sidebarOpen ? (
                  <X size={24} className="text-white/90" />
                ) : (
                  <Menu size={24} className="text-white/90" />
                )}
              </motion.div>
            </motion.button>
          )}

          <div className="flex items-center gap-2">
            <div className="bg-white/10 p-2 rounded-lg backdrop-blur-sm">
              <Cpu className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-lg sm:text-xl bg-clip-text bg-gradient-to-r from-white to-blue-100 text-transparent">
              Departamento de Sistemas
            </span>
          </div>
        </div>

        {/* Parte derecha */}
        <div className="flex items-center gap-4">
          {/* Notificaciones (opcional) */}
          <button
            className="p-2 rounded-full hover:bg-white/10 transition-colors relative"
            aria-label="Notificaciones"
          >
            <Bell className="w-5 h-5 text-white/90" />
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* Perfil del usuario */}
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="hidden sm:flex flex-col items-end">
              <motion.span
                className="font-medium text-white/90"
                initial={{ opacity: 1, x: 0 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                {usuario?.nombre_completo || "Usuario"}
              </motion.span>
              <span className="text-xs text-white/60">
                {usuario?.rol || "Administrador"}
              </span>
            </div>

            {/* Avatar */}
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border-2 border-white/20 group-hover:border-white/40 transition-colors">
                {usuario?.foto ? (
                  <img
                    src={usuario.foto}
                    alt="Foto de perfil"
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <User className="w-5 h-5 text-white/80" />
                )}
              </div>

              {/* Menú desplegable (opcional) */}
              <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-xl py-1 hidden group-hover:block z-50">
                <div className="px-4 py-2 text-sm text-gray-700 border-b">
                  <div className="font-medium">{usuario?.nombre_completo}</div>
                  <div className="text-xs text-gray-500">{usuario?.email}</div>
                </div>
                <a
                  href="#"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Mi perfil
                </a>
                <a
                  href="#"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Configuración
                </a>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Cerrar sesión</span>
                </button>
              </div>
            </div>
          </div>

          {/* Botón de salir - versión móvil */}
          <button
            onClick={handleLogout}
            className="sm:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
            title="Cerrar sesión"
            aria-label="Cerrar sesión"
          >
            <LogOut className="w-5 h-5 text-white/90" />
          </button>
        </div>
      </nav>
    </>
  );
}