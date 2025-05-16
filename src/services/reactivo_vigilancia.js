import axios from "axios";
import {
  CREAR_REACTIVO_VIGILANCIA,
  LISTAR_REACTIVO_VIGILANCIA,
  ELIMINAR_REACTIVO_VIGILANCIA,
  EXPORTAR_REACTIVO_VIGILANCIA,
} from "../const/url";

// const API_URL = CREAR_REACTIVO_VIGILANCIA;

export const crearReactivoVigilancia = async (datos) => {
  try {
    const response = await axios.post(CREAR_REACTIVO_VIGILANCIA, datos);
    console.log("Respuesta del servidor:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error al crear dispositivo:", error);
    throw new Error(
      error?.response?.data?.mensaje || "Error al crear el dispositivo",
    );
  }
};

export const actualizarReactivoVigilancia = async (id, datos) => {
  try {
    const response = await axios.post(CREAR_REACTIVO_VIGILANCIA, {
      id,
      ...datos,
    });
    console.log("Respuesta del servidor:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error al crear dispositivo:", error);
    throw new Error(
      error?.response?.data?.mensaje || "Error al crear el dispositivo",
    );
  }
};

export const listarReactivosVigilancia = async () => {
  try {
    const response = await axios.get(LISTAR_REACTIVO_VIGILANCIA);
    return response.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.mensaje ||
        "Error al listar  reactivos de vigilancia",
    );
  }
};

export const eliminarReactivoVigilancia = async (id) => {
  try {
    const response = await axios.delete(ELIMINAR_REACTIVO_VIGILANCIA, {
      data: { id },
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.error || "Error al eliminar el reactivo",
    );
  }
};

export const exportarReactivosVigilancias = async () => {
  try {
    const response = await axios.get(EXPORTAR_REACTIVO_VIGILANCIA, {
      responseType: "blob",
    });

    // Crear link para descargar el archivo Excel
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "reactivos_vigilancia.xlsx"); // nombre del archivo
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
