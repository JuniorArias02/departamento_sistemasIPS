import axios from "axios";
import { CREAR_EQUIPO, OBTENER_EQUIPOS, OBTENER_TOTAL_EQUIPOS, EDITAR_EQUIPOS,BUSCAR_EQUIPO } from "../const/endpoint/pc_equipos/pc_equipo_endpoint";


export const crearEquipo = async (datos) => {
	try {
		const response = await axios.post(CREAR_EQUIPO, datos);
		return response.data;
	} catch (error) {
		console.error('Error al crear equipo', error);
		return [];
	}
};

export const buscarEquipo = async (q) => {
  try {
    const res = await axios.get(`${BUSCAR_EQUIPO}?q=${encodeURIComponent(q)}`);
    return res.data;
  } catch (error) {
    console.error("Error al buscar equipo:", error);
    return [];
  }
};

export const editarEquipo = async (datos) => {
	try {
		const response = await axios.post(EDITAR_EQUIPOS, datos);
		return response.data;
	} catch (error) {
		console.error('Error al editar equipo', error);
		return [];
	}
};


export const obtenerTotalEquipos = async () => {
	try {
		const response = await axios.post(OBTENER_TOTAL_EQUIPOS);
		return response.data;
	} catch (error) {
		console.error('Error al obtener total de equipos', error);
		return { status: false, total: 0 }; 
	}
};


export const obtenerEquiposComputo = async () => {
	try {
		const response = await axios.post(OBTENER_EQUIPOS);
		return response.data;
	} catch (error) {
		console.error('Error al crear equipo', error);
		return [];
	}
};
