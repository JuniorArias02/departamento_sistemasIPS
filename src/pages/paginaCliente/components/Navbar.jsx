import { LogOut, Menu, X } from "lucide-react";
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
      <nav className="bg-custom-blue-1 text-white px-4 py-3 shadow-md flex justify-between items-center">
        <div className="flex items-center space-x-4">
          {permisos.includes(PERMISOS.INGRESAR_SIDEBAR_ADMIN) && toggleSidebar && (
            <button
              onClick={toggleSidebar}
              className="transition-transform duration-300 z-50"
              title={sidebarOpen ? "Cerrar menú" : "Abrir menú"}
            >
              <div
                className={`transform transition-transform duration-300 ${sidebarOpen ? "rotate-180" : "rotate-0"
                  }`}
              >
                {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
              </div>
            </button>
          )}

          <div className="font-bold text-lg sm:text-xl">
            Departamento De Sistemas 💻
          </div>

        </div>

        <div className="flex items-center space-x-4">
          {/* Nombre del usuario solo en pantallas grandes */}
          <motion.span
            className="hidden sm:inline capitalize"
            initial={{ opacity: 1, x: 0 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            {usuario?.nombre_completo || "Usuario"}
          </motion.span>

          {/* Botón de salir visible siempre */}
          <button
            onClick={handleLogout}
            className="flex items-center space-x-1 hover:bg-blue-600 px-2 py-1 rounded transition"
            title="Cerrar sesión"
          >
            <LogOut size={20} />
            <span>Salir</span>
          </button>
        </div>

      </nav>
    </>
  );
}