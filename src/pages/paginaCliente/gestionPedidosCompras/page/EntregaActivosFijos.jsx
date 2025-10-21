import React, { useState, useEffect } from 'react';
import { FirmaInput } from "../../../appFirma/appFirmas";
import { subirFirmaActa, crearEntregaActivos, subirItemsEntrega } from '../../../../services/cp_entrega_activos_services';
import { User, Package, FileSignature, Search, Plus, Trash2, Check } from 'lucide-react';
import BuscarResponsable from '../../componentsUnive/BuscarResponsable';
import { listarSedes } from '../../../../services/sedes_service';
import BuscarInventario from '../../componentsUnive/BuscarInventario';
import BuscarDependencia from '../../componentsUnive/BuscarDependencia';
import Swal from "sweetalert2";

export default function EntregaActivosFijos() {
  const [sedes, setSedes] = useState([]);
  const [resetInventario, setResetInventario] = useState(false);
  const [resetResponsable, setResetResponsable] = useState(false);

  const [form, setForm] = useState({
    personal_id: "",
    sede: "",
    fecha: new Date().toISOString().split('T')[0],
    items: [],
    firma_quien_entrega: "",
    firma_quien_recibe: "",
  });

  useEffect(() => {
    const cargarSedes = async () => {
      const data = await listarSedes();
      setSedes(data);
    }
    cargarSedes();
  }, []);

  function base64ToBlob(base64) {
    if (!base64 || !base64.includes(",")) return null;
    const byteString = atob(base64.split(",")[1]);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: "image/png" });
  }


  // Estados para búsquedas y selecciones
  const [busquedaPersonal, setBusquedaPersonal] = useState("");
  const [busquedaItem, setBusquedaItem] = useState("");
  const [personalFiltrado, setPersonalFiltrado] = useState([]);
  const [itemsFiltrados, setItemsFiltrados] = useState([]);
  const [itemSeleccionado, setItemSeleccionado] = useState(null);
  const [contieneAccesorios, setContieneAccesorios] = useState("no");
  const [descripcionAccesorios, setDescripcionAccesorios] = useState("");
  const [mostrarResultadosPersonal, setMostrarResultadosPersonal] = useState(false);
  const [mostrarResultadosItems, setMostrarResultadosItems] = useState(false);


  const seleccionarItem = (item) => {
    setItemSeleccionado({
      id: item.id,
      nombre: item.nombre,
      codigo: item.codigo,
      serial: item.serial
    });
    setBusquedaItem(`${item.nombre} (${item.codigo})`);
    setItemsFiltrados([]);
    setMostrarResultadosItems(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


  // Agregar item a la lista
  const agregarItem = () => {
    if (!itemSeleccionado) return;

    const nuevoItem = {
      ...itemSeleccionado,
      contieneAccesorios,
      descripcionAccesorios: contieneAccesorios === "si" ? descripcionAccesorios : ""
    };

    setForm(prev => ({
      ...prev,
      items: [...prev.items, nuevoItem]
    }));

    // Resetear selección
    setItemSeleccionado(null);
    setBusquedaItem("");
    setContieneAccesorios("no");
    setDescripcionAccesorios("");
  };

  // Eliminar item de la lista
  const eliminarItem = (index) => {
    const nuevosItems = [...form.items];
    nuevosItems.splice(index, 1);
    setForm({ ...form, items: nuevosItems });
  };



  const handleSubmit = async (e) => {
    e.preventDefault();

    // console.log(form);
    // if (!form.firma_quien_entrega || !form.firma_quien_recibe) {
    //   return Swal.fire({
    //     icon: "warning",
    //     title: "Faltan firmas",
    //     text: "Debe registrar ambas firmas",
    //   });
    // }

    try {
      // 1️⃣ Crear entrega
      const entrega = await crearEntregaActivos({
        personal_id: form.personal_id,
        sede_id: form.sede_id,
        fecha_entrega: form.fecha,
        proceso_solicitante: form.proceso_solicitante
      });

      if (!entrega.ok) {
        return Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudo crear la entrega",
        });
      }

      // 2️⃣ Subir items
      if (form.items.length > 0) {
        const itemsPayload = form.items.map(item => ({
          item_id: item.id,
          es_accesorio: item.contieneAccesorios === "si" ? 1 : 0,
          accesorio_descripcion: item.descripcionAccesorios
        }));

        await subirItemsEntrega({
          entrega_activos_id: entrega.id,
          items: itemsPayload
        });
      }

      // 3️⃣ Subir firmas
      // 3️⃣ Subir firmas (solo si existen)
      const formData = new FormData();
      formData.append("id", entrega.id);

      if (form.firma_quien_entrega) {
        formData.append("firma_entrega", base64ToBlob(form.firma_quien_entrega), "firma_entrega.png");
      }
      if (form.firma_quien_recibe) {
        formData.append("firma_recibe", base64ToBlob(form.firma_quien_recibe), "firma_recibe.png");
      }

      // Solo subir si hay al menos una firma
      if (form.firma_quien_entrega || form.firma_quien_recibe) {
        await subirFirmaActa(formData);
      }
      await Swal.fire({
        icon: "success",
        title: "¡Listo!",
        text: "Entrega creada correctamente con firmas",
      });

      // Resetear formulario
      setForm({
        responsable: "",
        sede: "",
        fecha: new Date().toISOString().split('T')[0],
        items: [],
        firma_quien_entrega: "",
        firma_quien_recibe: ""
      });
      setItemSeleccionado(null);
      setContieneAccesorios("no");
      setDescripcionAccesorios("");
      setResetInventario(prev => !prev);
      setResetResponsable(prev => !prev);
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Ocurrió un error al crear la entrega",
      });
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white">
          <h1 className="text-3xl font-bold flex items-center">
            <FileSignature className="mr-3" size={32} />
            Crear Acta de Entrega de Activos Fijos
          </h1>
          <p className="mt-2 opacity-90">Complete el formulario para registrar la entrega de activos</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          {/* Primer apartado: Información del responsable */}
          <section className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white mr-3">
                <User size={20} />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-800">Información del Responsable</h2>
                <p className="text-sm text-gray-600">Seleccione la persona responsable de los activos</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <BuscarResponsable
                  name="personal_id"
                  value={form.personal_id}
                  onChange={(e) => setForm({ ...form, [e.target.name]: e.target.value })}
                  label="Buscar Personal"
                  reset={resetResponsable}
                />


              </div>

              <div className="space-y-2">
                <div className="relative">
                  <BuscarDependencia
                    name="proceso_solicitante"
                    value={form.proceso_solicitante}
                    onChange={handleChange}
                    labelSede="Seleccione una sede"
                    labelDependencia="Seleccione el proceso solicitante"
                    required
                    icon={
                      <div className="p-1.5 bg-indigo-100 rounded-md">
                        <User size={16} className="text-indigo-600" />
                      </div>
                    }
                  />
                </div>

              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700">Fecha de Entrega</label>
              <input
                type="date"
                value={form.fecha}
                onChange={(e) => setForm({ ...form, fecha: e.target.value })}
                className="mt-1 w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                required
              />
            </div>
          </section>

          {/* Segundo apartado: Agregar items */}
          <section className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white mr-3">
                <Package size={20} />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-800">Agregar Items</h2>
                <p className="text-sm text-gray-600">Busque y seleccione los activos a entregar</p>
              </div>
            </div>

            <div className="space-y-2">
              <BuscarInventario
                name="itemSeleccionado"
                value={itemSeleccionado ? itemSeleccionado.id : ""}
                onChange={(item) => seleccionarItem(item)}
                label="Buscar Item"
                required
                reset={resetInventario}
              />
            </div>

            {itemSeleccionado && (
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Item Seleccionado</label>
                    <div className="p-3 bg-white border border-gray-300 rounded-lg">
                      <div className="font-medium">{itemSeleccionado.nombre}</div>
                      <div className="text-sm text-gray-600">Código: {itemSeleccionado.codigo} - Serial: {itemSeleccionado.serial}</div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">¿Contiene Accesorios?</label>
                    <div className="flex space-x-4">
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          value="si"
                          checked={contieneAccesorios === "si"}
                          onChange={() => setContieneAccesorios("si")}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <span className="ml-2 text-gray-700">Sí</span>
                      </label>
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          value="no"
                          checked={contieneAccesorios === "no"}
                          onChange={() => setContieneAccesorios("no")}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <span className="ml-2 text-gray-700">No</span>
                      </label>
                    </div>
                  </div>

                  {contieneAccesorios === "si" && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Descripción de Accesorios</label>
                      <textarea
                        value={descripcionAccesorios}
                        onChange={(e) => setDescripcionAccesorios(e.target.value)}
                        placeholder="Describa los accesorios incluidos"
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                      />
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={agregarItem}
                    className="flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    <Plus className="mr-2" size={18} />
                    Agregar Item
                  </button>
                </div>
              </div>
            )}

            {/* Lista de items agregados */}
            {form.items.length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <Package className="mr-2" size={20} />
                  Items Agregados
                </h3>
                <div className="space-y-3">
                  {form.items.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
                      <div>
                        <div className="font-medium text-gray-900">{item.nombre}</div>
                        <div className="text-sm text-gray-600">Código: {item.codigo} - Serial: {item.serial}</div>
                        {item.contieneAccesorios === "si" && (
                          <div className="mt-1 text-sm text-gray-700">
                            <span className="font-medium">Accesorios:</span> {item.descripcionAccesorios}
                          </div>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => eliminarItem(index)}
                        className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition"
                        title="Eliminar item"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>

          {/* Tercer apartado: Firmas */}
          <section className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white mr-3">
                <FileSignature size={20} />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-800">Firmas</h2>
                <p className="text-sm text-gray-600">Registre las firmas de entrega y recepción</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <FirmaInput
                  value={form.firma_quien_entrega}
                  onChange={(value) => setForm({ ...form, firma_quien_entrega: value })}
                  label="Firma de quien entrega"
                />
              </div>

              <div className="space-y-2">
                <FirmaInput
                  value={form.firma_quien_recibe}
                  onChange={(value) => setForm({ ...form, firma_quien_recibe: value })}
                  label="Firma de quien recibe"
                />
              </div>
            </div>
          </section>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-medium rounded-lg shadow-md transition flex items-center"
            >
              <Check className="mr-2" size={20} />
              Completar Entrega
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}