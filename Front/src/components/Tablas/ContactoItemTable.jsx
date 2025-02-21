// Componente ContactoItemTable.jsx
import PropTypes from 'prop-types';
import Button from '../common/button.jsx';

function ContactoItemTable({ contactoItems, onEdit, onDelete }) {
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">ID</th>
                        <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">ID Cliente</th>
                        <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Nombre Cliente</th>
                        <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">ID Item</th>
                        <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Nombre Item</th>
                        <th className="py-3 px-4 text-center text-sm font-semibold text-gray-700">Acciones</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {contactoItems.length > 0 ? (
                        contactoItems.map((item) => (
                            <tr key={item.ID_contacto_item} className="hover:bg-gray-50">
                                <td className="py-3 px-4 text-sm text-gray-700">{item.ID_contacto_item}</td>
                                <td className="py-3 px-4 text-sm text-gray-700">{item.ID_contacto}</td>
                                <td className="py-3 px-4 text-sm text-gray-700">{item.nombreContacto || '--'}</td>
                                <td className="py-3 px-4 text-sm text-gray-700">{item.ID_item}</td>
                                <td className="py-3 px-4 text-sm text-gray-700">{item.nombreItem || '--'}</td>
                                <td className="py-3 px-4 text-center">
                                    <div className="flex justify-center space-x-2">
                                        <Button
                                            onClick={() => onEdit(item)}
                                            variant="primary"
                                            className="p-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                            </svg>
                                        </Button>
                                        <Button
                                            onClick={() => onDelete(item.ID_contacto_item)}
                                            variant="danger"
                                            className="p-1 bg-red-500 text-white rounded hover:bg-red-600"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6" className="py-4 px-4 text-center text-gray-500">
                                No hay asociaciones disponibles
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

ContactoItemTable.propTypes = {
    contactoItems: PropTypes.arrayOf(
        PropTypes.shape({
            ID_contacto_item: PropTypes.number.isRequired,
            ID_item: PropTypes.number.isRequired,
            ID_contacto: PropTypes.number.isRequired,
            nombreContacto: PropTypes.string,
            nombreItem: PropTypes.string,
        })
    ).isRequired,
    onEdit: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
};

export default ContactoItemTable;