import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      });

      localStorage.setItem(
        "access_token",
        response.data.access_token
      );

      alert("Login Successful!");

      navigate("/dashboard");

    } catch (error) {
      alert(error.response?.data?.detail || "Login Failed");
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <div className="bg-white w-[420px] rounded-2xl shadow-2xl p-8">

        <div className="text-center">
          <h1 className="text-4xl font-bold text-blue-700">
            AetherOS
          </h1>

          <p className="text-gray-500 mt-2">
            Agentic AI Enterprise Operating System
          </p>
        </div>

        <form onSubmit={handleLogin} className="mt-8">

          <div className="mb-4">
            <label className="font-semibold">Email</label>

            <input
              type="email"
              placeholder="Enter your email"
              className="w-full mt-2 p-3 border rounded-lg"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

          </div>

          <div className="mb-4">
            <label className="font-semibold">Password</label>

            <input
              type="password"
              placeholder="Enter your password"
              className="w-full mt-2 p-3 border rounded-lg"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

          </div>

          <button
            type="submit"
            className="w-full bg-blue-700 text-white py-3 rounded-lg"
          >
            Login
          </button>

        </form>

        <div className="text-center mt-6">
          <Link
            to="/register"
            className="text-blue-700 font-semibold"
          >
            Register
          </Link>
        </div>

      </div>
    </div>
  );
}

export default Login;