import PropTypes from 'prop-types';
import { 
  CheckCircle2, 
  AlertTriangle, 
  Info, 
  XCircle, 
  X 
} from 'lucide-react';

const MESSAGE_TYPES = {
  success: {
    icon: CheckCircle2,
    bgColor: 'bg-green-50',
    borderColor: 'border-green-500',
    textColor: 'text-green-800',
    iconColor: 'text-green-500'
  },
  error: {
    icon: XCircle,
    bgColor: 'bg-red-50',
    borderColor: 'border-red-500',
    textColor: 'text-red-800',
    iconColor: 'text-red-500'
  },
  warning: {
    icon: AlertTriangle,
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-500',
    textColor: 'text-yellow-800',
    iconColor: 'text-yellow-500'
  },
  confirmation: {
    icon: Info,
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-500',
    textColor: 'text-blue-800',
    iconColor: 'text-blue-500'
  }
};

const Message = ({ 
  isOpen, 
  onClose, 
  message, 
  type = 'info', 
  title, 
  actionButtons 
}) => {
  if (!isOpen) return null;

  const messageConfig = MESSAGE_TYPES[type] || MESSAGE_TYPES.info;
  const IconComponent = messageConfig.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-sm" 
        onClick={onClose}
      ></div>
      
      {/* Modal Container */}
      <div className={`
        relative w-full max-w-md rounded-xl border-2 shadow-2xl 
        ${messageConfig.bgColor} 
        ${messageConfig.borderColor}
        transform transition-all duration-300 ease-in-out
        scale-100 opacity-100
      `}>
        {/* Close Button */}
        <button 
          onClick={onClose} 
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          <X size={24} />
        </button>

        {/* Content */}
        <div className="p-6 text-center">
          {/* Icon */}
          <div className="flex justify-center mb-4">
            <IconComponent 
              size={64} 
              className={`${messageConfig.iconColor}`} 
            />
          </div>

          {/* Title */}
          <h2 className={`
            text-2xl font-bold mb-3 
            ${messageConfig.textColor}
          `}>
            {title || (type === 'success' ? 'Éxito' :
                      type === 'error' ? 'Error' :
                      type === 'warning' ? 'Advertencia' :
                      type === 'confirmation' ? 'Confirmación' :
                      'Mensaje')}
          </h2>

          {/* Message */}
          <p className={`
            text-base mb-6 
            ${messageConfig.textColor}
          `}>
            {message}
          </p>

          {/* Action Buttons */}
          <div className="flex justify-center space-x-4">
            {actionButtons ? (
              actionButtons.map((button, index) => (
                <button
                  key={index}
                  onClick={button.onClick}
                  className={`
                    px-4 py-2 rounded-md 
                    transition-colors duration-200
                    ${button.className || 'bg-blue-500 text-white hover:bg-blue-600'}
                  `}
                >
                  {button.label}
                </button>
              ))
            ) : (
              <button
                onClick={onClose}
                className={`
                  px-6 py-2 rounded-md 
                  ${messageConfig.borderColor} 
                  ${messageConfig.textColor}
                  border hover:bg-gray-100
                `}
              >
                Cerrar
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

Message.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  message: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['success', 'error', 'warning', 'confirmation']),
  title: PropTypes.string,
  actionButtons: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
    className: PropTypes.string
  }))
};

export default Message;