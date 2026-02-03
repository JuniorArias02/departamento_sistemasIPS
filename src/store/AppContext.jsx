import { createContext, useContext, useState, useEffect } from "react";
import { obtenerPermisos } from "../services/permisos_services";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [permisos, setPermisos] = useState([]);
  const [cargando, setCargando] = useState(true);

  // Cargar datos al iniciar
  useEffect(() => {
    const user = localStorage.getItem("usuario");
    const userPermisos = localStorage.getItem("permisos");

    if (user) {
      setUsuario(JSON.parse(user));
      setPermisos(JSON.parse(userPermisos) || []);
    }
    setCargando(false);
  }, []);

  // Función para actualizar permisos sin cerrar sesión
  const actualizarPermisos = async () => {
    if (!usuario) return;

    try {
      const nuevosPermisos = await obtenerPermisos(usuario.id);
      setPermisos(nuevosPermisos);
      localStorage.setItem("permisos", JSON.stringify(nuevosPermisos));
    } catch (error) {
      console.error("Error al actualizar permisos:", error);
    }
  };

  const login = async (usuarioData, permisosObtenidos) => { 
    setUsuario(usuarioData);
    setPermisos(permisosObtenidos);
    localStorage.setItem("usuario", JSON.stringify(usuarioData));
    localStorage.setItem("permisos", JSON.stringify(permisosObtenidos));
  };

  const logout = () => {
    setUsuario(null);
    setPermisos([]);
    localStorage.removeItem("usuario");
    localStorage.removeItem("permisos");
  };

  return (
    <AppContext.Provider
      value={{ usuario, permisos, login, logout, cargando, actualizarPermisos }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);

