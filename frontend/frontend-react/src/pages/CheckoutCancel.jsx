import { useNavigate } from 'react-router-dom';

export default function CheckoutCancel() {
  const navigate = useNavigate();

  return (
    <div>
      <h1>Pagament cancel-lat</h1>
      <p>No s'ha fet cap carrec. Pots tornar-ho a intentar quan vulguis.</p>
      <button onClick={() => navigate('/checkout')}>Tornar al checkout</button>
    </div>
  );
}
