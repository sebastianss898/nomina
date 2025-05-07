import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import RegistroEmpleado from "./pages/RegistroEmpleado";
import RegistroNomina from "./pages/RegistroNomina";
import HistorialNominas from "./pages/HistorialNominas";
import Register from './pages/Register';
import Init from "./pages/Init";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/Init" element={<Init />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/empleado/nuevo" element={<RegistroEmpleado />} />
        <Route path="/nomina/nueva" element={<RegistroNomina />} />
        <Route path="/nominas/historial" element={<HistorialNominas />} />
        <Route path="/register" element={<Register />} />
        <Route path="/mo" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

