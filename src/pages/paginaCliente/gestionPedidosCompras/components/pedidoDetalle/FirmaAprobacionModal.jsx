
import { useEffect } from "react";
import {
  PenTool,
  Check,
  X
} from "lucide-react";
import { FirmaInput } from "../../../../appFirma/appFirmas";
import AgregarFirmaModal from "../crearPedido/AgregarFirmaModal";

export const FirmaAprobacionModal = ({
  firmaAprobacion,
  setFirmaAprobacion,
  modalOpen,
  setModalOpen,
  isSubmitting,
  setShowFirmaAprobacionForm,
  handleAprobarPedido,
  manejarConfirmacion
}) => {
  useEffect(() => {
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

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

          {/* Botón para usar firma guardada */}
          <div className="mb-6 flex justify-center">
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="bg-gradient-to-r from-indigo-500 to-violet-600 text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
            >
              Usar firma guardada
            </button>
            <AgregarFirmaModal
              open={modalOpen}
              onClose={() => setModalOpen(false)}
              onConfirm={manejarConfirmacion}
            />
          </div>

          {/* Botones de acción */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              onClick={() => {
                setShowFirmaAprobacionForm(false);
                setFirmaAprobacion("");
              }}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              <X size={18} />
              Cancelar
            </button>
            <button
              onClick={handleAprobarPedido}
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