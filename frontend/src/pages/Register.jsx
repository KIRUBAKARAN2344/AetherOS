import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

function Register() {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!fullName.trim() || !email.trim() || !password || !confirmPassword) {
      setError("All fields are required.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("/users/register", {
        full_name: fullName.trim(),
        email: email.trim(),
        password: password,
      });

      if (response.status === 200 || response.status === 201) {
        setSuccess("User registered successfully! Redirecting to login...");
        setTimeout(() => {
          navigate("/");
        }, 1500);
      }
    } catch (err) {
      console.error("Registration error:", err);
      const detail = err.response?.data?.detail;
      if (typeof detail === "string") {
        setError(detail);
      } else if (Array.isArray(detail)) {
        setError(detail.map((d) => d.msg).join(", "));
      } else {
        setError("Registration failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="bg-white w-[450px] rounded-2xl shadow-2xl p-8">

        <div className="text-center">
          <h1 className="text-4xl font-bold text-blue-700">
            AetherOS
          </h1>

          <p className="text-gray-500 mt-2">
            Create your account
          </p>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 text-sm rounded-lg">
            {error}
          </div>
        )}

        {success && (
          <div className="mt-4 p-3 bg-green-100 border border-green-400 text-green-700 text-sm rounded-lg">
            {success}
          </div>
        )}

        <form onSubmit={handleRegister} className="mt-6">

          <div className="mb-4">
            <label className="font-semibold block text-gray-700">Full Name</label>
            <input
              type="text"
              placeholder="Enter your full name"
              className="w-full mt-2 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="mb-4">
            <label className="font-semibold block text-gray-700">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full mt-2 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="mb-4">
            <label className="font-semibold block text-gray-700">Password</label>
            <input
              type="password"
              placeholder="Create password"
              className="w-full mt-2 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="mb-6">
            <label className="font-semibold block text-gray-700">Confirm Password</label>
            <input
              type="password"
              placeholder="Confirm password"
              className="w-full mt-2 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-700 text-white py-3 rounded-lg hover:bg-blue-800 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
          >
            {loading ? "Registering..." : "Register"}
          </button>

        </form>

        <div className="text-center mt-6">
          <p className="text-gray-600">
            Already have an account?
            <Link
              to="/"
              className="text-blue-700 font-semibold ml-2 hover:underline"
            >
              Login
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}

export default Register;