import PropTypes from 'prop-types';

const Button = ({ 
  children, 
  variant = 'primary', 
  className = '', 
  onClick = () => {},
  ...props 
}) => {
  const variantClasses = {
    primary: 'bg-blue-500 text-white hover:bg-blue-600',
    secondary: 'bg-gray-300 text-gray-700 hover:bg-gray-400',
    danger: 'bg-red-500 text-white hover:bg-red-600',
    success: 'bg-green-500 text-white hover:bg-green-600',
    default: 'bg-gray-200 text-gray-700 hover:bg-gray-300',
    error: 'bg-red-900 text-white-700 hover:bg-gray-300',
    warning: 'bg-yellow-500 text-black hover:bg-yellow-600', // Agregado warning
  };

  return (
    <button
      className={`
        p-2 
        rounded 
        transition-colors 
        ${variantClasses[variant]}
        ${className}
      `}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['primary', 'secondary', 'danger', 'success', 'default', 'error', 'warning']),
  className: PropTypes.string,
  onClick: PropTypes.func
};

export default Button;
