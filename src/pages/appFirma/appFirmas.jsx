// components/FirmaInput.jsx
import { useState } from 'react';
import SignatureModal from './components/SignatureModal';

export const FirmaInput = ({ value, onChange, label = "Firma" }) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      
      <div className="flex items-center gap-4">
        {value ? (
          <div className="relative group">
            <img 
              src={value} 
              alt="Firma" 
              className="w-32 h-20 object-contain border rounded-md"
            />
            <button
              type="button"
              onClick={() => onChange('')}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              ✕
            </button>
          </div>
        ) : (
          <div className="w-32 h-20 flex items-center justify-center border-2 border-dashed rounded-md text-gray-400">
            Sin firma
          </div>
        )}

        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="bg-gradient-to-r from-indigo-500 to-violet-600 hover:opacity-90 px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors cursor-pointer"
        >
          {value ? 'Cambiar' : 'Agregar'}
        </button>
      </div>

      {showModal && (
        <SignatureModal
          onClose={() => setShowModal(false)}
          onSaveSignature={(data) => {
            onChange(data);
            setShowModal(false);
          }}
        />
      )}
    </div>
  );
};