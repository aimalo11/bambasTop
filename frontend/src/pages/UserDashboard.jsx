import { useState, useEffect } from 'react';
import './UserDashboard.css';

export default function UserDashboard() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const loggedInUser = localStorage.getItem('user');
        if (loggedInUser) setUser(JSON.parse(loggedInUser));

        const token = localStorage.getItem('accessToken');
        fetch('/api/orders/me', {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => {
                setOrders(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    if (loading) return <div className="dashboard-container">Carregant...</div>;

    return (
        <div className="dashboard-container fade-in">
            <h1>El meu Panell</h1>
            
            <section className="profile-section">
                <h2>El meu Perfil</h2>
                <div className="profile-card">
                    <p><strong>Nom:</strong> {user?.name}</p>
                    <p><strong>Email:</strong> {user?.email}</p>
                    <p><strong>Rol:</strong> {user?.role}</p>
                </div>
            </section>

            <section className="orders-section">
                <h2>Les meves Comandes</h2>
                {orders.length === 0 ? (
                    <p>Encara no has realitzat cap comanda.</p>
                ) : (
                    <div className="orders-list">
                        {orders.map(order => (
                            <div key={order._id} className="order-card">
                                <div className="order-header">
                                    <span>ID: {order._id}</span>
                                    <span className={`status-badge ${order.status}`}>{order.status}</span>
                                </div>
                                <div className="order-details">
                                    <p>Data: {new Date(order.createdAt).toLocaleDateString()}</p>
                                    <p>Total: {order.total.toFixed(2)}€</p>
                                </div>
                                <div className="order-products">
                                    {order.products.map((p, i) => (
                                        <div key={i} className="mini-product">
                                            {p.name} (x{p.quantity})
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}
