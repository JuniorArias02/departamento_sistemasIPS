import React, { useState } from "react";
import { FirmaInput } from "../../../appFirma/appFirmas";
import { crearPedido, subirFirmaPedido } from "../../../../services/cp_pedidos_services";
import { useApp } from "../../../../store/AppContext";

export default function CrearPedido() {
  const { usuario } = useApp();

  // Estado del formulario
  const [form, setForm] = useState({
    fecha_solicitud: "",
    proceso_solicitante: "",
    tipo_solicitud: "", // Id tipo solicitud
    observacion: "",
    elaborado_por: usuario.id,
    elaborado_por_firma: "", // Será base64 o lo que manejes en FirmaInput
    creador_por: usuario.id,
  });

  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState("");

  // Submit del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMensaje("");

    try {
      // Primero creas el pedido
      const response = await crearPedido(form);
      if (!response.success) throw new Error(response.error || "Error creando pedido");

      // Luego subes la firma con el id devuelto
      const pedidoId = response.id;

      // Aquí transformas la firma (firma_entrega) a archivo para subir multipart
      // Supongo que form.elaborado_por_firma es base64 desde FirmaInput
      const base64 = form.elaborado_por_firma;
      const blob = base64ToBlob(base64); // función para convertir base64 a Blob
      const formData = new FormData();
      formData.append("id_pedido", pedidoId);
      formData.append("tipo_firma", "elaborado_por_firma");
      formData.append("firma", blob, "firma.png");

      const resFirma = await subirFirmaPedido(formData);
      if (!resFirma.success) throw new Error(resFirma.error || "Error subiendo firma");

      setMensaje("Pedido creado y firma subida con éxito!");
      setForm({
        fecha_solicitud: "",
        proceso_solicitante: "",
        tipo_solicitud: "",
        observacion: "",
        elaborado_por: usuario.id,
        elaborado_por_firma: "",
        creador_por: usuario.id,
      });
    } catch (error) {
      setMensaje(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Convierte base64 a Blob para enviar archivo
  function base64ToBlob(base64) {
    const byteString = atob(base64.split(",")[1]);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: "image/png" });
  }

  return (
    <>
      <h1>Crear Pedido</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Fecha Solicitud:
          <input
            type="date"
            value={form.fecha_solicitud}
            onChange={(e) => setForm({ ...form, fecha_solicitud: e.target.value })}
            required
          />
        </label>

        <label>
          Proceso Solicitante:
          <input
            type="text"
            value={form.proceso_solicitante}
            onChange={(e) => setForm({ ...form, proceso_solicitante: e.target.value })}
            required
          />
        </label>

        <label>
          Tipo Solicitud:
          <input
            type="number"
            value={form.tipo_solicitud}
            onChange={(e) => setForm({ ...form, tipo_solicitud: e.target.value })}
            required
          />
          {/* O reemplaza por select con tus tipos */}
        </label>

        <label>
          Observación:
          <textarea
            value={form.observacion}
            onChange={(e) => setForm({ ...form, observacion: e.target.value })}
            required
          />
        </label>

        <label>
          Firma Elaborado Por:
          <FirmaInput
            value={form.elaborado_por_firma}
            onChange={(value) => setForm({ ...form, elaborado_por_firma: value })}
            label="Firma"
          />
        </label>

        <button type="submit" disabled={loading}>
          {loading ? "Creando..." : "Crear Pedido"}
        </button>
      </form>

      {mensaje && <p>{mensaje}</p>}
    </>
  );
}
