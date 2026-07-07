import { useState } from 'react';
import './App.css';
import Catalogo from './components/Catalogo';
import Carrito from './components/Carrito';
import Ticket from './components/Ticket';
import ReporteVentas from './components/ReporteVentas';
import { createVenta } from './services/api';

function App() {
  const [carrito, setCarrito] = useState([]);
  const [metodoPago, setMetodoPago] = useState('efectivo');
  const [ticket, setTicket] = useState(null);

  const agregarAlCarrito = (producto) => {
    if (!producto || Number(producto.stock) <= 0) {
      alert('No hay stock disponible para este producto');
      return;
    }

    setCarrito(prevCarrito => {
      const itemExistente = prevCarrito.find(item => item.productoId === producto.id);

      if (itemExistente) {
        if (itemExistente.cantidad >= producto.stock) {
          alert('No hay suficiente stock disponible');
          return prevCarrito;
        }

        return prevCarrito.map(item =>
          item.productoId === producto.id ? { ...item, cantidad: item.cantidad + 1 } : item
        );
      }

      return [
        ...prevCarrito,
        {
          productoId: producto.id,
          nombre: producto.nombre,
          precio: Number(producto.precio),
          stock: Number(producto.stock),
          cantidad: 1,
        },
      ];
    });
  };

  const actualizarCantidad = (productoId, nuevaCantidad) => {
    setCarrito(prevCarrito => {
      if (nuevaCantidad <= 0) {
        return prevCarrito.filter(item => item.productoId !== productoId);
      }

      const item = prevCarrito.find(item => item.productoId === productoId);
      if (!item) {
        return prevCarrito;
      }

      if (nuevaCantidad > item.stock) {
        alert('No hay suficiente stock disponible');
        return prevCarrito;
      }

      return prevCarrito.map(item =>
        item.productoId === productoId ? { ...item, cantidad: nuevaCantidad } : item
      );
    });
  };

  const eliminarItem = (productoId) => {
    setCarrito(prevCarrito => prevCarrito.filter(item => item.productoId !== productoId));
  };

  const confirmarVenta = async () => {
    if (carrito.length === 0) {
      alert('El carrito está vacío');
      return;
    }

    const total = carrito.reduce((acumulador, item) => acumulador + item.precio * item.cantidad, 0);

    try {
      const respuesta = await createVenta({
        total,
        metodoPago,
        carrito: carrito.map(item => ({
          productoId: item.productoId,
          cantidad: item.cantidad,
          precio: item.precio,
        })),
      });

      setTicket({
        folio: respuesta.ventaId || 'N/A',
        fecha: new Date().toISOString(),
        productos: carrito,
        total,
      });
      setCarrito([]);
      alert(respuesta.message || 'Venta registrada correctamente');
    } catch (error) {
      alert(error.message || 'Error al procesar la venta');
    }
  };

  return (
    <div>
      <h1>Punto de Venta</h1>
      <Catalogo onAgregarAlCarrito={agregarAlCarrito} />
      <Carrito
        items={carrito}
        metodoPago={metodoPago}
        onMetodoPagoChange={setMetodoPago}
        onActualizarCantidad={actualizarCantidad}
        onEliminarItem={eliminarItem}
        onConfirmarVenta={confirmarVenta}
      />
      {ticket && (
        <Ticket
          folio={ticket.folio}
          fecha={ticket.fecha}
          productos={ticket.productos}
          total={ticket.total}
        />
      )}
      <ReporteVentas />
    </div>
  );
}

export default App;
