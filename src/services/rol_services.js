import axios from "axios";
import { LISTAR_ROL, OBTENER_ROL } from "../const/endpoint/rol/rol_endpoint";

export const listarRoles = async () => {
  try {
    const response = await axios.get(LISTAR_ROL);
    return response.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.mensaje ||
      "Error al listar  las roles",
    );
  }
};


export const listarRoles_completo = async () => {
  try {
    const response = await axios.get(OBTENER_ROL);
    return response.data;
  } catch (error) {
    console.error('Error en listarRoles_completo:', error);
    throw error;
  }
};

