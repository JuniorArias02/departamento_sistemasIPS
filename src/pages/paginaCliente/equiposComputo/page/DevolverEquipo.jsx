import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FirmaInput } from "../../../appFirma/appFirmas";
import { FileText, User, Laptop, Calendar, Package, RotateCcw } from "lucide-react";
import { devolverEquipo } from "../../../../services/pc_entregas_services";
import Swal from "sweetalert2";


const DevolverEquipo = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { acta } = location.state || {};

    const [firmaEntrega, setFirmaEntrega] = useState("");
    const [firmaRecibe, setFirmaRecibe] = useState("");
    const [observaciones, setObservaciones] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!acta) {
            navigate(-1);
        }
    }, [acta, navigate]);

    const base64ToFile = (base64) => {
        const arr = base64.split(',');
        const mime = arr[0].match(/:(.*?);/)[1];
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);

        while (n--) u8arr[n] = bstr.charCodeAt(n);

        return new File([u8arr], 'firma.png', { type: mime });
    };



    const handleSubmit = async () => {
        if (!firmaEntrega || !firmaRecibe) {
            Swal.fire({
                icon: 'warning',
                title: 'Atención',
                text: 'Las dos firmas son obligatorias para proceder con la devolución.',
                confirmButtonColor: '#f97316'
            });
            return;
        }

        setLoading(true);

        const formData = new FormData();
        // Agregamos los datos al FormData, convirtiendo las firmas base64 a archivos
        formData.append("entrega_id", acta?.id);
        formData.append("firma_entrega", base64ToFile(firmaEntrega));
        formData.append("firma_recibe", base64ToFile(firmaRecibe));
        formData.append("observaciones", observaciones);

        try {
            const res = await devolverEquipo(formData);

            if (res.success || res.ok) {
                await Swal.fire({
                    icon: 'success',
                    title: '¡Éxito!',
                    text: 'El equipo ha sido devuelto correctamente.',
                    confirmButtonColor: '#10b981',
                    timer: 2000,
                    showConfirmButton: false
                });
                navigate(-1);
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: res.message || "No se pudo procesar la devolución en este momento.",
                    confirmButtonColor: '#ef4444'
                });
            }
        } catch (err) {
            console.error(err);
            Swal.fire({
                icon: 'error',
                title: 'Error Inesperado',
                text: 'Ocurrió un error al intentar comunicar con el servidor.',
                confirmButtonColor: '#ef4444'
            });
        } finally {
            setLoading(false);
        }
    };

    if (!acta) return null;

    return (
        <div className="min-h-screen bg-white p-6 md:p-12 font-sans text-slate-900">
            <div className="max-w-5xl mx-auto">
                {/* Header Integrado */}
                <div className="mb-12">
                    <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 flex items-center gap-4">
                        <div className="bg-orange-500/10 p-3 rounded-2xl text-orange-600">
                            <FileText className="w-8 h-8" />
                        </div>
                        Devolución de Equipo
                    </h1>
                    <p className="text-slate-500 mt-3 text-lg font-light max-w-2xl">
                        Finaliza la asignación del equipo diligenciando el acta de devolución y verificando el estado de los periféricos.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                    {/* Lateral Izquierda: Resumen del Equipo y Periféricos */}
                    <div className="lg:col-span-5 space-y-12">
                        <section>
                            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-6">Información de la Entrega</h3>
                            <div className="space-y-6">
                                <div className="flex gap-4 items-start">
                                    <div className="bg-blue-50 p-2.5 rounded-xl">
                                        <Laptop className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-slate-900">{acta.nombre_equipo}</p>
                                        <p className="text-xs text-slate-500">{acta.equipo_marca} {acta.equipo_modelo}</p>
                                    </div>
                                </div>
                                <div className="flex gap-4 items-start">
                                    <div className="bg-indigo-50 p-2.5 rounded-xl">
                                        <User className="w-5 h-5 text-indigo-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-slate-900">{acta.funcionario_nombre}</p>
                                        <p className="text-xs text-slate-500">CC: {acta.funcionario_cedula}</p>
                                    </div>
                                </div>
                                <div className="flex gap-4 items-start">
                                    <div className="bg-amber-50 p-2.5 rounded-xl">
                                        <Calendar className="w-5 h-5 text-amber-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-slate-900">Fecha de Asignación</p>
                                        <p className="text-xs text-slate-500">{new Date(acta.fecha_entrega).toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Periféricos Integrados */}
                        {acta.perifericos && acta.perifericos.length > 0 && (
                            <section>
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Periféricos a Recibir</h3>
                                    <span className="bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full text-[10px]">{acta.perifericos.length} ítems</span>
                                </div>
                                <div className="space-y-3">
                                    {acta.perifericos.map((p, index) => (
                                        <div key={index} className="flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl border border-slate-100 group hover:border-blue-200 transition-all">
                                            <div className="flex items-center gap-4">
                                                <div className="bg-white p-2 rounded-lg shadow-sm">
                                                    <Package className="w-4 h-4 text-slate-400" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-slate-800">{p.nombre}</p>
                                                    <p className="text-[10px] text-slate-400 font-mono">SN: {p.serial || 'N/A'}</p>
                                                </div>
                                            </div>
                                            <span className="text-xs font-bold text-slate-400">x{p.cantidad}</span>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>

                    {/* Lado Derecho: Formulario de Firmas y Observaciones */}
                    <div className="lg:col-span-7 space-y-10">
                        <section className="space-y-8">
                            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Diligenciamiento del Acta</h3>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-3">Observaciones de la Devolución</label>
                                <textarea
                                    value={observaciones}
                                    onChange={(e) => setObservaciones(e.target.value)}
                                    className="w-full border-none rounded-3xl p-5 ring-1 ring-slate-200 focus:ring-2 focus:ring-blue-500/50 bg-slate-50/30 text-slate-900 transition-all min-h-[140px]"
                                    placeholder="Describe el estado físico del equipo, accesorios faltantes o cualquier novedad..."
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Firma entrega */}
                                <div>
                                    {/* <p className="block text-sm font-semibold text-slate-700 mb-4">Firma quien Entrega</p> */}
                                    <div className="bg-white p-3 ring-1 ring-slate-200 rounded-3xl overflow-hidden hover:ring-blue-500/50 transition-all shadow-sm">
                                        <FirmaInput
                                            label="Firma quien Entrega"
                                            value={firmaEntrega}
                                            onChange={setFirmaEntrega}
                                            size="medium"
                                        />
                                    </div>
                                </div>

                                {/* Firma recibe */}
                                <div>
                                    {/* <p className="block text-sm font-semibold text-slate-700 mb-4">Firma quien Recibe</p> */}
                                    <div className="bg-white p-3 ring-1 ring-slate-200 rounded-3xl overflow-hidden hover:ring-blue-500/50 transition-all shadow-sm">
                                        <FirmaInput
                                            label="Firma quien Recibe"
                                            value={firmaRecibe}
                                            onChange={setFirmaRecibe}
                                            size="medium"
                                        />
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Botones de Acción */}
                        <div className="flex flex-col sm:flex-row gap-4 pt-6">
                            <button
                                onClick={handleSubmit}
                                disabled={loading}
                                className={`flex-1 flex items-center justify-center gap-3 text-white py-4 px-8 rounded-2xl font-bold shadow-xl shadow-orange-500/20 transition-all ${loading
                                    ? 'bg-slate-300 cursor-not-allowed shadow-none'
                                    : 'bg-gradient-to-r from-orange-500 to-rose-600 hover:shadow-orange-500/40 hover:-translate-y-1 active:translate-y-0'
                                    }`}
                            >
                                {loading ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        <span>Procesando...</span>
                                    </>
                                ) : (
                                    <>
                                        <RotateCcw className="w-5 h-5" />
                                        <span>Confirmar Devolución</span>
                                    </>
                                )}
                            </button>

                            <button
                                onClick={() => navigate(-1)}
                                className="px-10 py-4 bg-slate-50 text-slate-500 rounded-2xl font-bold hover:bg-slate-100 hover:text-slate-700 transition-all"
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DevolverEquipo;
