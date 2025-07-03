import axios from "axios";
import { LISTAR_MANTENIMIENTOS_POR_DIA, LISTAR_MANTENIMIENTOS_POR_MES, LISTAR_PERSONAL_ASIGNABLE, CREAR_AGENDA_MANTENIMIENTO, CREAR_MANTENIMIENTO, CONTAR_MANTENIMIENTO, ELIMINAR_MANTENIMIENTO, LISTAR_MANTENIMIENTOS, CONTAR_MANTENIMIENTOS_PENDIENTES, ACTUALIZAR_ESTADO_MANTENIMIENTO, GRAFICA_MANTENIMIENTO } from "../const/endpoint/mantenimientosIps/mantenimiento_endpoint";


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
		const response = await axios.post(CREAR_MANTENIMIENTO, datos);
		return response.data;
	} catch (error) {
		console.error("Detalles del error:", error?.response?.data);
		throw new Error(
			error?.response?.data?.error ||
			error?.response?.data?.mensaje ||
			"Error al crear el mantenimiento freezer"
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


export const getMantenimientosPorMes = async (fecha) => {
	const fechaISO = fecha.toISOString().split("T")[0]; // ej: "2025-07-01"
	const { data } = await axios.get(LISTAR_MANTENIMIENTOS_POR_MES, {
		params: { fecha: fechaISO }
	});
	console.log("Datos obtenidos:", data);
	return data;
};

export const crearAgendaMantenimiento = async (datos) => {
	try {
		const { data } = await axios.post(CREAR_AGENDA_MANTENIMIENTO, datos);
		return data;
	} catch (error) {
		console.error("Error creando mantenimiento agendado:", error);
		throw error?.response?.data || { error: "Error desconocido" };
	}
};

export const getMantenimientosPorDia = async (fecha) => {
	const fechaStr = fecha.toISOString().split('T')[0];
	const res = await axios.get(`${LISTAR_MANTENIMIENTOS_POR_DIA}?fecha=${fechaStr}`);
	return res.data;
};

export const listarPersonalAsignable = async (usuario_id) => {
	try {
		const res = await axios.post(LISTAR_PERSONAL_ASIGNABLE, {
			usuario_id
		});
		return res.data;
	} catch (error) {
		console.error("Error al listar personal asignable:", error);
		throw error;
	}
};