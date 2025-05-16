import axios from "axios";
import {
  CONTAR_REACTIVO_VIGILANCIA,
  CONTAR_DISPOSITIVO_MEDICO,
  CONTAR_EQUIPO_BIOMEDICO,
  CONTAR_MEDICAMENTO,
} from "../const/url";

export const obtenerTotalDispositivoMedicoc = async () => {
  const res = await axios.get(CONTAR_DISPOSITIVO_MEDICO);
  return res.data.total;
};

export const obtenerTotalEquipoBiomedico = async () => {
  const res = await axios.get(CONTAR_EQUIPO_BIOMEDICO);
  return res.data.total;
};

export const obtenerTotalMedicamentos = async () => {
  const res = await axios.get(CONTAR_MEDICAMENTO);
  return res.data.total;
};

export const obtenerTotalReactivosVigilancia = async () => {
  const res = await axios.get(CONTAR_REACTIVO_VIGILANCIA);
  return res.data.total;
};
