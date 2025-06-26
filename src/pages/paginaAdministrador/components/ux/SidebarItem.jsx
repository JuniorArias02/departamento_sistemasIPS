import { motion, AnimatePresence } from "framer-motion";

export const SidebarItem = ({ icon, text, onClick, sidebarOpen, isActive = false, badge }) => (
  <motion.li
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    className="list-none"
  >
    <div className="relative">
      <button
        onClick={onClick}
        className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${isActive
            ? 'bg-white/10 text-white'
            : 'text-white/70 hover:bg-white/5 hover:text-white'
          }`}
      >
        <div className="relative flex-shrink-0">
          {icon}
          {badge && (
            <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center inter-regular">
              {badge}
            </span>
          )}
        </div>

        <div className="min-w-[110px] overflow-hidden">
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
                className="poppins-medium block truncate text-[14px]"
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