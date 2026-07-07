const pool = require('../config/db');

const getProductos = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM productos');
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error al obtener productos' });
    }
};

const getProductoById = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM productos WHERE id = ?', [req.params.id]);
        res.json(rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error al obtener producto' });
    }
};

const createProducto = async (req, res) => {
    try {
        const { nombre, precio, stock } = req.body;

        if (!nombre || typeof nombre !== 'string' || nombre.trim() === '') {
            return res.status(400).json({ message: 'El nombre del producto es obligatorio' });
        }

        const precioNumerico = Number(precio);
        const stockNumerico = Number(stock);

        if (!Number.isFinite(precioNumerico) || precioNumerico < 0) {
            return res.status(400).json({ message: 'El precio debe ser un número válido' });
        }

        if (!Number.isFinite(stockNumerico) || stockNumerico < 0) {
            return res.status(400).json({ message: 'El stock debe ser un número válido' });
        }

        await pool.query(
            'INSERT INTO productos (nombre, precio, stock) VALUES (?, ?, ?)',
            [nombre.trim(), precioNumerico, stockNumerico]
        );

        res.status(201).json({ message: 'Producto creado exitosamente' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error al crear producto' });
    }
};

const updateProducto = async (req, res) => {
    try {
        const { nombre, precio, stock } = req.body;

        if (!nombre || typeof nombre !== 'string' || nombre.trim() === '') {
            return res.status(400).json({ message: 'El nombre del producto es obligatorio' });
        }

        const precioNumerico = Number(precio);
        const stockNumerico = Number(stock);

        if (!Number.isFinite(precioNumerico) || precioNumerico < 0) {
            return res.status(400).json({ message: 'El precio debe ser un número válido' });
        }

        if (!Number.isFinite(stockNumerico) || stockNumerico < 0) {
            return res.status(400).json({ message: 'El stock debe ser un número válido' });
        }

        await pool.query(
            'UPDATE productos SET nombre = ?, precio = ?, stock = ? WHERE id = ?',
            [nombre.trim(), precioNumerico, stockNumerico, req.params.id]
        );

        res.json({ message: 'Producto actualizado exitosamente' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error al actualizar producto' });
    }
};

const deleteProducto = async (req, res) => {
    try {
        await pool.query('DELETE FROM productos WHERE id = ?', [req.params.id]);
        res.json({ message: 'Producto eliminado exitosamente' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error al eliminar producto' });
    }
};

module.exports = {
    getProductos,
    getProductoById,
    createProducto,
    updateProducto,
    deleteProducto
};