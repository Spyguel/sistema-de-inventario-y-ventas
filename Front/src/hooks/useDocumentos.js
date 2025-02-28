import { useState, useEffect } from 'react';

function useDocumentos() {
    const [documentos, setDocumentos] = useState([]);
    
    useEffect(() => {
        // Simulación de datos para visualización
        const datosEjemplo = [
            { ID_documento: 1, nombre: 'Factura', tipo: 'COMPRA', numero: 'FC-001' },
            { ID_documento: 2, nombre: 'Nota de Venta', tipo: 'VENTA', numero: 'NV-001' },
            { ID_documento: 3, nombre: 'Orden de Producción', tipo: 'PRODUCCION', numero: 'OP-001' },
            { ID_documento: 4, nombre: 'Guía de Remisión', tipo: 'TRANSFERENCIA', numero: 'GR-001' },
            { ID_documento: 5, nombre: 'Nota de Crédito', tipo: 'DEVOLUCION', numero: 'NC-001' }
        ];
        
        setDocumentos(datosEjemplo);
    }, []);
    
    return { documentos };
}

export default useDocumentos;