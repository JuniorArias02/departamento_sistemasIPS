import { LogOut, Menu, X, Cpu, Bell, User } from "lucide-react";
import { useApp } from "../../../store/AppContext";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { motion, AnimatePresence } from "framer-motion";
import { PERMISOS } from "../../../secure/permisos/permisos";
import { RUTAS } from "../../../const/routers/routers";
import { useState, useRef, useEffect } from "react";
import DepartamentoSistemas from "./DepartamentoSistemas";
import { notificarActualizaciones } from "../../../services/administrador_web_services";

export default function Navbar({ toggleSidebar, sidebarOpen }) {
  const navigate = useNavigate();
  const { usuario, logout, permisos } = useApp();
  const [mostrarMenu, setMostrarMenu] = useState(false);
  const [cantidadActualizaciones, setCantidadActualizaciones] = useState(0);
  const menuRef = useRef(null);

  const toggleMenu = () => setMostrarMenu(prev => !prev);


  useEffect(() => {
    const obtenerActualizaciones = async () => {
      try {
        const res = await notificarActualizaciones();
        if (res.success && Array.isArray(res.data)) {
          setCantidadActualizaciones(res.data.length);
        }
      } catch (error) {
        console.error("Error al consultar actualizaciones:", error);
      }
    };

    obtenerActualizaciones();
  }, []);

  useEffect(() => {
    const handleClickFuera = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMostrarMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickFuera);
    return () => document.removeEventListener("mousedown", handleClickFuera);
  }, []);

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
      <nav className="h-16 bg-gradient-to-r from-indigo-700 to-violet-800 text-white px-4 py-2 sm:px-6 sm:py-3 shadow-lg flex justify-between items-center border-b border-white/10">
        {/* Parte izquierda - más compacta */}
        <div className="flex items-center gap-3">
          {permisos.includes(PERMISOS.SISTEMA.INGRESAR_SIDEBAR_ADMIN) && toggleSidebar && (
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
                  <X size={20} className="text-white/90" />
                ) : (
                  <Menu size={20} className="text-white/90" />
                )}
              </motion.div>
            </motion.button>
          )}

          <div className="scale-90 sm:scale-100 origin-left">
            <DepartamentoSistemas />
          </div>
        </div>

        {/* Parte derecha - optimizada para móvil */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Notificaciones */}
          <button
            className="p-1 sm:p-2 rounded-full hover:bg-white/10 transition-colors relative cursor-pointer"
            aria-label="Notificaciones"
            onClick={() => navigate(RUTAS.USER.SISTEMA.VER_ACTUALIZACIONES)}
          >
            <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-white/90" />
            {cantidadActualizaciones > 0 && (
              <span className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-red-500 text-white text-[10px] sm:text-xs rounded-full h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center">
                {cantidadActualizaciones}
              </span>
            )}
          </button>

          {/* Menú usuario */}
          <div className="relative" ref={menuRef}>
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={toggleMenu}
            >
              <div className="hidden sm:flex flex-col items-end">
                <span className="font-medium text-white/90 text-sm">
                  {usuario?.nombre_completo || "Usuario"}
                </span>
                <span className="text-xs text-white/60">
                  {usuario?.rol || "Administrador"}
                </span>
              </div>
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/10 flex items-center justify-center border-2 border-white/20 hover:border-white/40">
                {usuario?.foto ? (
                  <img src={usuario.foto} className="w-full h-full rounded-full object-cover" />
                ) : (
                  <User className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-white/80" />
                )}
              </div>
            </div>

            {mostrarMenu && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-xl py-1 z-50">
                <div className="px-4 py-2 text-sm text-gray-700 border-b">
                  <div className="font-medium truncate">{usuario?.nombre_completo}</div>
                  <div className="text-xs text-gray-500 truncate">{usuario?.email}</div>
                </div>
                <a
                  onClick={() => {
                    navigate(RUTAS.USER.PERFIL.ROOT);
                    setTimeout(() => setMostrarMenu(false), 150);
                  }}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
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
            )}
          </div>
        </div>
      </nav>
    </>
  );
}