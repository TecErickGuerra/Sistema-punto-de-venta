const Carrito = ({ items, metodoPago, onMetodoPagoChange, onActualizarCantidad, onEliminarItem, onConfirmarVenta }) => {
    const calcularSubtotal = (item) => item.precio * item.cantidad;
    const total = items.reduce((acumulador, item) => acumulador + calcularSubtotal(item), 0);

    return (
        <div>
            <h2>Carrito</h2>
            {items.length === 0 ? (
                <p>El carrito está vacío.</p>
            ) : (
                <ul>
                    {items.map(item => (
                        <li key={item.productoId}>
                            <div>
                                <strong>{item.nombre}</strong> - ${Number(item.precio).toFixed(2)}
                            </div>
                            <div>
                                <button onClick={() => onActualizarCantidad(item.productoId, item.cantidad - 1)}>-</button>
                                <span> {item.cantidad} </span>
                                <button
                                    onClick={() => onActualizarCantidad(item.productoId, item.cantidad + 1)}
                                    disabled={item.cantidad >= item.stock}
                                >
                                    +
                                </button>
                                <button onClick={() => onEliminarItem(item.productoId)}>Eliminar</button>
                            </div>
                            <div>Subtotal: ${calcularSubtotal(item).toFixed(2)}</div>
                        </li>
                    ))}
                </ul>
            )}
            <h3>Total: ${total.toFixed(2)}</h3>
            <label htmlFor="metodo-pago">Método de pago</label>
            <select id="metodo-pago" value={metodoPago} onChange={(e) => onMetodoPagoChange(e.target.value)}>
                <option value="efectivo">Efectivo</option>
                <option value="tarjeta">Tarjeta</option>
                <option value="transferencia">Transferencia</option>
            </select>
            <button onClick={onConfirmarVenta} disabled={items.length === 0}>
                Confirmar venta
            </button>
        </div>
    );
};

export default Carrito;
