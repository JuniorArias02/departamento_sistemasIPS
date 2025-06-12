import { Navigate } from "react-router-dom";
import { useApp } from "../store/AppContext";
import { PERMISOS } from "./permisos/permisos";
export default function RutaSoloAdmin({ children }) {
  const { permisos } = useApp();

  if (!permisos.includes(PERMISOS.INGRESAR_DASHBOARDADMIN)) {
    return <Navigate to="/404" replace />;
  }

  return children;
}