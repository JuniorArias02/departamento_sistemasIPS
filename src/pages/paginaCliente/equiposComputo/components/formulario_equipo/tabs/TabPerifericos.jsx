import {
	Monitor,
	Keyboard,
	Mouse,
	AudioLines,
	EthernetPort,
	Wifi,
	Gauge,
	Package2
} from 'lucide-react';
export default function TabPerifericos({ form, handleChange }) {

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
			{/* Columna 1 */}
			<div className="space-y-4">
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
						<Monitor className="mr-2 h-4 w-4" /> Monitor
					</label>
					<input
						type="text"
						name="monitor"
						value={form.monitor}
						onChange={handleChange}
						className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
					/>
				</div>

				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
						<Keyboard className="mr-2 h-4 w-4" /> Teclado
					</label>
					<input
						type="text"
						name="teclado"
						value={form.teclado}
						onChange={handleChange}
						className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
					/>
				</div>

				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
						<Mouse className="mr-2 h-4 w-4" /> Mouse
					</label>
					<input
						type="text"
						name="mouse"
						value={form.mouse}
						onChange={handleChange}
						className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
					/>
				</div>

				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
						<AudioLines className="mr-2 h-4 w-4" />Parlantes
					</label>
					<input
						type="text"
						name="parlantes"
						value={form.parlantes}
						onChange={handleChange}
						className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
					/>
				</div>
			</div>

			{/* Columna 2 */}
			<div className="space-y-4">
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
						<EthernetPort className="mr-2 h-4 w-4" />IP Fija
					</label>
					<input
						type="text"
						name="ip_fija"
						value={form.ip_fija}
						onChange={handleChange}
						className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
					/>
				</div>

				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
						<Package2 className="mr-2 h-4 w-4" />Número de Inventario

					</label>
					<input
						type="text"
						name="numero_inventario"
						value={form.numero_inventario}
						onChange={handleChange}
						className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
					/>
				</div>

				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
						<Wifi className="mr-2 h-4 w-4" />Internet

					</label>
					<select
						name="internet"
						value={form.internet}
						onChange={handleChange}
						className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
					>
						<option value="">Seleccione...</option>
						<option value="Si">Sí</option>
						<option value="No">No</option>
					</select>
				</div>

				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
						<Gauge className="mr-2 h-4 w-4" />Velocidad de Red (Mbps)
					</label>
					<input
						type="text"
						name="velocidad_red"
						value={form.velocidad_red}
						onChange={handleChange}
						className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
					/>
				</div>
			</div>
		</div>
	)
}