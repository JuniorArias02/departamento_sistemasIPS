import { Eraser, Save, X, Pen } from 'lucide-react';

const SignatureToolbar = ({ onBrushChange, onClear, onSave, onCancel }) => {
  const brushOptions = [
    { value: 8, label: "Fino", icon: <Pen size={14} /> },
    { value: 12, label: "Medio", icon: <Pen size={18} /> },
    { value: 16, label: "Grueso", icon: <Pen size={22} /> },
  ];

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      padding: '12px',
      background: '#f8f9fa',
      borderRadius: '12px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    }}>
      {/* Primera línea: Selector de pinceles */}
      <div style={{ 
        display: 'flex', 
        gap: '8px', 
        alignItems: 'center',
        justifyContent: 'center',
        flexWrap: 'wrap'
      }}>
        {brushOptions.map((brush) => (
          <button
            key={brush.value}
            onClick={() => onBrushChange(brush.value)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 12px',
              background: '#fff',
              border: '1px solid #e0e0e0',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 0.2s',
              minWidth: '80px',
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#f0f0f0'}
            onMouseLeave={(e) => e.currentTarget.style.background = '#fff'}
          >
            {brush.icon}
            <span style={{ fontSize: '14px' }}>{brush.label}</span>
          </button>
        ))}
      </div>

      {/* Segunda línea: Acciones */}
      <div style={{ 
        display: 'flex', 
        gap: '8px',
        justifyContent: 'center',
        flexWrap: 'wrap'
      }}>
        <button
          onClick={onClear}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 12px',
            background: '#fff',
            border: '1px solid #e0e0e0',
            borderRadius: '8px',
            cursor: 'pointer',
            minWidth: '100px',
          }}
        >
          <Eraser size={18} />
          <span>Borrar</span>
        </button>

        <button
          onClick={onSave}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 12px',
            background: '#4f46e5',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            minWidth: '100px',
          }}
        >
          <Save size={18} />
          <span>Guardar</span>
        </button>

        <button
          onClick={onCancel}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 12px',
            background: '#fff',
            border: '1px solid #e0e0e0',
            borderRadius: '8px',
            cursor: 'pointer',
            minWidth: '100px',
          }}
        >
          <X size={18} />
          <span>Cancelar</span>
        </button>
      </div>
    </div>
  );
};

export default SignatureToolbar;