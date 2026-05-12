import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error en el login');
      }

      // Guardar datos en localStorage
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      localStorage.setItem('user', JSON.stringify(data.user));

      // Redirigir al inicio
      window.location.href = '/'; // Recargamos para que App.jsx detecte los cambios
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      maxWidth: "400px", 
      margin: "40px auto", 
      padding: "20px", 
      border: "1px solid #ccc", 
      borderRadius: "8px" 
    }}>
      <h2 style={{ textAlign: "center" }}>Login</h2>

      {error && <div style={{ color: 'red', marginBottom: '15px', textAlign: 'center' }}>{error}</div>}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "15px" }}>
          <label>Email</label><br />
          <input 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: "100%", padding: "8px", boxSizing: "border-box" }} 
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Contraseña</label><br />
          <input 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: "100%", padding: "8px", boxSizing: "border-box" }} 
          />
        </div>

        <button 
          type="submit"
          disabled={loading}
          style={{ 
            width: "100%", 
            padding: "10px", 
            backgroundColor: loading ? "#ccc" : "#4CAF50", 
            color: "white", 
            border: "none",
            cursor: loading ? "not-allowed" : "pointer"
          }}
        >
          {loading ? 'Entrant...' : 'Entrar'}
        </button>
      </form>
    </div>
  );
}
