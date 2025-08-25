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
    <div style={{
      backgroundColor: 'white',
      borderRadius: '16px',
      padding: '24px',
      width: '90%',
      maxWidth: '600px',
      maxHeight: '90vh',
      boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '16px',
      }}>
        <h2 style={{ margin: 0, color: '#333', fontSize: '1.5rem' }}>Firma aquí</h2>
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '1.5rem',
            cursor: 'pointer',
            color: '#666',
            padding: '4px',
          }}
        >
          ✕
        </button>
      </div>

      <div style={{
        flex: 1,
        border: '1px dashed #d1d5db',
        borderRadius: '12px',
        marginBottom: '16px',
        overflow: 'hidden',
        minHeight: '300px'
      }}>
        <SignatureCanvas
          brushSize={brush}
          onChange={setDataURL}
        />
      </div>

      <SignatureToolbar
        onBrushChange={setBrush}
        onClear={clearCanvas}
        onSave={save}
        onCancel={onClose}
        disabled={!dataURL || isSubmitting}
      />

      {isSubmitting && (
        <div style={{
          marginTop: '12px',
          color: '#4f46e5',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}>
          <div className="spinner"></div>
          <span>Guardando...</span>
        </div>
      )}

    
    </div>
  );
};

export default SignatureModal;