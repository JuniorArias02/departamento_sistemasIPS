import { RUTAS } from "../const/routers/routers";
import { PERMISOS } from "./permisos/permisos";

export const validarRutas = (navigate, permisos) => {
  const tieneAccesoAdmin = permisos?.includes(PERMISOS.SISTEMA.INGRESAR_DASHBOARDADMIN);
  navigate(tieneAccesoAdmin ? RUTAS.ADMIN.ROOT : RUTAS.DASHBOARD);
};