export const getEstadoColor = (estado) => {
	switch (estado?.toLowerCase()) {
		case 'aprobado':
			return 'bg-green-100 text-green-800';
		case 'pendiente':
			return 'bg-yellow-100 text-yellow-800';
		case 'rechazado':
			return 'bg-red-100 text-red-800';
		case 'en proceso':
			return 'bg-blue-100 text-blue-800';
		default:
			return 'bg-gray-100 text-gray-800';
	}
};
