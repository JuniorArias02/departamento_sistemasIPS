import Swal from "sweetalert2";

export function mostrarAlertaSinPermiso() {
	Swal.fire({
		icon: "warning",
		title: "Acceso denegado",
		text: "No tienes permisos para acceder a esta opción.",
		confirmButtonColor: "#3085d6",
	});
}
