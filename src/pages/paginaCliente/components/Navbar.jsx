import { LogOut, Menu, X } from "lucide-react";
import { useApp } from "../../../store/AppContext";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useState } from "react";
import { ADMINISTRADOR } from "../../../const/variable_entorno";
export default function Navbar() {
  const navigate = useNavigate();
  const { usuario, logout } = useApp();
  const [menuAbierto, setMenuAbierto] = useState(false);

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
        navigate("/");
      }
    });
  };

  return (
    <>
      {/* Navbar superior */}
      <nav className="bg-custom-blue-1 text-white px-4 py-3 shadow-md flex justify-between items-center">
        <div className="font-bold text-lg sm:text-xl">
          Departamento De Sistemas 💻
        </div>

        {/* Botón menú móvil */}
        <button className="sm:hidden" onClick={() => setMenuAbierto(true)}>
          <Menu size={24} />
        </button>

        {/* Menú escritorio */}
        <div className="hidden sm:flex items-center space-x-6">
          {usuario?.rol === ADMINISTRADOR && (
            <button
              onClick={() => navigate("/dashboard/view_usuarios")}
              className="hover:bg-blue-600 px-2 py-1 rounded transition cursor-pointer"
            >
              Ver Usuarios
            </button>
          )}


          <span className="capitalize">
            {usuario?.nombre_completo || "Usuario"}
          </span>
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

      {/* Menú lateral móvil (slide) */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-custom-blue-1 text-white shadow-lg transform ${menuAbierto ? "translate-x-0" : "-translate-x-full"} transition-transform duration-300 z-50 sm:hidden`}
      >
        <div className="flex justify-between items-center px-4 py-3 border-b border-white">
          <span className="font-semibold">Menú</span>
          <button onClick={() => setMenuAbierto(false)}>
            <X size={24} />
          </button>
        </div>
        <ul className="flex flex-col p-4 space-y-4">
          <li className="capitalize">
            {usuario?.nombre_completo || "Usuario"}
          </li>
          {usuario?.rol === ADMINISTRADOR && (
            <li>
              <button
                onClick={() => {
                  navigate("/dashboard/view_usuarios");
                  setMenuAbierto(false);
                }}
                className="w-full text-left px-2 py-1 hover:bg-blue-600 rounded transition cursor-pointer"
              >
                Ver Usuarios
              </button>
            </li>
          )}


          <li>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 hover:bg-blue-600 px-2 py-1 rounded transition"
              title="Cerrar sesión"
            >
              <LogOut size={20} />
              <span>Salir</span>
            </button>
          </li>
        </ul>
      </div>

      {/* Fondo oscuro cuando el menú está abierto */}
      {menuAbierto && (
        <div
          className="fixed inset-0 bg-black opacity-40 z-40 sm:hidden"
          onClick={() => setMenuAbierto(false)}
        ></div>
      )}
    </>
  );
}
