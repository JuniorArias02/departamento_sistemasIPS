import { motion, useMotionValue, useTransform } from "framer-motion";
import { Plus } from "lucide-react";
import { useState, useEffect } from "react";

export function DraggableButton({ setSelectedDate }) {


  return (
    <motion.button
      className="fixed bottom-8 right-8 p-4 bg-[#5D0EC0] text-white rounded-full shadow-lg flex items-center gap-2 cursor-pointer active:cursor-pointer z-[9999]"
      whileHover={{ scale: 1.05, backgroundColor: '#4E24CE' }}
      whileDrag={{ scale: 1.1, boxShadow: '0px 10px 20px rgba(0,0,0,0.2)' }}
      onClick={(e) => {
        // Evita que se active el onClick cuando arrastras
        if (!e.defaultPrevented) {
          setSelectedDate(new Date());
        }
      }}

    >
      <Plus size={24} />
      <span className="hidden sm:inline">Nuevo</span>
    </motion.button>
  );
}