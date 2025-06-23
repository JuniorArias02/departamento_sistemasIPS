import axios from "axios";
import { CREAR_MANTENIMIENTO, CONTAR_MANTENIMIENTO, ELIMINAR_MANTENIMIENTO, LISTAR_MANTENIMIENTOS, CONTAR_MANTENIMIENTOS_PENDIENTES, ACTUALIZAR_ESTADO_MANTENIMIENTO,GRAFICA_MANTENIMIENTO } from "../const/endpoint/mantenimientosIps/mantenimiento_endpoint";


export const listarMantenimientos = async (usuarioId) => {
	try {
		const response = await axios.post(
			LISTAR_MANTENIMIENTOS,
			{ usuario_id: usuarioId }

		);
		return response.data;
	} catch (error) {
		throw new Error(
			error?.response?.data?.error || "Error al listar los mantenimientos"
		);
	}
};



export const actualizarEstadoMantenimiento = async (id, datos) => {
	try {
		const response = await axios.post(ACTUALIZAR_ESTADO_MANTENIMIENTO, { id, ...datos });
		return response.data;
	} catch (error) {
		throw new Error(
			error?.response?.data?.mensaje || "Error al actualizar el mantenimiento freezer",
		);
	}
};

export const crearMantenimiento = async (datos) => {
	try {
		console.log("datos de entrada",datos)
		const response = await axios.post(CREAR_MANTENIMIENTO, datos);
		return response.data;
	} catch (error) {
		throw new Error(
			error?.response?.data?.mensaje || "Error al crear el mantenimiento freezer",
		);
	}
};


export const obtenerTotalMantenimiento = async () => {
	const res = await axios.get(CONTAR_MANTENIMIENTO);
	return res.data.total;
};


export const obtenerGraficaMantenimiento = async () => {
	const res = await axios.get(GRAFICA_MANTENIMIENTO);
	return res.data;
};


export const fetchNotificacionesPendientes = async (usuarioId) => {
	try {
		const { data } = await axios.post(CONTAR_MANTENIMIENTOS_PENDIENTES, {
			usuario_id: usuarioId
		});
		if (data.success) {
			return data.total_pendientes;
		}
		return 0;
	} catch (error) {
		console.error('Error:', error.response?.data?.error || error.message);
		return 0;
	}
};