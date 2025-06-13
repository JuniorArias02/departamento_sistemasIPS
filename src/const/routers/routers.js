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
      VISTA_DATOS: `${DASHBOARD_ADMIN}/roles`
    },

    CREAR_FORMULARIO: `${DASHBOARD_ADMIN}/crear_formulario`,
  },

  USER: {
    INVENTARIO: {
      CREAR_INVENTARIO: `${DASHBOARD}/crear_inventario`,
      VER_INVENTARIO: `${DASHBOARD}/inventarios`,
      ACTUALIZAR_INVENTARIO: `${DASHBOARD}/inventarios/actualizar`,
    },
    MANTENIMIENTO_FREEZER: {
      CREAR_MANTENIMIENTO: `${DASHBOARD}/crear_mantenimiento_freezer`,
      VISTA_DATOS: `${DASHBOARD}/mantenimiento_freezer`,
      VER_DETALLES: `${DASHBOARD}/mantenimiento_freezer/detalles`,
    },
  }
};
