import { useState } from 'react';
import Button from '../components/common/button.jsx';
import BarraBusqueda from '../components/common/BarraBusqueda.jsx';
import InformesTable from '../components/Tablas/InformesTable.jsx';
import useSearch from '../hooks/useSearch';
import DatePicker from 'react-datepicker'; // Asegúrate de instalar este paquete
import 'react-datepicker/dist/react-datepicker.css';

function Informes() {
    const [activeTab, setActiveTab] = useState('Inicio');
    const { searchConfig, handleSearch } = useSearch();
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    const handleRecopilar = () => {
        // Aquí va la lógica para recopilar la información según las fechas seleccionadas
        console.log('Recopilar datos entre', startDate, 'y', endDate);
    };

    return (
        <div className="h-[100%] ml-10 p-4">
            <div className="rounded-lg shadow-lg p-6 h-[95%]">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Informes de Ingresos y Egresos</h2>
                <p className="text-sm text-gray-500 mb-4">Accede a datos clave sobre Ingresos, Egresos y calidad de los productos.</p>

                <div className=''>
                <div className="flex space-x-4 mb-6 justify-end">
                    <Button onClick={() => setActiveTab('Inicio')} variant={activeTab === 'Inicio' ? 'primary' : 'default'}>
                        Todos
                    </Button>
                    <Button onClick={() => setActiveTab('Egresos')} variant={activeTab === 'Egresos' ? 'primary' : 'default'}>
                        Egresos
                    </Button>
                    <Button onClick={() => setActiveTab('Ingreso')} variant={activeTab === 'Ingreso' ? 'primary' : 'default'}>
                        Ingresos
                    </Button>
                    <Button onClick={() => setActiveTab('Ranking')} variant={activeTab === 'Ranking' ? 'primary' : 'default'}>
                        Ranking de productos
                    </Button>
                </div>

                <div className="flex space-x-4 mb-6 justify-center">
                    <div className="flex flex-col">
                        <label className="block text-sm font-medium text-gray-700">Desde</label>
                        <DatePicker
                            selected={startDate}
                            onChange={date => setStartDate(date)}
                            dateFormat="yyyy/MM/dd"
                            className="mt-2 p-2 border rounded-lg focus:outline-none focus:ring-2 max-h-8 focus:ring-indigo-500"
                            wrapperClassName="z-10"
                            popperPlacement="bottom"
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="block text-sm font-medium text-gray-700">Hasta</label>
                        <DatePicker
                            selected={endDate}
                            onChange={date => setEndDate(date)}
                            dateFormat="yyyy/MM/dd"
                            className="mt-2 p-2 border rounded-lg focus:outline-none focus:ring-2 max-h-8 focus:ring-indigo-500"
                            wrapperClassName="z-10"
                            popperPlacement="bottom"
                        />
                    </div>
                    <Button
                        onClick={handleRecopilar}
                        disabled={!startDate || !endDate}
                        variant="primary"
                        className="mt-6 w-full sm:w-auto px-4 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                    >
                        Recopilar
                    </Button>
                </div>
            </div>
                {/* Barra de búsqueda solo se muestra si las fechas están seleccionadas */}
                {startDate && endDate && (
                    <BarraBusqueda onSearch={handleSearch} placeholder={`Buscar en ${activeTab}...`} options={[]} initialFilters={searchConfig.filters} />
                )}

                {/* Mostrar la tabla solo si las fechas están seleccionadas */}
                {startDate && endDate && (
                    <div className="mt-4 border border-gray-200 rounded-lg overflow-hidden">
                        <InformesTable categoria={activeTab} startDate={startDate} endDate={endDate} />
                    </div>
                )}
                
            <div className='h-52 w-52 bg-purple-500'>

</div>
            </div>
        </div>
    );
}

export default Informes;
