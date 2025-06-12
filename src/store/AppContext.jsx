import { createContext, useContext, useState, useEffect } from "react";
import { obtenerPermisos } from "../services/permisos";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [permisos, setPermisos] = useState([]);
  const [cargando, setCargando] = useState(true);

  // Recuperar sesión al cargar la app
  useEffect(() => {
    const user = localStorage.getItem("usuario");
    const userPermisos = localStorage.getItem("permisos");

    if (user) {
      setUsuario(JSON.parse(user));
      setPermisos(JSON.parse(userPermisos) || []);
    }

    setCargando(false);
  }, []);

  // Función de login modificada para recibir permisos
  const login = async (usuario, permisosObtenidos) => {
    setUsuario(usuario);
    setPermisos(permisosObtenidos);
    
    localStorage.setItem("usuario", JSON.stringify(usuario));
    localStorage.setItem("permisos", JSON.stringify(permisosObtenidos));
  };

  const logout = () => {
    setUsuario(null);
    setPermisos([]);
    localStorage.removeItem("usuario");
    localStorage.removeItem("permisos");
  };

  return (
    <AppContext.Provider value={{ usuario, permisos, login, logout, cargando }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);