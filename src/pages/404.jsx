import { Ghost } from "lucide-react";
import BackPage from "./paginaCliente/components/BackPage";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-white to-blue-50 text-gray-900 p-8 text-center">
      <Ghost size={72} className="text-blue-700 mb-6 animate-bounce" />
      <h1 className="text-7xl font-extrabold mb-4 tracking-wide text-blue-900">404</h1>
      <h2 className="text-2xl font-semibold mb-2">Oops! Página no encontrada</h2>
      <p className="mb-8 max-w-md text-gray-600 leading-relaxed">
        La página que buscas no existe, fue movida o está temporalmente fuera de servicio.
      </p>
      <BackPage texto="Volver al inicio" className="bg-blue-700 hover:bg-blue-800 text-white font-semibold px-6 py-3 rounded-lg shadow-lg transition-colors duration-300" />
    </div>
  );
}
