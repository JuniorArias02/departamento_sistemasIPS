import { useState } from "react";
import { crearActaEntrega } from "../../../../services/pc_entregas_services";
import { useApp } from "../../../../store/AppContext";
import { FirmaInput } from "../../../appFirma/appFirmas";
import { buscarPerifericoo } from "../../../../services/pc_perifericos_services";
import { buscarEquipo } from "../../../../services/pc_equipos_services";
import { buscarPersonal } from "../../../../services/personal_services";
import BuscarEquipo from "../../componentsUnive/BuscarEquipo";
import BuscarPerifericos from "../../componentsUnive/BuscarPerifericos";
import Swal from 'sweetalert2';
import {
  ClipboardList, Search, User, Calendar, Plus, Trash2, Save,
  FileText, Edit3, Cable, List, Loader2, Info
} from 'lucide-react';
import BuscarResponsable from "../../componentsUnive/BuscarResponsable";


const VistaCrearActaEntrega = () => {
  const { usuario } = useApp();

  const [perifericoBusqueda, setPerifericoBusqueda] = useState("");
  const [perifericoSeleccionado, setPerifericoSeleccionado] = useState(null);
  const [perifericoSeleccionadoId, setPerifericoSeleccionadoId] = useState("");

  const [busquedaEquipo, setBusquedaEquipo] = useState("");
  const [equipoSeleccionado, setEquipoSeleccionado] = useState(null);

  const [personalResultados, setPersonalResultados] = useState([]);
  const [personalBusqueda, setPersonalBusqueda] = useState('');

  const [guardando, setGuardando] = useState(false);

  const dataURLtoBlob = (dataurl) => {
    const arr = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  };

  const [form, setForm] = useState({
    equipo_id: "",
    funcionario_id: "",
    fecha_entrega: "",
    firma_entrega: "",
    firma_recibe: "",
    perifericos: []
  });

  const [periferico, setPeriferico] = useState({
    nombre: "",
    cantidad: 1,
    marca: "",
    modelo: "",
    observaciones: ""
  });

  const [perifericos, setPerifericos] = useState([]);


  const agregarPeriferico = (item) => {
    setForm((prev) => {
      const existe = prev.perifericos.some(
        (p) => p.inventario_id === item.inventario_id
      );
      if (existe) return prev;

      return {
        ...prev,
        perifericos: [
          ...prev.perifericos,
          {
            inventario_id: item.inventario_id,
            nombre: item.nombre,
            serial: item.serial,
            marca: item.marca,
            modelo: item.modelo,
            cantidad: 1,
          },
        ],
      };
    });
  };



  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };


  const buscarFuncionario = async (texto) => {
    setPersonalBusqueda(texto);
    if (texto.length >= 2) {
      const resultados = await buscarPersonal(texto);
      setPersonalResultados(resultados);
    } else {
      setPersonalResultados([]);
    }
  };


  const removerPeriferico = (index) => {
    const nuevosPerifericos = form.perifericos.filter((_, i) => i !== index);
    setForm({ ...form, perifericos: nuevosPerifericos });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGuardando(true);

    Swal.fire({
      title: 'Guardando acta...',
      text: 'Por favor espera',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    try {
      const payload = {
        funcionario_id: form.funcionario_id,
        equipo_id: form.equipo_id,
        fecha_entrega: form.fecha_entrega,
        usuario_id: usuario.id,
        firma_entrega: form.firma_entrega,
        firma_recibe: form.firma_recibe,
        perifericos: form.perifericos.map(p => ({
          inventario_id: p.inventario_id,
          cantidad: Number(p.cantidad),
          observaciones: p.observaciones || ""
        })),
      };

      const res = await crearActaEntrega(payload);
      // console.log(res);
      if (res.status) {
        Swal.fire({
          icon: 'success',
          title: 'Acta creada',
          text: 'La acta fue registrada correctamente',
          timer: 2000,
          showConfirmButton: false
        });

        setForm({
          equipo_id: "",
          funcionario_id: "",
          fecha_entrega: "",
          firma_entrega: "",
          firma_recibe: "",
          perifericos: []
        });

        setBusquedaEquipo("");
        setEquipoSeleccionado(null);
        setPersonalBusqueda("");
        setPerifericoSeleccionado(null);
        setPerifericoSeleccionadoId("");
        setPerifericoBusqueda("");
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: res.message || 'No se pudo guardar el acta'
        });
      }

    } catch (error) {
      console.error("Error inesperado:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error del sistema',
        text: 'Ocurrió un error inesperado.'
      });
    } finally {
      setGuardando(false);
    }
  };
  return (
    <div className="max-w-4xl mx-auto p-6 mt-5 bg-white rounded-2xl shadow-xl border border-gray-100">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-5 rounded-xl mb-8 border border-blue-100">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
          <div className="bg-blue-100 p-2 rounded-lg">
            <ClipboardList className="text-blue-600" size={28} />
          </div>
          Crear Acta de Entrega
        </h1>
        <p className="text-gray-600 flex items-center gap-2">
          <Info className="h-4 w-4 text-blue-400" />
          Complete todos los campos para generar el acta de entrega
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Sección de Información Principal */}
        <div className="bg-gray-50 p-5 rounded-xl border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <FileText className="text-blue-500" size={20} />
            Información del Equipo y Entrega
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Campo ID Equipo */}
            <div>
              <div className="relative">
                <div className="mb-3">
                  <BuscarEquipo
                    name="equipo_id"
                    value={form.equipo_id}
                    onChange={handleChange}
                    label="Equipo"
                  />
                </div>
                <BuscarResponsable
                  name="funcionario_id"
                  value={form.funcionario_id}
                  onChange={handleChange}
                  label="Funcionario"
                />
              </div>
            </div>

            {/* Campo Fecha */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                <Calendar className="text-gray-500" size={16} />
                Fecha de Entrega
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="text-gray-400" size={18} />
                </div>
                <input
                  type="date"
                  name="fecha_entrega"
                  value={form.fecha_entrega}
                  onChange={handleChange}
                  className="border pl-10 p-3 rounded-xl w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 border-gray-300 transition-colors"
                  required
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sección de Firmas */}
        <div className="bg-gray-50 p-5 rounded-xl border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Edit3 className="text-blue-500" size={20} />
            Firmas
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FirmaInput
              value={form.firma_entrega}
              onChange={(value) => setForm({ ...form, firma_entrega: value })}
              label="Firma Entrega"
            />

            <FirmaInput
              value={form.firma_recibe}
              onChange={(value) => setForm({ ...form, firma_recibe: value })}
              label="Firma Recibe"
            />
          </div>
        </div>

        {/* Búsqueda de Periféricos */}
        <div className="bg-gray-50 p-5 rounded-xl border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Cable className="text-blue-500" size={20} />
            Gestión de Periféricos
          </h2>

          <BuscarPerifericos onSelect={agregarPeriferico} />

          {form.perifericos.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 p-5 rounded-xl mt-4">
              <h4 className="font-medium text-gray-800 mb-4 flex items-center gap-2">
                <List className="text-blue-600" size={20} />
                Periféricos Agregados
              </h4>

              <ul className="divide-y divide-blue-100">
                {form.perifericos.map((p, index) => (
                  <li key={index} className="py-4 flex justify-between items-center">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-gray-800">{p.nombre}</span>
                        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                          {p.cantidad}x
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">
                        {p.marca} {p.modelo} • {p.serial}
                      </div>
                    </div>

                    {/* ELIMINAR */}
                    <button
                      type="button"
                      onClick={() => {
                        const nuevos = [...form.perifericos];
                        nuevos.splice(index, 1);
                        setForm({ ...form, perifericos: nuevos });
                      }}
                      className="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>


        {/* Botón de envío */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-medium py-3 px-6 rounded-xl flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
            disabled={guardando}
          >
            {guardando ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                Procesando...
              </>
            ) : (
              <>
                <Save size={18} />
                Guardar Acta de Entrega
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default VistaCrearActaEntrega;