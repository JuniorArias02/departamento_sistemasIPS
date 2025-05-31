import { ADMINISTRADOR } from "../const/variable_entorno";
import { useNavigate } from "react-router-dom";
import { useApp } from "../store/AppContext";

export const validarRutas = (usuario, navigate) => {
  if (usuario.rol === ADMINISTRADOR) {
    navigate("/dashboardAdmin");
  } else {
    navigate("/dashboard");
  }
};
