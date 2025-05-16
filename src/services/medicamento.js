import axios from "axios";
import {
  CREAR_MEDICAMENTO,
  LISTAR_MEDICAMENTO,
  ELIMINAR_MEDICAMENTO,
  EXPORTAR_MEDICAMENTO,
} from "../const/url";

// const API_URL = CREAR_MEDICAMENTO;

export const crearMedicamento = async (datos) => {
  try {
    const response = await axios.post(CREAR_MEDICAMENTO, datos);
    console.log("Respuesta del servidor:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error al crear dispositivo:", error);
    throw new Error(
      error?.response?.data?.mensaje || "Error al crear el dispositivo",
    );
  }
};

export const actualizarMedicamento = async (id, datos) => {
  try {
    const response = await axios.post(CREAR_MEDICAMENTO, { id, ...datos });
    console.log("Respuesta del servidor:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error al crear dispositivo:", error);
    throw new Error(
      error?.response?.data?.mensaje || "Error al crear el dispositivo",
    );
  }
};

export const listarMedicamentos = async () => {
  try {
    const response = await axios.get(LISTAR_MEDICAMENTO);
    return response.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.mensaje || "Error al listar medicamentos",
    );
  }
};

export const eliminarMedicamento = async (id) => {
  try {
    const response = await axios.delete(ELIMINAR_MEDICAMENTO, {
      data: { id },
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.error || "Error al eliminar el medicamento",
    );
  }
};

export const exportarMedicamentos = async () => {
  try {
    const response = await axios.get(EXPORTAR_MEDICAMENTO, {
      responseType: "blob",
    });

    // Crear link para descargar el archivo Excel
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "medicamentos.xlsx"); // nombre del archivo
    document.body.appendChild(link);
    link.click();
    link.remove();

    return true; // o lo que quieras devolver
  } catch (error) {
    console.error("Error al exportar dispositivos:", error);
    throw new Error(
      error?.response?.data?.mensaje || "Error al exportar dispositivos",
    );
  }
};
