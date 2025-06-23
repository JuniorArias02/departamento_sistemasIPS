import React from 'react';
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { obtenerTotalInventario } from '../../services/inventario_services';
import { obtenerTotalMantenimiento } from "../../services/mantenimiento_services";
import { Eye, ClipboardList, Wrench } from "lucide-react";
import { motion } from "framer-motion";
import { useContadorAnimado } from "../../hook/useContadorAnimado";
import { RUTAS } from "../../const/routers/routers";
import { PERMISOS } from '../../secure/permisos/permisos';
import { useApp } from '../../store/AppContext';
export default function Dashboard() {
	const { permisos, } = useApp();
	const navigate = useNavigate();

	const [totales, setTotales] = useState({
		inventario: 0,
		mantenimiento: 0
	});

	useEffect(() => {
		const cargarTotales = async () => {
			try {
				const resultados = await Promise.all([
					permisos.includes(PERMISOS.INVENTARIO.VER_FORMULARIO)
						? obtenerTotalInventario()
						: Promise.resolve(0),
					permisos.includes(PERMISOS.MANTENIMIENTOS.VER_DATOS)
						? obtenerTotalMantenimiento()
						: Promise.resolve(0),
				]);

				setTotales({
					inventario: resultados[0],
					mantenimiento: resultados[1],
				});
			} catch (error) {
				console.error("Error al cargar totales", error);
			}
		};

		cargarTotales();
		const intervalo = setInterval(cargarTotales, 10000);
		return () => clearInterval(intervalo);
	}, [permisos]);

	const opciones = [
		{
			titulo: "Inventarios Generales",
			ruta: RUTAS.USER.INVENTARIO.CREAR_INVENTARIO,
			verRuta: RUTAS.USER.INVENTARIO.VER_INVENTARIO,
			total: totales.inventario,
			permisoFormulario: PERMISOS.INVENTARIO.AGREGAR,
			permisoVerDatos: PERMISOS.INVENTARIO.VER_FORMULARIO
		},
		{
			titulo: "Mantenimientos IPS",
			ruta: RUTAS.USER.MANTENIMIENTO.CREAR_MANTENIMIENTO,
			verRuta: RUTAS.USER.MANTENIMIENTO.VISTA_DATOS,
			total: totales.mantenimiento,
			permisoFormulario: PERMISOS.MANTENIMIENTOS.VER_FORMULARIO,
			permisoVerDatos: PERMISOS.MANTENIMIENTOS.VER_DATOS
		}
	];

	const iconos = [
		<ClipboardList className="h-10 w-10 text-yellow-600" />,
		<Wrench className="h-10 w-10 text-red-600" />
	];

	// Aquí usas el hook para animar el total de cada opción
	const opcionesConAnimacion = opciones.map(op => ({
		...op,
		totalAnimado: useContadorAnimado(op.total, 1000)
	}));

	return (
		<motion.div
			className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-6 pt-24"
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
		>
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl w-full">
				{opcionesConAnimacion
					.filter(op =>
						permisos.includes(op.permisoFormulario) || permisos.includes(op.permisoVerDatos)
					)
					.map((op, i) => (
						<motion.div
							key={i}
							className="relative bg-white p-6 rounded-3xl shadow-[0_8px_30px_-15px_rgba(0,0,0,0.1)] hover:shadow-[0_15px_40px_-15px_rgba(59,130,246,0.3)] border border-white/20 hover:border-indigo-200/50 transition-all duration-300 cursor-pointer group overflow-hidden"
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{
								delay: i * 0.1,
								duration: 0.6,
								ease: [0.16, 1, 0.3, 1]
							}}
							whileHover={{ y: -5 }}
						>
							{/* Fondo decorativo sutil */}
							<div className="absolute inset-0 bg-gradient-to-br from-white to-indigo-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

							{/* Botón "Ver Datos" */}
							{op.verRuta && permisos.includes(op.permisoVerDatos) && (
								<motion.button
									onClick={(e) => {
										e.stopPropagation();
										navigate(op.verRuta);
									}}
									className="absolute top-4 right-4 flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-medium text-xs bg-white/80 hover:bg-white px-3 py-1.5 rounded-full shadow-sm ring-1 ring-gray-200/50 backdrop-blur-sm transition-all z-10"
									whileHover={{ scale: 1.05 }}
									whileTap={{ scale: 0.95 }}
								>
									<Eye className="h-3.5 w-3.5" />
									<span>Ver Datos</span>
								</motion.button>
							)}

							{/* Contenido principal */}
							<div
								onClick={() => {
									if (!op.permisoFormulario || permisos.includes(op.permisoFormulario)) {
										navigate(op.ruta);
									}
								}}
								className="relative flex flex-col items-center justify-center space-y-4 h-full"
							>


								{/* Ícono con efecto */}
								<div className="bg-gradient-to-br from-indigo-100 to-violet-100 p-5 rounded-2xl group-hover:scale-110 group-hover:rotate-2 transition-all duration-500 shadow-inner">
									{React.cloneElement(iconos[i], {
										className: "h-8 w-8 text-indigo-600",
										strokeWidth: 1.5
									})}
								</div>

								{/* Título */}
								<h2 className="text-xl font-bold text-gray-800 group-hover:text-indigo-700 transition-colors text-center">
									{op.titulo}
								</h2>

								{/* Descripción */}
								<p className="text-xs text-gray-500/80 font-medium tracking-wide uppercase">
									Total registrados
								</p>

								{/* Contador animado */}
								<div className="relative">
									<div className="absolute -inset-1 bg-indigo-100/50 rounded-full blur-sm group-hover:blur-md transition-all duration-300"></div>
									<p className="relative text-3xl font-extrabold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent px-5 py-1">
										{op.totalAnimado}
									</p>
								</div>

								{/* Efecto hover */}
								<div className="absolute -bottom-4 -left-4 w-20 h-20 bg-indigo-400/10 rounded-full filter blur-xl group-hover:opacity-100 opacity-0 transition-opacity duration-500"></div>
								<div className="absolute -top-4 -right-4 w-20 h-20 bg-violet-400/10 rounded-full filter blur-xl group-hover:opacity-100 opacity-0 transition-opacity duration-500"></div>
							</div>
						</motion.div>
					))}
			</div>
		</motion.div>
	);
}
