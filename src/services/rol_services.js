import axios from "axios";
import { LISTAR_ROL, OBTENER_ROL, PERMISOS_ROL, CREAR_ROL } from "../const/endpoint/rol/rol_endpoint";
import { ASIGNAR_PERMISO } from "../const/endpoint/rol/permisos/permisos_endpoint";


export const crearRol = async (datos) => {
  try {
    const response = await axios.post(CREAR_ROL, datos);
    return response.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.mensaje || "Error al crear neuvo rol"
    );
  }
};

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


export const obtenerPermisosRol = async (rolId) => {
  try {
    const response = await axios.get(`${PERMISOS_ROL}?rol_id=${rolId}`);
    return response.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.mensaje || "Error al obtener los permisos del rol"
    );
  }
};


export const asignarPermisos = async (usuarioId, rolId, permisosIds) => {
  try {
    const response = await axios.post(ASIGNAR_PERMISO, {
      usuario_id: usuarioId,
      rol_id: rolId,
      permisos: permisosIds
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.mensaje || "Error al asignar los permisos"
    );
  }
};