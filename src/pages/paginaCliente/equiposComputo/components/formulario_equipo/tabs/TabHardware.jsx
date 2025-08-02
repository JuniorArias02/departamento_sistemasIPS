import {
	HardDrive,
	Cpu,
	MemoryStick,
	Disc,
	Monitor,
	Network,
	Speaker,
	Usb,
	Disc3,
	HardDriveDownload
	

} from "lucide-react";
export default function TabHardware({ form, handleChange }) {

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
			{/* Columna 1 */}
			<div className="space-y-4">
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
						<Cpu className="mr-2 h-4 w-4" /> Procesador
					</label>
					<input
						type="text"
						name="procesador"
						value={form.procesador}
						onChange={handleChange}
						className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
					/>
				</div>

				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
						<MemoryStick className="mr-2 h-4 w-4" /> Memoria RAM (GB)
					</label>
					<input
						type="text"
						name="memoria_ram"
						value={form.memoria_ram}
						onChange={handleChange}
						className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
					/>
				</div>

				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
						<Disc className="mr-2 h-4 w-4" /> Disco Duro
					</label>
					<input
						type="text"
						name="disco_duro"
						value={form.disco_duro}
						onChange={handleChange}
						className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
					/>
				</div>

				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
						<HardDrive className="mr-2 h-4 w-4" /> Capacidad Disco (GB)
					</label>
					<input
						type="text"
						name="capacidad_disco"
						value={form.capacidad_disco}
						onChange={handleChange}
						className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
					/>
				</div>

				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
						<Network className="mr-2 h-4 w-4" /> Tarjeta de Red
					</label>
					<input
						type="text"
						name="tarjeta_red"
						value={form.tarjeta_red}
						onChange={handleChange}
						className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
					/>
				</div>
			</div>

			{/* Columna 2 */}
			<div className="space-y-4">
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
						<Monitor className="mr-2 h-4 w-4" /> Tarjeta de Video
					</label>
					<input
						type="text"
						name="tarjeta_video"
						value={form.tarjeta_video}
						onChange={handleChange}
						className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
					/>
				</div>

				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
						<Speaker className="mr-2 h-4 w-4" /> Tarjeta de Sonido
					</label>
					<input
						type="text"
						name="tarjeta_sonido"
						value={form.tarjeta_sonido}
						onChange={handleChange}
						className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
					/>
				</div>

				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
						<Usb className="mr-2 h-4 w-4" /> Puertos USB
					</label>
					<input
						type="text"
						name="usb"
						value={form.usb}
						onChange={handleChange}
						className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
					/>
				</div>

				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
						<Disc3 className="mr-2 h-4 w-4" />Unidad CD/DVD
					</label>
					<input
						type="text"
						name="unidad_cd"
						value={form.unidad_cd}
						onChange={handleChange}
						className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
					/>
				</div>

				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
						<HardDriveDownload className="mr-2 h-4 w-4" />Drive
						</label>
					<input
						type="text"
						name="drive"
						value={form.drive}
						onChange={handleChange}
						className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
					/>
				</div>
			</div>
		</div>
	)
}