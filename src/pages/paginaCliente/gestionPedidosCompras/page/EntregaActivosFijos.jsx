import React, { useState, useEffect } from 'react';
import { FirmaInput } from "../../../appFirma/appFirmas";
import { subirFirmaActa, crearEntregaActivos, subirItemsEntrega, guardarEntregaActivos, cargarItemsEntrega } from '../../../../services/cp_entrega_activos_services';
import { User, Package, FileSignature, Search, Plus, Trash2, Check } from 'lucide-react';
import BuscarResponsable from '../../componentsUnive/BuscarResponsable';
import { listarSedes } from '../../../../services/sedes_service';
import BuscarInventario from '../../componentsUnive/BuscarInventario';
import BuscarDependencia from '../../componentsUnive/BuscarDependencia';
import Swal from "sweetalert2";
import { useLocation, useNavigate } from "react-router-dom";

export default function EntregaActivosFijos() {
  const location = useLocation();
  const navigate = useNavigate();
  const entregaEdit = location.state?.entrega;

  const [sedes, setSedes] = useState([]);
  const [resetInventario, setResetInventario] = useState(false);
  const [resetResponsable, setResetResponsable] = useState(false);
  const [nuevaFirmaEntrega, setNuevaFirmaEntrega] = useState(null);
  const [nuevaFirmaRecibe, setNuevaFirmaRecibe] = useState(null);


  const [form, setForm] = useState({
    personal_id: "",
    sede_id: "",
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

  useEffect(() => {
    if (entregaEdit) {
      setForm({
        personal_id: entregaEdit.personal_id || "",
        sede_id: entregaEdit.sede_id || "",
        proceso_solicitante: entregaEdit.proceso_solicitante || "",
        fecha: entregaEdit.fecha_entrega
          ? entregaEdit.fecha_entrega.split("T")[0]
          : new Date().toISOString().split("T")[0],
        items: entregaEdit.items || [],
        firma_quien_entrega: entregaEdit.firma_quien_entrega || "",
        firma_quien_recibe: entregaEdit.firma_quien_recibe || "",
      });
    }
  }, [entregaEdit]);

  useEffect(() => {
    console.log(entregaEdit);
    const obtenerItems = async () => {
      if (!entregaEdit?.entrega_id) return;

      const res = await cargarItemsEntrega(entregaEdit.entrega_id);
      console.log(res);
      if (res.success && res.data.length > 0) {
        setForm(prev => ({
          ...prev,
          items: res.data.map(item => ({
            id: item.item_id,
            contieneAccesorios: item.es_accesorio ? "si" : "no",
            descripcionAccesorios: item.accesorio_descripcion || "",
            nombre: item.nombre_item || "Item cargado",
            codigo: item.codigo_item || "",
            serial: item.serial_item || ""
          }))
        }));
      }
    };

    obtenerItems();
  }, [entregaEdit]);




  function base64ToBlob(base64) {
    try {
      // Si tiene el encabezado, lo separamos
      const parts = base64.split(",");
      const mime = parts[0].match(/:(.*?);/)[1];
      const bstr = atob(parts[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new Blob([u8arr], { type: mime });
    } catch (error) {
      console.error("Error convirtiendo base64 a Blob:", error);
      return null;
    }
  }



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


    setItemSeleccionado(null);
    setBusquedaItem("");
    setContieneAccesorios("no");
    setDescripcionAccesorios("");
  };

  const eliminarItem = (index) => {
    const nuevosItems = [...form.items];
    nuevosItems.splice(index, 1);
    setForm({ ...form, items: nuevosItems });
  };



  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const entrega = await guardarEntregaActivos({
        id: entregaEdit?.entrega_id || null,
        personal_id: form.personal_id,
        sede_id: form.sede_id,
        fecha_entrega: form.fecha,
        proceso_solicitante: form.proceso_solicitante
      });

      if (!entrega.ok) {
        return Swal.fire({
          icon: "error",
          title: "Error",
          text: entrega.error || "No se pudo guardar la entrega",
        });
      }

      // 🟡 Subir items
      if (form.items && form.items.length > 0) {
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

      // 🟢 Subir firmas
      const formData = new FormData();
      formData.append("id", entrega.id);

      if (form.firma_quien_entrega) {
        const blobEntrega = base64ToBlob(form.firma_quien_entrega);
        if (blobEntrega)
          formData.append("firma_entrega", blobEntrega, "firma_entrega.png");
      }

      if (form.firma_quien_recibe) {
        const blobRecibe = base64ToBlob(form.firma_quien_recibe);
        if (blobRecibe)
          formData.append("firma_recibe", blobRecibe, "firma_recibe.png");
      }

      await subirFirmaActa(formData);

      await Swal.fire({
        icon: "success",
        title: "¡Listo!",
        text: form.id
          ? "Entrega actualizada correctamente"
          : "Entrega creada correctamente",
      });

      if (!form.id) {
        setForm({
          responsable: "",
          sede: "",
          fecha: new Date().toISOString().split("T")[0],
          items: [],
          firma_quien_entrega: "",
          firma_quien_recibe: ""
        });
        setItemSeleccionado(null);
        setContieneAccesorios("no");
        setDescripcionAccesorios("");
        setResetInventario(prev => !prev);
        setResetResponsable(prev => !prev);
      }
      navigate(-1);
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Ocurrió un error al guardar la entrega",
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
                    formSedeId={form.sede_id}
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
                <h2 className="text-xl font-semibold text-gray-800">Agregar Ítems</h2>
                <p className="text-sm text-gray-600">Busque y seleccione los activos a entregar</p>
              </div>
            </div>

            {/* Si NO es edición, permitir agregar items */}
            {!entregaEdit && (
              <>
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
                          <div className="text-sm text-gray-600">
                            Código: {itemSeleccionado.codigo} - Serial: {itemSeleccionado.serial}
                          </div>
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
              </>
            )}

            {/* Lista de ítems agregados */}
            {form.items.length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <Package className="mr-2" size={20} />
                  Ítems Agregados
                </h3>
                <div className="space-y-3">
                  {form.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg shadow-sm"
                    >
                      <div>
                        <div className="font-medium text-gray-900">{item.nombre}</div>
                        <div className="text-sm text-gray-600">
                          Código: {item.codigo} - Serial: {item.serial}
                        </div>
                        {item.contieneAccesorios === "si" && (
                          <div className="mt-1 text-sm text-gray-700">
                            <span className="font-medium">Accesorios:</span> {item.descripcionAccesorios}
                          </div>
                        )}
                      </div>

                      {!entregaEdit && (
                        <button
                          type="button"
                          onClick={() => eliminarItem(index)}
                          className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition"
                          title="Eliminar item"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
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