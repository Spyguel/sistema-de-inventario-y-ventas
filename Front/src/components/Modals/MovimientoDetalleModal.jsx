
import PropTypes from 'prop-types';
import Modal from '../../components/Modals/Modal.jsx';
import Badge from '../common/Badge.jsx';

const MovimientoDetalleModal = ({ isOpen, onClose, movimiento }) => {
  const getTipoBadgeColor = (tipo) => {
    switch (tipo?.toLowerCase()) {
      case 'entrada':
        return 'success';
      case 'salida':
        return 'danger';
      case 'ajuste':
        return 'warning';
      default:
        return 'secondary';
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Detalle del Movimiento"
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-500">ID</p>
            <p className="text-sm text-gray-900">{movimiento.ID_movimiento}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Fecha</p>
            <p className="text-sm text-gray-900">{movimiento.fecha}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Estado</p>
            <p className="text-sm text-gray-900">
              <span className={`px-2 py-1 rounded text-xs font-medium ${
                movimiento.activo 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {movimiento.activo ? 'Activo' : 'Inactivo'}
              </span>
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Tipo</p>
            <Badge
              color={getTipoBadgeColor(movimiento.tipo)}
              text={movimiento.tipo}
            />
          </div>
        </div>

        <div>
          <p className="text-sm font-medium text-gray-500">Usuario</p>
          <p className="text-sm text-gray-900">{movimiento.usuario?.email || 'N/A'}</p>
        </div>

        <div>
          <p className="text-sm font-medium text-gray-500">Contacto</p>
          <p className="text-sm text-gray-900">{movimiento.contacto?.nombre || 'N/A'}</p>
        </div>

        <div>
          <p className="text-sm font-medium text-gray-500">Item</p>
          <p className="text-sm text-gray-900">{movimiento.item?.nombre || 'N/A'}</p>
        </div>

        <div>
          <p className="text-sm font-medium text-gray-500">Cantidad</p>
          <p className="text-sm text-gray-900">{movimiento.cantidad}</p>
        </div>

        {movimiento.observaciones && (
          <div>
            <p className="text-sm font-medium text-gray-500">Observaciones</p>
            <p className="text-sm text-gray-900 whitespace-pre-line">{movimiento.observaciones}</p>
          </div>
        )}
      </div>

      <div className="mt-6 flex justify-end">
        <button
          type="button"
          className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-transparent rounded-md hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
          onClick={onClose}
        >
          Cerrar
        </button>
      </div>
    </Modal>
  );
};

MovimientoDetalleModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  movimiento: PropTypes.shape({
    ID_movimiento: PropTypes.number.isRequired,
    fecha: PropTypes.string.isRequired,
    usuario: PropTypes.object,
    contacto: PropTypes.object,
    item: PropTypes.object,
    cantidad: PropTypes.number.isRequired,
    tipo: PropTypes.string.isRequired,
    activo: PropTypes.bool.isRequired,
    observaciones: PropTypes.string
  }).isRequired
};

export default MovimientoDetalleModal;