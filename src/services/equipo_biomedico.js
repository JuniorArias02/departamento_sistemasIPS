import axios from "axios";
import {
  CREAR_EQUIPO_BIOMEDICO,
  LISTAR_EQUIPO_BIOMEDICO,
  ELIMINAR_EQUIPO_BIOMEDICO,
  EXPORTAR_EQUIPO_BIOMEDICO,
} from "../const/url";

// const API_URL = CREAR_EQUIPO_BIOMEDICO;

export const crearEquipoBioMedico = async (datos) => {
  try {
    const response = await axios.post(CREAR_EQUIPO_BIOMEDICO, datos);
    return response.data;
  } catch (error) {
    console.error("Error al crear dispositivo:", error);
    throw new Error(
      error?.response?.data?.mensaje || "Error al crear el dispositivo",
    );
  }
};

export const actualizarEquipoBioMedico = async (id, datos) => {
  try {
    const response = await axios.post(CREAR_EQUIPO_BIOMEDICO, { id, ...datos });
    return response.data;
  } catch (error) {
    console.error("Error al crear dispositivo:", error);
    throw new Error(
      error?.response?.data?.mensaje || "Error al crear el dispositivo",
    );
  }
};

export const listarEquiposBiomedicos = async () => {
  try {
    const response = await axios.get(LISTAR_EQUIPO_BIOMEDICO);
    return response.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.mensaje ||
        "Error al listar los equipos biomedicos",
    );
  }
};

export const eliminarEquipoBiomedico = async (id) => {
  try {
    const response = await axios.delete(ELIMINAR_EQUIPO_BIOMEDICO, {
      data: { id },
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.error || "Error al eliminar el equipo",
    );
  }
};

export const exportarEquiposBiomedicos = async () => {
  try {
    const response = await axios.get(EXPORTAR_EQUIPO_BIOMEDICO, {
      responseType: "blob",
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "equipos_biomedicos.xlsx"); // nombre del archivo
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
