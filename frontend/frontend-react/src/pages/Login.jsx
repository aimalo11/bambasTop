export default function Login() {
  return (
    <div style={{ 
      maxWidth: "400px", 
      margin: "40px auto", 
      padding: "20px", 
      border: "1px solid #ccc", 
      borderRadius: "8px" 
    }}>
      <h2 style={{ textAlign: "center" }}>Login</h2>

      <form>
        <div style={{ marginBottom: "15px" }}>
          <label>Email</label><br />
          <input 
            type="email" 
            style={{ width: "100%", padding: "8px" }} 
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Contraseña</label><br />
          <input 
            type="password" 
            style={{ width: "100%", padding: "8px" }} 
          />
        </div>

        <button 
          style={{ 
            width: "100%", 
            padding: "10px", 
            backgroundColor: "#4CAF50", 
            color: "white", 
            border: "none" 
          }}
        >
          Entrar
        </button>
      </form>
    </div>
  );
}
