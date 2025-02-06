import PropTypes from 'prop-types';

const Message = ({ isOpen, onClose, message, type }) => {
  if (!isOpen) return null;

  const modalClass = type === 'success' ? 'bg-success' : 'bg-warning'; 

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="fixed inset-0 bg-black opacity-50" onClick={onClose}></div>
      <div className={`bg-white rounded-lg p-6 shadow-lg ${modalClass} z-50`}>
        <h2 className="text-lg font-bold text-primary">{type === 'success' ? 'Éxito' : 'Error'}</h2>
        <p className="text-primary">{message}</p>
        <button
          className="mt-4 bg-error text-white px-4 py-2 rounded hover:bg-error"
          onClick={onClose}
        >
          Cerrar
        </button>
      </div>
    </div>
  );
};

Message.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  message: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['success', 'error']).isRequired,
};

export default Message;