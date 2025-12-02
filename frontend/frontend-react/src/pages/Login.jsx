export default function Login() {
  return (
    <div style={{ padding: "20px" }}>
      <h1>Login</h1>

      <form>
        <label>Email</label><br />
        <input type="email" /><br /><br />

        <label>Contraseña</label><br />
        <input type="password" /><br /><br />

        <button>Entrar</button>
      </form>
    </div>
  );
}
