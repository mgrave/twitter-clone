import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./styles/index.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider } from "./utils/AuthContext.jsx";
import { ThemeProvider } from "./utils/ThemeContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <ThemeProvider>
      <App />
      <ToastContainer />
    </ThemeProvider>
  </AuthProvider>
);
