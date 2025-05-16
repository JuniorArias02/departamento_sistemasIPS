import { createContext, useContext, useState, useEffect } from "react";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true); // nuevo

  useEffect(() => {
    const user = localStorage.getItem("usuario");
    if (user) {
      setUsuario(JSON.parse(user));
    }
    setCargando(false); // ya terminó de verificar
  }, []);

  const login = (data) => {
    setUsuario(data.usuario);
    localStorage.setItem("usuario", JSON.stringify(data.usuario));
  };

  const logout = () => {
    setUsuario(null);
    localStorage.removeItem("usuario");
  };

  return (
    <AppContext.Provider value={{ usuario, login, logout, cargando }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
