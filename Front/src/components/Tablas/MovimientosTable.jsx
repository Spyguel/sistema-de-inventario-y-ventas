import { useState } from 'react';
import PropTypes from 'prop-types';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/solid';
import Button from '../common/button.jsx';
import Tabla from '../common/Tabla.jsx';
import { format } from 'date-fns';
import Badge from '../common/Badge.jsx';
import MovimientoDetalleModal from '../Modals/MovimientoDetalleModal.jsx';

const MovimientosTable = ({
  movimientos = [],
  onToggleActive,
  requestSort = () => {}
}) => {
  const [selectedMovimiento, setSelectedMovimiento] = useState(null);
  const [showDetalleModal, setShowDetalleModal] = useState(false);

  const handleViewDetails = (movimiento) => {
    setSelectedMovimiento(movimiento);
    setShowDetalleModal(true);
  };

  const handleToggleActive = (ID_movimiento) => {
    onToggleActive(ID_movimiento);
  };

  const headers = [
    { key: 'ID_movimiento', label: 'ID' },
    { key: 'fecha', label: 'Fecha' },
    { key: 'usuario.email', label: 'Usuario' },
    { key: 'contacto.nombre', label: 'Contacto' },
    { key: 'item.nombre', label: 'Item' },
    { key: 'tipo_mov', label: 'Tipo' },
    { key: 'cantidad', label: 'Cantidad' },
    { key: 'estado', label: 'Estado' },
    { key: 'razon', label: 'Razón' },
    { key: 'detalle', label: 'Detalle' }
  ];

  // Transformamos la fecha y agregamos el estado (ya vienen los joins realizados)
  const movimientosTransformados = movimientos.map(movimiento => ({
    ...movimiento,
    fecha: movimiento.fecha ? format(new Date(movimiento.fecha), 'dd/MM/yyyy HH:mm') : 'N/A',
    estado: movimiento.activo ? 'Activo' : 'Inactivo'
  }));

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

  // Se actualiza para que valide la clave "tipo_mov" que es la que se espera en el objeto
  const renderCell = (movimiento, header) => {
    if (header.key === 'tipo_mov') {
      return (
        <Badge
          color={getTipoBadgeColor(movimiento.tipo_mov)}
          text={movimiento.tipo_mov}
        />
      );
    }
    return null; // Para las demás celdas se usa el renderizado predeterminado
  };

  const renderActions = (movimiento) => (
    <div className="flex space-x-2">
      <Button
        onClick={() => handleViewDetails(movimiento)}
        variant="secondary"
        size="sm"
        title="Ver detalles"
      >
        <EyeIcon className="h-4 w-4" />
      </Button>
      <Button
        onClick={() => handleToggleActive(movimiento.ID_movimiento)}
        variant={movimiento.activo ? 'danger' : 'success'}
        size="sm"
        title={movimiento.activo ? 'Desactivar movimiento' : 'Activar movimiento'}
      >
        {movimiento.activo ? (
          <EyeSlashIcon className="h-4 w-4" />
        ) : (
          <EyeIcon className="h-4 w-4" />
        )}
      </Button>
    </div>
  );

  return (
    <>
      <Tabla
        headers={headers}
        data={movimientosTransformados}
        onSort={requestSort}
        renderActions={renderActions}
        renderCell={renderCell}
        emptyMessage="No hay movimientos registrados"
        className="w-full"
      />
      
      {showDetalleModal && selectedMovimiento && (
        <MovimientoDetalleModal
          isOpen={showDetalleModal}
          onClose={() => setShowDetalleModal(false)}
          movimiento={selectedMovimiento}
        />
      )}
    </>
  );
};

MovimientosTable.propTypes = {
  movimientos: PropTypes.arrayOf(PropTypes.shape({
    ID_movimiento: PropTypes.number.isRequired,
    fecha: PropTypes.string.isRequired,
    usuario: PropTypes.shape({
      email: PropTypes.string.isRequired,
    }).isRequired,
    contacto: PropTypes.shape({
      nombre: PropTypes.string.isRequired,
    }),
    item: PropTypes.shape({
      nombre: PropTypes.string.isRequired,
    }).isRequired,
    cantidad: PropTypes.number.isRequired,
    tipo_mov: PropTypes.string.isRequired,
    activo: PropTypes.bool.isRequired,
    observaciones: PropTypes.string,
    razon: PropTypes.string,
    detalle: PropTypes.string,
  })).isRequired,
  onToggleActive: PropTypes.func.isRequired,
  requestSort: PropTypes.func
};

export default MovimientosTable;
