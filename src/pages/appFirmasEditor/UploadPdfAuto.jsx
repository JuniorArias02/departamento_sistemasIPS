import React, { useRef, useState } from "react";

export default function UploadPdfAuto({ pedidoId, onPreview }) {
  const inputRef = useRef(null);
  const [fileName, setFileName] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const arrayBuffer = await file.arrayBuffer();
    const blob = new Blob([arrayBuffer], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);

    setFileName(file.name);
    setPreviewUrl(url);

    // 🔹 Enviar el archivo al padre para luego firmarlo
    onPreview({ file, arrayBuffer, url });
  };

  return (
    <div className="flex flex-col gap-3">
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf"
        style={{ display: "none" }}
        onChange={handleFile}
      />

      <button
        type="button"
        onClick={() => inputRef.current.click()}
        className="px-4 py-2 rounded bg-[#4F39F6] text-white hover:bg-[#4F39FF]/80"
      >
        Subir PDF para visualizar
      </button>

      {fileName && (
        <span className="text-sm text-gray-600">Archivo: {fileName}</span>
      )}

      {previewUrl && (
        <iframe
          src={previewUrl}
          title="Vista previa PDF"
          width="100%"
          height="500px"
          className="border rounded"
        />
      )}
    </div>
  );
}
