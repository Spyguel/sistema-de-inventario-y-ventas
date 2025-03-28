import PropTypes from 'prop-types';
import { XMarkIcon } from '@heroicons/react/24/outline';

const FormModal = ({ isOpen, onClose, title, children, wide = false }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className={`bg-white rounded-lg shadow-xl w-full max-h-[90vh] ${wide ? 'max-w-4xl' : 'max-w-md'} relative`}>
        {/* Estructura flex para ocupar toda la altura del modal */}
        <div className="flex flex-col h-full">
          {/* Header fijo */}
          <div className="flex justify-between items-center p-4 border-b">
            <h3 className="text-lg font-semibold">{title}</h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
          {/* Contenido scrollable: aquí se incluirán todos los inputs y botones */}
          <div className="p-4 overflow-y-auto">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

FormModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  wide: PropTypes.bool, // Prop opcional para ancho
};

export default FormModal;
