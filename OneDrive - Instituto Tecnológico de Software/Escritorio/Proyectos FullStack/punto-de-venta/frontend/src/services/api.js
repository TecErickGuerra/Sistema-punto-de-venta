const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';

const getProductos = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/productos`);
        if (!response.ok) {
            throw new Error('No se pudieron obtener los productos');
        }
        return await response.json();
    } catch (error) {
        console.error('Error al obtener productos', error);
        throw error;
    }
};

const createVenta = async (ventaData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/ventas`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(ventaData),
        });
        if (!response.ok) {
            throw new Error('No se pudo registrar la venta');
        }
        return await response.json();
    } catch (error) {
        console.error('Error al registrar venta', error);
        throw error;
    }
};

const getVentasHoy = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/ventas/hoy`);
        if (!response.ok) {
            throw new Error('No se pudo obtener el reporte de ventas');
        }
        return await response.json();
    } catch (error) {
        console.error('Error al obtener reporte de ventas', error);
        throw error;
    }
};

export { getProductos, createVenta, getVentasHoy };