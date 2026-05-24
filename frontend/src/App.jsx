import { useState, useEffect } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import "./App.css";

export default function App() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loggedInUser = localStorage.getItem('user');
    if (loggedInUser) {
      setUser(JSON.parse(loggedInUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  return (
    <div className="app-layout">
      <nav className="main-navbar">
        <div className="nav-logo-section">
          <Link to="/" className="nav-logo">
            <span className="logo-icon">👟</span>
            <span className="logo-text">bambas<span className="logo-highlight">Top</span></span>
          </Link>
        </div>

        <div className="nav-links-container">
          <Link to="/" className="nav-link">Inici</Link>
          <Link to="/cart" className="nav-link nav-cart-link">
            Cistella
          </Link>
        </div>

        <div className="nav-user-section">
          {user ? (
            <>
              {user.role === 'admin' && (
                <Link to="/admin" className="nav-link admin-badge">Admin Panel</Link>
              )}
              <Link to="/dashboard" className="nav-link user-profile-link">El meu compte</Link>
              <div className="user-greeting">
                <span className="greeting-text">Hola, </span>
                <span className="user-name">{user.name}</span>
              </div>
              <button 
                onClick={handleLogout}
                className="btn-logout"
              >
                Logout
              </button>
            </>
          ) : (
            <div className="auth-links">
              <Link to="/login" className="nav-link btn-login-nav">Login</Link>
              <Link to="/register" className="btn btn-primary btn-register-nav">Registrar-se</Link>
            </div>
          )}
        </div>
      </nav>

      <main className="main-content">
        <Outlet />
      </main>

      <footer className="main-footer">
        <p>&copy; {new Date().getFullYear()} bambasTop. Tots els drets reservats.</p>
        <p className="footer-tagline">Calçat exclusiu per a tothom, a preus increïbles.</p>
      </footer>
    </div>
  );
}

