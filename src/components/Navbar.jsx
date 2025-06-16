import { Link, useNavigate } from "react-router-dom";
import logo from "../img/logo.png";
import { getAuth, signOut } from "firebase/auth";

export default function Navbar() {
  const navigate = useNavigate();
  const auth = getAuth();

  const handleLogout = async () => {
    try {
      // Cierra sesión en Firebase
      await signOut(auth);

      // Limpia cualquier otro dato local si lo usas
      localStorage.removeItem("usuario"); // Ajusta si usas otra clave
      sessionStorage.clear();

      // Redirige al login
      navigate("/");
    } catch (error) {
      console.error("Error cerrando sesión:", error);
      alert("Hubo un error al cerrar sesión. Intenta nuevamente.");
    }
  };

  return (
    <nav className="bg-[#E0BBE4] text-[#333] p-4 shadow-sm">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/Init" className="flex items-center space-x-3">
          <div className="h-10 w-10">
            <img src={logo} alt="Logo" className="w-full h-full object-contain" />
          </div>
          <span className="text-xl font-semibold">Fácil Nómina</span>
        </Link>

        <div className="flex space-x-3 text-sm font-medium">
          <Link to="/" className="px-3 py-2 rounded hover:bg-[#D3CCE3] transition duration-200">
            Login
          </Link>
          <Link to="/Init" className="px-3 py-2 rounded hover:bg-[#D3CCE3] transition duration-200">
            Inicio
          </Link>
          <Link to="/lista" className="px-3 py-2 rounded hover:bg-[#D3CCE3] transition duration-200">
            Lista de empleados
          </Link>
          <Link to="/nominas/historial" className="px-3 py-2 rounded hover:bg-[#D3CCE3] transition duration-200">
            Historial de nómina
          </Link>
          <Link to="/nomina/nueva" className="px-3 py-2 rounded hover:bg-[#D3CCE3] transition duration-200">
            Crear nómina
          </Link>

          {/* Botón Logout */}
          <button
            onClick={handleLogout}
            className="px-3 py-2 rounded hover:bg-red-200 transition duration-200 text-red-700 font-semibold"
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    </nav>
  );
}
