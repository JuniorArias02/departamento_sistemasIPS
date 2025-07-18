const DASHBOARD = "/dashboard";
const DASHBOARD_ADMIN = `${DASHBOARD}/admin`;

export const RUTAS = {
  ERROR_404: "/404",
  PAGINA_CONSTRUCCION: "/construccion",
  LOGIN: "/",

  DASHBOARD,

  ADMIN: {
    ROOT: DASHBOARD_ADMIN,

    USUARIOS: {
      ROOT: `${DASHBOARD_ADMIN}/usuarios`,
      CREAR_USUARIO: `${DASHBOARD_ADMIN}/crear_usuario`,
    },

    ROLES: {
      VISTA_DATOS: `${DASHBOARD_ADMIN}/roles`,
      CREAR_ROL: `${DASHBOARD_ADMIN}/crear_rol`,
    },

    PERMISOS: {
      CREAR: `${DASHBOARD_ADMIN}/crear_permiso`,
      ASIGNAR: `${DASHBOARD_ADMIN}/asignar_permiso`
    },

    SISTEMA: {
      ACTUALIZACIONES_WEB: `${DASHBOARD_ADMIN}/actualizaciones_Web`,
    },

    CREAR_FORMULARIO: `${DASHBOARD_ADMIN}/crear_formulario`,
  },

  USER: {
    PERFIL: {
      ROOT: `${DASHBOARD}/perfil`,
    },
    INVENTARIO: {
      CREAR_INVENTARIO: `${DASHBOARD}/crear_inventario`,
      VER_INVENTARIO: `${DASHBOARD}/inventarios`,
      ACTUALIZAR_INVENTARIO: `${DASHBOARD}/crear_inventario`,
    },
    MANTENIMIENTO: {
      CREAR_MANTENIMIENTO: `${DASHBOARD}/crear_mantenimiento`,
      VISTA_DATOS: `${DASHBOARD}/mantenimiento`,
      VER_DETALLES: `${DASHBOARD}/mantenimiento/detalles`,
      AGENDA_MANTENIMIENTOS: `${DASHBOARD}/agenda_mantenimiento`,
      VER_PROGRAMADOS:`${DASHBOARD}/agenda_programadas`,
      HORAS_DEL_DIA_PATH: `${DASHBOARD}/mantenimiento/horas/:fecha`,
      HORAS_DEL_DIA: (fecha) => `${DASHBOARD}/mantenimiento/horas/${fecha}`,
    },

    SISTEMA: {
      VER_ACTUALIZACIONES: `${DASHBOARD}/ver_actualizaciones`,
    },
  }
};
