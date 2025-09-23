export function formatearFecha(fechaString) {
	if (!fechaString) return "";
	const [year, month, day] = fechaString.split("-");
	return `${day}/${month}/${year}`;
}
