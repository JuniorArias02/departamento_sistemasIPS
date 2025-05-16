import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function BackPage({
  to = "/dashboard",
  texto = "Volver",
  isEdit = false,
}) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (isEdit) {
      navigate(-1); // retrocede si está en edición
    } else {
      navigate(to); // va a la ruta por defecto
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
