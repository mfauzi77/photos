import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom"; // Import useNavigate untuk redirect dan Link untuk Register

const Login = () => {
  const [email, setEmail] = useState(""); // State untuk email
  const [password, setPassword] = useState(""); // State untuk password
  const [error, setError] = useState(""); // State untuk error
  const navigate = useNavigate(); // Inisialisasi useNavigate untuk redirect

  const handleSubmit = async (e) => {
    e.preventDefault(); // Cegah reload halaman
    setError(""); // Reset error sebelum mulai

    try {
      const response = await axios.post(
        "https://photo-sharing-api-bootcamp.do.dibimbing.id/api/v1/login", // API login
        { email, password }, // Data yang dikirim ke API
        {
          headers: {
            "Content-Type": "application/json",
            "apiKey": "c7b411cc-0e7c-4ad1-aa3f-822b00e7734b", // API key
          },
        }
      );

      // Simpan token ke localStorage jika login berhasil
      localStorage.setItem("token", response.data.token);
      // Redirect ke halaman Explore setelah login berhasil
      navigate("/explore");
    } catch (err) {
      // Tampilkan pesan error jika login gagal
      setError("Login gagal, periksa kembali email dan password.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-semibold text-center mb-6">Login</h2>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Email
            </label>
            <input
              type="email"
              className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Masukkan email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Password
            </label>
            <input
              type="password"
              className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Masukkan password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Login
          </button>
        </form>

        <p className="text-center text-gray-600 mt-4">
          Belum punya akun?{" "}
          <Link to="/register" className="text-blue-500 hover:underline">
            Daftar di sini
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
