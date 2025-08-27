import axios from "axios";
import { LOGIN } from "../const/endpoint/login_endpoint";


export const loginUsuario = async (datos) => {
  try {
    const response = await axios.post(LOGIN, datos);
    if (!response.data?.usuario && response.data?.status !== "error" && response.data?.status !== "bloqueado") {
      throw new Error("Datos de usuario no recibidos");

    }
    return response.data;
  } catch (error) {
    if (error.response?.data) {
      throw error.response.data;
    }
    throw { status: "error", mensaje: error.message || "Error al iniciar sesión" };
  }
};
