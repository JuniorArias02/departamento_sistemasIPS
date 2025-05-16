import { Ghost } from "lucide-react";
import BackPage from "./paginaCliente/components/BackPage";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800 p-8 text-center">
      <Ghost size={64} className="text-blue-600 mb-4" />
      <h1 className="text-5xl font-bold mb-2">404</h1>
      <p className="text-xl mb-4">Página no encontrada</p>
      <p className="mb-6 text-gray-600">
        La página que estás buscando no existe o fue movida.
      </p>
      <BackPage texto="Volver al inicio" />
    </div>
  );
}
