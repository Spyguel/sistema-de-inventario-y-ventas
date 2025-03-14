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

  const headers = [
    { key: 'ID', label: 'ID' },
    { key: 'Fecha', label: 'Fecha' },
    { key: 'Usuario', label: 'Usuario' },
    { key: 'Contacto', label: 'Contacto' },
    { key: 'Item', label: 'Item' },
    { key: 'Tipo', label: 'Tipo' },
    { key: 'Cantidad', label: 'Cantidad' },
    { key: 'Razón', label: 'Razón' },
    { key: 'Detalle', label: 'Detalle' }
  ];

  const movimientosTransformados = movimientos.map(movimiento => ({
    ...movimiento,
    Fecha: movimiento.Fecha ? format(new Date(movimiento.Fecha), 'dd/MM/yyyy HH:mm') : 'N/A',
    Contacto: movimiento.Contacto || 'Sin contacto',
    Item: movimiento.Item || 'N/A',
    Razón: movimiento.Razón || 'N/A',
    Detalle: movimiento.Detalle || 'N/A'
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

  const renderCell = (movimiento, header) => {
    switch (header.key) {
      case 'Tipo':
        return (
          <Badge
            color={getTipoBadgeColor(movimiento.Tipo)}
            text={movimiento.Tipo}
          />
        );
      
      case 'Cantidad':
        return `${movimiento.Cantidad} u.`;

      default:
        return movimiento[header.key];
    }
  };

  // Versión original de los botones de acción
  const renderActions = (movimiento) => (
    <div className="flex gap-2">
      <Button
        onClick={() => handleViewDetails(movimiento)}
        variant="secondary"
        size="sm"
        title="Ver detalles"
        className="px-2 py-1"
      >
        <EyeIcon className="h-5 w-5" />
      </Button>
      
      <Button
        onClick={() => onToggleActive(movimiento.ID)}
        variant={movimiento.activo ? 'danger' : 'success'}
        size="sm"
        title={movimiento.activo ? 'Desactivar' : 'Activar'}
        className="px-2 py-1"
      >
        {movimiento.activo ? (
          <EyeSlashIcon className="h-5 w-5" />
        ) : (
          <EyeIcon className="h-5 w-5" />
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
        keyField="ID"
        actionsHeader="Acciones"
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
    ID: PropTypes.number.isRequired,
    Fecha: PropTypes.string,
    Usuario: PropTypes.string.isRequired,
    Contacto: PropTypes.string,
    Item: PropTypes.string,
    Tipo: PropTypes.string.isRequired,
    Cantidad: PropTypes.number.isRequired,
    activo: PropTypes.bool.isRequired,
    Razón: PropTypes.string,
    Detalle: PropTypes.string
  })).isRequired,
  onToggleActive: PropTypes.func.isRequired,
  requestSort: PropTypes.func
};

export default MovimientosTable;