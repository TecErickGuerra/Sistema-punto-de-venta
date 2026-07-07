const pool = require('../config/db');

const obtenerVentasHoy = async (req, res) => {
    try {
        const [rows] = await pool.query(
            `SELECT id, fecha, total, metodo_pago
             FROM ventas
             WHERE DATE(fecha) = CURDATE()
             ORDER BY fecha DESC`
        );

        const [resumen] = await pool.query(
            `SELECT COALESCE(SUM(total), 0) AS total_del_dia
             FROM ventas
             WHERE DATE(fecha) = CURDATE()`
        );

        res.json({
            ventas: rows,
            totalDelDia: Number(resumen[0].total_del_dia || 0),
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error al obtener reporte de ventas' });
    }
};

const registrarVenta = async (req, res) => {
    const { total, metodoPago, carrito, metodo_pago } = req.body;
    const metodoPagoFinal = metodoPago || metodo_pago;
    const items = Array.isArray(carrito) ? carrito : [];

    if (!total || !metodoPagoFinal || items.length === 0) {
        return res.status(400).json({ message: 'Datos incompletos' });
    }

    const totalNumerico = Number(total);

    if (!Number.isFinite(totalNumerico) || totalNumerico <= 0) {
        return res.status(400).json({ message: 'El total de la venta debe ser un número válido' });
    }

    const conn = await pool.getConnection();

    try {
        await conn.beginTransaction();

        const [ventaResult] = await conn.query(
            'INSERT INTO ventas (total, metodo_pago) VALUES (?, ?)',
            [totalNumerico, metodoPagoFinal]
        );
        const ventaId = ventaResult.insertId;

        for (const item of items) {
            const productoId = item.productoId ?? item.id;
            const cantidad = Number(item.cantidad);
            const precioUnitario = Number(item.precio ?? item.precio_unitario ?? 0);

            if (!productoId || !Number.isFinite(cantidad) || cantidad <= 0 || !Number.isFinite(precioUnitario) || precioUnitario < 0) {
                throw new Error('Datos del carrito inválidos');
            }

            const [stockRows] = await conn.query('SELECT stock FROM productos WHERE id = ?', [productoId]);

            if (stockRows.length === 0) {
                throw new Error(`Producto ${productoId} no encontrado`);
            }

            const stockActual = Number(stockRows[0].stock);

            if (stockActual < cantidad) {
                throw new Error(`Stock insuficiente para el producto ${productoId}`);
            }

            await conn.query(
                `INSERT INTO venta_detalle
                (venta_id, producto_id, cantidad, precio_unitario, subtotal)
                VALUES (?, ?, ?, ?, ?)`,
                [ventaId, productoId, cantidad, precioUnitario, precioUnitario * cantidad]
            );

            await conn.query(
                'UPDATE productos SET stock = stock - ? WHERE id = ?',
                [cantidad, productoId]
            );
        }

        await conn.commit();
        return res.status(201).json({ message: 'Venta registrada exitosamente', ventaId });
    } catch (err) {
        await conn.rollback();
        console.error(err);
        return res.status(400).json({ message: err.message || 'Error al registrar venta' });
    } finally {
        conn.release();
    }
};

module.exports = {
    registrarVenta,
    obtenerVentasHoy,
};