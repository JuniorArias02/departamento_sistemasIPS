import { Image, UploadCloud, Trash2 } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { URL_IMAGE } from "../../../../../../const/api";

export default function TabImagen({ form, handleChange, imagen }) {
  const [previewImage, setPreviewImage] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (imagen) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(imagen);
    } else {
      setPreviewImage(null);
    }
  }, [imagen]);


  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    processImage(file);
    handleChange(e);
  };

  const processImage = (file) => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewImage(null);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.match('image.*')) {
      processImage(file);
      // Crear un evento sintético para el handleChange
      const syntheticEvent = {
        target: {
          name: "imagen",
          files: [file]
        }
      };
      handleChange(syntheticEvent);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const removeImage = () => {
    setPreviewImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-6">
      {/* Sección de carga */}
      <div
        className={`border-2 border-dashed rounded-xl p-6 text-center transition-all duration-300 ${isDragging ? 'border-blue-500 bg-blue-50/50' : 'border-gray-200 hover:border-gray-300'
          }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={triggerFileInput}
      >
        <div className="flex flex-col items-center justify-center space-y-3">
          <UploadCloud className="w-8 h-8 text-blue-500" />
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-900">
              {previewImage ? "Cambiar imagen" : "Arrastra y suelta o haz clic"}
            </p>
            <p className="text-xs text-gray-500">
              {previewImage ? "Formatos: JPG, PNG, WEBP (Max. 5MB)" : "Formatos: JPG, PNG, WEBP (Max. 5MB)"}
            </p>
          </div>
          {!previewImage && (
            <button
              type="button"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              Seleccionar archivo
            </button>
          )}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          name="imagen"
          accept="image/*"
          onChange={handleImageChange}
          className="hidden"
        />
      </div>

      {/* Vista previa */}
      {(previewImage || form.imagen_url) && (
        <div className="relative group">
          <div className="overflow-hidden rounded-lg shadow-sm border border-gray-100">
            <img
              src={previewImage || `${URL_IMAGE}${form.imagen_url}`}
              alt="Previsualización"
              className="w-full h-auto max-h-64 object-contain bg-gray-50"
            />
          </div>
          <button
            type="button"
            onClick={removeImage}
            className="absolute -top-2 -right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:bg-red-600"
            title="Eliminar imagen"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <div className="mt-2 text-xs text-gray-500 text-center">
            Haz clic en la imagen para cambiarla
          </div>
        </div>
      )}

      {/* Estado del sistema */}
      <div className="text-xs text-gray-400 flex items-center justify-between">
        <span>Recomendado: 800x600px (relación 4:3)</span>
        <span>Max. 5MB</span>
      </div>
    </div>
  );
}