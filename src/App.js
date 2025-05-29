import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import ListEmpleados from "./pages/ListEmpleados";
import RegistroEmpleado from "./pages/RegistroEmpleado";
import RegistroNomina from "./pages/RegistroNomina";
import HistorialNominas from "./pages/HistorialNominas";
import Register from './pages/Register';
import Init from "./pages/Init";
import { AutoLogoutProvider } from "./components/AutoLogoutProvider";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <AutoLogoutProvider>
        <Routes>
          {/* Rutas públicas */}
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Rutas protegidas */}
          <Route
            path="/init"
            element={
              <ProtectedRoute>
                <Init />
              </ProtectedRoute>
            }
          />
          <Route
            path="/lista"
            element={
              <ProtectedRoute>
                <ListEmpleados />
              </ProtectedRoute>
            }
          />
          <Route
            path="/empleado/nuevo"
            element={
              <ProtectedRoute>
                <RegistroEmpleado />
              </ProtectedRoute>
            }
          />
          <Route
            path="/nomina/nueva"
            element={
              <ProtectedRoute>
                <RegistroNomina />
              </ProtectedRoute>
            }
          />
          <Route
            path="/nominas/historial"
            element={
              <ProtectedRoute>
                <HistorialNominas />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AutoLogoutProvider>
    </BrowserRouter>
  );
}

export default App;
