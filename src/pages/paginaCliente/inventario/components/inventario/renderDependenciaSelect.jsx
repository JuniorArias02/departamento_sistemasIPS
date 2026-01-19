import { motion } from "framer-motion";
import { Building2 } from "lucide-react";

const renderDependenciaSelect = ({ formData, handleChange, dependencias }) => (
	<motion.div
		initial={{ opacity: 0, y: 10 }}
		animate={{ opacity: 1, y: 0 }}
		className="space-y-1"
	>
		<label htmlFor="dependencia" className="text-sm font-medium text-gray-700 flex items-center gap-1">
			<Building2 size={18} className="text-gray-400" />
			<span>Dependencia</span>
		</label>
		<div className="relative">
			<select
				id="dependencia"
				name="dependencia"
				value={formData.dependencia || ""}
				onChange={handleChange}
				disabled={!dependencias.length}
				className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
			>
				<option value="">Seleccione una dependencia</option>
				{dependencias.map((d) => (
					<option key={d.nombre} value={d.nombre}>{d.nombre}</option>
				))}
			</select>
			<Building2 size={18} className="absolute left-3 top-3.5 text-gray-400" />
		</div>
	</motion.div>
);

export default renderDependenciaSelect; 