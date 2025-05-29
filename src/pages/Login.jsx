import { useState } from "react";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/init");
    } catch (error) {
      let errorMessage = "Error al iniciar sesión";
      switch (error.code) {
        case "auth/invalid-email":
          errorMessage = "Email inválido";
          break;
        case "auth/user-disabled":
          errorMessage = "Usuario deshabilitado";
          break;
        case "auth/user-not-found":
          errorMessage = "Usuario no encontrado";
          break;
        case "auth/wrong-password":
          errorMessage = "Contraseña incorrecta";
          break;
        default:
          errorMessage = error.message;
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-pastel-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-6 rounded-lg shadow-soft border border-pastel-dialogBorder">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-pastel-textMain">
            Inicia sesión en tu cuenta
          </h2>
        </div>

        {error && (
          <div className="bg-pastel-error border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="email" className="sr-only">Correo electrónico</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="Correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full px-3 py-2 bg-pastel-inputBg border border-pastel-inputBorder text-pastel-textMain placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-pastel-inputFocus"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Contraseña</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full px-3 py-2 bg-pastel-inputBg border border-pastel-inputBorder text-pastel-textMain placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-pastel-inputFocus"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-pastel-primary focus:ring-pastel-selection border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 text-sm text-pastel-textMain">
                Recuérdame
              </label>
            </div>

            <div className="text-sm">
              <Link to="/forgot-password" className="font-medium text-pastel-textMain hover:text-pastel-selectionBorder">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-pastel-primary hover:bg-pastel-primaryHover focus:outline-none focus:ring-2 focus:ring-pastel-inputFocus ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Procesando...
                </>
              ) : 'Iniciar sesión'}
            </button>
          </div>
        </form>

        <div className="text-center text-sm text-pastel-textSecondary">
          ¿No tienes una cuenta?{" "}
          <Link to="/register" className="font-medium hover:text-pastel-primaryHover">
            Regístrate
          </Link>
        </div>
      </div>
    </div>
  );
}
