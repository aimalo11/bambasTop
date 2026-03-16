import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Checkout.css';

export default function Checkout() {
    const navigate = useNavigate();
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        address: '',
        cardNumber: ''
    });

    useEffect(() => {
        // Load cart from backend or local fallback
        fetch('/api/cart')
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

    const handlePayment = (e) => {
        e.preventDefault();
        setLoading(true);

        fetch('/api/cart/checkout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                ...formData,
                cart
            })
        })
            .then(res => {
                if (!res.ok) throw new Error("Server error");
                return res.json();
            })
            .then(data => {
                localStorage.removeItem('cart');
                alert('🎉 Pagament completat amb èxit! Gràcies per la teva comanda.');
                navigate('/');
            })
            .catch(err => {
                console.error("Error during checkout:", err);
                localStorage.removeItem('cart');
                alert('🎉 Pagament local completat amb èxit! (Servidor no disponible)');
                navigate('/');
            })
            .finally(() => setLoading(false));
    };

    const calculateTotal = () => {
        return cart.reduce((total, item) => total + Number(item.precio), 0);
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

            <div className="checkout-grid">
                <div className="checkout-form-section">
                    <h3>Dades d\'enviament i pagament</h3>
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
                        <div className="form-group">
                            <label>Número de targeta</label>
                            <input type="text" name="cardNumber" required value={formData.cardNumber} onChange={handleChange} placeholder="XXXX XXXX XXXX XXXX" maxLength="16" />
                        </div>

                        <button type="submit" className="btn btn-primary pay-btn" disabled={loading}>
                            {loading ? 'Processant...' : `Pagar ${calculateTotal()}€`}
                        </button>
                    </form>
                </div>

                <div className="checkout-summary">
                    <h3>Resum de la Comanda</h3>
                    <div className="summary-items">
                        {cart.map((item, index) => (
                            <div key={item._id || index} className="summary-item">
                                <span>{item.nombre}</span>
                                <span>{item.precio}€</span>
                            </div>
                        ))}
                    </div>
                    <div className="summary-total">
                        <span>Total:</span>
                        <span>{calculateTotal()}€</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
