import { useState } from 'react';
import { useApp } from "../../../store/AppContext";
import { PERMISOS } from "../../../secure/permisos/permisos";
import { crearRol } from '../../../services/rol_services';
import { ShieldPlus, Key, Loader2, AlertCircle } from 'lucide-react';
import Swal from 'sweetalert2';

export default function FormularioCrearRol() {
  const { usuario, permisos } = useApp();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [nombreRol, setNombreRol] = useState('');

  // Verificar permisos
  const puedeCrear = permisos.includes(PERMISOS.ROLES.CREAR);

  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nombreRol.trim()) {
      await Swal.fire({
        title: 'Campo requerido',
        text: 'Debe ingresar un nombre para el rol',
        icon: 'warning',
        confirmButtonColor: '#7e22ce',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const datosEnvio = {
        nombre: nombreRol.trim(),
        creado_por: usuario.id
      };

      const response = await crearRol(datosEnvio);

      await Swal.fire({
        title: '¡Rol creado!',
        text: `El rol "${nombreRol}" ha sido creado exitosamente`,
        icon: 'success',
        confirmButtonColor: '#7e22ce',
        confirmButtonText: 'Aceptar'
      });

      setNombreRol('');

      return response;

    } catch (error) {
      await Swal.fire({
        title: 'Error',
        text: error.message || 'Error al crear el rol',
        icon: 'error',
        confirmButtonColor: '#dc2626',
        confirmButtonText: 'Entendido'
      });
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!puedeCrear) {
    return (
      <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-md mt-6">
        <div className="flex items-center gap-3 p-4 bg-red-50 rounded-lg text-red-600">
          <AlertCircle className="w-5 h-5" />
          <p>No tienes permisos para crear roles.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-lg mt-6">
      <div className="flex items-center gap-3 mb-6">
        <ShieldPlus className="w-8 h-8 text-purple-600" />
        <h1 className="text-2xl font-bold text-gray-800">Crear Nuevo Rol</h1>
      </div>

      <p className="text-gray-600 mb-8">Ingrese el nombre del nuevo rol. Los permisos se asignarán posteriormente.</p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Campo Nombre del Rol */}
        <div>
          <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <Key className="w-4 h-4" />
            Nombre del Rol *
          </label>
          <input
            type="text"
            id="nombre"
            value={nombreRol}
            onChange={(e) => setNombreRol(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
            placeholder="Ej: Administrador, Supervisor, etc."
            maxLength={50}
          />
          <p className="text-xs text-gray-500 mt-1">Máximo 50 caracteres</p>
        </div>

        {/* Botón de envío */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={isSubmitting || !nombreRol.trim()}
            className="w-full px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Creando...
              </>
            ) : (
              <>
                <ShieldPlus className="w-5 h-5" />
                Crear Rol
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}