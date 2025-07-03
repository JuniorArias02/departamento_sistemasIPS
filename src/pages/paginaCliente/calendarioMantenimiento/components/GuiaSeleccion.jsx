import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Hand, MousePointerClick, ArrowUp, ArrowDown, MoveVertical } from "lucide-react";

const GuiaSeleccion = ({ onClose }) => {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => document.body.style.overflow = 'auto';
  }, []);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[9999]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="w-full h-full flex flex-col md:flex-row items-center justify-center p-2 md:p-4 relative">
          {/* Línea divisoria central (vertical siempre) */}
          <div className="absolute top-0 bottom-0 left-1/2 transform -translate-x-1/2 w-0.5 bg-white/30"></div>

          {/* Sección izquierda - Selección */}
          <motion.div
            className="relative w-full md:w-1/2 h-1/2 md:h-full flex flex-col items-center justify-center px-2"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <motion.div
              className="bg-white/90 text-[#5D0EC0] p-3 rounded-full shadow-lg mb-4 md:mb-6"
              animate={{ scale: [1, 1.1, 1], x: [-10, 10, -10] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <Hand size={32} />
            </motion.div>

            <div className="text-center max-w-xs text-white">
              <h3 className="text-lg md:text-xl font-bold mb-2">Zona de Selección</h3>
              <div className="inline-flex items-center gap-2 bg-[#5D0EC0] text-white px-4 py-2 rounded-full shadow-lg text-sm">
                <MousePointerClick size={18} />
                <span>Arrastra para seleccionar</span>
                <MoveVertical size={18} />
              </div>
              <p className="text-white/80 mt-3 text-xs md:text-sm">
                Mantén presionado y arrastra en esta área para seleccionar tu horario
              </p>
            </div>
          </motion.div>

          {/* Sección derecha - Scroll */}
          <motion.div
            className="relative w-full md:w-1/2 h-1/2 md:h-full flex flex-col items-center justify-center px-2"
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <motion.div
              className="bg-white/90 text-[#5D0EC0] p-3 rounded-full shadow-lg mb-4 md:mb-6"
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              <ArrowUp size={32} />
              <ArrowDown size={32} className="mt-1" />
            </motion.div>

            <div className="text-center max-w-xs text-white">
              <h3 className="text-lg md:text-xl font-bold mb-2">Zona de Scroll</h3>
              <div className="inline-flex items-center gap-2 bg-white text-[#5D0EC0] px-4 py-2 rounded-full border-2 border-[#5D0EC0] shadow-lg text-sm">
                <ArrowUp size={18} />
                <span>Desliza para navegar</span>
                <ArrowDown size={18} />
              </div>
              <p className="text-white/80 mt-3 text-xs md:text-sm">
                Usa esta área para hacer scroll y ver más horas del día
              </p>
            </div>
          </motion.div>

          {/* Botón de cierre */}
          <motion.button
            onClick={onClose}
            className="absolute top-4 right-4 bg-white text-[#5D0EC0] p-2 rounded-full shadow-lg"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <X size={24} />
          </motion.button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default GuiaSeleccion;