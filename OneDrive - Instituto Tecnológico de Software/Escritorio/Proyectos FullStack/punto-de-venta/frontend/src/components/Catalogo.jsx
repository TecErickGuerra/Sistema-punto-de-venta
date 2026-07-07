import { useEffect, useState } from 'react';
import { getProductos } from '../services/api';

const Catalogo = ({ onAgregarAlCarrito }) => {
    const [productos, setProductos] = useState([]);

    useEffect(() => {
        cargarProductos();
    }, []);

    const cargarProductos = async () => {
        try {
            const productosObtenidos = await getProductos();
            setProductos(productosObtenidos);
        } catch (error) {
            console.error('Error al cargar productos', error);
        }
    };

    return (
        <div>
            <h2>Catálogo de productos</h2>
            <ul>
                {productos.map(producto => (
                    <li key={producto.id}>
                        {producto.nombre} - ${producto.precio} - Stock: {producto.stock}
                        <button onClick={() => onAgregarAlCarrito(producto)}>
                            Agregar
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Catalogo;