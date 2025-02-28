import { useState, useEffect } from 'react';

function useContactos() {
    const [contactos, setContactos] = useState([]);
    
    useEffect(() => {
        // Simulación de datos para visualización
        const datosEjemplo = [
            { ID_contacto: 1, nombre: 'Proveedor ABC', tipo: 'PROVEEDOR', telefono: '123-456-7890', email: 'info@proveedorabc.com' },
            { ID_contacto: 2, nombre: 'Cliente XYZ', tipo: 'CLIENTE', telefono: '098-765-4321', email: 'contacto@clientexyz.com' },
            { ID_contacto: 3, nombre: 'Distribuidor 123', tipo: 'DISTRIBUIDOR', telefono: '555-123-4567', email: 'ventas@distribuidor123.com' },
            { ID_contacto: 4, nombre: 'Proveedor DEF', tipo: 'PROVEEDOR', telefono: '222-333-4444', email: 'info@proveedordef.com' },
            { ID_contacto: 5, nombre: 'Cliente 456', tipo: 'CLIENTE', telefono: '111-222-3333', email: 'cliente@456.com' }
        ];
        
        setContactos(datosEjemplo);
    }, []);
    
    return { contactos };
}

export default useContactos;