// src/views/HorasDiaWrapper.jsx
import { useParams } from 'react-router-dom';
import HorasDiaView from '../pages/paginaCliente/calendarioMantenimiento/components/ModalHorasDia';

const HorasDiaWrapper = () => {
  const { fecha } = useParams();
  const fechaObj = new Date(`${fecha}T00:00:00-05:00`);

  return <HorasDiaView fecha={fechaObj} />;
};

export default HorasDiaWrapper;
