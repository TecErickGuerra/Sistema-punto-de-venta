import { useState, useEffect } from 'react';
import { getVentasHoy } from '../services/api';
import './ReporteVentas.css';

const ReporteVentas = () => {
    const [ventas, setVentas] = useState([]);
    const [totalDelDia, setTotalDelDia] = useState(0);

    useEffect(() => {
        cargarVentas();
    }, []);

    const cargarVentas = async () => {
        try {
            const reporte = await getVentasHoy();
            setVentas(reporte.ventas || []);
            setTotalDelDia(reporte.totalDelDia || 0);
        } catch (error) {
            console.error('Error al cargar ventas', error);
        }
    };

    return (
        <div className="reporte-ventas">
            <h2>Reporte de ventas del día</h2>
            <h3>Total acumulado: ${Number(totalDelDia).toFixed(2)}</h3>

            {ventas.length === 0 ? (
                <p>No hay ventas registradas hoy.</p>
            ) : (
                <ul>
                    {ventas.map((venta) => (
                        <li key={venta.id}>
                            <strong>Folio:</strong> {venta.id} -
                            <strong> Hora:</strong> {new Date(venta.fecha).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })} -
                            <strong> Total:</strong> ${Number(venta.total).toFixed(2)} -
                            <strong> Pago:</strong> {venta.metodo_pago}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default ReporteVentas;