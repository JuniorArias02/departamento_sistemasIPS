import { useEffect, useState } from "react";
import {
  PenTool,
  Check,
  X,
  MessageCircle
} from "lucide-react";
import { FirmaInput } from "../../../../appFirma/appFirmas";


export const FirmaAprobacionModal = ({
  firmaAprobacion,
  setFirmaAprobacion,
  modalOpen,
  setModalOpen,
  isSubmitting,
  setShowFirmaAprobacionForm,
  handleAprobarPedido,
  manejarConfirmacion,
  onObservacionChange
}) => {
  const [motivoAprobacion, setMotivoAprobacion] = useState("");

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleConfirmarAprobacion = () => {
    handleAprobarPedido(motivoAprobacion);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#00000050] bg-opacity-70">
      <div className="w-full max-w-md bg-white rounded-xl shadow-xl overflow-hidden">
        {/* Encabezado */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <PenTool size={24} className="text-blue-200" />
              <h3 className="text-xl font-semibold">Firma de Aprobación</h3>
            </div>
            <button
              onClick={() => setShowFirmaAprobacionForm(false)}
              className="p-1 rounded-full hover:bg-blue-700 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
          <p className="mt-2 text-blue-100 text-sm">
            Por favor firma en el recuadro para aprobar el pedido
          </p>
        </div>

        {/* Contenido */}
        <div className="p-6">
          {/* Área de firma */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Firma actual
            </label>
            <FirmaInput
              value={firmaAprobacion}
              onChange={setFirmaAprobacion}
              label=""
              canvasHeight={150}
            />
          </div>

          {/* Campo de observación opcional */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <div className="flex items-center gap-2">
                <MessageCircle size={16} className="text-gray-500" />
                Observación de Aceptación (Opcional)
              </div>
            </label>
            <textarea
              value={motivoAprobacion}
              onChange={(e) => setMotivoAprobacion(e.target.value)}
              placeholder="Escribe el motivo de la aceptación o comentarios adicionales..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              maxLength={500}
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Este campo es opcional</span>
              <span>{motivoAprobacion.length}/500</span>
            </div>
          </div>

          {/* Botón para usar firma guardada */}
          <div className="mb-6 flex justify-center">
            <button
              type="button"
              onClick={manejarConfirmacion}
              className="bg-gradient-to-r from-indigo-500 to-violet-600 text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
            >
              Usar firma guardada
            </button>
          </div>

          {/* Botones de acción */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              onClick={() => {
                setShowFirmaAprobacionForm(false);
                setFirmaAprobacion("");
                setObservacion("");
              }}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              <X size={18} />
              Cancelar
            </button>
            <button
              onClick={handleConfirmarAprobacion}
              disabled={!firmaAprobacion || isSubmitting}
              className={`flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg font-medium hover:opacity-90 transition-all ${!firmaAprobacion ? "opacity-70 cursor-not-allowed" : ""
                }`}
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Procesando...
                </>
              ) : (
                <>
                  <Check size={18} />
                  Confirmar Aprobación
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};