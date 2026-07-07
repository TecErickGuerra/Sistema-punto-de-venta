const express = require('express');
const { registrarVenta, obtenerVentasHoy } = require('../controllers/ventas.controller');

const router = express.Router();

router.get('/hoy', obtenerVentasHoy);
router.post('/', registrarVenta);

module.exports = router;