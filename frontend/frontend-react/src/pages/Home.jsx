export default function Home() {
  const productos = [
    { id: 1, nombre: "NIKE VAPORMAX", precio: "80€" },
    { id: 2, nombre: "ADIDAS SAMBA", precio: "100€" },
    { id: 3, nombre: "NIKE TN PLUS", precio: "180€" }
  ];

  return (
    <div style={{ padding: "20px" }}>
      <h1>Productos destacados</h1>

      <div style={{ display: "flex", gap: "20px" }}>
        {productos.map((p) => (
          <div key={p.id} style={{ border: "1px solid #ccc", padding: "10px" }}>
            <h3>{p.nombre}</h3>
            <p>Precio: {p.precio}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
