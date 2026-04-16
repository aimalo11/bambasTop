import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      return setError('Les contrasenyes no coincideixen');
    }

    setLoading(true);
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error en el registre');
      }

      alert('Usuari registrat correctament! Ara pots iniciar sessió.');
      navigate('/login');
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
      <h2 style={{ textAlign: "center" }}>Registro</h2>

      {error && <div style={{ color: 'red', marginBottom: '15px', textAlign: 'center' }}>{error}</div>}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "15px" }}>
          <label>Nom</label><br />
          <input 
            type="text" 
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "8px", boxSizing: "border-box" }} 
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Email</label><br />
          <input 
            type="email" 
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "8px", boxSizing: "border-box" }} 
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Contraseña</label><br />
          <input 
            type="password" 
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "8px", boxSizing: "border-box" }} 
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Repetir contraseña</label><br />
          <input 
            type="password" 
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
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
            backgroundColor: loading ? "#ccc" : "#2196F3", 
            color: "white", 
            border: "none",
            cursor: loading ? "not-allowed" : "pointer"
          }}
        >
          {loading ? 'Registrant...' : 'Registrarse'}
        </button>
      </form>
    </div>
  );
}

