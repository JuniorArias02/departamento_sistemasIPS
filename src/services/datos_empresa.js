import axios from "axios";

import { OBTENER_DATOS_EMPRESA } from "../const/endpoint/datos_empresa_endpoint";

export const obtenerDatosEmpresa = async () => {
  try {
    const res = await axios.get(OBTENER_DATOS_EMPRESA);
    return res.data.data; 
  } catch (error) {
    console.error("Error al obtener datos de la empresa:", error);
    throw error;
  }
};