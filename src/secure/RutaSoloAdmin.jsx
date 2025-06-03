import { Navigate } from "react-router-dom";
import { useApp } from "../store/AppContext";
import { ADMINISTRADOR } from "../const/variable_entorno";

export default function RutaSoloAdmin({ children }) {
  const { usuario } = useApp();

  // Si no es admin, manda al 404
  if (usuario?.rol !== ADMINISTRADOR) {
    return <Navigate to="/404" replace />;
  }

  
  return children;
}
