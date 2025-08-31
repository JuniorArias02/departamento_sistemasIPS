import { motion } from "framer-motion";

export const SidebarSubItem = ({ 
  icon, 
  text, 
  onClick, 
  isActive = false, 
  sidebarOpen, 
  delay = 0,
  badge // Agregué prop para badge por si acaso
}) => {
  // Variantes para animaciones más fluidas
  const itemVariants = {
    hidden: { 
      opacity: 0, 
      x: -15,
      transition: {
        duration: 0.15,
        ease: "easeOut"
      }
    },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: {
        duration: 0.25,
        ease: "easeOut",
        delay: delay
      }
    },
    hover: {
      x: 5,
      transition: {
        duration: 0.15,
        ease: "easeOut"
      }
    }
  };

  const iconVariants = {
    normal: { scale: 1 },
    hover: { scale: 1.15 },
    active: { scale: 1.1, rotate: 5 }
  };

  return (
    <motion.li
      variants={itemVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      className="list-none mb-1"
    >
      <motion.button
        onClick={onClick}
        className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 relative group ${
          isActive
            ? 'bg-white/15 text-white shadow-inner'
            : 'text-white/70 hover:bg-white/10 hover:text-white'
        }`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {/* Efecto de highlight en estado activo */}
        {isActive && (
          <motion.div 
            className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent rounded-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          />
        )}

        {/* Icono con animación */}
        <motion.div 
          className="flex-shrink-0 relative"
          variants={iconVariants}
          animate={isActive ? "active" : "normal"}
          whileHover="hover"
        >
          {icon}
          
          {/* Badge de notificación */}
          {badge && (
            <motion.span 
              className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[9px] rounded-full h-3 w-3 flex items-center justify-center"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ 
                type: "spring", 
                stiffness: 500, 
                damping: 15,
                delay: delay + 0.1
              }}
            />
          )}
        </motion.div>

        {/* Texto con animación de entrada */}
        {sidebarOpen && (
          <motion.span 
            className="poppins-regular text-sm flex-1 text-left whitespace-nowrap overflow-hidden text-ellipsis"
            initial={{ opacity: 0, x: -5 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2, delay: delay + 0.05 }}
          >
            {text}
          </motion.span>
        )}

        {/* Indicador de estado activo */}
        {isActive && sidebarOpen && (
          <motion.div 
            className="w-1 h-4 bg-white rounded-full ml-auto"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ 
              type: "spring", 
              stiffness: 400, 
              damping: 10,
              delay: delay + 0.1
            }}
          />
        )}
      </motion.button>
    </motion.li>
  );
};