import PropTypes from 'prop-types';
import Button from '../../button';

const Form = ({ title, children, onSubmit, submitText = 'Guardar', cancelText, onCancel, columns = 1 }) => {
  // Si se especifica 2 columnas, se aplica el grid, de lo contrario se usa el espaciado vertical
  const childrenContainerClass = columns === 2 ? 'grid grid-cols-2 gap-4' : 'space-y-4';
  
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {title && <h2 className="text-2xl font-bold text-gray-800 mb-4">{title}</h2>}
      
      <div className={childrenContainerClass}>
        {children}
      </div>

      <div className="flex justify-end gap-3 mt-6">
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel}>
            {cancelText}
          </Button>
        )}
        <Button type="submit" variant="primary">
          {submitText}
        </Button>
      </div>
    </form>
  );
};

Form.propTypes = {
  title: PropTypes.string,
  children: PropTypes.node.isRequired,
  onSubmit: PropTypes.func.isRequired,
  submitText: PropTypes.string,
  cancelText: PropTypes.string,
  onCancel: PropTypes.func,
  columns: PropTypes.number, // Nueva prop para configurar columnas
};

export default Form;
