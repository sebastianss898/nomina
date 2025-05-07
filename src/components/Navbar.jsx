import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-blue-600 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">
        Fácil nómina
        </Link>

        <div className="flex space-x-4">
          <Link
            to="/"
            className="hover:bg-blue-500 px-3 py-2 rounded transition"
          >
            Login
          </Link>
          <Link
            to="/Init"
            className="hover:bg-blue-500 px-3 py-2 rounded transition"
          >
            Inicio
          </Link>

          <Link
            to="/dashboard"
            className="hover:bg-blue-500 px-3 py-2 rounded transition"
          >
            lista de empleados
          </Link>
          <Link
            to="/nominas/historial"
            className="hover:bg-blue-500 px-3 py-2 rounded transition"
          >
            historial de nomina
          </Link>
          <Link
            to="/nomina/nueva"
            className="hover:bg-blue-500 px-3 py-2 rounded transition"
          >
            Crear nomina
          </Link>
        </div>
      </div>
    </nav>
  );
}
