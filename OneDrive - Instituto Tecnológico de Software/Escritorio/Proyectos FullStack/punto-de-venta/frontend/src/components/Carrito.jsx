const Carrito = ({ items, metodoPago, onMetodoPagoChange, onActualizarCantidad, onEliminarItem, onConfirmarVenta }) => {
    const calcularSubtotal = (item) => item.precio * item.cantidad;
    const total = items.reduce((acumulador, item) => acumulador + calcularSubtotal(item), 0);
    const totalItems = items.reduce((acumulador, item) => acumulador + item.cantidad, 0);

    return (
        <div className="panel-card cart-panel fade-in">
            <div className="cart-header">
                <h2>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                    </svg>
                    Carrito
                </h2>
                {totalItems > 0 && (
                    <span className="badge badge-primary total-badge">{totalItems} items</span>
                )}
            </div>

            {items.length === 0 ? (
                <div className="cart-empty">
                    <svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--text-muted)' }}>
                        <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                    </svg>
                    <p>El carrito está vacío.</p>
                </div>
            ) : (
                <div className="cart-content-wrapper">
                    {/* Lista de Items */}
                    <div className="cart-items-list">
                        {items.map(item => (
                            <div key={item.productoId} className="cart-item">
                                <div className="cart-item-details">
                                    <div className="cart-item-name">{item.nombre}</div>
                                    <div className="cart-item-price">${Number(item.precio).toFixed(2)} c/u</div>
                                </div>
                                
                                <div className="cart-item-actions">
                                    <div className="quantity-controls">
                                        <button 
                                            className="qty-btn"
                                            onClick={() => onActualizarCantidad(item.productoId, item.cantidad - 1)}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="5" x2="19" y1="12" y2="12"/></svg>
                                        </button>
                                        <span className="qty-number">{item.cantidad}</span>
                                        <button 
                                            className="qty-btn"
                                            onClick={() => onActualizarCantidad(item.productoId, item.cantidad + 1)}
                                            disabled={item.cantidad >= item.stock}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" x2="12" y1="5" y2="19"/><line x1="5" x2="19" y1="12" y2="12"/></svg>
                                        </button>
                                    </div>
                                    
                                    <div className="cart-item-subtotal">${calcularSubtotal(item).toFixed(2)}</div>
                                    
                                    <button 
                                        className="btn-delete"
                                        onClick={() => onEliminarItem(item.productoId)}
                                        title="Eliminar producto"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="3 6 5 6 21 6"/>
                                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                                            <line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Resumen e Importes */}
                    <div className="cart-summary">
                        <div className="summary-row">
                            <span className="summary-label">Subtotal</span>
                            <span className="summary-value">${total.toFixed(2)}</span>
                        </div>
                        <div className="summary-row total-row">
                            <span className="summary-label-total">Total a pagar</span>
                            <span className="summary-value-total">${total.toFixed(2)}</span>
                        </div>
                    </div>

                    {/* Método de Pago */}
                    <div className="payment-section">
                        <label className="section-label">Método de pago</label>
                        <div className="payment-options">
                            <button 
                                type="button"
                                className={`payment-opt-btn ${metodoPago === 'efectivo' ? 'active' : ''}`}
                                onClick={() => onMetodoPagoChange('efectivo')}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="12" x2="12" y1="2" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                                </svg>
                                <span>Efectivo</span>
                            </button>
                            
                            <button 
                                type="button"
                                className={`payment-opt-btn ${metodoPago === 'tarjeta' ? 'active' : ''}`}
                                onClick={() => onMetodoPagoChange('tarjeta')}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect width="20" height="14" x="2" y="5" rx="2"/>
                                    <line x1="2" x2="22" y1="10" y2="10"/>
                                </svg>
                                <span>Tarjeta</span>
                            </button>
                            
                            <button 
                                type="button"
                                className={`payment-opt-btn ${metodoPago === 'transferencia' ? 'active' : ''}`}
                                onClick={() => onMetodoPagoChange('transferencia')}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M16 3h5v5"/><path d="M8 21H3v-5"/><path d="M12 20v-8m0 0-4 4m4-4 4 4"/><path d="m19 12-7-8-7 8"/>
                                </svg>
                                <span>Transf.</span>
                            </button>
                        </div>
                    </div>

                    {/* Botón de Confirmación */}
                    <button 
                        className="btn-confirm-checkout" 
                        onClick={onConfirmarVenta} 
                        disabled={items.length === 0}
                    >
                        {/* SVG Check Icon */}
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
                        </svg>
                        Confirmar y Cobrar
                    </button>
                </div>
            )}

            {/* Estilos locales para Carrito */}
            <style>{`
                .cart-panel {
                    display: flex;
                    flex-direction: column;
                    min-height: 400px;
                    max-height: calc(100vh - 120px);
                }
                .cart-header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin-bottom: 1.25rem;
                    border-bottom: 1px solid var(--border-color);
                    padding-bottom: 0.75rem;
                }
                .cart-header h2 {
                    font-size: 1.25rem;
                    margin: 0;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    color: var(--text-main);
                }
                .total-badge {
                    font-size: 0.8rem;
                    padding: 0.35rem 0.6rem;
                    border-radius: var(--radius-full);
                }

                .cart-empty {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    flex: 1;
                    padding: 3rem 1rem;
                    text-align: center;
                    color: var(--text-muted);
                    gap: 1rem;
                }

                .cart-content-wrapper {
                    display: flex;
                    flex-direction: column;
                    gap: 1.25rem;
                    flex: 1;
                    overflow: hidden;
                }

                .cart-items-list {
                    display: flex;
                    flex-direction: column;
                    gap: 0.75rem;
                    overflow-y: auto;
                    flex: 1;
                    padding-right: 0.25rem;
                }

                .cart-item {
                    background-color: var(--bg-app);
                    border: 1px solid var(--border-color);
                    border-radius: var(--radius-md);
                    padding: 0.75rem;
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }

                .cart-item-details {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                }

                .cart-item-name {
                    font-size: 0.9rem;
                    font-weight: 600;
                    color: var(--text-main);
                }

                .cart-item-price {
                    font-size: 0.8rem;
                    color: var(--text-muted);
                }

                .cart-item-actions {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                }

                .quantity-controls {
                    display: flex;
                    align-items: center;
                    background-color: var(--bg-card);
                    border: 1px solid var(--border-color);
                    border-radius: var(--radius-full);
                    padding: 2px;
                }

                .qty-btn {
                    width: 24px;
                    height: 24px;
                    border-radius: var(--radius-full);
                    color: var(--text-muted);
                }
                .qty-btn:hover:not(:disabled) {
                    background-color: var(--primary-light);
                    color: var(--primary);
                }
                .qty-btn:disabled {
                    opacity: 0.4;
                    cursor: not-allowed;
                }

                .qty-number {
                    width: 24px;
                    text-align: center;
                    font-size: 0.85rem;
                    font-weight: 600;
                    color: var(--text-main);
                }

                .cart-item-subtotal {
                    font-size: 0.95rem;
                    font-weight: 700;
                    color: var(--text-main);
                }

                .btn-delete {
                    color: var(--text-muted);
                    padding: 4px;
                    border-radius: var(--radius-sm);
                }
                .btn-delete:hover {
                    color: var(--danger);
                    background-color: var(--danger-light);
                }

                .cart-summary {
                    border-top: 1.5px solid var(--border-color);
                    border-bottom: 1.5px solid var(--border-color);
                    padding: 0.85rem 0;
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }

                .summary-row {
                    display: flex;
                    justify-content: space-between;
                    font-size: 0.9rem;
                    color: var(--text-muted);
                }

                .total-row {
                    margin-top: 0.25rem;
                    border-top: 1px dashed var(--border-color);
                    padding-top: 0.5rem;
                }

                .summary-label-total {
                    font-size: 1rem;
                    font-weight: 700;
                    color: var(--text-main);
                }

                .summary-value-total {
                    font-size: 1.25rem;
                    font-weight: 800;
                    color: var(--primary);
                }

                .payment-section {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }

                .section-label {
                    font-size: 0.85rem;
                    font-weight: 600;
                    color: var(--text-muted);
                }

                .payment-options {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 0.5rem;
                }

                .payment-opt-btn {
                    padding: 0.6rem 0.25rem;
                    border: 1.5px solid var(--border-color);
                    border-radius: var(--radius-md);
                    background-color: var(--bg-app);
                    color: var(--text-muted);
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 0.4rem;
                    font-size: 0.75rem;
                    font-weight: 600;
                    transition: all 0.2s ease;
                }
                .payment-opt-btn:hover {
                    border-color: var(--primary-border);
                    color: var(--primary);
                }
                .payment-opt-btn.active {
                    background-color: var(--primary-light);
                    border-color: var(--primary);
                    color: var(--primary);
                    box-shadow: var(--shadow-sm);
                }

                .btn-confirm-checkout {
                    width: 100%;
                    padding: 0.9rem;
                    background-color: var(--success);
                    color: var(--text-inverse);
                    border-radius: var(--radius-md);
                    font-size: 0.95rem;
                    font-weight: 700;
                    box-shadow: 0 4px 10px rgba(16, 185, 129, 0.2);
                    gap: 0.5rem;
                    margin-top: 0.5rem;
                }
                .btn-confirm-checkout:hover:not(:disabled) {
                    background-color: var(--success-hover);
                    transform: translateY(-1px);
                    box-shadow: 0 6px 14px rgba(16, 185, 129, 0.3);
                }
                .btn-confirm-checkout:active:not(:disabled) {
                    transform: translateY(1px);
                }
                .btn-confirm-checkout:disabled {
                    background-color: var(--border-color);
                    color: var(--text-muted);
                    box-shadow: none;
                    cursor: not-allowed;
                }
            `}</style>
        </div>
    );
};

export default Carrito;
