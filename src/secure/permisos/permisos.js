import { SUBIR_ADJUNTO } from "../../const/endpoint/cp_pedidos_endpoint";

export const PERMISOS = {
	USUARIOS: {
		MENU_ITEM: "menu_item_usuario",
		ACCESO_MODULO: "acceso_modulo_usuario",
		CREAR: "crear_usuario",
		EDITAR: "editar_usuario",
		ELIMINAR: "eliminar_usuario",
		ACTUALIZAR: "actualizar_usuario",
		VER_DATOS: "ver_datos_usuarios"
	},
	SISTEMA: {
		INGRESAR_DASHBOARDADMIN: "ingresar_dashboardAdmin",
		INGRESAR_SIDEBAR_ADMIN: "ingresar_sidebarAdmin"
	},
	ROLES: {
		MENU_ITEM: "menu_item_roles",
		ACCESO_MODULO: "acceso_modulo_roles",
		VER_LISTADO: "ver_listado_roles",
		CREAR: "crear_roles",
		EDITAR: "editar_roles",
		ASIGNAR_PERMISOS: "asignar_permisos"
	},
	MANTENIMIENTOS: {
		VER_DATOS: "ver_datos_mantenimientos",
		VER_FORMULARIO: "ver_formulario_mantenimiento",
		MARCAR_REVISADO: "marcar_revisado_mantenimiento",
		VER_DETALLE: "ver_detalle_mantenimiento",
		CREAR: "crear_mantenimiento",
		EDITAR: "editar_mantenimiento",
		ELIMINAR: "eliminar_mantenimiento",
		VER_TODOS: "ver_todos_mantenimientos",
		VER_PROPIOS: "ver_propios_mantenimientos",
		CONTAR_TODOS_PENDIENTES: 'contar_todos_pendientes_mantenimientos',
		CONTAR_PROPIOS_PENDIENTES: 'contar_propios_pendientes_mantenimientos',
	},
	AGENDAMIENTO_MANTENIMIENTOS: {
		MENU_ITEM: "menu_item_agendamiento_mantenimientos",
		VER_CALENDARIO: "ver_calendario_mantenimientos",
		VER_PROGRAMADOS: "ver_programados_mantenimientos",
		CREAR_AGENDA: "crear_agenda_mantenimientos"
	},

	GESTION_PERMISOS: {
		MENU_ITEM: "menu_item_permisos",
		CREAR: "crear_permiso",
		ASIGNAR: "asignar_permisos"
	},
	INVENTARIO: {
		VER_DATOS: "ver_datos_inventario",
		VER_FORMULARIO: "ver_formulario_inventario",
		CREAR: "crear_inventario",
		EDITAR: "editar_inventario",
		ELIMINAR: "eliminar_inventario",
		EXPORTAR: "exportar_inventario"
	},

	ADMINISTRADOR_WEB: {
		MENU_ITEM: 'menu_item_admin_web',
		CREAR_AVISO_ACTUALIZACION: 'crear_aviso_actualizacion_web',
		EDITAR_AVISO_ACTUALIZACION: 'editar_aviso_actualizacion_web',
		ELIMINAR_AVISO_ACTUALIZACION: 'eliminar_aviso_actualizacion_web',
		VER_AVISOS: 'ver_avisos_actualizacion_web',
	},
	GESTION_EQUIPOS: {
		MENU_ITEM: "menu_item_equipos_computo",
		AGREGAR: "agregar_equipo",
		VER_FORMULARIO: "ver_formulario_equipo",
		CREAR_ACTA: "crear_acta_entrega",
		CREAR_MANTENIMIENTO: "crear_mantenimiento_equipo",  // Crear mantenimientos
		VER: "ver_equipos_computo",
		EDITAR: "editar_equipo",
		ELIMINAR: "eliminar_equipo",
		EXPORTAR: "exportar_inventario_equipos",
		VER_ACTA_MANTENIMIENTO:"ver_acta_mantenimiento",
		DEVOLVER_EQUIPO: "devolver_equipo"
	},

	GESTION_COMPRA_PEDIDOS: {
		MENU_ITEM: 'menu_item_gestion_compra',
		CREAR_PEDIDO: 'crear_pedido',
		VER_INFORMES: 'ver_informes',
		VER_PROVEEDORE: 'ver_proveedores',
		VER_SOLICITUDES_PEDIDOS: 'ver_solicitudes_pedidos',
		VER_PEDIDOS_ENCARGADO: 'ver_pedidos_encargado',
		VER_SOLICITUDES_DESCUENTO:'ver_solicitudes_descuento',
		VER_ENTREGA_ACTIVOS_FIJOS:'ver_entrega_activos_fijos',
		LISTAR_PEDIDOS: 'listar_pedidos',
		GESTIONAR_PEDIDO: 'gestionar_pedido',
		VER_ENTREGA_SOLICITUD: 'ver_entrega_solicitud',
		CREAR_ENTREGA_SOLICITUD: 'crear_entrega_solicitud',
		CREAR_ENTREGA_ACTIVOS_FIJOS: 'crear_entrega_activos_fijos',
		CREAR_DESCUENTO_FIJOS:'crear_descuento_fijos',
		VER_CONSOLIDADO_PEDIDOS:'ver_consolidado_pedidos',
		SUBIR_ORDEN_COMPRA:'subir_orden_compra',

	},

	GESTION_PERSONAL: {
		MENU_ITEM: 'menu_item_gestion_personal',
		CREAR: 'crear_personal',
		VER: 'ver_personal',
	},


};
