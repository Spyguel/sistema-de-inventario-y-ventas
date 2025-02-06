// SelectInput.jsx
import PropTypes from 'prop-types';

const SelectInput = ({ label, name, value, onChange, options, className = '', ...props }) => {
  return (
    <div className={`mb-4 ${className}`}>
      <label htmlFor={name} className="block text-gray-700 text-sm font-medium mb-2">
        {label}
      </label>
      <select
        id={name}
        name={name}
        value={value || ''} // Asegúrate de que value sea una cadena
        onChange={onChange}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200"
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

SelectInput.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string, // Cambiado a no requerido
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  className: PropTypes.string,
};

export default SelectInput;