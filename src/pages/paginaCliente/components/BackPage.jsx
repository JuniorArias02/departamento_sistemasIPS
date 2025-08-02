import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ADMINISTRADOR } from "../../../const/variable_entorno";
import { RUTAS } from "../../../const/routers/routers";
import { motion } from "framer-motion";

export default function BackPage({
  to = RUTAS.DASHBOARD,
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
        navigate(RUTAS.ADMIN.ROOT);
      } else {
        navigate(to);
      }
    }
  };

  return (
    <motion.button
      type="button"
      onClick={handleBack}
      whileHover={{ x: -3 }}
      whileTap={{ scale: 0.97 }}
      className="group relative flex items-center gap-2 bg-white/80 hover:bg-white text-gray-700 font-medium py-2.5 px-5 rounded-xl transition-all duration-300 cursor-pointer border border-gray-200/80 shadow-sm hover:shadow-md hover:border-gray-300 backdrop-blur-sm mb-5"
    >
      {/* Flecha con animación */}
      <motion.div
        initial={{ x: 0 }}
        animate={{ x: 0 }}
        whileHover={{ x: -4 }}
        transition={{ type: "spring", stiffness: 300 }}
        className="flex items-center"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-gray-600 group-hover:text-blue-600 transition-colors duration-300"
        >
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
      </motion.div>

      {/* Texto con efecto deslizante */}
      <motion.span
        initial={{ x: 0 }}
        animate={{ x: 0 }}
        whileHover={{ x: -2 }}
        transition={{ type: "spring", stiffness: 300 }}
        className="relative"
      >
        {texto}
        {/* Efecto subrayado al hover */}
        <span className="absolute left-0 -bottom-0.5 h-0.5 bg-blue-500 w-0 group-hover:w-full transition-all duration-300 origin-left"></span>
      </motion.span>

      {/* Efecto de brillo al hover (opcional) */}
      <span className="absolute inset-0 rounded-xl overflow-hidden">
        <span className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/10 to-blue-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -translate-x-full group-hover:translate-x-0"></span>
      </span>
    </motion.button>
  );
}
