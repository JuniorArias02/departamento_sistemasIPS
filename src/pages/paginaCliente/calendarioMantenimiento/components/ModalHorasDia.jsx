import React, { useState } from "react";
import ModalCrearMantenimiento from "./ModalCrearMantenimiento";
import { X, Clock, ChevronRight, ChevronLeft, Sun, Moon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const ModalHorasDia = ({ fecha, onClose }) => {
  const [horaSeleccionada, setHoraSeleccionada] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);

  // Dividir las horas en grupos de 12 (mañana/tarde)
  const horasDelDia = Array.from({ length: 24 }, (_, i) => ({
    hora: `${i.toString().padStart(2, '0')}:00`,
    periodo: i < 12 ? 'AM' : 'PM'
  }));

  const horasPorPagina = 12;
  const paginas = [
    horasDelDia.slice(0, 12), // Mañana (AM)
    horasDelDia.slice(12, 24) // Tarde/Noche (PM)
  ];

  const handleNextPage = () => {
    setCurrentPage((prev) => (prev + 1) % paginas.length);
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => (prev - 1 + paginas.length) % paginas.length);
  };

  return (
    <div className="fixed inset-0 bg-[#00000004] flex justify-center items-center z-50 backdrop-blur-xs">
      <motion.div 
        className="bg-white rounded-xl p-6 w-[90vw] max-w-md max-h-[90vh] overflow-y-auto shadow-2xl border border-white/10"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", damping: 20 }}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <Clock className="text-[#5D0EC0]" size={20} />
            <span>Horas disponibles - {fecha.toLocaleDateString('es', { weekday: 'long', day: 'numeric', month: 'long' })}</span>
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Selector de periodo */}
        <div className="flex justify-center items-center mb-4 gap-2">
          <button 
            onClick={handlePrevPage}
            className="p-2 rounded-full hover:bg-[#4E24CE]/10 text-[#4E24CE]"
          >
            <ChevronLeft size={18} />
          </button>
          
          <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#4E24CE]/10 to-[#5D0EC0]/10 rounded-full">
            {currentPage === 0 ? (
              <Sun className="text-yellow-500" size={18} />
            ) : (
              <Moon className="text-indigo-500" size={18} />
            )}
            <span className="font-medium text-sm">
              {currentPage === 0 ? 'Mañana (AM)' : 'Tarde/Noche (PM)'}
            </span>
          </div>
          
          <button 
            onClick={handleNextPage}
            className="p-2 rounded-full hover:bg-[#4E24CE]/10 text-[#4E24CE]"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        {/* Grid de horas */}
        <motion.div 
          className="grid grid-cols-3 gap-3"
          key={currentPage}
          initial={{ opacity: 0, x: currentPage === 0 ? -20 : 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: currentPage === 0 ? -20 : 20 }}
          transition={{ duration: 0.2 }}
        >
          {paginas[currentPage].map(({ hora, periodo }, i) => (
            <motion.button
              key={`${currentPage}-${i}`}
              onClick={() => setHoraSeleccionada(hora)}
              className={`p-3 rounded-lg text-center transition-all flex flex-col items-center
                ${horaSeleccionada === hora 
                  ? 'bg-gradient-to-br from-[#4E24CE] to-[#5D0EC0] text-white shadow-lg'
                  : 'bg-gray-50 hover:bg-gray-100 text-gray-800 border border-gray-200'}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="font-medium text-sm">{hora}</span>
              <span className="text-xs opacity-70">{periodo}</span>
            </motion.button>
          ))}
        </motion.div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium transition-colors flex items-center gap-2"
          >
            Cancelar
          </button>
        </div>
      </motion.div>

      {/* Modal para crear mantenimiento */}
      <AnimatePresence>
        {horaSeleccionada && (
          <ModalCrearMantenimiento
            fecha={fecha}
            hora={horaSeleccionada}
            onClose={() => setHoraSeleccionada(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default ModalHorasDia;

