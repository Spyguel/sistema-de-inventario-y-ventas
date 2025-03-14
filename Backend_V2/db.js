// database.js
const { Pool } = require('pg');

// Configuración de la base de datos
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'sistema-inventario',
  password: '1234567',
  port: 5432,
});

// Exportar el pool para usar en otros módulos
module.exports = pool;