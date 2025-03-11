// MultiSelectInput.jsx
import PropTypes from 'prop-types';

const MultiSelectInput = ({ label, name, value = [], onChange, options, className = '', ...props }) => {
  const handleChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions).map(option => option.value);
    onChange(selectedOptions);
  };

  return (
    <div className={`mb-4 ${className}`}>
      <label htmlFor={name} className="block text-gray-700 text-sm font-medium mb-2">
        {label}
      </label>
      <select
        id={name}
        name={name}
        value={value}
        onChange={handleChange}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200"
        multiple // Permite selección múltiple
        {...props}
      >
        {options && options.length > 0 ? (
          options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))
        ) : (
          <option value="" disabled>No options available</option> // Mensaje si no hay opciones
        )}
      </select>
    </div>
  );
};

MultiSelectInput.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.arrayOf(PropTypes.string), // Array de valores seleccionados
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  className: PropTypes.string,
};

export default MultiSelectInput;