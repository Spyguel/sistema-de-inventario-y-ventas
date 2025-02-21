// config/db.js
const { Pool } = require('pg');
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'sistema-inventario',
    password: '1234567',
    port: 5432,
});

pool.connect()
    .then(client => {
        console.log('✅ Conexión exitosa a PostgreSQL');
        client.release();
    })
    .catch(err => {
        console.error('❌ Error al conectar a PostgreSQL:', err);
    });

module.exports = pool;
