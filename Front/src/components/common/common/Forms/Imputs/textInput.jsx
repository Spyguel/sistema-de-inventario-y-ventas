// TextInput.jsx
import PropTypes from 'prop-types';

const TextInput = ({ label, name, value, onChange, error, placeholder, className = '', ...props }) => {
  return (
    <div className={`mb-4 ${className}`}>
      <label htmlFor={name} className="block text-gray-700 text-sm font-medium mb-2">
        {label}
      </label>
      <input
        type="text"
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
          error ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'
        } transition-colors`}
        {...props}
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};

TextInput.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  error: PropTypes.string,
  placeholder: PropTypes.string,
  className: PropTypes.string,
};

export default TextInput;