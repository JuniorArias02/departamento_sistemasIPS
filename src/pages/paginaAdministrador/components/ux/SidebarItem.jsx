import { motion, AnimatePresence } from "framer-motion";

export const SidebarItem = ({ icon, text, onClick, sidebarOpen, isActive = false, badge }) => (
  <motion.li 
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    className="list-none"
  >
    <div className="relative"> {/* Contenedor adicional para el badge absoluto */}
      <button
        onClick={onClick}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
          isActive 
            ? 'bg-white/10 text-white' 
            : 'text-white/70 hover:bg-white/5 hover:text-white'
        }`}
      >
        <div className="relative flex-shrink-0">
          {icon}
          {badge && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {badge}
            </span>
          )}
        </div>
        
        {/* Texto con ancho fijo para evitar layout shift */}
        <div className="min-w-[120px] overflow-hidden"> {/* Contenedor con ancho mínimo */}
          <AnimatePresence mode="wait">
            {sidebarOpen ? (
              <motion.span
                key={`sidebar-item-text-${text}`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ 
                  opacity: 1, 
                  x: 0,
                  transition: { delay: 0.15, duration: 0.2 }
                }}
                exit={{ 
                  opacity: 0, 
                  x: -10,
                  transition: { duration: 0.1 } 
                }}
                className="font-medium block truncate"
              >
                {text}
              </motion.span>
            ) : (
              <span 
                key={`sidebar-item-empty-${text}`} 
                className="w-0 h-0 overflow-hidden block"
                aria-hidden
              />
            )}
          </AnimatePresence>
        </div>
      </button>
    </div>
  </motion.li>
);