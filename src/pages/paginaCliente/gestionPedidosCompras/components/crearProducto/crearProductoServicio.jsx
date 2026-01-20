import React, { useState, useRef } from 'react';
import {
    Package,
    Save,
    X,
    Sparkles,
    Tag,
    FileText,
    AlertCircle,
    ArrowLeft,
    Loader2
} from 'lucide-react';
import Swal from 'sweetalert2';
import { useApp } from '../../../../../store/AppContext';
import { crearProductoServicio } from '../../../../../services/cp_producto_servicio';
import { useNavigate } from 'react-router-dom';

export function CrearProductoServicio() {
    const { usuario } = useApp();
    const [loading, setLoading] = useState(false);
    const formRef = useRef(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const formData = new FormData(e.target);
            const codigo_producto = formData.get('codigo_producto')?.trim();
            const nombre = formData.get('nombre')?.trim();

            if (!codigo_producto) {
                throw new Error('El código del producto es obligatorio');
            }
            if (!nombre) {
                throw new Error('El nombre del producto es obligatorio');
            }

            const data = await crearProductoServicio({
                usuario_id: usuario.id,
                codigo_producto,
                nombre
            });

            if (!data.success) {
                throw new Error(data.error || 'Error al crear el producto/servicio');
            }

            await Swal.fire({
                icon: 'success',
                title: '¡Producto creado!',
                text: `El producto "${data.producto_servicio.nombre}" fue registrado exitosamente`,
                timer: 3000,
                showConfirmButton: false,
                background: '#fff',
                customClass: {
                    popup: 'rounded-xl shadow-2xl'
                }
            });

            // Limpiar formulario
            formRef.current?.reset();
            // Opcional: regresar después de crear exitosamente?
            // navigate(-1); 

        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message,
                confirmButtonText: 'Entendido',
                confirmButtonColor: '#ef4444',
                customClass: {
                    popup: 'rounded-xl shadow-2xl'
                }
            });
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        formRef.current?.reset();
    };

    return (
        <div className="min-h-screen bg-gray-50/50 py-8 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center">

            {/* Contenedor principal estilo tarjeta */}
            <div className="w-full max-w-2xl bg-white rounded-3xl shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] border border-gray-100 overflow-hidden relative">

                {/* Botón Flotante de Regreso */}
                <div className="absolute top-6 left-6 z-10">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 bg-white/80 hover:bg-white text-gray-600 hover:text-indigo-600 rounded-full shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 backdrop-blur-sm group"
                        title="Volver atrás"
                    >
                        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    </button>
                </div>

                {/* Banner decorativo superior */}
                <div className="h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 w-full"></div>

                <div className="p-8 sm:p-10 space-y-8">
                    {/* Header */}
                    <div className="text-center relative">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl mb-4 group hover:scale-105 transition-transform duration-300 border-2 border-dashed border-indigo-100">
                            <Package className="text-indigo-600 group-hover:text-purple-600 transition-colors" size={40} />
                        </div>
                        <h2 className="text-3xl font-bold bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent mb-2">
                            Nuevo Producto o Servicio
                        </h2>
                        <p className="text-gray-500 max-w-md mx-auto flex items-center justify-center gap-2">
                            Registra elementos para el inventario
                        </p>
                    </div>

                    {/* Formulario */}
                    <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">

                        <div className="grid gap-6">
                            {/* Código del Producto */}
                            <div className="group space-y-2">
                                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                    <div className="p-1.5 bg-blue-50 rounded-lg text-blue-600">
                                        <Tag size={16} />
                                    </div>
                                    Código del Producto
                                    <span className="text-red-500 text-xs ml-auto font-normal flex items-center gap-1">
                                        * Obligatorio
                                    </span>
                                </label>
                                <div className="relative transform transition-all duration-300 focus-within:scale-[1.01]">
                                    <input
                                        type="text"
                                        name="codigo_producto"
                                        placeholder="Ej: PROD-2024-001"
                                        className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none text-gray-800 placeholder-gray-400 font-medium"
                                        required
                                    />
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-gray-400">
                                        <Tag size={18} />
                                    </div>
                                </div>
                                <p className="text-xs text-gray-500 pl-1 flex items-center gap-1">
                                    <AlertCircle size={12} />
                                    Debe ser único en el sistema
                                </p>
                            </div>

                            {/* Nombre del Producto */}
                            <div className="group space-y-2">
                                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                    <div className="p-1.5 bg-purple-50 rounded-lg text-purple-600">
                                        <FileText size={16} />
                                    </div>
                                    Nombre o Descripción
                                    <span className="text-red-500">*</span>
                                </label>
                                <div className="relative transform transition-all duration-300 focus-within:scale-[1.01]">
                                    <textarea
                                        name="nombre"
                                        placeholder="Describe el producto o servicio detalladamente..."
                                        rows={3}
                                        className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 transition-all outline-none text-gray-800 placeholder-gray-400 font-medium resize-none"
                                        required
                                    />
                                    <div className="absolute top-4 left-4 pointer-events-none text-gray-400">
                                        <FileText size={18} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Información adicional con estilo mejorado */}
                        <div className="bg-indigo-50/50 rounded-2xl p-5 border border-indigo-100/50 text-sm text-indigo-900/80">
                            <div className="flex gap-3">
                                <div className="p-2 bg-indigo-100 rounded-xl h-fit">
                                    <AlertCircle size={18} className="text-indigo-600" />
                                </div>
                                <div className="space-y-2">
                                    <h4 className="font-semibold text-indigo-900">Antes de guardar</h4>
                                    <ul className="space-y-1.5 list-disc list-inside text-xs opacity-90">
                                        <li>Verifica que el código no exista previamente</li>
                                        <li>Usa nombres descriptivos para facilitar la búsqueda</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Botones de acción */}
                        <div className="flex gap-4 pt-4 border-t border-gray-50">
                            <button
                                type="button"
                                onClick={handleReset}
                                className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 border border-gray-200 text-gray-600 font-semibold rounded-xl hover:bg-gray-50 hover:border-gray-300 hover:text-gray-900 transition-all duration-300"
                                disabled={loading}
                            >
                                <X size={18} />
                                Limpiar
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className={`flex-[2] flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg shadow-indigo-200 hover:shadow-xl hover:shadow-indigo-300 transition-all duration-300 transform active:scale-95 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="animate-spin" size={20} />
                                        <span>Guardando...</span>
                                    </>
                                ) : (
                                    <>
                                        <Save size={20} />
                                        <span>Crear Producto</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}