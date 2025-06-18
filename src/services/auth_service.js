import axios from "axios";
import { LOGIN } from "../const/endpoint/login/login_endpoint";


export const loginUsuario = async (datos) => {
  try {
    const response = await axios.post(LOGIN, datos);

    if (!response.data?.usuario) {
      throw new Error("Datos de usuario no recibidos");
    }

    return response.data;

  } catch (error) {
    throw error.response?.data?.mensaje || error.message || "Error al iniciar sesión";
  }
};