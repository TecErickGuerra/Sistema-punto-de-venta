const express = require('express');
const cors = require('cors');
const productosRoutes = require('./routes/productos.routes');
const ventasRoutes = require('./routes/ventas.routes');
const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/productos', productosRoutes);
app.use('/api/ventas', ventasRoutes);

module.exports = app;