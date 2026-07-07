import './Ticket.css';

const Ticket = ({ folio, fecha, productos = [], total }) => {
    const fechaFormateada = fecha
        ? new Date(fecha).toLocaleString('es-ES', {
            dateStyle: 'medium',
            timeStyle: 'short',
        })
        : 'Sin fecha';

    return (
        <div className="ticket-print-area">
            <div className="ticket-card">
                <h2>Ticket de venta</h2>
                <p><strong>Folio:</strong> {folio}</p>
                <p><strong>Fecha:</strong> {fechaFormateada}</p>

                <table className="ticket-table">
                    <thead>
                        <tr>
                            <th>Producto</th>
                            <th>Cant.</th>
                            <th>Precio</th>
                            <th>Subtotal</th>
                        </tr>
                    </thead>
                    <tbody>
                        {productos.map((producto) => (
                            <tr key={producto.productoId ?? producto.id}>
                                <td>{producto.nombre}</td>
                                <td>{producto.cantidad}</td>
                                <td>${Number(producto.precio).toFixed(2)}</td>
                                <td>${(Number(producto.precio) * Number(producto.cantidad)).toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="ticket-total">
                    <strong>Total: ${Number(total).toFixed(2)}</strong>
                </div>

                <button className="no-print" type="button" onClick={() => window.print()}>
                    Imprimir ticket
                </button>
            </div>
        </div>
    );
};

export default Ticket;