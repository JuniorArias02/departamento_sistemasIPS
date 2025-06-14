import { motion } from "framer-motion";
export const SidebarItem = ({ icon, text, onClick, sidebarOpen, isActive = false, badge }) => (
  <motion.li 
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
  >
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
        isActive 
          ? 'bg-white/10 text-white' 
          : 'text-white/70 hover:bg-white/5 hover:text-white'
      }`}
    >
      <div className="relative">
        {icon}
        {badge && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {badge}
          </span>
        )}
      </div>
      {sidebarOpen && (
        <motion.span 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="font-medium"
        >
          {text}
        </motion.span>
      )}
    </button>
  </motion.li>
);