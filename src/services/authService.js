import axios from "axios";
import { LOGIN } from "../const/url";

const API_URL = LOGIN;

export const loginUsuario = async (datos) => {
  try {
    const response = await axios.post(API_URL, datos);
    console.log("Respuesta del servidor:", response.data);
    return response.data;
  } catch (error) {
    throw error.response?.data?.mensaje || "Error al iniciar sesión";
  }
};
