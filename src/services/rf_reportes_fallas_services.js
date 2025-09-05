import axios from "axios";
import { 
  CREAR_REPORTE, 
  REPORTES_NUEVOS, 
  REPORTE_ASIGNADOS, 
  TOMAR_REPORTE, 
  MIS_REPORTES_CREADOS 
} from "../const/endpoint/rf_reportes_fallas_endpoint";

// 1️⃣ Crear reporte
export const crearReporte = async (form) => {
  try {
    const response = await axios.post(CREAR_REPORTE, form);
    return response.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message || "Error al crear nuevo reporte"
    );
  }
};

// 2️⃣ Ver reportes nuevos (sin responsable)
export const obtenerReportesNuevos = async (form) => {
  try {
    const response = await axios.post(REPORTES_NUEVOS, form);
    return response.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message || "Error al obtener reportes nuevos"
    );
  }
};

// 3️⃣ Tomar reporte
export const tomarReporte = async (form) => {
  try {
    const response = await axios.post(TOMAR_REPORTE, form);
    return response.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message || "Error al tomar reporte"
    );
  }
};

// 4️⃣ Ver reportes que estoy atendiendo
export const obtenerReportesAsignados = async (form) => {
  try {
    const response = await axios.post(REPORTE_ASIGNADOS, form);
    return response.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message || "Error al obtener reportes asignados"
    );
  }
};

// 5️⃣ Ver mis reportes creados
export const obtenerMisReportesCreados = async (form) => {
  try {
    const response = await axios.post(MIS_REPORTES_CREADOS, form);
    return response.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message || "Error al obtener mis reportes"
    );
  }
};
