import { ADMINISTRADOR } from "../const/variable_entorno";

export const validarRutas = (usuario, navigate) => {
  if (usuario.rol === ADMINISTRADOR) {
    navigate("/dashboardAdmin");
  } else {
    navigate("/dashboard");
  }
};
