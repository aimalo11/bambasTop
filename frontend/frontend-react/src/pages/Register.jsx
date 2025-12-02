export default function Register() {
  return (
    <div style={{ padding: "20px" }}>
      <h1>Registro</h1>

      <form>
        <label>Email</label><br />
        <input type="email" /><br /><br />

        <label>Contraseña</label><br />
        <input type="password" /><br /><br />

        <button>Crear cuenta</button>
      </form>
    </div>
  );
}
