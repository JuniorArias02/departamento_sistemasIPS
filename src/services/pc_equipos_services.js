import axios from "axios";
import { CREAR_EQUIPO, OBTENER_EQUIPOS, LISTAR_ACTAS_ENTREGA, OBTENER_TOTAL_EQUIPOS, EDITAR_EQUIPOS, BUSCAR_EQUIPO, SUBIR_IMAGEN, BUSCAR_EQUIPOS } from "../const/endpoint/pc_equipo_endpoint";


export const crearEquipo = async (datos) => {
	try {
		const response = await axios.post(CREAR_EQUIPO, datos);
		return response.data;
	} catch (error) {
		console.error('Error al crear equipo', error);
		return [];
	}
};

export const subirImagen = async (formData) => {
	try {
		const response = await axios.post(SUBIR_IMAGEN, formData, {
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		});
		return response.data;
	} catch (error) {
		console.error('Error al subir imagen', error);
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

export const buscarEquipos = async (query) => {
	try {
		const res = await axios.get(`${BUSCAR_EQUIPOS}?query=${encodeURIComponent(query)}`);
		return res.data;
	} catch (error) {
		console.error("Error al buscar equipo:", error);
		return { success: false, resultados: [] };
	}
};



export const listarActaEntrega = async () => {
	try {
		const res = await axios.get(LISTAR_ACTAS_ENTREGA);
		return res.data;
	} catch (error) {
		console.error("Error al listar actas de entrega:", error);
		return { success: false, data: [] };
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
