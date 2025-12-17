import axios from "axios";
import { CREAR_PERSONAL, OBTENER_PERSONAL, BUSCAR_PERSONAL, BUSCAR_PERSONAL_ID, BUSCAR_PERSONAL_COORD,LISTAR_CARGO } from "../const/endpoint/personal_endpoint";

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

export const buscarPersonalCoord = async () => {
	try {
		const res = await axios.get(BUSCAR_PERSONAL_COORD);
		return res.data;
	} catch (error) {
		console.error("Error al obtener personal:", error);
		return [];
	}
};

export const buscarPersonalId = async (id) => {
	try {
		const res = await axios.get(`${BUSCAR_PERSONAL_ID}?id=${encodeURIComponent(id)}`);
		return res.data;
	} catch (error) {
		console.error("Error al obtener personal:", error);
		return null;
	}
};

export const listarCargo = async () => {
	try {
		const response = await axios.get(LISTAR_CARGO);
		return response.data.data;
	} catch (error) {
		console.error("Error al obtener cargos:", error);
		return [];
	}
};
