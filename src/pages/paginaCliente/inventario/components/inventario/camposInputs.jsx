import React from 'react'
import { motion } from 'framer-motion'

function CamposInputs({ name, label, type, icon, formData, handleChange }) {
	
	return (
		<div
			key={name}
			initial={{ opacity: 0, y: 10 }}
			animate={{ opacity: 1, y: 0 }}
			className="space-y-1"
		>
			<label htmlFor={name} className="text-sm font-medium text-gray-700 flex items-center gap-1">
				{icon}
				<span>{label}</span>
			</label>
			<div className="relative">
				<input
					type={type}
					id={name}
					name={name}
					value={formData[name] || ''}
					onChange={handleChange}
					className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
					placeholder={`Ingrese ${label.toLowerCase()}`}
					step={type === "number" ? "0.01" : undefined}
				/>
				<div className="absolute left-3 top-3.5">
					{icon}
				</div>
			</div>
		</div>
	);
}

export default CamposInputs;