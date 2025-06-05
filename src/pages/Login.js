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
      <div className="max-w-md w-full space-y-8 bg-white p-6 rounded-2xl shadow-soft border border-pastel-dialogBorder">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-pastel-textMain">
            Inicia sesión en tu cuenta
          </h2>
        </div>

        {error && (
          <div
            className="bg-pastel-error border border-red-300 text-red-700 px-4 py-3 rounded-lg text-sm"
            role="alert"
            aria-live="assertive"
          >
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-4">
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
                className="block w-full px-4 py-2 bg-pastel-inputBg border border-pastel-inputBorder text-pastel-textMain placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-pastel-inputFocus"
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
                className="block w-full px-4 py-2 bg-pastel-inputBg border border-pastel-inputBorder text-pastel-textMain placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-pastel-inputFocus"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label htmlFor="remember-me" className="flex items-center text-sm text-pastel-textMain">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-pastel-primary focus:ring-pastel-selection border-gray-300 rounded mr-2"
              />
              Recuérdame
            </label>
            <Link
              to="/forgot-password"
              className="text-sm font-medium text-pastel-textMain hover:text-pastel-selectionBorder"
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full flex justify-center items-center py-2 px-4 rounded-lg text-sm font-medium text-white bg-pastel-primary hover:bg-pastel-primaryHover focus:outline-none focus:ring-2 focus:ring-pastel-inputFocus transition-all duration-200 ${loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Procesando...
              </>
            ) : (
              "Iniciar sesión"
            )}
          </button>
        </form>

        <div className="text-center text-sm text-pastel-textSecondary">
          ¿No tienes una cuenta?{" "}
          <Link
            to="/register"
            className="font-medium text-pastel-primary hover:text-pastel-primaryHover"
          >
            Regístrate
          </Link>
        </div>
      </div>
    </div>
  );
}
