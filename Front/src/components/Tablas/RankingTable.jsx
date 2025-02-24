const RankingTable = () => {
    // Datos de ejemplo para los rankings
    const rankingData = [
        { rank: 1, producto: 'Producto A', totalMovimientos: 100, totalVendido: 2000, totalComprado: 1500 },
        { rank: 2, producto: 'Producto B', totalMovimientos: 80, totalVendido: 1600, totalComprado: 1200 },
        { rank: 3, producto: 'Producto C', totalMovimientos: 70, totalVendido: 1400, totalComprado: 1000 },
        { rank: 4, producto: 'Producto D', totalMovimientos: 60, totalVendido: 1200, totalComprado: 800 },
        { rank: 5, producto: 'Producto E', totalMovimientos: 50, totalVendido: 1000, totalComprado: 600 },
    ];

    const getRankColor = (rank) => {
        switch (rank) {
            case 1:
                return 'bg-yellow-400'; // Dorado
            case 2:
                return 'bg-gray-300'; // Plateado
            case 3:
                return 'bg-orange-400'; // Bronce
            default:
                return 'bg-white border border-gray-200'; // Transparente con borde
        }
    };

    return (
        <div className="p-6 bg-gray-500 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-center">Ranking</h2>
            <div className="space-y-4 h-[30%]">
                {rankingData.map((item) => (
                    <div
                        key={item.rank}
                        className={`flex justify-between items-center p-4 rounded-lg ${getRankColor(item.rank)} 
                        ${item.rank > 3 ? 'border-4 border-gray-300' : ''} shadow-md transition-transform transform hover:scale-105`}
                    >
                        {/* Información de ranking y producto */}
                        <div className="flex items-center space-x-4">
                            <div className="text-3xl font-bold text-gray-800">{item.rank}</div>
                            <div className="text-xl font-semibold text-gray-700">{item.producto}</div>
                        </div>
                        {/* Datos de ventas, movimientos y compras */}
                        <div className="flex space-x-6 text-lg text-gray-600">
                            <div><strong>Total Movimientos:</strong> {item.totalMovimientos}</div>
                            <div><strong>Total Vendido:</strong> ${item.totalVendido.toLocaleString()}</div>
                            <div><strong>Total Comprado:</strong> ${item.totalComprado.toLocaleString()}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RankingTable;
