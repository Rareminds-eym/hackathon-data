import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface LoginScreenProps {
  onLogin: () => void;
}


const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [loginUser, setLoginUser] = useState("");
  const [loginPass, setLoginPass] = useState("@2025");
  const [loginError, setLoginError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginUser === 'admin' && loginPass === 'rmfg@2025') {
      setLoginError("");
      onLogin();
      navigate("/dashboard");
    } else {
      setLoginError("Invalid username or password");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <form
        className="bg-white p-8 rounded shadow-md w-full max-w-sm"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        {loginError && <div className="mb-4 text-red-500 text-center">{loginError}</div>}
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium text-gray-700">Username</label>
          <input
            type="text"
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={loginUser}
            onChange={e => setLoginUser(e.target.value)}
            autoFocus
            required
          />
        </div>
        <div className="mb-6">
          <label className="block mb-2 text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={loginPass}
            onChange={e => setLoginPass(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors font-semibold"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginScreen;
