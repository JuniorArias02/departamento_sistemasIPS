import { createContext, useContext, useState, useEffect } from "react";
import { obtenerPermisos } from "../services/permisos";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [permisos, setPermisos] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const user = localStorage.getItem("usuario");
    const userPermisos = localStorage.getItem("permisos");

    if (user) {
      setUsuario(JSON.parse(user));
      setPermisos(JSON.parse(userPermisos) || []);
    }

    setCargando(false);
  }, []);

  const login = async (usuario) => {
    setUsuario(usuario);
    localStorage.setItem("usuario", JSON.stringify(usuario));

    const permisosObtenidos = await obtenerPermisos(usuario.id);
    setPermisos(permisosObtenidos);
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
