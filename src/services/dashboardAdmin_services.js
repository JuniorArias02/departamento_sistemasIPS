import axios from 'axios';
import { GRAFICA_INVENTARIO,GRAFICA_DISPOSITIVO_MEDICO,GRAFICA_EQUIPO_BIOMEDICO,GRAFICA_MEDICAMENTO,GRAFICA_REACTIVO_VIGILANCIA } from '../const/url';

export const obtenerGraficaInventario = async () => {
	const res = await axios.get(GRAFICA_INVENTARIO);
	return res.data;
};

export const obtenerGraficaDispositivoMedico = async () => {
	const res = await axios.get(GRAFICA_DISPOSITIVO_MEDICO);
	return res.data;
};

export const obtenerGraficaEquipoBiomedico = async () => {
	const res = await axios.get(GRAFICA_EQUIPO_BIOMEDICO);
	return res.data;
};

export const obtenerGraficaMedicamento = async () => {
	const res = await axios.get(GRAFICA_MEDICAMENTO);
	return res.data;
};


export const obtenerGraficaReactivo = async () => {
	const res = await axios.get(GRAFICA_REACTIVO_VIGILANCIA);
	return res.data;
};