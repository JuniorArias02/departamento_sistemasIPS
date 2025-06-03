import { Navigate } from "react-router-dom";
import { useApp } from "../store/AppContext";

export default function RutaPrivada({ children }) {
  const { usuario, cargando } = useApp();

if (cargando) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white text-blue-600">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-opacity-30 mb-4"></div>
      <p className="text-xl font-semibold animate-pulse">Cargando</p>
    </div>
  );
}


  if (!usuario) {
    return <Navigate to="/" replace />;
  }

  return children;
}
