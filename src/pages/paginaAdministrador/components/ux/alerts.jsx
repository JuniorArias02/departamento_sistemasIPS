import Swal from 'sweetalert2';
export const showSuccessAlert = (message) => {
	return Swal.fire({
		position: 'center',
		icon: 'success',
		title: message,
		showConfirmButton: false,
		timer: 2500,
		background: '#f8fafc',
		backdrop: `
      rgba(16, 185, 129, 0.1)
      left top
      no-repeat
    `
	});
};

export const showErrorAlert = (error) => {
	return Swal.fire({
		icon: 'error',
		title: 'Error',
		text: typeof error === 'string' ? error : error.message,
		confirmButtonColor: '#3b82f6',
		background: '#f8fafc'
	});
};