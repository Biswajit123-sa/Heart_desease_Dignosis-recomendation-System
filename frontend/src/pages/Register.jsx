import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import Alert from '../components/Alert';
import { registerUser } from '../services/authService';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }
    setIsSubmitting(true);
    setError('');
    try {
      await registerUser(formData);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex">
      {/* Left side - form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-[#fef2f2]">
        <div className="w-full max-w-md animate-fade-in">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-800">Create Account</h2>
            <p className="text-slate-500 mt-2">Join as a healthcare professional</p>
          </div>

          <Card>
            {error && <Alert type="error" message={error} />}
            
            <form onSubmit={handleSubmit} className="space-y-5 mt-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <i className="fa-regular fa-user"></i>
                  </div>
                  <input
                    type="text"
                    name="name"
                    className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-xl focus:ring-brand-500 focus:border-brand-500 sm:text-sm"
                    placeholder="Enter your Name"
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <i className="fa-regular fa-envelope"></i>
                  </div>
                  <input
                    type="email"
                    name="email"
                    className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-xl focus:ring-brand-500 focus:border-brand-500 sm:text-sm"
                    placeholder="Enter your Email address"
                    onChange={handleChange}
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
                    type="password"
                    name="password"
                    className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-xl focus:ring-brand-500 focus:border-brand-500 sm:text-sm"
                    placeholder="••••••••"
                    onChange={handleChange}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-brand-500 hover:bg-brand-600 transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Registering...' : 'Register'}
              </button>
            </form>
          </Card>
          
          <p className="mt-6 text-center text-sm text-slate-600">
            Already have an account? <Link to="/login" className="font-medium text-brand-600 hover:text-brand-500">Sign in</Link>
          </p>
        </div>
      </div>

      {/* Right side - graphic */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-900 items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-brand-900/40 via-transparent to-transparent"></div>
        <div className="relative z-10 text-white text-center p-12 max-w-lg">
          <i className="fa-solid fa-hospital text-6xl mb-6 text-brand-400"></i>
          <h2 className="text-4xl font-bold mb-4">Secure & Confidential</h2>
          <p className="text-slate-300 text-lg">Your data is encrypted and secure. We comply with medical data privacy standards to keep your patients' info safe.</p>
        </div>
      </div>
    </div>
  );
};

export default Register;
