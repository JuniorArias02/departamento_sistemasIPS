import { URL_PATH } from "../../api";

export const CONTAR_USUARIOS = `${URL_PATH}controllers/usuario/contar_usuarios.php`;
export const CREAR_USUARIO = `${URL_PATH}controllers/usuario/crear_usuario.php`;
export const LISTAR_USUARIOS = `${URL_PATH}controllers/usuario/listar_usuarios.php`;
export const ACTUALIZAR_USUARIO = `${URL_PATH}controllers/usuario/editar_usuario.php`;
export const OBTENER_USUARIO = `${URL_PATH}controllers/usuario/obtener_usuario.php`;
export const ELIMINAR_USUARIO = `${URL_PATH}controllers/usuario/eliminar_usuario.php`;
export const SUBIR_FIRMA_USUARIO = `${URL_PATH}controllers/usuario/subir_firma_usuario.php`;
export const APLICAR_FIRMA_GUARDADA = `${URL_PATH}controllers/usuario/aplicar_firma.php`;

export const GENERAR_CODIGO_RECUPERACION = `${URL_PATH}controllers/sec_codigo_verificacion/genera_codigo.php`;
export const VALIDAR_CODIGO_RECUPERACION = `${URL_PATH}controllers/sec_codigo_verificacion/validar_codigo.php`;

export const CAMBIAR_CONTRASENA = `${URL_PATH}controllers/usuario/cambiar_contrasena.php`;