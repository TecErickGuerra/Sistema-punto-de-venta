import { useState, useEffect } from 'react';
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
  const [activeTab, setActiveTab] = useState('pos'); // 'pos' o 'reportes'
  const [fechaHora, setFechaHora] = useState(new Date());
  
  // Estado para notificaciones personalizadas tipo Toast
  const [toast, setToast] = useState({ visible: false, mensaje: '', tipo: 'info' });

  // Actualizar reloj de la cabecera
  useEffect(() => {
    const timer = setInterval(() => {
      setFechaHora(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Función para mostrar alertas estilizadas
  const mostrarAlerta = (mensaje, tipo = 'info') => {
    setToast({ visible: true, mensaje, tipo });
    setTimeout(() => {
      setToast(prev => ({ ...prev, visible: false }));
    }, 4000);
  };

  const agregarAlCarrito = (producto) => {
    if (!producto || Number(producto.stock) <= 0) {
      mostrarAlerta('No hay stock disponible para este producto', 'danger');
      return;
    }

    setCarrito(prevCarrito => {
      const itemExistente = prevCarrito.find(item => item.productoId === producto.id);

      if (itemExistente) {
        if (itemExistente.cantidad >= producto.stock) {
          mostrarAlerta('No hay suficiente stock disponible', 'warning');
          return prevCarrito;
        }

        mostrarAlerta(`Se aumentó cantidad de ${producto.nombre}`, 'success');
        return prevCarrito.map(item =>
          item.productoId === producto.id ? { ...item, cantidad: item.cantidad + 1 } : item
        );
      }

      mostrarAlerta(`${producto.nombre} agregado al carrito`, 'success');
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
        mostrarAlerta('Producto eliminado del carrito', 'info');
        return prevCarrito.filter(item => item.productoId !== productoId);
      }

      const item = prevCarrito.find(item => item.productoId === productoId);
      if (!item) {
        return prevCarrito;
      }

      if (nuevaCantidad > item.stock) {
        mostrarAlerta('No hay suficiente stock disponible', 'warning');
        return prevCarrito;
      }

      return prevCarrito.map(item =>
        item.productoId === productoId ? { ...item, cantidad: nuevaCantidad } : item
      );
    });
  };

  const eliminarItem = (productoId) => {
    setCarrito(prevCarrito => prevCarrito.filter(item => item.productoId !== productoId));
    mostrarAlerta('Producto eliminado del carrito', 'info');
  };

  const confirmarVenta = async () => {
    if (carrito.length === 0) {
      mostrarAlerta('El carrito está vacío', 'warning');
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
      mostrarAlerta(respuesta.message || 'Venta registrada correctamente', 'success');
    } catch (error) {
      mostrarAlerta(error.message || 'Error al procesar la venta', 'danger');
    }
  };

  const formatearFecha = (date) => {
    return date.toLocaleDateString('es-ES', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }) + ' - ' + date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className="app-container">
      {/* Cabecera Principal */}
      <header className="app-header">
        <div className="brand-section">
          <div className="brand-icon-wrapper">
            {/* SVG Store Front Icon */}
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/>
              <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
              <path d="M7 2v5"/>
              <path d="M12 2v5"/>
              <path d="M17 2v5"/>
              <path d="M2 7h20"/>
            </svg>
          </div>
          <div>
            <h1 className="brand-title">Punto de Venta Pro</h1>
          </div>
        </div>

        {/* Pestañas de Navegación */}
        <nav className="nav-tabs">
          <button 
            className={`tab-btn ${activeTab === 'pos' ? 'active' : ''}`}
            onClick={() => setActiveTab('pos')}
          >
            {/* SVG Shopping Bag Icon */}
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/>
              <path d="M3 6h18"/>
              <path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
            Terminal POS
          </button>
          
          <button 
            className={`tab-btn ${activeTab === 'reportes' ? 'active' : ''}`}
            onClick={() => setActiveTab('reportes')}
          >
            {/* SVG Chart Icon */}
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" x2="18" y1="20" y2="10"/>
              <line x1="12" x2="12" y1="20" y2="4"/>
              <line x1="6" x2="6" y1="20" y2="14"/>
            </svg>
            Reportes
          </button>
        </nav>

        {/* Estatus y Reloj */}
        <div className="header-status">
          <div className="status-badge">
            <span className="status-dot"></span>
            Online
          </div>
          <div className="current-time">
            {formatearFecha(fechaHora)}
          </div>
        </div>
      </header>

      {/* Contenido Principal */}
      <main className="app-main-content">
        {activeTab === 'pos' ? (
          <div className="pos-layout fade-in">
            <div className="pos-main-panel">
              <Catalogo onAgregarAlCarrito={agregarAlCarrito} />
            </div>
            
            <div className="pos-side-panel">
              <Carrito
                items={carrito}
                metodoPago={metodoPago}
                onMetodoPagoChange={setMetodoPago}
                onActualizarCantidad={actualizarCantidad}
                onEliminarItem={eliminarItem}
                onConfirmarVenta={confirmarVenta}
              />
            </div>
          </div>
        ) : (
          <div className="fade-in">
            <ReporteVentas />
          </div>
        )}
      </main>

      {/* Modal del Ticket de Venta */}
      {ticket && (
        <div className="modal-overlay" onClick={() => setTicket(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <Ticket
              folio={ticket.folio}
              fecha={ticket.fecha}
              productos={ticket.productos}
              total={ticket.total}
              onClose={() => setTicket(null)}
            />
          </div>
        </div>
      )}

      {/* Notificación Toast Flotante */}
      {toast.visible && (
        <div className={`toast-alert toast-${toast.tipo}`}>
          <div className="toast-icon">
            {toast.tipo === 'success' && (
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
            )}
            {toast.tipo === 'warning' && (
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/></svg>
            )}
            {toast.tipo === 'danger' && (
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" x2="9" y1="9" y2="15"/><line x1="9" x2="15" y1="9" y2="15"/></svg>
            )}
            {toast.tipo === 'info' && (
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
            )}
          </div>
          <div className="toast-message">{toast.mensaje}</div>
        </div>
      )}

      {/* Estilos específicos para el Toast */}
      <style>{`
        .toast-alert {
          position: fixed;
          bottom: 24px;
          right: 24px;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem 1.25rem;
          border-radius: var(--radius-md);
          background-color: var(--bg-card);
          border: 1px solid var(--border-color);
          box-shadow: var(--shadow-lg);
          z-index: 200;
          min-width: 300px;
          max-width: 450px;
          animation: toast-in 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        
        @keyframes toast-in {
          from { transform: translateY(20px) scale(0.9); opacity: 0; }
          to { transform: translateY(0) scale(1); opacity: 1; }
        }

        .toast-success { border-left: 4px solid var(--success); }
        .toast-success .toast-icon { color: var(--success); }
        
        .toast-warning { border-left: 4px solid var(--warning); }
        .toast-warning .toast-icon { color: var(--warning); }
        
        .toast-danger { border-left: 4px solid var(--danger); }
        .toast-danger .toast-icon { color: var(--danger); }
        
        .toast-info { border-left: 4px solid var(--primary); }
        .toast-info .toast-icon { color: var(--primary); }
        
        .toast-message {
          font-size: 0.9rem;
          font-weight: 500;
          color: var(--text-main);
        }
        
        .toast-icon {
          display: flex;
          align-items: center;
          justify-content: center;
        }
      `}</style>
    </div>
  );
}

export default App;
