import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from 'lucide-react';

export const SidebarCollapsible = ({ icon, text, isOpen, onClick, children, sidebarOpen, badge, isBeta }) => (
  <li>
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${isOpen ? 'bg-white/10 text-white' : 'text-white/70 hover:bg-white/5 hover:text-white'
        }`}
    >
      <div className="relative">
        {icon}
        {badge && !isBeta && ( // 👈 Badge normal (contador)
          <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center inter-medium">
            {badge}
          </span>
        )}
        {isBeta && ( // 👈 Badge BETA (estilo especial)
          <span className="absolute -top-2 -right-2 bg-[#3B82F6] text-white text-[8px] font-bold rounded-full h-5 w-7 flex items-center justify-center border-b-2 border-blue-700 transform transition-all hover:scale-110 active:scale-95 active:border-b-0 active:translate-y-0.5">
            βeta
          </span>
        )}
      </div>

      {sidebarOpen && (
        <>
          <motion.span
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="poppins-medium flex-1 text-left whitespace-nowrap text-[14px]"
          >
            {text}
          </motion.span>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown size={16} />
          </motion.div>
        </>
      )}
    </button>

    <AnimatePresence>
      {isOpen && sidebarOpen && (
        <motion.ul
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={{
            hidden: { opacity: 0, height: 0 },
            visible: {
              opacity: 1,
              height: 'auto',
              transition: {
                staggerChildren: 0.05
              }
            }
          }}
          className="ml-1 pl-2 border-l border-white/10 mt-0.5 space-y-0.5"
        >
          {children}
        </motion.ul>
      )}
    </AnimatePresence>
  </li>
);