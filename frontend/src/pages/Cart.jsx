import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

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

  if (loading) return <p>Carregant cistella...</p>;

  return (
    <div>
      <h1>La teva cistella</h1>
      {cart.length === 0 ? (
        <div>
          <p>No tens productes a la cistella.</p>
          <button onClick={() => navigate('/')}>Tornar a la botiga</button>
        </div>
      ) : (
        <div>
          {cart.map((item, index) => (
            <div key={item._id || `${item.productoId}-${index}`} style={{ marginBottom: '12px' }}>
              <strong>{item.nombre}</strong> - {item.precio} EUR x {item.quantity || 1}
            </div>
          ))}
          <h3>Total: {total.toFixed(2)} EUR</h3>
          <button onClick={() => navigate('/checkout')}>Continuar al checkout</button>
        </div>
      )}
    </div>
  );
}
