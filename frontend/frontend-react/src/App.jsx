import { useState, useEffect } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";

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
    <div>
      <nav style={{ 
        padding: "15px", 
        borderBottom: "1px solid #ddd", 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center" 
      }}>
        <div style={{ display: "flex", gap: "10px" }}>
          <Link to="/">Home</Link>
          <Link to="/cart">Cart</Link>
        </div>

        <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
          {user ? (
            <>
              {user.role === 'admin' && (
                <Link to="/admin" style={{ color: "#2196F3", fontWeight: "bold" }}>Admin</Link>
              )}
              <Link to="/dashboard">El meu compte</Link>
              <span style={{ fontWeight: "bold", color: "#4CAF50" }}>Hola, {user.name}</span>
              <button 
                onClick={handleLogout}
                style={{
                  background: "#f44336",
                  color: "white",
                  border: "none",
                  padding: "5px 10px",
                  borderRadius: "4px",
                  cursor: "pointer"
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </div>
      </nav>

      <div style={{ padding: "20px" }}>
        <Outlet />
      </div>
    </div>
  );
}
