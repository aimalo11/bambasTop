import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function CheckoutSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    fetch('/api/cart/clear', {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).catch(() => null);
    localStorage.removeItem('cart');
  }, []);

  return (
    <div>
      <h1>Pagament completat</h1>
      <p>La teva comanda ha estat registrada correctament.</p>
      <button onClick={() => navigate('/')}>Tornar a inici</button>
    </div>
  );
}
