import { Link } from "react-router-dom";
import logo from "../img/logo.png"; // O usa "/logo.png" si está en public

export default function Navbar() {
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
          <Link
            to="/"
            className="px-3 py-2 rounded hover:bg-[#D3CCE3] transition duration-200"
          >
            Login
          </Link>
          <Link
            to="/Init"
            className="px-3 py-2 rounded hover:bg-[#D3CCE3] transition duration-200"
          >
            Inicio
          </Link>
          <Link
            to="/lista"
            className="px-3 py-2 rounded hover:bg-[#D3CCE3] transition duration-200"
          >
            Lista de empleados
          </Link>
          <Link
            to="/nominas/historial"
            className="px-3 py-2 rounded hover:bg-[#D3CCE3] transition duration-200"
          >
            Historial de nómina
          </Link>
          <Link
            to="/nomina/nueva"
            className="px-3 py-2 rounded hover:bg-[#D3CCE3] transition duration-200"
          >
            Crear nómina
          </Link>
        </div>
      </div>
    </nav>
   
  );
}
