import React, { useState, useEffect } from 'react';
import {FirmaInput} from "../../../appFirma/appFirmas";

// Importar iconos de Lucide
import { User, Package, FileSignature, Search, Plus, Trash2, Check } from 'lucide-react';

// Datos didácticos locales
const personalData = [
  { id: 1, nombre: "Juan Pérez", documento: "12345678", sede: "Lima" },
  { id: 2, nombre: "María García", documento: "87654321", sede: "Arequipa" },
  { id: 3, nombre: "Carlos López", documento: "11223344", sede: "Trujillo" },
  { id: 4, nombre: "Ana Martínez", documento: "44332211", sede: "Lima" },
  { id: 5, nombre: "Pedro Rodríguez", documento: "55667788", sede: "Arequipa" },
];

const itemsData = [
  { id: 1, codigo: "LAP-001", serial: "SN12345", nombre: "Laptop Dell XPS 13" },
  { id: 2, codigo: "MON-001", serial: "SN67890", nombre: "Monitor LG 24 pulgadas" },
  { id: 3, codigo: "TEC-001", serial: "SN13579", nombre: "Teclado mecánico" },
  { id: 4, codigo: "MOU-001", serial: "SN24680", nombre: "Mouse inalámbrico" },
  { id: 5, codigo: "TAB-001", serial: "SN98765", nombre: "Tablet Samsung Galaxy" },
];

const sedesData = ["Lima", "Arequipa", "Trujillo", "Cusco", "Chiclayo"];

export default function EntregaActivosFijos() {
  // Estado para el formulario
  const [form, setForm] = useState({
    responsable: "",
    sede: "",
    fecha: new Date().toISOString().split('T')[0],
    items: [],
    firma_quien_entrega: "",
    firma_quien_recibe: ""
  });

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

  // Filtrar personal según búsqueda
  useEffect(() => {
    if (busquedaPersonal.trim() === "") {
      setPersonalFiltrado([]);
      setMostrarResultadosPersonal(false);
    } else {
      const filtrado = personalData.filter(persona => 
        persona.nombre.toLowerCase().includes(busquedaPersonal.toLowerCase()) ||
        persona.documento.includes(busquedaPersonal)
      );
      setPersonalFiltrado(filtrado);
      setMostrarResultadosPersonal(true);
    }
  }, [busquedaPersonal]);

  // Filtrar items según búsqueda
  useEffect(() => {
    if (busquedaItem.trim() === "") {
      setItemsFiltrados([]);
      setMostrarResultadosItems(false);
    } else {
      const filtrado = itemsData.filter(item => 
        item.serial.toLowerCase().includes(busquedaItem.toLowerCase()) ||
        item.codigo.toLowerCase().includes(busquedaItem.toLowerCase()) ||
        item.nombre.toLowerCase().includes(busquedaItem.toLowerCase())
      );
      setItemsFiltrados(filtrado);
      setMostrarResultadosItems(true);
    }
  }, [busquedaItem]);

  // Manejar selección de responsable
  const seleccionarResponsable = (persona) => {
    setForm({ ...form, responsable: persona.id });
    setBusquedaPersonal(`${persona.nombre} (${persona.documento})`);
    setPersonalFiltrado([]);
    setMostrarResultadosPersonal(false);
  };

  // Manejar selección de item
  const seleccionarItem = (item) => {
    setItemSeleccionado(item);
    setBusquedaItem(`${item.nombre} (${item.codigo})`);
    setItemsFiltrados([]);
    setMostrarResultadosItems(false);
  };

  // Agregar item a la lista
  const agregarItem = () => {
    if (!itemSeleccionado) return;
    
    const nuevoItem = {
      ...itemSeleccionado,
      contieneAccesorios,
      descripcionAccesorios: contieneAccesorios === "si" ? descripcionAccesorios : ""
    };
    
    setForm({
      ...form,
      items: [...form.items, nuevoItem]
    });
    
    // Resetear campos de item
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

  // Manejar envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Formulario enviado:", form);
    alert("Formulario de entrega completado correctamente");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white">
          <h1 className="text-3xl font-bold flex items-center">
            <FileSignature className="mr-3" size={32} />
            Entrega de Activos Fijos
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
                <label className="block text-sm font-medium text-gray-700">Buscar Personal</label>
                <div className="relative">
                  <input
                    type="text"
                    value={busquedaPersonal}
                    onChange={(e) => setBusquedaPersonal(e.target.value)}
                    placeholder="Buscar por nombre o documento"
                    className="w-full px-4 py-2.5 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  />
                  <Search className="absolute left-3 top-3.5 text-gray-400" size={18} />
                  
                  {mostrarResultadosPersonal && personalFiltrado.length > 0 && (
                    <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {personalFiltrado.map(persona => (
                        <li 
                          key={persona.id} 
                          onClick={() => seleccionarResponsable(persona)}
                          className="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition"
                        >
                          <div className="font-medium text-gray-900">{persona.nombre}</div>
                          <div className="text-sm text-gray-600">Documento: {persona.documento} - Sede: {persona.sede}</div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Sede</label>
                <div className="relative">
                  <select 
                    value={form.sede} 
                    onChange={(e) => setForm({ ...form, sede: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none transition"
                    required
                  >
                    <option value="">Seleccionar sede</option>
                    {sedesData.map((sede, index) => (
                      <option key={index} value={sede}>{sede}</option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
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
              <label className="block text-sm font-medium text-gray-700">Buscar Item</label>
              <div className="relative">
                <input
                  type="text"
                  value={busquedaItem}
                  onChange={(e) => setBusquedaItem(e.target.value)}
                  placeholder="Buscar por serial, código o nombre"
                  className="w-full px-4 py-2.5 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                />
                <Search className="absolute left-3 top-3.5 text-gray-400" size={18} />
                
                {mostrarResultadosItems && itemsFiltrados.length > 0 && (
                  <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {itemsFiltrados.map(item => (
                      <li 
                        key={item.id} 
                        onClick={() => seleccionarItem(item)}
                        className="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition"
                      >
                        <div className="font-medium text-gray-900">{item.nombre}</div>
                        <div className="text-sm text-gray-600">Código: {item.codigo} - Serial: {item.serial}</div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
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