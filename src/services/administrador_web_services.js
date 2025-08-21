import { CREAR_AVISO_ACTUALIZACION_WEB,LISTAR_AVISOS_ACTUALIZACIONES_WEB ,CONTAR_AVISOS_ACTUALIZACIONES_WEB} from "../const/endpoint/adaministrador_wen_endpoint";
import axios from "axios";

export const crearAvisoActualizacionWeb = async (datos) => {
  try {
    const response = await axios.post(CREAR_AVISO_ACTUALIZACION_WEB, datos);
    return response.data;
  } catch (error) {
    console.error("Error al crear inventario:", error);
    throw new Error(
      error?.response?.data?.mensaje || "Error al crear el el aviso web",
    );
  }
};

export const listarAvisosACtualizacionesWeb = async () => {
  try {
    const response = await axios.get(LISTAR_AVISOS_ACTUALIZACIONES_WEB);
    return response.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.mensaje ||
      "Error al listar los avisos wen",
    );
  }
};

export const notificarActualizaciones = async () => {
  try {
    const response = await axios.get(CONTAR_AVISOS_ACTUALIZACIONES_WEB);
    return response.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.mensaje ||
      "Error al listar los avisos wen",
    );
  }
};