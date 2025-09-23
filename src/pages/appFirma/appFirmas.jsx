// components/FirmaInput.jsx
import { useState, useEffect } from 'react';
import SignatureModal from './components/SignatureModal';
import Portal from '../paginaCliente/components/Portal';

export const FirmaInput = ({ value, onChange, label = "Firma", icon, required = false }) => {
  const [showModal, setShowModal] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="mb-6">
      <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
        {icon && icon}
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <div className="flex items-center gap-4">
        {value ? (
          <div
            className="relative group cursor-pointer"
            onClick={() => setShowModal(true)}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <img
              src={value}
              alt="Firma del cliente"
              className="w-40 h-24 object-contain border rounded-lg shadow-sm transition-all duration-200 group-hover:shadow-md"
            />
            <div className={`absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center rounded-lg transition-opacity duration-200 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
              <span className="text-white text-sm font-medium">Editar</span>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onChange('');
              }}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-md hover:bg-red-600"
              aria-label="Eliminar firma"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ) : (
          <div
            className="w-40 h-24 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg text-gray-400 hover:border-violet-400 hover:text-violet-500 transition-colors duration-200 cursor-pointer"
            onClick={() => setShowModal(true)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
            <span className="text-xs">Haga clic para firmar</span>
          </div>
        )}

      
      </div>

      {!value && (
        <p className="text-xs text-gray-500 mt-2">Se requiere firma para continuar</p>
      )}

      {showModal && (
        <Portal>
          <FullScreenOverlay onClose={() => setShowModal(false)}>
            <SignatureModal
              onClose={() => setShowModal(false)}
              onSaveSignature={(data) => {
                onChange(data);
                setShowModal(false);
              }}
            />
          </FullScreenOverlay>
        </Portal>
      )}
    </div>
  );
};

// Componente para el overlay de pantalla completa con mejora de cierre
const FullScreenOverlay = ({ children, onClose }) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.keyCode === 27) onClose(); // Cerrar con tecla ESC
    };

    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden'; // Prevenir scroll

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 bg-opacity-70  flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
};