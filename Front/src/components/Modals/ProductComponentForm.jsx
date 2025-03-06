import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import FormModal from '../common/common/Forms/FormModal';
import Button from '../common/button';
import useFetchProductos from '../../hooks/useFetchItems';

const ProductComponentForm = ({ isOpen, onClose, product, onAddComponent }) => {
  // Obtenemos todos los ítems
  const { productos, loading, error, fetchComposicionPorIdItemFinal } = useFetchProductos();
  // Filtrar solo los que sean de tipo "Materia Prima" y estén activos
  const materiaPrima = productos.filter(item => item.tipo_item === 'Materia Prima' && item.activo);

  // Estado para almacenar la composición: objeto { [id_item]: cantidad_usada }
  const [composition, setComposition] = useState({});
  // Estado para manejar la carga de la composición ya registrada (si existe)
  const [loadingComposition, setLoadingComposition] = useState(false);

  useEffect(() => {
    if (isOpen && product?.id_item) {
      setLoadingComposition(true);
      fetchComposicionPorIdItemFinal(product.id_item)
        .then(compositoresData => {
          if (compositoresData && compositoresData.length > 0) {
            const compObj = {};
            compositoresData.forEach(comp => {
              compObj[comp.id_item] = comp.cantidad_usada;
            });
            setComposition(compObj);
          } else {
            setComposition({});
            alert('No se encontraron componentes para este producto');
          }
        })
        .catch(err => {
          console.error('Error al cargar la composición:', err);
          setComposition({});
          alert('Error al cargar la composición');
        })
        .finally(() => {
          setLoadingComposition(false);
        });
    } else {
      // Cuando el formulario se cierra, limpiamos la composición para que no se vuelva a buscar
      setComposition({});
    }
  }, [isOpen, product?.id_item, fetchComposicionPorIdItemFinal]);

  // Maneja la selección/des-selección estilo botón
  const toggleSelection = (id_item) => {
    setComposition(prev => {
      const newComp = { ...prev };
      if (newComp[id_item] === undefined) {
        newComp[id_item] = 0;
      } else {
        delete newComp[id_item];
      }
      return newComp;
    });
  };

  // Actualiza la cantidad usada de un componente
  const handleQuantityChange = (id_item, quantity) => {
    setComposition(prev => ({
      ...prev,
      [id_item]: Number(quantity)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const compositionArray = Object.entries(composition)
      .map(([id_item, cantidad_usada]) => ({ id_item: Number(id_item), cantidad_usada }))
      .filter(item => item.cantidad_usada > 0);
    if (compositionArray.length === 0) {
      alert('Debe seleccionar al menos un componente con cantidad mayor a 0');
      return;
    }
    onAddComponent(product, compositionArray);
    onClose();
  };

  return (
    <FormModal isOpen={isOpen} onClose={onClose} title={`Agregar componentes a ${product?.nombre || ''}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {loading || loadingComposition ? (
          <p>Cargando componentes...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div className="space-y-3">
            {materiaPrima.length > 0 ? (
              materiaPrima.map(item => {
                const isSelected = Object.hasOwnProperty.call(composition, item.id_item);
                return (
                  <div key={item.id_item} className="flex flex-col">
                    <button
                      type="button"
                      onClick={() => toggleSelection(item.id_item)}
                      className={`w-full text-left px-4 py-2 border rounded transition 
                        ${isSelected ? 'bg-blue-100 border-blue-400' : 'bg-white border-gray-300 hover:bg-gray-50'}`}
                    >
                      <span className="font-medium">{item.nombre}</span>
                      <span className="text-sm text-gray-600">({item.unidad_medida})</span>
                    </button>
                    {isSelected && (
                      <input
                        type="number"
                        className="w-full mt-2 p-2 border rounded"
                        value={composition[item.id_item] || ''}
                        onChange={(e) => handleQuantityChange(item.id_item, e.target.value)}
                        min="0"
                        step="any"
                        placeholder="Cantidad usada"
                      />
                    )}
                  </div>
                );
              })
            ) : (
              <p className="text-gray-500">No hay componentes disponibles</p>
            )}
          </div>
        )}
        <div className="flex gap-4 mt-6">
          <Button type="button" variant="secondary" onClick={onClose} className="flex-1 py-2.5">
            Cancelar
          </Button>
          <Button type="submit" variant="primary" className="flex-1 py-2.5">
            Guardar Componentes
          </Button>
        </div>
      </form>
    </FormModal>
  );
};

ProductComponentForm.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  product: PropTypes.object,
  onAddComponent: PropTypes.func.isRequired,
};

export default ProductComponentForm;
