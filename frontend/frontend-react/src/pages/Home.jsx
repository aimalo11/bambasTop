import { useState, useEffect } from 'react';
import './Home.css';
import ProductFilter from '../components/ProductFilter';
import { Link, useNavigate } from 'react-router-dom';

export default function Home() {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({});

  useEffect(() => {
    fetch('/api/cart')
      .then(res => {
        if (!res.ok) throw new Error("Server down");
        return res.json();
      })
      .then(data => {
        if (data && data.items) setCart(data.items);
      })
      .catch(err => {
        console.error("Error loading cart, trying localStorage:", err);
        const local = localStorage.getItem('cart');
        if (local) setCart(JSON.parse(local));
      });
  }, []);

  const DEFAULT_PRODUCTS = [
    { _id: '1', name: 'Nike React Vision Black/Blue', price: 160, category: 'Running', image: 'nike-react-vision.jpg', description: 'Designed to help reduce injury and keep you on the run.', sku: 'NKE-REA', stock: 50 },
    { _id: '2', name: 'Nike Air Max Plus TN Gradient Blue', price: 180, category: 'Casual', image: 'nike-tn.jpg', description: 'The Nike Air Max Plus TN offers a Tuned Air experience.', sku: 'NKE-TNP', stock: 30 },
    { _id: '3', name: 'Nike Air Force 1 Custom Drip', price: 120, category: 'Casual', image: 'custom-af1.jpg', description: 'The radiance lives on in the Nike Air Force 1.', sku: 'NKE-AF1', stock: 100 }
  ];

  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.name) params.append('name', filters.name);
    if (filters.minPrice) params.append('minPrice', filters.minPrice);
    if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);

    fetch(`/api/products?${params.toString()}`)
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success' && data.data.length > 0) {
          setProducts(data.data);
        } else {
          // Fallback to local filter if backend returns empty or error
          handleLocalFilter();
        }
      })
      .catch(err => {
        console.error("Error loading products:", err);
        handleLocalFilter();
      });

    function handleLocalFilter() {
      let filtered = [...DEFAULT_PRODUCTS];
      if (filters.name) {
        filtered = filtered.filter(p => p.name.toLowerCase().includes(filters.name.toLowerCase()));
      }
      if (filters.minPrice) {
        filtered = filtered.filter(p => p.price >= Number(filters.minPrice));
      }
      if (filters.maxPrice) {
        filtered = filtered.filter(p => p.price <= Number(filters.maxPrice));
      }
      setProducts(filtered);
    }
  }, [filters]);

  const addToCart = (product) => {
    const item = {
      productoId: product._id,
      nombre: product.name,
      precio: Number(product.price)
    };

    fetch('/api/cart/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item)
    })
      .then(res => {
        if (!res.ok) throw new Error("Server error");
        return res.json();
      })
      .then(data => {
        if (data && data.items) setCart(data.items);
        setIsCartOpen(true);
      })
      .catch(err => {
        console.error("Error adding to cart, using local fallback:", err);
        const newCart = [...cart, { ...item, _id: Date.now().toString() }];
        setCart(newCart);
        localStorage.setItem('cart', JSON.stringify(newCart));
        setIsCartOpen(true);
      });
  };

  const removeFromCart = (itemId) => {
    fetch(`/api/cart/${itemId}`, {
      method: 'DELETE'
    })
      .then(res => {
        if (!res.ok) throw new Error("Server error");
        return res.json();
      })
      .then(data => {
        if (data && data.items) setCart(data.items);
      })
      .catch(err => {
        console.error("Error removing from cart, local fallback:", err);
        const newCart = cart.filter(item => item._id !== itemId);
        setCart(newCart);
        localStorage.setItem('cart', JSON.stringify(newCart));
      });
  };

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  const handleCheckout = () => {
    navigate('/checkout');
    setIsCartOpen(false);
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => {
      return total + Number(item.precio);
    }, 0);
  };

  return (
    <div className="home-container fade-in">
      <h1 className="main-title slide-down">🔥 Top Bambas Exclusivas 🔥</h1>

      <div className="slide-up" style={{ animationDelay: '0.1s' }}>
        <ProductFilter onFilterChange={setFilters} />
      </div>

      <div className="product-grid slide-up" style={{ animationDelay: '0.2s' }}>
        {products.map((p) => (
          <div key={p._id} className="product-card">
            <div>
              {/* Product Image */}
              <div style={{
                height: '180px',
                background: '#f0f0f0',
                borderRadius: '8px',
                marginBottom: '15px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#aaa',
                fontSize: '3rem',
                overflow: 'hidden'
              }}>
                {p.image ? (
                  <img src={p.image.startsWith('http') ? p.image : `/images/${p.image}`} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                ) : (
                  '👟'
                )}
              </div>
              <h3>{p.name}</h3>
              <div className="product-meta">
                {p.category || 'General'}
              </div>
              <p className="product-price">{p.price}€</p>
              {p.description && <p style={{ color: '#aaa', fontSize: '0.85em', marginTop: '10px' }}>{p.description.substring(0, 50)}...</p>}
            </div>

            <div className="product-actions">
              <button onClick={() => addToCart(p)} className="btn btn-primary">
                Afegir
              </button>
              <Link to={`/product/${p._id}`} className="btn btn-secondary">
                Veure
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Cart UI */}
      <div className={`cart-container ${isCartOpen ? 'cart-open' : 'cart-closed'}`}>
        {/* Floating Button / Cart Header */}
        <div onClick={toggleCart} className="cart-header" style={{ cursor: 'pointer' }}>
          <span className="cart-title">
            🛒 {isCartOpen ? 'La teva cistella' : ''} {cart.length > 0 && `(${cart.length})`}
          </span>
          <span style={{ fontSize: '1.5rem' }}>{isCartOpen ? "✕" : "🛒"}</span>
        </div>

        {/* Unfolded Content */}
        <div className="cart-body">
          {cart.length === 0 ? (
            <p className="empty-cart-msg">La cistella està buida.</p>
          ) : (
            <>
              <ul className="cart-list">
                {cart.map((item, index) => (
                  <li key={item._id || index} className="cart-item">
                    <div>
                      <div style={{ fontWeight: 'bold' }}>{item.nombre}</div>
                      <div style={{ color: '#666', fontSize: '0.9em' }}>{item.precio}€</div>
                    </div>
                    <button
                      onClick={() => removeFromCart(item._id)}
                      className="remove-btn"
                      title="Eliminar"
                    >
                      ✕
                    </button>
                  </li>
                ))}
              </ul>
              <div className="cart-total">
                <span>Total</span>
                <span>{calculateTotal()}€</span>
              </div>
              <button
                onClick={handleCheckout}
                className="btn btn-primary"
                style={{ width: '100%', marginTop: '15px', fontWeight: 'bold' }}
              >
                Finalitzar Compra
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
