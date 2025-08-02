import { useState, useEffect } from 'react';
import { crearEquipo, editarEquipo } from "../../../../services/pc_equipos_services";
import { listarSedes } from "../../../../services/sedes_service";
import { obtenerAreaPorSede } from "../../../../services/area_services";
import { obtenerPersonal } from "../../../../services/personal_services";
import { useApp } from "../../../../store/AppContext";
import Swal from 'sweetalert2';
import {
	HardDrive,
	Cpu,
	Keyboard,
	Info,
	Save,
	X,
	Key,

} from 'lucide-react';
import TabGeneral from '../components/formulario_equipo/tabs/TabGeneral';
import TabHardware from '../components/formulario_equipo/tabs/TabHardware';
import TabPerifericos from '../components/formulario_equipo/tabs/TabPerifericos';
import TabLicencias from '../components/formulario_equipo/tabs/TabLicencias';
import BackPage from '../../components/BackPage';
import { useLocation } from "react-router-dom";
const FormularioEquipo = () => {
	const { usuario } = useApp();
	const location = useLocation();
	const equipoComputoEdit = location.state?.equipo;

	const [form, setForm] = useState({
		id: equipoComputoEdit ? equipoComputoEdit.id : null,
		usuario_id: usuario.id,
		nombre_equipo: "",
		marca: "",
		modelo: "",
		serial: "",
		tipo: "",
		propiedad: "",
		ip_fija: "",
		numero_inventario: "",
		sede_id: "",
		area_id: "",
		responsable_id: "",
		estado: "",
		fecha_entrega: "",
		descripcion_general: "",
		garantia_meses: "",
		forma_adquisicion: "",
		observaciones: "",
		fecha_ingreso: "",
		procesador: "",
		memoria_ram: "",
		disco_duro: "",
		tarjeta_video: "",
		tarjeta_red: "",
		tarjeta_sonido: "",
		usb: "",
		unidad_cd: "",
		parlantes: "",
		drive: "",
		monitor: "",
		teclado: "",
		mouse: "",
		internet: "",
		velocidad_red: "",
		capacidad_disco: "",
		windows: "",
		office: "",
		nitro: ""
	});

	useEffect(() => {
		console.log("Equipo a editar:", equipoComputoEdit);
		if (equipoComputoEdit) {
			setForm({
				id: equipoComputoEdit.id || null,
				usuario_id: equipoComputoEdit.usuario_id || usuario.id,
				nombre_equipo: equipoComputoEdit.nombre_equipo || "",
				marca: equipoComputoEdit.marca || "",
				modelo: equipoComputoEdit.modelo || "",
				serial: equipoComputoEdit.serial || "",
				tipo: equipoComputoEdit.tipo || "",
				propiedad: equipoComputoEdit.propiedad || "",
				ip_fija: equipoComputoEdit.ip_fija || "",
				numero_inventario: equipoComputoEdit.numero_inventario || "",
				sede_id: equipoComputoEdit.sede_id || "",
				area_id: equipoComputoEdit.area_id || "",
				responsable_id: equipoComputoEdit.responsable_id || "",
				estado: equipoComputoEdit.estado || "",
				fecha_entrega: equipoComputoEdit.fecha_entrega || "",
				descripcion_general: equipoComputoEdit.descripcion_general || "",
				garantia_meses: equipoComputoEdit.garantia_meses || "",
				forma_adquisicion: equipoComputoEdit.forma_adquisicion || "",
				observaciones: equipoComputoEdit.observaciones || "",
				fecha_ingreso: equipoComputoEdit.fecha_ingreso || "",
				procesador: equipoComputoEdit.procesador || "",
				memoria_ram: equipoComputoEdit.memoria_ram || "",
				disco_duro: equipoComputoEdit.disco_duro || "",
				tarjeta_video: equipoComputoEdit.tarjeta_video || "",
				tarjeta_red: equipoComputoEdit.tarjeta_red || "",
				tarjeta_sonido: equipoComputoEdit.tarjeta_sonido || "",
				usb: equipoComputoEdit.usb || "",
				unidad_cd: equipoComputoEdit.unidad_cd || "",
				parlantes: equipoComputoEdit.parlantes || "",
				drive: equipoComputoEdit.drive || "",
				monitor: equipoComputoEdit.monitor || "",
				teclado: equipoComputoEdit.teclado || "",
				mouse: equipoComputoEdit.mouse || "",
				internet: equipoComputoEdit.internet || "",
				velocidad_red: equipoComputoEdit.velocidad_red || "",
				capacidad_disco: equipoComputoEdit.capacidad_disco || "",
				windows: equipoComputoEdit.windows || "",
				office: equipoComputoEdit.office || "",
				nitro: equipoComputoEdit.nitro || ""
			});
		}
	}, [equipoComputoEdit]);


	const [sedes, setSedes] = useState([]);
	const [areas, setAreas] = useState([]);
	const [personal, setPersonal] = useState([]);
	const [loading, setLoading] = useState(false);
	const [activeTab, setActiveTab] = useState('general');

	// Obtener sedes al cargar el componente
	useEffect(() => {
		const fetchSedes = async () => {
			try {
				const data = await listarSedes();
				setSedes(data);
			} catch (error) {
				console.error('Error al obtener sedes:', error);
			}
		};
		fetchSedes();
	}, []);

	// Obtener áreas cuando cambia la sede
	useEffect(() => {
		const fetchAreas = async () => {
			if (form.sede_id) {
				try {
					const data = await obtenerAreaPorSede({ sede_id: form.sede_id });
					setAreas(data.data);
				} catch (error) {
					console.error('Error al obtener áreas:', error);
				}
			} else {
				setAreas([]);
			}
		};
		fetchAreas();
	}, [form.sede_id]);

	// Obtener personal
	useEffect(() => {
		const fetchPersonal = async () => {
			try {
				const data = await obtenerPersonal();
				setPersonal(data.data);
			} catch (error) {
				console.error('Error al obtener personal:', error);
			}
		};
		fetchPersonal();
	}, []);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setForm(prev => ({
			...prev,
			[name]: value
		}));
	};


	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);

		try {
			console.log("Datos del formulario:", form);

			// 🔹 Si hay equipo, llama a editarEquipo
			const res = equipoComputoEdit
				? await editarEquipo(form)
				: await crearEquipo(form);

			if (res.status) {
				await Swal.fire({
					title: '¡Éxito!',
					text: res.message || (equipoComputoEdit ? 'Equipo actualizado correctamente' : 'Equipo creado correctamente'),
					icon: 'success',
					confirmButtonColor: '#4f46e5',
				});

				// Si fue crear, limpias el formulario
				if (!equipoComputoEdit) {
					setForm({
						id: equipoComputoEdit ? equipoComputoEdit.id : null,
						usuario_id: usuario.id,
						nombre_equipo: "",
						marca: "",
						modelo: "",
						serial: "",
						tipo: "",
						propiedad: "",
						ip_fija: "",
						numero_inventario: "",
						area_id: "",
						responsable_id: "",
						estado: "",
						fecha_entrega: "",
						descripcion_general: "",
						garantia_meses: "",
						forma_adquisicion: "",
						observaciones: "",
						repuestos_principales: "",
						recomendaciones: "",
						equipos_adicionales: "",
						procesador: "",
						memoria_ram: "",
						disco_duro: "",
						tarjeta_video: "",
						tarjeta_red: "",
						tarjeta_sonido: "",
						usb: "",
						unidad_cd: "",
						parlantes: "",
						drive: "",
						monitor: "",
						teclado: "",
						mouse: "",
						internet: "",
						velocidad_red: "",
						capacidad_disco: "",
						windows: "",
						office: "",
						nitro: ""
					});
				}
			} else {
				await Swal.fire({
					title: 'Error',
					text: res.message || (equipoComputoEdit ? 'No se pudo actualizar el equipo' : 'No se pudo guardar el equipo'),
					icon: 'error',
					confirmButtonColor: '#4f46e5',
				});
				console.log("Campos faltantes:", res.faltantes);
			}
		} catch (error) {
			console.error('Error al guardar', error);
			await Swal.fire({
				title: 'Error',
				text: equipoComputoEdit ? 'Hubo un problema al actualizar el equipo' : 'Hubo un problema al crear el equipo',
				icon: 'error',
				confirmButtonColor: '#4f46e5',
			});
		} finally {
			setLoading(false);
		}
	}


	const resetForm = () => {
		setForm({
			usuario_id: usuario.id,
			nombre_equipo: "",
			marca: "",
			modelo: "",
			serial: "",
			tipo: "",
			propiedad: "",
			ip_fija: "",
			numero_inventario: "",
			area_id: "",
			responsable_id: "",
			estado: "",
			fecha_entrega: "",
			descripcion_general: "",
			garantia_meses: "",
			forma_adquisicion: "",
			observaciones: "",
			procesador: "",
			memoria_ram: "",
			disco_duro: "",
			tarjeta_video: "",
			tarjeta_red: "",
			tarjeta_sonido: "",
			usb: "",
			unidad_cd: "",
			parlantes: "",
			drive: "",
			monitor: "",
			teclado: "",
			mouse: "",
			internet: "",
			velocidad_red: "",
			capacidad_disco: "",
			windows: "",
			office: "",
			nitro: ""
		});
	};


	return (
		<div className="max-w-6xl mx-auto mt-5 mb-5 p-6 bg-white rounded-lg shadow-md">
			<BackPage isEdit={true} />
			<h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
				<HardDrive className="mr-2" /> Formulario de Equipos de Cómputo
			</h1>

			{/* Tabs */}
			<div className="flex border-b border-gray-200 mb-6">
				<button
					onClick={() => setActiveTab('general')}
					className={`py-2 px-4 font-medium flex items-center ${activeTab === 'general' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500'}`}
				>
					<Info className="mr-2 h-4 w-4" /> Información General
				</button>
				<button
					onClick={() => setActiveTab('hardware')}
					className={`py-2 px-4 font-medium flex items-center ${activeTab === 'hardware' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500'}`}
				>
					<Cpu className="mr-2 h-4 w-4" /> Hardware
				</button>
				<button
					onClick={() => setActiveTab('perifericos')}
					className={`py-2 px-4 font-medium flex items-center ${activeTab === 'perifericos' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500'}`}
				>
					<Keyboard className="mr-2 h-4 w-4" /> Periféricos
				</button>
				<button
					onClick={() => setActiveTab('licencias')}
					className={`py-2 px-4 font-medium flex items-center ${activeTab === 'licencias' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500'}`}
				>
					<Key className="mr-2 h-4 w-4" /> Licencias
				</button>
			</div>

			<form onSubmit={handleSubmit}>
				{activeTab === 'general' && (
					<TabGeneral
						form={form}
						handleChange={handleChange}
						sedes={sedes}
						areas={areas}
						personal={personal}
					/>
				)}

				{activeTab === 'hardware' && (
					<TabHardware
						form={form}
						handleChange={handleChange}
					/>
				)}

				{activeTab === 'perifericos' && (
					<TabPerifericos
						form={form}
						handleChange={handleChange}
					/>
				)}

				{activeTab === 'licencias' && (
					<TabLicencias
						form={form}
						setForm={setForm}
					/>
				)}

				{/* Observaciones y Descripción General (siempre visible) */}
				<div className="mt-6">
					<div className="mb-4">
						<label className="block text-sm font-medium text-gray-700 mb-1">Descripción General</label>
						<textarea
							name="descripcion_general"
							value={form.descripcion_general}
							onChange={handleChange}
							rows={3}
							className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
						/>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">Observaciones</label>
						<textarea
							name="observaciones"
							value={form.observaciones}
							onChange={handleChange}
							rows={3}
							className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
						/>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">Repuestos Principales</label>
						<textarea
							name="repuestos_principales"
							value={form.repuestos_principales}
							onChange={handleChange}
							rows={3}
							className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
						/>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">Recomendaciones</label>
						<textarea
							name="recomendaciones"
							value={form.recomendaciones}
							onChange={handleChange}
							rows={3}
							className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
						/>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">Equipos Adicionales</label>
						<textarea
							name="equipos_adicionales"
							value={form.equipos_adicionales}
							onChange={handleChange}
							rows={3}
							className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
						/>
					</div>
				</div>

				{/* Botones */}
				<div className="mt-8 flex justify-end space-x-4">
					<button
						type="button"
						onClick={() => {
							Swal.fire({
								title: '¿Estás seguro?',
								text: 'Se perderán todos los datos no guardados',
								icon: 'warning',
								showCancelButton: true,
								confirmButtonColor: '#4f46e5',
								cancelButtonColor: '#ef4444',
								confirmButtonText: 'Sí, cancelar',
								cancelButtonText: 'No, continuar'
							}).then((result) => {
								if (result.isConfirmed) {
									resetForm();
								}
							});
						}}
						className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex items-center"
					>
						<X className="mr-2 h-4 w-4" /> Cancelar
					</button>
					<button
						type="submit"
						disabled={loading}
						className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex items-center"
					>
						{loading ? (
							'Guardando...'
						) : (
							<>
								<Save className="mr-2 h-4 w-4" /> Guardar Equipo
							</>
						)}
					</button>
				</div>
			</form>
		</div>
	);
};


export default FormularioEquipo;