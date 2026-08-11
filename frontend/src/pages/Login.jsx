import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Card from '../components/Card';
import Alert from '../components/Alert';
import { loginUser } from '../services/authService';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    setIsSubmitting(true);
    setError('');
    try {
      const data = await loginUser({ email, password });
      login(data.token, { name: data.name, email: data.email, role: data.role });
      navigate('/data-collection');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex">
      {/* Left side - graphic */}
      <div className="hidden lg:flex lg:w-1/2 bg-brand-500 items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjZWY0NDQ0IiAvPgo8Y2lyY2xlIGN4PSI0IiBjeT0iNCIgcj0iMiIgZmlsbD0iI2Y4NzE3MSIvPgo8L3N2Zz4=')] opacity-20"></div>
        <div className="relative z-10 text-white text-center p-12 max-w-lg">
          <i className="fa-solid fa-user-doctor text-6xl mb-6"></i>
          <h2 className="text-4xl font-bold mb-4">Welcome Back</h2>
          <p className="text-brand-100 text-lg">Access your patient dashboard, run predictive diagnostics, and manage care plans.</p>
        </div>
      </div>
      
      {/* Right side - form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-[#fef2f2]">
        <div className="w-full max-w-md animate-fade-in">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-800">Login</h2>
            <p className="text-slate-500 mt-2">Sign in to your account</p>
          </div>

          <Card>
            {error && <Alert type="error" message={error} />}
            
            <form onSubmit={handleSubmit} className="space-y-6 mt-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <i className="fa-regular fa-envelope"></i>
                  </div>
                  <input
                    type="email"
                    className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-xl focus:ring-brand-500 focus:border-brand-500 sm:text-sm transition-colors"
                    placeholder="doctor@hospital.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <i className="fa-solid fa-lock"></i>
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    className="block w-full pl-10 pr-10 py-2 border border-slate-300 rounded-xl focus:ring-brand-500 focus:border-brand-500 sm:text-sm transition-colors"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-brand-500 transition-colors"
                  >
                    <i className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input id="remember-me" type="checkbox" className="h-4 w-4 text-brand-600 focus:ring-brand-500 border-slate-300 rounded" />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-700">Remember me</label>
                </div>
                <div className="text-sm">
                  <a href="#" className="font-medium text-brand-600 hover:text-brand-500">Forgot password?</a>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-brand-500 hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Signing In...' : 'Sign In'}
              </button>
            </form>
          </Card>
          
          <p className="mt-6 text-center text-sm text-slate-600">
            Don't have an account? <Link to="/register" className="font-medium text-brand-600 hover:text-brand-500">Register here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
