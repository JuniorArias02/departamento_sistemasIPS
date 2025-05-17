import axios from "axios";
import {
  CREAR_DISPOSITIVO_MEDICO,
  LISTAR_DISPOSITIVO_MEDICO,
  ELIMINAR_DISPOSITIVO_MEDICO,
  EXPORTAR_DISPOSITIVO_MEDICO,
} from "../const/url";

// const API_URL = CREAR_DISPOSITIVO_MEDICO;

export const crearDispositivoMedico = async (datos) => {
  try {
    const response = await axios.post(CREAR_DISPOSITIVO_MEDICO, datos);
    console.log("Respuesta del servidor:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error al crear dispositivo:", error);
    throw new Error(
      error?.response?.data?.mensaje || "Error al crear el dispositivo",
    );
  }
};

export const actualizarDispositivoMedico = async (id, datos) => {
  try {
    const response = await axios.post(CREAR_DISPOSITIVO_MEDICO, {
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

export const listarDispositivosMedicos = async () => {
  try {
    const response = await axios.get(LISTAR_DISPOSITIVO_MEDICO);
    return response.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.mensaje ||
        "Error al listar los dispositivos médicos",
    );
  }
};

export const eliminarDispositivoMedico = async (id) => {
  try {
    const response = await axios.delete(ELIMINAR_DISPOSITIVO_MEDICO, {
      data: { id },
    });
    console.log("Dispositivo eliminado:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error al eliminar dispositivo:", error);
    throw new Error(
      error?.response?.data?.mensaje || "Error al eliminar el dispositivo",
    );
  }
};

export const exportarDispositivosMedicos = async () => {
  try {
    const response = await axios.get(EXPORTAR_DISPOSITIVO_MEDICO, {
      responseType: "blob",
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "dispositivos_medicos.xlsx"); // nombre del archivo
    document.body.appendChild(link);
    link.click();
    link.remove();

    return true;
  } catch (error) {
    console.error("Error al exportar dispositivos:", error);
    throw new Error(
      error?.response?.data?.mensaje || "Error al exportar dispositivos",
    );
  }
};
