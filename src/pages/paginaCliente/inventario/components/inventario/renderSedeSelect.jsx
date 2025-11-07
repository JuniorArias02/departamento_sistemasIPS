import { motion } from "framer-motion";
import { MapPin, ChevronDown } from "lucide-react";
const renderSedeSelect = ({ formData, handleChange, sedes }) => (
	<motion.div
		initial={{ opacity: 0, y: 10 }}
		animate={{ opacity: 1, y: 0 }}
		transition={{ delay: 0.4 }}
		className="space-y-1"
	>
		<label htmlFor="sede_id" className="text-sm font-medium text-gray-700 flex items-center gap-1">
			<MapPin size={18} className="text-gray-400" />
			<span>Sede/Localización</span>
		</label>
		<div className="relative">
			<select
				id="sede_id"
				name="sede_id"
				value={formData.sede_id}
				onChange={handleChange}
				className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none transition-all"
			>
				<option value="">Seleccione una sede</option>
				{sedes.map((s) => (
					<option key={s.id} value={s.id}>{s.nombre}</option>
				))}
			</select>
			<MapPin size={18} className="absolute left-3 top-3.5 text-gray-400" />
			<ChevronDown size={18} className="absolute right-3 top-3.5 text-gray-400 pointer-events-none" />
		</div>
	</motion.div>
);

export default renderSedeSelect;