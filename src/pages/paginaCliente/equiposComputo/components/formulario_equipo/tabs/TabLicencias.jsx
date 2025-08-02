import {
	Info,
	Key
} from 'lucide-react';

export default function TabLicencias({ form, setForm }) {

	return (
		<div className="space-y-6">
			<h3 className="text-lg font-medium text-gray-900 flex items-center">
				<Key className="mr-2 h-5 w-5 text-indigo-500" /> Licencias de Software
			</h3>

			<div className="space-y-4">
				{/* Checkbox Windows */}
				<div className="relative flex items-start">
					<div className="flex h-6 items-center">
						<input
							id="windows"
							name="windows"
							type="checkbox"
							checked={form.windows === "Si"}
							onChange={(e) => setForm({
								...form,
								windows: e.target.checked ? "Si" : "No"
							})}
							className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
						/>
					</div>
					<div className="ml-3 text-sm leading-6">
						<label htmlFor="windows" className="font-medium text-gray-900 flex items-center">
							<svg className="mr-2 h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2z" />
							</svg>
							Windows
						</label>
						<p className="text-gray-500">Sistema operativo Microsoft Windows</p>
					</div>
				</div>

				{/* Checkbox Office */}
				<div className="relative flex items-start">
					<div className="flex h-6 items-center">
						<input
							id="office"
							name="office"
							type="checkbox"
							checked={form.office === "Si"}
							onChange={(e) => setForm({
								...form,
								office: e.target.checked ? "Si" : "No"
							})}
							className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
						/>
					</div>
					<div className="ml-3 text-sm leading-6">
						<label htmlFor="office" className="font-medium text-gray-900 flex items-center">
							<svg className="mr-2 h-4 w-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
							</svg>
							Microsoft Office
						</label>
						<p className="text-gray-500">Suite de productividad Office (Word, Excel, PowerPoint)</p>
					</div>
				</div>

				{/* Checkbox Nitro */}
				<div className="relative flex items-start">
					<div className="flex h-6 items-center">
						<input
							id="nitro"
							name="nitro"
							type="checkbox"
							checked={form.nitro === "Si"}
							onChange={(e) => setForm({
								...form,
								nitro: e.target.checked ? "Si" : "No"
							})}
							className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
						/>
					</div>
					<div className="ml-3 text-sm leading-6">
						<label htmlFor="nitro" className="font-medium text-gray-900 flex items-center">
							<svg className="mr-2 h-4 w-4 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
							</svg>
							Nitro PDF
						</label>
						<p className="text-gray-500">Software para edición y creación de PDFs</p>
					</div>
				</div>
			</div>

			<div className="bg-indigo-50 p-4 rounded-md">
				<h4 className="text-sm font-medium text-indigo-800 flex items-center">
					<Info className="mr-2 h-4 w-4" /> Información sobre licencias
				</h4>
				<p className="mt-1 text-sm text-indigo-700">
					Marque las licencias que están instaladas y activas en este equipo.
					Todas las licencias deben estar debidamente registradas en el departamento de sistemas.
				</p>
			</div>
		</div>
	)
}