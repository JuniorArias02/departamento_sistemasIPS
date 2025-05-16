import { URL_PATH } from "./api";

export const LOGIN = `${URL_PATH}controllers/auth/login.php`;
// crear
export const CREAR_DISPOSITIVO_MEDICO = `${URL_PATH}controllers/formulario/crear_dispositivo_medico.php`;
export const CREAR_EQUIPO_BIOMEDICO = `${URL_PATH}controllers/formulario/crear_equipo_biomedico.php`;
export const CREAR_MEDICAMENTO = `${URL_PATH}controllers/formulario/crear_medicamento.php`; 
export const CREAR_REACTIVO_VIGILANCIA = `${URL_PATH}controllers/formulario/crear_reactivo_vigilancia.php`; 
// contar
export const CONTAR_DISPOSITIVO_MEDICO = `${URL_PATH}controllers/contar_dispositivos_medicos.php`;
export const CONTAR_EQUIPO_BIOMEDICO = `${URL_PATH}controllers/contar_equipos_biomedicos.php`;
export const CONTAR_MEDICAMENTO = `${URL_PATH}controllers/contar_medicamentos.php`;
export const CONTAR_REACTIVO_VIGILANCIA = `${URL_PATH}controllers/contar_reactivos_vigilancias.php`;