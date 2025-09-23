import axios from "axios";
import { CREAR_DESCUENTO, SUBIR_FIRMA_DESCUENTO, OBTENES_LISTADO_DESCUENTO, EXPORTAR_DESCUENTO } from "../const/endpoint/cp_solicitud_descuento_endpoint";


export const obtenerListadoDescuento = async () => {
  try {
    const response = await axios.get(OBTENES_LISTADO_DESCUENTO);
    return response.data;
  } catch (error) {
    console.error("Error al obtener listado de descuentos", error);
    throw error;
  }
};

export const exportarDescuento = async (descuentoId) => {
  try {
    const response = await axios.get(EXPORTAR_DESCUENTO, {
      params: { id: descuentoId },
      responseType: "blob",
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "descuento_fijos.xlsx");
    document.body.appendChild(link);
    link.click();
    link.remove();

    return true;
  } catch (error) {
    console.error("Error al exportar el descuento:", error);
    throw new Error(
      error?.response?.data?.mensaje || "Error al exportar el descuento"
    );
  }
};




export const crear_descuento = async (form) => {
  try {
    const response = await axios.post(CREAR_DESCUENTO, form, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error al crear descuento", error);
    throw error;
  }
};

export const subirFirmaDescuento = async (formData) => {
  try {
    const response = await axios.post(SUBIR_FIRMA_DESCUENTO, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error al subir firma", error);
    throw error;
  }
};
