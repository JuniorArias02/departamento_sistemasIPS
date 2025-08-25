import { useState } from "react";
import { crearActaEntrega } from "../../../../services/pc_entregas_services";
import { useApp } from "../../../../store/AppContext";
import { FirmaInput } from "../../../appFirma/appFirmas";
import { buscarPerifericoo } from "../../../../services/pc_perifericos_services";
import { buscarEquipo } from "../../../../services/pc_equipos_services";
import { buscarPersonal } from "../../../../services/personal_services";
import Swal from 'sweetalert2';
import { Search, Calendar, User, Plus, Trash2, Save, MousePointerClick, ClipboardList } from 'lucide-react';

const VistaCrearActaEntrega = () => {
  const { usuario } = useApp();
  const [resultadosBusqueda, setResultadosBusqueda] = useState([]);
  const [perifericoBusqueda, setPerifericoBusqueda] = useState("");
  const [perifericoSeleccionado, setPerifericoSeleccionado] = useState(null);
  const [perifericoSeleccionadoId, setPerifericoSeleccionadoId] = useState("");

  const [busquedaEquipo, setBusquedaEquipo] = useState("");
  const [resultadosEquipos, setResultadosEquipos] = useState([]);
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

  const buscarPeriferico = async (valor) => {
    setPeriferico({ ...periferico, nombre: valor });

    if (valor.trim().length >= 2) {
      const resultados = await buscarPerifericoo(valor);
      setResultadosBusqueda(resultados);
      // console.log("Resultados búsqueda:", resultadosBusqueda);
    } else {
      setResultadosBusqueda([]);
    }
  };
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const agregarPeriferico = () => {
    if (periferico.nombre.trim()) {
      setForm({
        ...form,
        perifericos: [...form.perifericos, periferico]
      });
      setPeriferico({
        nombre: "",
        cantidad: 1,
        marca: "",
        modelo: "",
        observaciones: ""
      });
    }
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
    setGuardando(true); // activamos loading

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
      setGuardando(false); // desactivamos loading
    }
  };
  return (


    <div className="max-w-4xl mx-auto p-6 mt-5 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <ClipboardList className="text-blue-600" size={24} />
        Crear Acta de Entrega
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Campo ID Equipo */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="text-gray-400" size={18} />
            </div>
            <input
              type="text"
              value={busquedaEquipo}
              onChange={async (e) => {
                setBusquedaEquipo(e.target.value);
                if (e.target.value.length >= 2) {
                  const res = await buscarEquipo(e.target.value);
                  setResultadosEquipos(res);
                } else {
                  setResultadosEquipos([]);
                }
              }}
              placeholder="Buscar equipo por serial o inventario"
              className="border pl-10 p-2 rounded w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <select
            value={equipoSeleccionado?.id || ""}
            onChange={(e) => {
              const eq = resultadosEquipos.find(eqp => eqp.id == e.target.value);
              if (eq) {
                setEquipoSeleccionado(eq);
                setForm({ ...form, equipo_id: eq.id });
              }
            }}
            className="border p-2 rounded w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">-- Selecciona un equipo --</option>
            {resultadosEquipos.map((eq) => (
              <option key={eq.id} value={eq.id}>
                {eq.nombre_equipo} - {eq.marca} {eq.modelo} - {eq.serial}
              </option>
            ))}
          </select>

          {/* Campo Funcionario */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="text-gray-400" size={18} />
            </div>
            <input
              type="text"
              value={personalBusqueda}
              onChange={(e) => buscarFuncionario(e.target.value)}
              placeholder="Buscar por cédula o nombre"
              className="border pl-10 p-2 rounded w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />

            {personalResultados.length > 0 && (
              <div className="mt-2 border rounded p-2 max-h-40 overflow-y-auto bg-white shadow-lg z-10 absolute w-full">
                {personalResultados.map((persona) => (
                  <div
                    key={persona.id}
                    onClick={() => {
                      setForm((prev) => ({
                        ...prev,
                        funcionario_id: persona.id,
                      }));
                      setPersonalBusqueda(`${persona.nombre} - ${persona.cedula}`);
                      setPersonalResultados([]);
                    }}
                    className="cursor-pointer hover:bg-blue-50 px-3 py-2 rounded flex items-center gap-2"
                  >
                    <MousePointerClick className="text-blue-500" size={14} />
                    {persona.nombre} - {persona.cedula}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Campo Fecha */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Calendar className="text-gray-400" size={18} />
            </div>
            <input
              type="date"
              name="fecha_entrega"
              value={form.fecha_entrega}
              onChange={handleChange}
              className="border pl-10 p-2 rounded w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
        </div>

        {/* Sección de Firmas */}
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

        {/* Búsqueda de Periféricos */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="text-gray-400" size={18} />
          </div>
          <input
            type="text"
            value={perifericoBusqueda}
            onChange={async (e) => {
              setPerifericoBusqueda(e.target.value);
              if (e.target.value.trim().length >= 2) {
                const resultados = await buscarPerifericoo(e.target.value);
                setResultadosBusqueda(resultados);
              } else {
                setResultadosBusqueda([]);
              }
            }}
            className="border pl-10 p-2 rounded w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Buscar periférico (por código, nombre o serial)"
          />
        </div>

        {resultadosBusqueda.length > 0 && (
          <select
            value={perifericoSeleccionadoId || ""}
            onChange={(e) => {
              const selected = resultadosBusqueda.find(p => p.id === parseInt(e.target.value));
              if (selected) {
                setPerifericoSeleccionado(selected);
                setPerifericoSeleccionadoId(selected.id);
              }
            }}
            className="border p-2 rounded w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">-- Selecciona un periférico --</option>
            {resultadosBusqueda.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nombre} - {p.codigo} - {p.serial}
              </option>
            ))}
          </select>
        )}

        <button
          type="button"
          disabled={!perifericoSeleccionado}
          onClick={() => {
            if (!form.perifericos.some(p => p.inventario_id === perifericoSeleccionado.id)) {
              setForm({
                ...form,
                perifericos: [
                  ...form.perifericos,
                  {
                    inventario_id: perifericoSeleccionado.id,
                    nombre: perifericoSeleccionado.nombre,
                    codigo: perifericoSeleccionado.codigo,
                    serial: perifericoSeleccionado.serial,
                    marca: perifericoSeleccionado.marca,
                    modelo: perifericoSeleccionado.modelo,
                    cantidad: 1
                  }
                ]
              });
            }
            setPerifericoSeleccionado(null);
            setPerifericoSeleccionadoId("");
            setPerifericoBusqueda("");
            setResultadosBusqueda([]);
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${perifericoSeleccionado
            ? 'bg-blue-600 text-white hover:bg-blue-700'
            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
        >
          <Plus size={18} />
          Agregar periférico
        </button>

        {/* Lista de periféricos */}
        {form.perifericos.length > 0 && (
          <div className="border border-gray-200 p-4 rounded-lg bg-gray-50">
            <h4 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
              <ClipboardList className="text-blue-500" size={18} />
              Periféricos Agregados
            </h4>
            <ul className="divide-y divide-gray-200">
              {form.perifericos.map((p, index) => (
                <li key={index} className="py-3 flex justify-between items-center">
                  <div className="flex-1">
                    <span className="font-medium text-gray-800">{p.nombre}</span>
                    <div className="text-sm text-gray-500">
                      {p.cantidad}x • {p.marca} {p.modelo} • {p.codigo} • {p.serial}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const nuevos = [...form.perifericos];
                      nuevos.splice(index, 1);
                      setForm({ ...form, perifericos: nuevos });
                    }}
                    className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50"
                    title="Eliminar"
                  >
                    <Trash2 size={18} />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Botón de envío */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            className="bg-gradient-to-r from-indigo-500 to-violet-600 hover:opacity-90 text-white font-medium py-2 px-4 rounded-xl flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md cursor-pointer"
            disabled={guardando}
          >
            <Save size={18} />
            {guardando ? "Procesando..." : "Guardar Acta de Entrega"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default VistaCrearActaEntrega;