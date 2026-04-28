import { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import './AdminDashboard.css';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

export default function AdminDashboard() {
    const [stats, setStats] = useState({ orders: [], users: [] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        
        Promise.all([
            fetch('/api/orders/all', { headers: { Authorization: `Bearer ${token}` } }).then(res => res.json()),
            fetch('/api/users', { headers: { Authorization: `Bearer ${token}` } }).then(res => res.json())
        ])
        .then(([ordersData, usersData]) => {
            setStats({ 
                orders: Array.isArray(ordersData) ? ordersData : [], 
                users: usersData.status === 'success' ? usersData.data : [] 
            });
            setLoading(false);
        })
        .catch(err => {
            console.error(err);
            setLoading(false);
        });
    }, []);

    if (loading) return <div className="admin-container">Carregant dades mestres...</div>;

    const totalSales = stats.orders.reduce((sum, o) => o.status === 'paid' ? sum + o.total : sum, 0);
    
    // Preparar dades pel gràfic de vendes per dia
    const salesByDay = stats.orders.reduce((acc, o) => {
        const date = new Date(o.createdAt).toLocaleDateString();
        acc[date] = (acc[date] || 0) + (o.status === 'paid' ? o.total : 0);
        return acc;
    }, {});

    const chartData = {
        labels: Object.keys(salesByDay),
        datasets: [
            {
                label: 'Vendes (€)',
                data: Object.values(salesByDay),
                backgroundColor: 'rgba(76, 175, 80, 0.6)',
            },
        ],
    };

    return (
        <div className="admin-container fade-in">
            <h1>Panell d\'Administració</h1>

            <div className="stats-grid">
                <div className="stat-card">
                    <h3>Total Usuaris</h3>
                    <p className="stat-value">{stats.users.length}</p>
                </div>
                <div className="stat-card">
                    <h3>Total Comandes</h3>
                    <p className="stat-value">{stats.orders.length}</p>
                </div>
                <div className="stat-card">
                    <h3>Vendes Totals</h3>
                    <p className="stat-value">{totalSales.toFixed(2)}€</p>
                </div>
            </div>

            <div className="chart-section">
                <h2>Rendiment de Vendes</h2>
                <div className="chart-wrapper">
                    <Bar data={chartData} options={{ responsive: true, maintainAspectRatio: false }} />
                </div>
            </div>

            <div className="tables-grid">
                <section className="table-section">
                    <h2>Últims Usuaris</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Nom</th>
                                <th>Email</th>
                                <th>Rol</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stats.users.slice(0, 5).map(u => (
                                <tr key={u._id}>
                                    <td>{u.name}</td>
                                    <td>{u.email}</td>
                                    <td>{u.role}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </section>

                <section className="table-section">
                    <h2>Últimes Comandes</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Usuari</th>
                                <th>Estat</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stats.orders.slice(0, 5).map(o => (
                                <tr key={o._id}>
                                    <td>{o._id.slice(-6)}</td>
                                    <td>{o.user?.name || 'Desconegut'}</td>
                                    <td><span className={`status-badge ${o.status}`}>{o.status}</span></td>
                                    <td>{o.total.toFixed(2)}€</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </section>
            </div>
        </div>
    );
}
