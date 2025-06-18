import { useState } from "react";
import Swal from "sweetalert2";
import BackPage from "../components/BackPage";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useApp } from "../../../store/AppContext";
import { Shield, LockKeyhole, PlusCircle, MinusCircle, ListChecks } from 'lucide-react';

export default function GestionRolesPermisos() {
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAsignarModal, setShowAsignarModal] = useState(false);


    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto p-6 space-y-6">
            <BackPage />

            <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-800">
                    Gestión de Roles y Permisos
                </h1>
                <p className="text-gray-600 mt-2">
                    Asigna y gestiona los permisos para cada rol del sistema
                </p>
            </div>

            <div className="flex justify-end mb-4">
                <button
                    onClick={() => setShowAsignarModal(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
                >
                    <PlusCircle className="mr-2" /> Asignar Permiso
                </button>
            </div>

            {roles.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">No hay roles registrados</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {roles.map((rol) => (
                        <motion.div
                            key={rol.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className="bg-white rounded-xl shadow-md overflow-hidden"
                        >
                            <div className="p-5 border-l-4 border-blue-500">
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center">
                                        <Shield className="mr-2 text-blue-600" />
                                        <h3 className="text-xl font-semibold text-gray-800">{rol.nombre}</h3>
                                    </div>
                                    <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                                        {rol.permisos.length} permisos
                                    </span>
                                </div>

                                {rol.permisos.length > 0 ? (
                                    <div className="mt-4">
                                        <div className="flex items-center text-sm text-gray-500 mb-2">
                                            <ListChecks className="mr-2" />
                                            <span>Permisos asignados:</span>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {rol.permisos.map((permiso) => (
                                                <div 
                                                    key={permiso.id} 
                                                    className="flex items-center bg-gray-100 px-3 py-1 rounded-full"
                                                >
                                                    <LockKeyhole className="mr-1 h-4 w-4 text-gray-600" />
                                                    <span className="text-sm text-gray-700">{permiso.nombre}</span>
                                                    <button
                                                        onClick=""
                                                        className="ml-2 text-red-500 hover:text-red-700"
                                                    >
                                                        <MinusCircle className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="mt-4 text-sm text-gray-500">
                                        Este rol no tiene permisos asignados
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Modal para asignar permisos */}
            {showAsignarModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-lg p-6 w-full max-w-md"
                    >
                        <h3 className="text-xl font-semibold mb-4">Asignar Permiso a Rol</h3>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Rol</label>
                                <select
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                    onChange=""
                                >
                                    <option value="">Selecciona un rol</option>
                                    {roles.map(rol => (
                                        <option key={rol.id} value={rol.id}>{rol.nombre}</option>
                                    ))}
                                </select>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Permiso</label>
                                <select
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                    onChange=""
                                >
                                    <option value="">Selecciona un permiso</option>
                                  
                                </select>
                            </div>
                        </div>

                        <div className="mt-6 flex justify-end space-x-3">
                            <button
                                onClick={() => setShowAsignarModal(false)}
                                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick=""
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
                            >
                                <PlusCircle className="mr-2" /> Asignar
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
}