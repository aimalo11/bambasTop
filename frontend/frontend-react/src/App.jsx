import { Link, Outlet } from "react-router-dom";

export default function App() {
  return (
    <div>
      <nav style={{ padding: "10px" }}>
        <Link to="/">Home</Link> |{" "}
        <Link to="/login">Login</Link> |{" "}
        <Link to="/register">Register</Link>
      </nav>

      <Outlet />
    </div>
  );
}
