export default function Register() {
  return (
    <div style={{ 
      maxWidth: "400px", 
      margin: "40px auto", 
      padding: "20px", 
      border: "1px solid #ccc", 
      borderRadius: "8px" 
    }}>
      <h2 style={{ textAlign: "center" }}>Registro</h2>

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

        <div style={{ marginBottom: "15px" }}>
          <label>Repetir contraseña</label><br />
          <input 
            type="password" 
            style={{ width: "100%", padding: "8px" }} 
          />
        </div>

        <button 
          style={{ 
            width: "100%", 
            padding: "10px", 
            backgroundColor: "#2196F3", 
            color: "white", 
            border: "none" 
          }}
        >
          Registrarse
        </button>
      </form>
    </div>
  );
}

