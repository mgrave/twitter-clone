import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import instance from "../utils/axiosConfig.js";
import { toast } from "react-toastify";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await instance.post("/api/user/login", {
        email,
        password,
      });
      toast.success("Logged in successfully!");

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data));

      navigate("/");
    } catch (err) {
      toast.error("Invalid credentials");
    }
  };

  return (
    <div
      className={`flex justify-center items-center min-h-screen w-[80%] m-auto`}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true" width="50%">
        <g>
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
        </g>
      </svg>
      <div className="p-6 w-96">
        <h1 className="text-2xl font-bold mb-4 text-center">Login</h1>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-black font-semibold">Email</label>
            <input
              type="email"
              className="w-full p-2 border boder-gray-300 rounded mt-1 hover:border-blue-400 transition-colors duration-300"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-black font-semibold">Password</label>
            <input
              type="password"
              className="w-full p-2 border boder-gray-300 rounded mt-1 hover:border-blue-400 transition-colors duration-300"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded"
          >
            Login
          </button>
        </form>
        <p className="text-center mt-4">
          {`Don't have an account? `}
          <Link to="/register" className="text-blue-500">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};
