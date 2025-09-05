import axios from "axios";
import {
  CREAR_COTIZACION

} from "../const/endpoint/cp_cotizaciones_endpoint.js";

export const crearCotizacion = async (form) => {
  try {
	const response = await axios.post(CREAR_COTIZACION, form);
	return response.data;
  } catch (error) {
	console.error("Error al cotizar", error);
	return { success: false };
  }
};
