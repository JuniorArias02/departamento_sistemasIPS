// components/SignatureModal.jsx
import { useState } from 'react';
import SignatureCanvas from './SignatureCanvas';
import SignatureToolbar from './SignatureToolbar';

const SignatureModal = ({ onClose, onSaveSignature }) => {
  const [brush, setBrush] = useState(8);
  const [dataURL, setDataURL] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const clearCanvas = () => {
    setDataURL('');
  };

  const save = async () => {
    setIsSubmitting(true);
    await onSaveSignature(dataURL);
    setIsSubmitting(false);
    onClose();
  };

  return (
    <div className="bg-white rounded-2xl p-6 w-full max-w-4xl max-h-[90vh] shadow-xl flex flex-col overflow-y-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800 m-0">Firma aquí</h2>
        <button
          onClick={onClose}
          className="bg-transparent border-none text-xl cursor-pointer text-gray-500 p-1 hover:text-gray-700 transition-colors"
        >
          ✕
        </button>
      </div>

      {/* Contenido principal - Layout horizontal */}
      <div className="flex flex-col md:flex-row gap-6 flex-1 overflow-hidden">
        {/* Panel lateral izquierdo - Herramientas */}
        <div className="w-full md:w-1/3 flex flex-col overflow-y-auto">
          <SignatureToolbar
            onBrushChange={setBrush}
            onClear={clearCanvas}
            onSave={save}
            onCancel={onClose}
            disabled={!dataURL || isSubmitting}
            currentBrush={brush}
          />
          
          {isSubmitting && (
            <div className="mt-4 text-indigo-600 flex items-center gap-2">
              <div className="spinner border-2 border-indigo-600 border-t-transparent rounded-full w-4 h-4 animate-spin"></div>
              <span>Guardando...</span>
            </div>
          )}
        </div>

        {/* Área de firma a la derecha */}
        <div className="w-full md:w-2/3 flex-1 border-2 border-dashed border-gray-300 rounded-xl overflow-hidden min-h-[350px] overflow-y-auto ">
          <SignatureCanvas
            brushSize={brush}
            onChange={setDataURL}
          />
        </div>
      </div>
    </div>
  );
};

export default SignatureModal;