import { useState } from 'react';
import Button from '../components/common/button.jsx';
import BarraBusqueda from '../components/common/BarraBusqueda.jsx';
import InformesTable from '../components/Tablas/InformesTable.jsx';
import RankingTable from '../components/Tablas/RankingTable.jsx'; 

function Informes() {
    const [activeTab, setActiveTab] = useState('ingresos');
    const [searchConfig, setSearchConfig] = useState({
        term: '',
        filters: {},
        startDate: null,
        endDate: null,
    });

    // Lógica de búsqueda y filtrado
    const handleSearch = (searchTerm, filters, startDate, endDate) => {
        setSearchConfig({
            term: searchTerm,
            filters: filters,
            startDate: startDate,
            endDate: endDate,
        });
    };

    // Título basado en la pestaña activa
    const getTitle = () => {
        switch (activeTab) {
            case 'ingresos':
                return 'Informes de Ingresos y Egresos';
            case 'ranking':
                return 'Ranking de Productos';
            default:
                return 'Informes';
        }
    };

    return (
        <div className="h-[100%] ml-10 p-4">
            <div className="rounded-lg shadow-lg p-6 h-[95%]">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">{getTitle()}</h2>
                <p className="text-sm text-gray-500 mb-4">
                    {activeTab === 'ingresos' && 'Ver detalles sobre los ingresos en la empresa.'}
                    {activeTab === 'egresos' && 'Ver detalles sobre los egresos de la empresa.'}
                    {activeTab === 'ranking' && 'Ver los productos más vendidos y sus rendimientos.'}
                </p>

                <div className="flex space-x-4 mb-6 justify-end">
                    <Button
                        onClick={() => setActiveTab('ingresos')}
                        variant={activeTab === 'ingresos' ? 'primary' : 'default'}
                        className={`px-4 py-2 rounded-lg transition ${
                            activeTab === 'ingresos'
                                ? 'bg-blue-500 text-white shadow hover:bg-blue-600'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                    >
                        Ingresos y egresos
                    </Button>
                    <Button
                        onClick={() => setActiveTab('ranking')}
                        variant={activeTab === 'ranking' ? 'primary' : 'default'}
                        className={`px-4 py-2 rounded-lg transition ${
                            activeTab === 'ranking'
                                ? 'bg-blue-500 text-white shadow hover:bg-blue-600'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                    >
                        Ranking de productos
                    </Button>
                    
                </div>

                <BarraBusqueda 
                    onSearch={handleSearch}
                    placeholder={`Buscar ${activeTab}...`}
                    options={[]} // Aquí puedes pasar las opciones de filtros si las tienes
                    initialFilters={searchConfig.filters}
                    initialStartDate={searchConfig.startDate}
                    initialEndDate={searchConfig.endDate}
                />
                {/* Renderizado de tabla según la pestaña activa */}
                <div className=" max-h-[74%] mt-4 border border-gray-200 rounded-lg overflow-y-scroll overflow-x-hidden">
                    {activeTab === 'ingresos' && (
                        <InformesTable
                            categoria="Ingresos"
                            searchConfig={searchConfig}
                        />
                    )}
                    {activeTab === 'egresos' && (
                        <InformesTable
                            categoria="Egresos"
                            searchConfig={searchConfig}
                        />
                    )}
                    {activeTab === 'ranking' && (
                        <RankingTable
                            searchConfig={searchConfig}
                        />
                    )}
                </div>
                
            </div>
        </div>
    );
}

export default Informes;
