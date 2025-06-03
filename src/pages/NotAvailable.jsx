import { Hammer } from "lucide-react";
import BackPage from "./paginaCliente/components/BackPage";

export default function NotAvailable() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-gray-800 p-8 text-center">
      {/* Eliminamos 'animate-pulse' y las clases de Tailwind de animación, y usamos nuestra clase CSS personalizada */}
      <Hammer 
        size={72} 
        className="text-blue-600 mb-6 hammering-animation" 
      />
      <h1 className="text-5xl font-extrabold mb-4 tracking-wide">Página No Disponible</h1>
      <h2 className="text-xl font-semibold mb-2">Esta página todavía no se encuentra disponible</h2>
      <p className="mb-8 max-w-md text-gray-600 leading-relaxed">
        Estamos trabajando para poner esta sección en línea pronto. Gracias por tu paciencia.
      </p>
      <BackPage texto="Volver al inicio" />
    </div>
  );
}