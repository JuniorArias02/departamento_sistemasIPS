import axios from "axios";
import { CREAR_PERSONAL,OBTENER_PERSONAL,BUSCAR_PERSONAL } from "../const/endpoint/personal_endpoint";

export const crearPersonal = async (datos) => {
	try {
		const response = await axios.post(CREAR_PERSONAL, datos); 
		return response;
	} catch (error) {
		console.error('Error al crear personal', error);
		return [];
	}
};


export const obtenerPersonal = async () => {
  try {
    const response = await axios.post(OBTENER_PERSONAL); 
	console.log("Respuesta de obtenerPersonal:", response.data.data);
    return response.data;
  } catch (error) {
    console.error("Error al obtener personal", error);
    return [];
  }
};
export const buscarPersonal = async (q) => {
  try {
	const res = await axios.get(`${BUSCAR_PERSONAL}?q=${encodeURIComponent(q)}`);
	return res.data;
  } catch (error) {
	console.error("Error al obtener personal:", error);
	return [];
  }
};
