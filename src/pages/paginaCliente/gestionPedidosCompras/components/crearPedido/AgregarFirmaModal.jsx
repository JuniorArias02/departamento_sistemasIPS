import { useState } from "react";
import { X, Lock, ArrowRight } from "lucide-react";
import { agregarFirmaPorClave } from "../../../../../services/usuario_service";

export default function AgregarFirmaModal({ open, onClose, onConfirm }) {
  const [contrasena, setContrasena] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    setIsLoading(true);
    await onConfirm(contrasena);
    setIsLoading(false);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      {/* Fondo oscuro con animación */}
      <div 
        className="fixed inset-0 bg-black/30 transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal moderno */}
      <div className="relative w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left shadow-xl transition-all">
        {/* Encabezado */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100">
              <Lock className="h-5 w-5 text-indigo-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">
              Verificación requerida
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Contenido */}
        <div className="mt-4">
          <p className="text-sm text-gray-500">
            Por favor ingresa tu contraseña para confirmar la firma
          </p>
          
          <div className="mt-5">
            <label htmlFor="password" className="sr-only">
              Contraseña
            </label>
            <div className="relative rounded-md shadow-sm">
              <input
                id="password"
                name="password"
                type="password"
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
                className="block w-full rounded-md border-gray-300 py-3 px-4 pr-10 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="Ingresa tu contraseña"
                autoComplete="current-password"
              />
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                <Lock className="h-4 w-4 text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Acciones */}
        <div className="mt-6 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={!contrasena || isLoading}
            className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <svg className="-ml-1 mr-2 h-4 w-4 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Verificando...
              </>
            ) : (
              <>
                Confirmar
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}