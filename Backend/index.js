// index.js
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const contactoRoutes = require('./routes/contacto');
const authRoutes = require('./routes/auth');

const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173', // Permite solicitudes desde este origen
}));

app.use('/contacto', contactoRoutes); // Rutas de Contacto
app.use('/auth', authRoutes);         // Rutas de autenticación

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
