import axios from "axios";
import { CREAR_MANTENIMIENTO_FREEZER, CONTAR_MANTENIMIENTO_FREEZER, ELIMINAR_MANTENIMIENTO_FREEZER, LISTAR_MANTENIMIENTOS_FREEZER, CONTAR_MANTENIMIENTOS_PENDIENTES, ACTUALIZAR_ESTADO_MANTENIMIENTO_FREEZER } from "../const/mantenimientosFreezer/mantenimientoUrl";
import { LISTAR_COORDINADORES } from "../const/url";

export const listarMantenimientosFreezer = async (usuarioId) => {
	try {
		const response = await axios.post(
			LISTAR_MANTENIMIENTOS_FREEZER,
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
		const response = await axios.post(ACTUALIZAR_ESTADO_MANTENIMIENTO_FREEZER, { id, ...datos });
		return response.data;
	} catch (error) {
		console.error("Error al actualizar mantenimiento:", error);
		throw new Error(
			error?.response?.data?.mensaje || "Error al actualizar el mantenimiento freezer",
		);
	}
};

export const crearMantenimientoFreezer = async (datos) => {
	try {
		const response = await axios.post(CREAR_MANTENIMIENTO_FREEZER, datos);
		return response.data;
	} catch (error) {
		console.error("Error al crear mantenimiento freezer:", error);
		throw new Error(
			error?.response?.data?.mensaje || "Error al crear el mantenimiento freezer",
		);
	}
};


export const listarCoordinadores = async () => {
	try {
		const response = await axios.get(LISTAR_COORDINADORES);
		return response.data;
	} catch (error) {
		throw new Error(
			error?.response?.data?.mensaje ||
			"Error al listar los coordinadores",
		);
	}
};


export const obtenerTotalMantenimientoFreezer = async () => {
	const res = await axios.get(CONTAR_MANTENIMIENTO_FREEZER);
	return res.data.total;
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