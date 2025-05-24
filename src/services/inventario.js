import axios from "axios";
import {
CREAR_INVENTARIO,
ELIMINAR_INVENTARIO,
LISTAR_INVENTARIO,
EXPORTAR_INVENTARIO,
BUSCAR_INVENTARIO

} from "../const/url";

// const API_URL = CREAR_EQUIPO_BIOMEDICO;

export const crearInventario = async (datos) => {
  try {
    const response = await axios.post(CREAR_INVENTARIO, datos);
    return response.data;
  } catch (error) {
    console.error("Error al crear inventario:", error);
    throw new Error(
      error?.response?.data?.mensaje || "Error al crear el inventario",
    );
  }
};

export const actualizarInventario = async (id, datos) => {
  try {
    const response = await axios.post(CREAR_INVENTARIO, { id, ...datos });
    return response.data;
  } catch (error) {
    console.error("Error al crear inventario:", error);
    throw new Error(
      error?.response?.data?.mensaje || "Error al crear el inventario",
    );
  }
};

export const listarInventarios = async () => {
  try {
    const response = await axios.get(LISTAR_INVENTARIO);
    return response.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.mensaje ||
        "Error al listar los inventario",
    );
  }
};

export const buscarInventario = async (filtros) => {
  try {
    const response = await axios.post(BUSCAR_INVENTARIO, filtros);
    return response.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.error || "Error al buscar el inventario"
    );
  }
};

export const eliminarInventario = async (id) => {
  try {
    const response = await axios.delete(ELIMINAR_INVENTARIO, {
      data: { id },
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.error || "Error al eliminar el inventario",
    );
  }
};

export const exportarInventarios = async () => {
  try {
    const response = await axios.get(EXPORTAR_INVENTARIO, {
      responseType: "blob",
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "inventarios.xlsx"); // nombre del archivo
    document.body.appendChild(link);
    link.click();
    link.remove();

    return true; // o lo que quieras devolver
  } catch (error) {
    console.error("Error al exportar los inventario:", error);
    throw new Error(
      error?.response?.data?.mensaje || "Error al exportar los inventario",
    );
  }
};
