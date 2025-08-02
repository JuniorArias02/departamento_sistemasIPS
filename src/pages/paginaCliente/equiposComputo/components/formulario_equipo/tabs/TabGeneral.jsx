// src/components/equipos/tabs/TabGeneral.jsx
import {
	ChevronDown,
	Computer,
	Trello,
	Package,
	ScanBarcode,
	Tag,
	List,
	ArrowDownToDot,
	User,
	SquareActivity,
	Calendar,
	CalendarArrowUp,
	Map,
	ShoppingBag
} from "lucide-react";

export default function TabGeneral({ form, handleChange, sedes, areas, personal }) {
	return (
		<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
			<div className="space-y-4">
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
						<Computer className="mr-2 h-4 w-4" />Nombre del Equipo
					</label>
					<input
						type="text"
						name="nombre_equipo"
						value={form.nombre_equipo}
						onChange={handleChange}
						className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
						required
					/>
				</div>

				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
						<Trello className="mr-2 h-4 w-4" />Marca
					</label>
					<input
						type="text"
						name="marca"
						value={form.marca}
						onChange={handleChange}
						className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
						required
					/>
				</div>

				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
						<Package className="mr-2 h-4 w-4" />Modelo
					</label>
					<input
						type="text"
						name="modelo"
						value={form.modelo}
						onChange={handleChange}
						className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
						required
					/>
				</div>

				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
						<ScanBarcode className="mr-2 h-4 w-4" />Serial
					</label>
					<input
						type="text"
						name="serial"
						value={form.serial}
						onChange={handleChange}
						className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
						required
					/>
				</div>

				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
						<Tag className="mr-2 h-4 w-4" />Tipo
					</label>
					<select
						name="tipo"
						value={form.tipo}
						onChange={handleChange}
						className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
						required
					>
						<option value="">Seleccione...</option>
						<option value="Desktop">Desktop</option>
						<option value="Laptop">Laptop</option>
						<option value="All-in-One">All-in-One</option>
						<option value="Servidor">Servidor</option>
					</select>
				</div>

				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
						<List className="mr-2 h-4 w-4" />Propiedad
					</label>
					<select
						name="propiedad"
						value={form.propiedad}
						onChange={handleChange}
						className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
						required
					>
						<option value="">Seleccione...</option>
						<option value="empresa">empresa</option>
						<option value="empleado">Empleado</option>
					</select>
				</div>
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
						<ShoppingBag className="mr-2 h-4 w-4" />Forma de Adquisicion
					</label>
					<select
						name="forma_adquisicion"
						value={form.forma_adquisicion}
						onChange={handleChange}
						className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
						required
					>
						<option value="">Seleccione...</option>
						<option value="compra">Compra Directa</option>
						<option value="alquiler">Alquiler</option>
						<option value="donacion">Donacion</option>
						<option value="comodato">Comodato</option>
					</select>
				</div>
			</div>

			{/* Columna 2 */}
			<div className="space-y-4">
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
						<Map className="mr-2 h-4 w-4" />	Sede
					</label>
					<div className="relative">
						<select
							name="sede_id"
							value={form.sede_id}
							onChange={handleChange}
							className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 appearance-none"
							required
						>
							<option value="">Seleccione una sede...</option>
							{sedes.map(sede => (
								<option key={sede.id} value={sede.id}>{sede.nombre}</option>
							))}
						</select>
						<ChevronDown className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
					</div>
				</div>

				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
						<ArrowDownToDot className="mr-2 h-4 w-4" />Área
					</label>
					<div className="relative">
						<select
							name="area_id"
							value={form.area_id}
							onChange={handleChange}
							disabled={!form.sede_id}
							className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 appearance-none"
							required
						>
							<option value="">{form.sede_id ? 'Seleccione un área...' : 'Primero seleccione una sede'}</option>
							{areas.map(area => (
								<option key={area.id} value={area.id}>{area.nombre}</option>
							))}
						</select>
						<ChevronDown className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
					</div>
				</div>

				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
						<User className="mr-2 h-4 w-4" />Responsable
					</label>
					<div className="relative">
						<select
							name="responsable_id"
							value={form.responsable_id}
							onChange={handleChange}
							className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 appearance-none"
							required
						>
							<option value="">Seleccione un responsable...</option>
							{personal.map(persona => (
								<option key={persona.id} value={persona.id}>{persona.nombre} {persona.cedula}</option>
							))}
						</select>
						<ChevronDown className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
					</div>
				</div>

				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
						<SquareActivity className="mr-2 h-4 w-4" />Estado
					</label>
					<select
						name="estado"
						value={form.estado}
						onChange={handleChange}
						className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
						required
					>
						<option value="">Seleccione...</option>
						<option value="Nuevo">Nuevo</option>
						<option value="Usado">Usado</option>
						<option value="Dañado">Dañado</option>
						<option value="En Reparación">En Reparación</option>
					</select>
				</div>

				<div className="grid grid-cols-2 gap-4">
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
							<Calendar className="mr-2 h-4 w-4" />Fecha de Entrega
						</label>
						<div className="relative">
							<input
								type="date"
								name="fecha_entrega"
								value={form.fecha_entrega}
								onChange={handleChange}
								className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
							/>
							{/* <Calendar className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" /> */}
						</div>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">Garantía (meses)</label>
						<input
							type="number"
							name="garantia_meses"
							value={form.garantia_meses}
							onChange={handleChange}
							className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
						/>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
							<CalendarArrowUp className="mr-2 h-4 w-4" />Fecha de ingreso
						</label>
						<div className="relative">
							<input
								type="date"
								name="fecha_ingreso"
								value={form.fecha_ingreso}
								onChange={handleChange}
								className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
							/>
							{/* <Calendar className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" /> */}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
