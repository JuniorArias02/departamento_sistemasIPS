import axios from "axios"
import { CREAR_DISPOSITIVO_MEDICO } from "../const/url"

const API_URL = CREAR_DISPOSITIVO_MEDICO;

export const crearDispositivoMedico = async (datos) => {
  try {
    const response = await axios.post(API_URL, datos);
    console.log("Respuesta del servidor:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error al crear dispositivo:", error);
    throw new Error(error?.response?.data?.mensaje || "Error al crear el dispositivo");
  }
};