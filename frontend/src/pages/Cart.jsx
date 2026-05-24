import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Cart.css';

export default function Cart() {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    fetch('/api/cart', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then((res) => {
        if (!res.ok) throw new Error('No s\'ha pogut carregar la cistella');
        return res.json();
      })
      .then((data) => setCart(data.items || []))
      .catch(() => {
        const local = localStorage.getItem('cart');
        setCart(local ? JSON.parse(local) : []);
      })
      .finally(() => setLoading(false));
  }, []);

  const total = useMemo(
    () =>
      cart.reduce(
        (acc, item) => acc + Number(item.precio) * Number(item.quantity || 1),
        0
      ),
    [cart]
  );

  const handleRemoveItem = (itemId) => {
    const token = localStorage.getItem('accessToken');
    fetch(`/api/cart/${itemId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => {
        if (!res.ok) throw new Error("Server error");
        return res.json();
      })
      .then(data => {
        if (data && data.items) setCart(data.items);
      })
      .catch(err => {
        console.error("Local fallback removal:", err);
        const newCart = cart.filter(item => item._id !== itemId);
        setCart(newCart);
        localStorage.setItem('cart', JSON.stringify(newCart));
      });
  };

  if (loading) return <div className="cart-page-container"><p>Carregant cistella...</p></div>;

  return (
    <div className="cart-page-container fade-in">
      <h1 className="cart-page-title">La Teva Cistella</h1>
      
      {cart.length === 0 ? (
        <div className="empty-cart-page">
          <span className="empty-cart-page-icon">🛒</span>
          <p>No tens cap producte a la teva cistella actualment.</p>
          <button onClick={() => navigate('/')} className="btn btn-primary">
            Tornar a la botiga
          </button>
        </div>
      ) : (
        <div className="cart-page-grid">
          <div className="cart-page-list">
            {cart.map((item, index) => (
              <div key={item._id || `${item.productoId}-${index}`} className="cart-page-item">
                <div className="cart-item-details">
                  <div className="cart-item-thumb">👟</div>
                  <div className="cart-item-main-info">
                    <span className="cart-item-title-text">{item.nombre}</span>
                    <span className="cart-item-price-calc">
                      {Number(item.precio).toFixed(2)}€ x {item.quantity || 1}
                    </span>
                  </div>
                </div>
                
                <button
                  onClick={() => handleRemoveItem(item._id)}
                  className="remove-btn"
                  title="Eliminar del carrito"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
          
          <div className="cart-summary-card">
            <h3 className="summary-heading">Resum comanda</h3>
            
            <div className="summary-row">
              <span>Subtotal</span>
              <span>{total.toFixed(2)}€</span>
            </div>
            
            <div className="summary-row">
              <span>Enviament</span>
              <span style={{ color: 'var(--success-color)' }}>Gratuït</span>
            </div>
            
            <div className="summary-total-row">
              <span>Total</span>
              <span>{total.toFixed(2)}€</span>
            </div>
            
            <button 
              onClick={() => navigate('/checkout')} 
              className="btn btn-primary cart-checkout-btn"
            >
              Continuar al Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
