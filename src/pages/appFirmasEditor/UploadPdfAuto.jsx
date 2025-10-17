// components/UploadPdfAuto.jsx
import React, { useRef, useState } from "react";

export default function UploadPdfAuto({ pedidoId }) {
  const inputRef = useRef(null);
  const [fileName, setFileName] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setFileName(file.name);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const detail = { pedidoId, file, arrayBuffer };
      window.dispatchEvent(new CustomEvent("pdf-selected", { detail }));
    } catch (err) {
      console.error("Error leyendo el PDF:", err);
    } finally {
      setLoading(false);
      e.target.value = "";
    }
  };

  return (
    <div className="upload-pdf-auto">
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf"
        style={{ display: "none" }}
        onChange={handleFile}
      />

      <button
        type="button"
        onClick={handleClick}
        className="px-4 py-2 rounded bg-sky-600 text-white hover:bg-sky-700"
      >
        {loading ? "Cargando..." : "Subir PDF y procesar"}
      </button>

      {fileName && (
        <span style={{ marginLeft: 12 }}>
          Archivo listo: <strong>{fileName}</strong>
        </span>
      )}
    </div>
  );
}
