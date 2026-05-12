import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import './Checkout.css';

export default function Checkout() {
    const navigate = useNavigate();
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        address: ''
    });
    const [error, setError] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        fetch('/api/cart', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(res => {
                if (!res.ok) throw new Error("Server down");
                return res.json();
            })
            .then(data => {
                if (data && data.items) setCart(data.items);
            })
            .catch(err => {
                console.warn("Backend checkout fetch failed, using local:", err);
                const local = localStorage.getItem('cart');
                if (local) setCart(JSON.parse(local));
            });
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePayment = async (e) => {
        e.preventDefault();
        setError('');

        if (!formData.name || !formData.email || !formData.address) {
            setError('Omple tots els camps obligatoris.');
            return;
        }
        if (cart.length === 0) {
            setError('La cistella no pot estar buida.');
            return;
        }

        setLoading(true);
        const token = localStorage.getItem('accessToken');

        try {
            const orderResponse = await fetch('/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    shipping: formData,
                    products: cart
                })
            });

            if (!orderResponse.ok) {
                const data = await orderResponse.json().catch(() => ({}));
                throw new Error(data.message || 'No s\'ha pogut crear la comanda');
            }
            const orderData = await orderResponse.json();

            const sessionResponse = await fetch('/api/checkout/create-session', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    shipping: formData,
                    products: cart,
                    orderId: orderData?.order?._id
                })
            });

            const sessionData = await sessionResponse.json().catch(() => ({}));
            if (!sessionResponse.ok || !sessionData.sessionId) {
                throw new Error(sessionData.message || 'No s\'ha pogut iniciar Stripe Checkout');
            }

            const stripe = await loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);
            if (!stripe) throw new Error('No s\'ha pogut carregar Stripe');

            const result = await stripe.redirectToCheckout({ sessionId: sessionData.sessionId });
            if (result?.error) {
                throw new Error(result.error.message || 'Error redirigint a Stripe');
            }
        } catch (err) {
            setError(err.message || 'Error en el pagament');
        } finally {
            setLoading(false);
        }
    };

    const calculateTotal = () => {
        return cart.reduce((total, item) => total + (Number(item.precio) * Number(item.quantity || 1)), 0);
    };

    if (cart.length === 0) {
        return (
            <div className="checkout-container">
                <h2>No tens cap producte a la cistella</h2>
                <button className="btn btn-secondary" onClick={() => navigate('/')}>Tornar a la botiga</button>
            </div>
        );
    }

    return (
        <div className="checkout-container fade-in">
            <h1 className="checkout-title">Finalitzar Compra</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}

            <div className="checkout-grid">
                <div className="checkout-form-section">
                    <h3>Dades d\'enviament</h3>
                    <form onSubmit={handlePayment} className="checkout-form">
                        <div className="form-group">
                            <label>Nom complet</label>
                            <input type="text" name="name" required value={formData.name} onChange={handleChange} placeholder="El teu nom" />
                        </div>
                        <div className="form-group">
                            <label>Correu electrònic</label>
                            <input type="email" name="email" required value={formData.email} onChange={handleChange} placeholder="correu@exemple.com" />
                        </div>
                        <div className="form-group">
                            <label>Adreça d\'enviament</label>
                            <input type="text" name="address" required value={formData.address} onChange={handleChange} placeholder="Carrer, Número, Ciutat" />
                        </div>
                        <button type="submit" className="btn btn-primary pay-btn" disabled={loading}>
                            {loading ? 'Processant...' : `Anar a Stripe (${calculateTotal().toFixed(2)}€)`}
                        </button>
                    </form>
                </div>

                <div className="checkout-summary">
                    <h3>Resum de la Comanda</h3>
                    <div className="summary-items">
                        {cart.map((item, index) => (
                            <div key={item._id || index} className="summary-item">
                                <span>{item.nombre} x {item.quantity || 1}</span>
                                <span>{(Number(item.precio) * Number(item.quantity || 1)).toFixed(2)}€</span>
                            </div>
                        ))}
                    </div>
                    <div className="summary-total">
                        <span>Total:</span>
                        <span>{calculateTotal().toFixed(2)}€</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
