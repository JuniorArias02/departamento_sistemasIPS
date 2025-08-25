// components/SignatureToolbar.jsx
import { Eraser, Save, X, Pen } from 'lucide-react';

const SignatureToolbar = ({ onBrushChange, onClear, onSave, onCancel, disabled, currentBrush }) => {
  const brushOptions = [
    { value: 4, label: "Muy fino", icon: <Pen size={12} /> },
    { value: 8, label: "Fino", icon: <Pen size={16} /> },
    { value: 12, label: "Medio", icon: <Pen size={20} /> },
    { value: 16, label: "Grueso", icon: <Pen size={24} /> },
  ];

  return (
    <div className="bg-gray-50 rounded-xl p-4 shadow-sm flex flex-col gap-4 ">
      {/* Título de herramientas */}
      <h3 className="text-sm font-medium text-gray-700 mb-1">Herramientas de firma</h3>
      
      {/* Selector de pincel con iconos visuales */}
      <div>
        <p className="text-xs text-gray-500 mb-2">Grosor del trazo</p>
        <div className="flex flex-wrap gap-2">
          {brushOptions.map((brush) => (
            <button
              key={brush.value}
              onClick={() => onBrushChange(brush.value)}
              className={`flex flex-col items-center p-2 rounded-lg border transition-all min-w-[60px] ${
                currentBrush === brush.value
                  ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                  : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-100'
              }`}
              title={brush.label}
            >
              <div className={`${currentBrush === brush.value ? 'text-indigo-600' : 'text-gray-600'}`}>
                {brush.icon}
              </div>
              <span className="text-xs mt-1">{brush.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Botones de acción */}
      <div className="mt-2 space-y-2 m-2 overflow-auto">
        <button
          onClick={onClear}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <Eraser size={18} />
          {/* <span>Limpiar</span> */}
        </button>

        <div className="flex gap-2">
          <button
            onClick={onSave}
            disabled={disabled}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              disabled
                ? 'bg-gray-400 text-white cursor-not-allowed'
                : 'bg-indigo-600 text-white hover:bg-indigo-700'
            }`}
          >
            <Save size={18} />
            {/* <span>Guardar</span> */}
          </button>

          <button
            onClick={onCancel}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <X size={18} />
            {/* <span>Cancelar</span> */}
          </button>
        </div>
      </div>

      {/* Indicador visual del pincel actual */}
      <div className="mt-4 pt-3 border-t border-gray-200">
        <p className="text-xs text-gray-500 mb-2">Pincel seleccionado:</p>
        <div className="flex items-center gap-2">
          <div className="flex-shrink-0">
            <Pen size={currentBrush + 8} className="text-indigo-600" />
          </div>
          <div className="flex-1">
            <div 
              className="bg-indigo-600 rounded-full"
              style={{ height: `${currentBrush}px`, width: `${currentBrush * 4}px` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignatureToolbar;