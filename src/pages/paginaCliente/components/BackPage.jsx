import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ADMINISTRADOR } from "../../../const/variable_entorno";
export default function BackPage({
  to = "/dashboard",
  texto = "Volver",
  isEdit = false,
  rol = null,
}) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (isEdit) {
      navigate(-1);
    } else {
      if (rol === ADMINISTRADOR) {
        navigate("/dashboardAdmin");
      } else {
        navigate(to);
      }
    }
  };

  return (
    <button
      type="button"
      onClick={handleBack}
      className="flex items-center gap-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 px-4 rounded-lg transition cursor-pointer"
    >
      <ArrowLeft size={20} />
      {texto}
    </button>
  );
}
