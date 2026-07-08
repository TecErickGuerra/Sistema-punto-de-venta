import { useEffect, useState } from 'react';
import { getProductos } from '../services/api';

const Catalogo = ({ onAgregarAlCarrito }) => {
    const [productos, setProductos] = useState([]);
    const [busqueda, setBusqueda] = useState('');
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        cargarProductos();
    }, []);

    const cargarProductos = async () => {
        setCargando(true);
        try {
            const productosObtenidos = await getProductos();
            setProductos(productosObtenidos);
        } catch (error) {
            console.error('Error al cargar productos', error);
        } finally {
            setCargando(false);
        }
    };

    // Filtrar productos
    const productosFiltrados = productos.filter(producto =>
        producto.nombre.toLowerCase().includes(busqueda.toLowerCase())
    );

    return (
        <div className="panel-card fade-in">
            <div className="catalogo-header">
                <h2>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                        <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
                        <line x1="12" y1="22.08" x2="12" y2="12"/>
                    </svg>
                    Catálogo de Productos
                </h2>
                
                {/* Botón de Refrescar */}
                <button className="btn-refresh" onClick={cargarProductos} title="Recargar productos">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/>
                    </svg>
                </button>
            </div>

            {/* Barra de Búsqueda */}
            <div className="search-container" style={{ marginBottom: '1.5rem' }}>
                <div className="search-icon-wrapper">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                    </svg>
                </div>
                <input
                    type="text"
                    className="search-input"
                    placeholder="Buscar producto por nombre..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                />
            </div>

            {/* Catálogo Content */}
            {cargando ? (
                <div className="loading-state">
                    <div className="spinner"></div>
                    <p>Cargando productos...</p>
                </div>
            ) : productosFiltrados.length === 0 ? (
                <div className="empty-state">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--text-muted)' }}>
                        <circle cx="12" cy="12" r="10"/><line x1="8" y1="12" x2="16" y2="12"/>
                    </svg>
                    <p>No se encontraron productos coincidentes.</p>
                </div>
            ) : (
                <div className="products-grid">
                    {productosFiltrados.map(producto => {
                        const stock = Number(producto.stock);
                        let stockBadgeClass = 'badge-success';
                        let stockLabel = `Stock: ${stock}`;
                        
                        if (stock <= 0) {
                            stockBadgeClass = 'badge-danger';
                            stockLabel = 'Agotado';
                        } else if (stock <= 5) {
                            stockBadgeClass = 'badge-warning';
                            stockLabel = `Stock bajo: ${stock}`;
                        }

                        return (
                            <div 
                                key={producto.id} 
                                className={`product-card ${stock <= 0 ? 'out-of-stock' : ''}`}
                                onClick={() => stock > 0 && onAgregarAlCarrito(producto)}
                            >
                                <div className="product-info-wrapper">
                                    <div className="product-icon-box">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
                                            <line x1="7" y1="7" x2="7.01" y2="7"/>
                                        </svg>
                                    </div>
                                    <div className="product-details">
                                        <h3 className="product-name">{producto.nombre}</h3>
                                        <div className="product-meta">
                                            <span className={`badge ${stockBadgeClass}`}>{stockLabel}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="product-footer">
                                    <div className="product-price">${Number(producto.precio).toFixed(2)}</div>
                                    <button 
                                        className="btn-add-item" 
                                        disabled={stock <= 0}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onAgregarAlCarrito(producto);
                                        }}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Estilos locales para Catalogo */}
            <style>{`
                .catalogo-header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin-bottom: 1.25rem;
                    border-bottom: 1px solid var(--border-color);
                    padding-bottom: 0.75rem;
                }
                .catalogo-header h2 {
                    font-size: 1.25rem;
                    margin: 0;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    color: var(--text-main);
                }
                .btn-refresh {
                    padding: 0.5rem;
                    border-radius: var(--radius-sm);
                    color: var(--text-muted);
                }
                .btn-refresh:hover {
                    color: var(--primary);
                    background-color: var(--primary-light);
                }
                
                .loading-state, .empty-state {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: 3rem 1.5rem;
                    text-align: center;
                    color: var(--text-muted);
                    gap: 0.75rem;
                }
                .spinner {
                    width: 32px;
                    height: 32px;
                    border: 3px solid var(--border-color);
                    border-top-color: var(--primary);
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                }
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }

                .products-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
                    gap: 1rem;
                }
                
                .product-card {
                    background-color: var(--bg-app);
                    border: 1px solid var(--border-color);
                    border-radius: var(--radius-md);
                    padding: 1rem;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    gap: 1rem;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }
                .product-card:hover {
                    border-color: var(--primary-border);
                    box-shadow: var(--shadow-md);
                    transform: translateY(-2px);
                    background-color: var(--bg-card);
                }
                .product-card.out-of-stock {
                    opacity: 0.6;
                    cursor: not-allowed;
                }
                .product-card.out-of-stock:hover {
                    transform: none;
                    box-shadow: none;
                    border-color: var(--border-color);
                    background-color: var(--bg-app);
                }
                
                .product-info-wrapper {
                    display: flex;
                    gap: 0.75rem;
                }
                .product-icon-box {
                    width: 36px;
                    height: 36px;
                    border-radius: var(--radius-sm);
                    background-color: var(--bg-card);
                    border: 1px solid var(--border-color);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: var(--text-muted);
                    flex-shrink: 0;
                }
                .product-card:hover .product-icon-box {
                    background-color: var(--primary-light);
                    color: var(--primary);
                    border-color: var(--primary-border);
                }
                .product-details {
                    display: flex;
                    flex-direction: column;
                    gap: 0.25rem;
                }
                .product-name {
                    font-size: 0.95rem;
                    font-weight: 600;
                    margin: 0;
                    color: var(--text-main);
                    line-height: 1.25;
                }
                .product-meta {
                    display: flex;
                }
                
                .product-footer {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    border-top: 1px dashed var(--border-color);
                    padding-top: 0.75rem;
                }
                .product-price {
                    font-size: 1.15rem;
                    font-weight: 700;
                    color: var(--primary);
                }
                .btn-add-item {
                    width: 32px;
                    height: 32px;
                    border-radius: var(--radius-full);
                    background-color: var(--primary);
                    color: var(--text-inverse);
                }
                .btn-add-item:hover:not(:disabled) {
                    background-color: var(--primary-hover);
                    transform: scale(1.05);
                }
                .btn-add-item:disabled {
                    background-color: var(--border-color);
                    color: var(--text-muted);
                    cursor: not-allowed;
                }
            `}</style>
        </div>
    );
};

export default Catalogo;