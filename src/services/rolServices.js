import axios from "axios";
import { LISTAR_ROL, OBTENER_ROL } from "../const/url";

const API_URL = "http://localhost:3000/api";

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

export const listarPermisosDisponibles = async () => {
  const response = await axios.get(`${API_URL}/permisos`);
  return response;
};

export const asignarPermisoARol = async (rolId, permisoId) => {
  const response = await axios.post(`${API_URL}/roles/permisos`, {
    rol_id: rolId,
    permiso_id: permisoId
  });
  return response;
};

export const removerPermisoDeRol = async (rolId, permisoId) => {
  const response = await axios.delete(`${API_URL}/roles/permisos`, {
    data: {
      rol_id: rolId,
      permiso_id: permisoId
    }
  });
  return response;
};