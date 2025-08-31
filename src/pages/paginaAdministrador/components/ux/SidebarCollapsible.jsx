import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from 'lucide-react';

export const SidebarCollapsible = ({ 
  icon, 
  text, 
  isOpen, 
  onClick, 
  children, 
  sidebarOpen, 
  badge, 
  isBeta 
}) => {
  // Variantes para animaciones
  const containerVariants = {
    hidden: { 
      opacity: 0, 
      height: 0,
      transition: {
        duration: 0.2,
        ease: "easeOut"
      }
    },
    visible: {
      opacity: 1,
      height: "auto",
      transition: {
        duration: 0.3,
        ease: "easeInOut",
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      x: -10,
      transition: {
        duration: 0.15
      }
    },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: {
        duration: 0.2,
        ease: "easeOut"
      }
    }
  };

  const textVariants = {
    hidden: { 
      opacity: 0, 
      x: -5,
      transition: {
        duration: 0.1
      }
    },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: {
        duration: 0.2,
        ease: "easeOut"
      }
    }
  };

  return (
    <li className="mb-1">
      <motion.button
        onClick={onClick}
        className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-lg transition-all duration-200 ${
          isOpen 
            ? 'bg-white/15 text-white shadow-md' 
            : 'text-white/80 hover:bg-white/10 hover:text-white'
        } group relative overflow-hidden`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {/* Efecto de fondo al hover */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent opacity-0 group-hover:opacity-100"
          initial={false}
          transition={{ duration: 0.2 }}
        />
        
        <div className="relative flex-shrink-0">
          <motion.div
            animate={{ 
              rotate: isOpen ? 5 : 0,
              scale: isOpen ? 1.1 : 1
            }}
            transition={{ duration: 0.2 }}
          >
            {icon}
          </motion.div>
          
          {/* Badge normal (contador) */}
          {badge && !isBeta && (
            <motion.span 
              className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] rounded-full h-4 min-w-4 flex items-center justify-center inter-medium px-0.5 shadow-sm"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ 
                type: "spring", 
                stiffness: 500, 
                damping: 15 
              }}
            >
              {badge > 99 ? "99+" : badge}
            </motion.span>
          )}
          
          {/* Badge BETA (estilo especial) */}
          {isBeta && (
            <motion.span 
              className="absolute -top-2 -right-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-[8px] font-bold rounded-full h-5 w-7 flex items-center justify-center border-b border-blue-700/50 shadow-sm"
              initial={{ scale: 0, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ 
                type: "spring", 
                stiffness: 500, 
                damping: 15,
                delay: 0.1
              }}
              whileHover={{ 
                scale: 1.1,
                rotate: [0, -2, 2, 0],
                transition: { duration: 0.3 }
              }}
            >
              β
            </motion.span>
          )}
        </div>

        {sidebarOpen && (
          <>
            <motion.span
              variants={textVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="poppins-medium flex-1 text-left whitespace-nowrap text-[14px] tracking-wide"
            >
              {text}
            </motion.span>
            <motion.div
              animate={{ 
                rotate: isOpen ? 180 : 0,
                scale: isOpen ? 1.1 : 1
              }}
              transition={{ 
                type: "spring", 
                stiffness: 400, 
                damping: 15,
                duration: 0.2
              }}
              className="text-white/70 group-hover:text-white"
            >
              <ChevronDown size={16} />
            </motion.div>
          </>
        )}
      </motion.button>

      <AnimatePresence mode="wait">
        {isOpen && sidebarOpen && (
          <motion.ul
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="ml-2 pl-3 border-l-2 border-white/15 mt-1 space-y-1 overflow-hidden"
          >
            <motion.div variants={itemVariants}>
              {children}
            </motion.div>
          </motion.ul>
        )}
      </AnimatePresence>
    </li>
  );
};