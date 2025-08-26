import axios from "axios";
import { CREAR_USUARIO, LISTAR_USUARIOS, OBTENER_USUARIO, ACTUALIZAR_USUARIO, ELIMINAR_USUARIO, CONTAR_USUARIOS, SUBIR_FIRMA_USUARIO, APLICAR_FIRMA_GUARDADA } from "../const/endpoint/usuario/usuario_endpoint";


export const subirFirmaUsuario = async (formData) => {
  try {
    const response = await axios.post(SUBIR_FIRMA_USUARIO, formData);
    return response.data;
  } catch (error) {
    console.error("Error al subir la firma:", error);
    return { status: false, message: "Fallo en la petición" };
  }
};

export const agregarFirmaPorClave = async (data) => {
  try {
    const response = await axios.post(APLICAR_FIRMA_GUARDADA, data, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error) {
    console.error("Error al traer la firma:", error);
    return error.response?.data || {
      status: false,
      message: "Fallo en la petición",
    };
  }
};


export const CrearUsuario = async (datos) => {
  try {
    const response = await axios.post(CREAR_USUARIO, datos);
    return response.data;
  } catch (error) {
    console.error("Error al crear usuario:", error);
    throw new Error(
      error?.response?.data?.mensaje || "Error al crear el usuario",
    );
  }
};

export const obtenerUsuario = async (id_usuario_editor, id_usuario_objetivo) => {
  try {
    const response = await axios.post(OBTENER_USUARIO, {
      id_usuario_editor,
      id_usuario_objetivo,
    });
    return response.data.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message || "Error al obtener el usuario");
  }
};


export const actualizarUsuario = async (datos) => {
  try {
    const response = await axios.post(ACTUALIZAR_USUARIO, datos);
    return response.data;
  } catch (error) {
    console.error("Error al editar usuario:", error);
    throw new Error(
      error?.response?.data?.message || "Error al editar el usuario"
    );
  }
};


export const eliminarUsuario = async (id_usuario_editor, id_usuario_objetivo) => {
  try {
    const res = await axios.post(ELIMINAR_USUARIO, {
      id_usuario_editor,
      id_usuario_objetivo
    });
    return res.data;
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    return { success: false, message: error.message };
  }
};



export const listarUsuariosAdmin = async (userId) => {
  try {
    const response = await axios.post(LISTAR_USUARIOS, { user_id: userId });
    if (response.data.success) {
      return response.data.data;
    } else {
      throw new Error(response.data.message || "Error al listar usuarios");
    }
  } catch (error) {
    throw new Error(error?.response?.data?.message || "Error al listar usuarios");
  }
};

export const obtenerTotalUsuarios = async () => {
  const res = await axios.get(CONTAR_USUARIOS);
  return res.data.total;
};