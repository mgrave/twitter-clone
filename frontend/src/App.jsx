/* eslint-disable react-hooks/exhaustive-deps */
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { NotFound } from "./pages/NotFound.jsx";
import { Login } from "./pages/Login.jsx";
import { Register } from "./pages/Register.jsx";
import { Profile } from "./pages/Profile.jsx";
import { Home } from "./pages/Home.jsx";
import { ProtectedRoute } from "./components/ProtectedRoute.jsx";
import { Post } from "./pages/Post.jsx";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./utils/AuthContext.jsx";
import { toast } from "react-toastify";

const CheckExpiration = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [toastShown, setToastShown] = useState(
    localStorage.getItem("toastShown") === "true"
  );

  useEffect(() => {
    const checkExpiration = () => {
      const expirationTime = localStorage.getItem("accountExpiration");
      const currentTime = Date.now();

      if (expirationTime && currentTime >= expirationTime) {
        logout().then(() => {
          localStorage.removeItem("accountExpiration");
          localStorage.removeItem("toastShown");
          navigate("/login");
          toast.info("Your session has expired. Please register again.");
        });
      } else if (
        expirationTime &&
        expirationTime - currentTime <= 30000 &&
        !toastShown
      ) {
        toast.info("Your account will expire in 30 seconds.");
        setToastShown(true);
        localStorage.setItem("toastShown", "true"); // Guardar estado en localStorage
      }
    };

    checkExpiration();

    // Verificar la expiración cada segundo para mostrar el aviso de 30 segundos restantes
    const intervalId = setInterval(checkExpiration, 1000); // Cada 1 segundo

    return () => clearInterval(intervalId); // Limpiar intervalo al desmontar el componente
  }, [logout, navigate, toastShown]);

  return null;
};

function App() {
  return (
    <BrowserRouter>
      <CheckExpiration />
      <Routes>
        <Route element={<ProtectedRoute redirect="/login" />}>
          <Route path="/" element={<Home />} />
          <Route path="/:username" element={<Profile />} />
          <Route path="/post/:tweetId" element={<Post />} />
        </Route>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
