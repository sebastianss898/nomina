import { useEffect, useRef, useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

export const AutoLogoutProvider = ({ children }) => {
  const navigate = useNavigate();
  const logoutTimer = useRef(null);
  const warningTimer = useRef(null);
  const [showWarning, setShowWarning] = useState(false);

  const INACTIVITY_LIMIT = 20 * 60 * 1000; // 30 minutos
  const WARNING_TIME = 19 * 60 * 1000; // A los 29 minutos mostrar advertencia

  const logout = async () => {
    clearTimeout(logoutTimer.current);
    clearTimeout(warningTimer.current);
    setShowWarning(false);
    await signOut(auth);
    navigate("/", { replace: true });
  };

  const resetTimer = () => {
    clearTimeout(logoutTimer.current);
    clearTimeout(warningTimer.current);
    setShowWarning(false);

    warningTimer.current = setTimeout(() => {
      setShowWarning(true);
    }, WARNING_TIME);

    logoutTimer.current = setTimeout(logout, INACTIVITY_LIMIT);
  };

  useEffect(() => {
    const events = ["keydown"/*"mousemove",  "mousedown", "touchstart", "scroll"*/];

    events.forEach((event) => {
      window.addEventListener(event, resetTimer);
    });

    resetTimer(); // iniciar timers al montar

    return () => {
      clearTimeout(logoutTimer.current);
      clearTimeout(warningTimer.current);
      events.forEach((event) => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, []);

  return (
    <>
      {showWarning && (
        <div className="fixed bottom-4 right-4 bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-3 rounded shadow-lg z-50">
          <strong className="font-bold">Atención:</strong>
          <span className="block sm:inline ml-1">
            Tu sesión se cerrará automáticamente por inactividad en 1 minuto.
          </span>
        </div>
      )}
      {children}
    </>
  );
};
