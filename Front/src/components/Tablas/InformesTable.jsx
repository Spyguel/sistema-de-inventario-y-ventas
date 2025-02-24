// InformesTable.jsx
import PropTypes from 'prop-types';

import Tabla from '../common/Tabla.jsx';


const InformesTable = ({ data = [], categoria, requestSort }) => {
    const getHeaders = () => {
        const commonHeaders = [
            { key: 'fecha', label: 'Fecha' },
            { key: 'total', label: 'Total' },
        ];

        const specificHeaders = {
            Inicio: [
                { key: 'tipo_mov', label: 'Tipo Movimiento' },
                { key: 'item_nombre', label: 'Item' },
                { key: 'contacto_nombre', label: 'Contacto' },
                { key: 'cantidad', label: 'Cantidad' },
                { key: 'estado_pago', label: 'Estado' },
            ],
            Egresos: [
                { key: 'tipo_mov', label: 'Tipo Egreso' },
                { key: 'proveedor', label: 'Proveedor' },
                { key: 'item_nombre', label: 'Item' },
                { key: 'cantidad', label: 'Cantidad' },
                { key: 'estado_pago', label: 'Estado Pago' },
            ],
            Ingreso: [
                { key: 'tipo_mov', label: 'Tipo Ingreso' },
                { key: 'cliente', label: 'Cliente' },
                { key: 'item_nombre', label: 'Item' },
                { key: 'cantidad', label: 'Cantidad' },
                { key: 'estado_pago', label: 'Estado Pago' },
            ],
            Ranking: [
                { key: 'item_nombre', label: 'Producto' },
                { key: 'tipo_item', label: 'Tipo' },
                { key: 'total_movimientos', label: 'Total Movimientos' },
                { key: 'total_vendido', label: 'Total Vendido' },
                { key: 'total_comprado', label: 'Total Comprado' },
            ],
        };

        return [...commonHeaders, ...(specificHeaders[categoria] || [])];
    };

    return (
        <Tabla
            headers={getHeaders()}
            data={data}
            onSort={requestSort}
        />
    );
};

InformesTable.propTypes = {
    data: PropTypes.array.isRequired,
    categoria: PropTypes.oneOf(['Inicio', 'Egresos', 'Ingreso', 'Ranking']).isRequired,
    requestSort: PropTypes.func,
};

export default InformesTable;