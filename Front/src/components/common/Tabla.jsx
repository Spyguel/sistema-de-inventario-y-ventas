// Tabla.jsx
import PropTypes from 'prop-types';

const Tabla = ({ headers, data, onSort, renderActions }) => {
  return (
    <div className="flex-grow overflow-hidden rounded-lg shadow-lg m-3 ">
      <div className="h-full overflow-hidden">
        <div className="overflow-auto max-h-[60vh]">
          <table className="w-full bg-background_2 rounded-lg" aria-label="Tabla General">
            <thead className="sticky top-0 z-10">
              <tr className="bg-principal  text-white">
                {headers.map((header, index) => (
                  <th 
                    key={index} 
                    className="p-2 cursor-pointer hover:bg-slate-500" 
                    onClick={() => onSort(header.key)}
                  >
                    {header.label}
                  </th>
                ))}
                <th className="p-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {data.length === 0 ? (
                <tr>
                  <td colSpan={headers.length + 1} className="p-2 text-center">No hay datos disponibles</td>
                </tr>
              ) : (
                data.map((item, index) => (
                  <tr 
                    key={index} 
                    className="hover:bg-gray-400 transition-colores text-center"
                  >
                    {Object.values(item).map((value, idx) => (
                      <td key={idx} className="p-2 text-center">{value}</td>
                    ))}
                    <td className="p-2 text-center flex justify-center space-x-2">
                      {renderActions(item)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

Tabla.propTypes = {
  headers: PropTypes.arrayOf(PropTypes.shape({
    key: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
  })).isRequired,
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  onSort: PropTypes.func.isRequired,
  renderActions: PropTypes.func.isRequired,
};

export default Tabla;
