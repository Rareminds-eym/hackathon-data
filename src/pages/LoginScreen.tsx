import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, User, AlertCircle } from 'lucide-react';

interface LoginScreenProps {
  onLogin: () => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [loginUser, setLoginUser] = useState("");
  const [loginPass, setLoginPass] = useState("");
  const [loginError, setLoginError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  if (loginUser.toLowerCase() === 'admin' && loginPass === 'rmfg@2025') {
      setLoginError("");
      onLogin();
      navigate("/dashboard");
    } else {
      setLoginError("Invalid username or password");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 flex items-center justify-center p-3 md:p-4 relative overflow-hidden">
      {/* Animated background elements - reduced for mobile */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -left-20 md:-top-40 md:-left-40 w-40 h-40 md:w-80 md:h-80 bg-white opacity-5 md:opacity-10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-20 -right-20 md:-bottom-40 md:-right-40 w-48 h-48 md:w-96 md:h-96 bg-pink-300 opacity-5 md:opacity-10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 md:w-32 md:h-32 bg-blue-300 opacity-10 md:opacity-20 rounded-full blur-2xl animate-bounce delay-500"></div>
      </div>

      {/* Main container */}
      <div className="relative z-10 w-full max-w-sm md:max-w-md">
        {/* Glass morphism card */}
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-6 md:mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl md:rounded-2xl mb-3 md:mb-4 shadow-lg">
              <Lock className="w-6 h-6 md:w-8 md:h-8 text-white" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Login</h2>
            <p className="text-gray-300 text-sm">Sign in to your account</p>
          </div>

          {/* Error message */}
          {loginError && (
            <div className="mb-4 md:mb-6 p-3 md:p-4 bg-red-500/20 border border-red-500/30 rounded-xl flex items-center gap-3 animate-in slide-in-from-top-2 duration-300">
              <AlertCircle className="w-4 h-4 md:w-5 md:h-5 text-red-400 flex-shrink-0" />
              <div className="text-red-200 text-sm text-center">{loginError}</div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
            {/* Username field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-200">Username</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 md:pl-4 flex items-center pointer-events-none">
                  <User className="h-4 w-4 md:h-5 md:w-5 text-gray-400 group-focus-within:text-blue-400 transition-colors" />
                </div>
                  <input
                    type="text"
                    placeholder="Username"
                    className="w-full pl-10 md:pl-12 pr-3 md:pr-4 py-2.5 md:py-3 bg-white/5 border border-white/10 rounded-lg md:rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200 backdrop-blur-sm text-sm md:text-base"
                    value={loginUser}
                    onChange={e => setLoginUser(e.target.value)}
                    autoFocus
                    required
                  />
              </div>
            </div>

            {/* Password field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-200">Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 md:pl-4 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 md:h-5 md:w-5 text-gray-400 group-focus-within:text-blue-400 transition-colors" />
                </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    className="w-full pl-10 md:pl-12 pr-10 md:pr-12 py-2.5 md:py-3 bg-white/5 border border-white/10 rounded-lg md:rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200 backdrop-blur-sm text-sm md:text-base"
                    value={loginPass}
                    onChange={e => setLoginPass(e.target.value)}
                    required
                  />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 md:pr-4 flex items-center text-gray-400 hover:text-gray-200 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4 md:h-5 md:w-5" /> : <Eye className="h-4 w-4 md:h-5 md:w-5" />}
                </button>
              </div>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              className="w-full py-2.5 md:py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg md:rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 text-sm md:text-base"
            >
              Login
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 md:mt-8 pt-4 md:pt-6 border-t border-white/10 text-center">
            <p className="text-gray-400 text-xs">
              Powered by Rareminds Systems
            </p>
          </div>
        </div>

        {/* Bottom decoration */}
        <div className="mt-6 md:mt-8 text-center">
          <div className="inline-flex items-center gap-2 text-white/60 text-sm">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            Secure Connection
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;