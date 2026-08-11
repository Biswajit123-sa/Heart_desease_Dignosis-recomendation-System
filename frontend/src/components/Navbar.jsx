import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate('/login');
  };

  const navLinkClass = ({ isActive }) =>
    `text-sm font-medium transition-colors ${
      isActive ? 'text-brand-600' : 'text-slate-600 hover:text-brand-500'
    }`;
    
  const mobileNavLinkClass = ({ isActive }) =>
    `block px-3 py-2 rounded-md text-base font-medium transition-colors ${
      isActive ? 'bg-brand-50 text-brand-600' : 'text-slate-600 hover:bg-slate-50 hover:text-brand-500'
    }`;

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <nav className="bg-white/90 backdrop-blur-md border-b border-brand-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2">
              <img src="/logo.svg" alt="Logo" className="h-8 w-8" />
              <span className="text-xl font-bold text-slate-800 tracking-tight">HeartCare<span className="text-brand-500">AI</span></span>
            </Link>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
              <NavLink to="/" className={navLinkClass}>Home</NavLink>
              <NavLink to="/about" className={navLinkClass}>About</NavLink>
              {user && (
                <>
                  <NavLink to="/data-collection" className={navLinkClass}>Predict Risk</NavLink>
                  <NavLink to="/chat" className={navLinkClass}>AI Assistant</NavLink>
                </>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {user ? (
              <div className="relative">
                <button 
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 text-slate-600 hover:text-brand-600 transition-colors focus:outline-none"
                >
                  <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-600">
                    <i className="fa-solid fa-user"></i>
                  </div>
                  <span className="font-medium hidden sm:block">{user.name || 'User'}</span>
                  <i className="fa-solid fa-chevron-down text-xs"></i>
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg py-1 border border-brand-100 animate-fade-in">
                    <button 
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-brand-50 hover:text-brand-600 transition-colors"
                    >
                      <i className="fa-solid fa-right-from-bracket w-5"></i> Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-4">
                <Link to="/login" className="text-slate-600 font-medium hover:text-brand-600 transition-colors">Log in</Link>
                <Link to="/register" className="bg-brand-500 hover:bg-brand-600 text-white px-4 py-2 rounded-xl font-medium shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5">
                  Get Started
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <div className="flex items-center md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-slate-400 hover:text-brand-500 hover:bg-brand-50 focus:outline-none transition-colors"
              >
                <span className="sr-only">Open main menu</span>
                <i className={`fa-solid ${mobileMenuOpen ? 'fa-xmark' : 'fa-bars'} text-xl`}></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-brand-100 bg-white shadow-lg absolute w-full animate-fade-in">
          <div className="px-4 pt-2 pb-4 space-y-1">
            <NavLink to="/" onClick={closeMobileMenu} className={mobileNavLinkClass}>Home</NavLink>
            <NavLink to="/about" onClick={closeMobileMenu} className={mobileNavLinkClass}>About</NavLink>
            {user && (
              <>
                <NavLink to="/data-collection" onClick={closeMobileMenu} className={mobileNavLinkClass}>Predict Risk</NavLink>
                <NavLink to="/chat" onClick={closeMobileMenu} className={mobileNavLinkClass}>AI Assistant</NavLink>
              </>
            )}
            
            {!user && (
              <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col gap-3">
                <Link to="/login" onClick={closeMobileMenu} className="block text-center text-slate-600 font-medium hover:text-brand-600 py-2 border border-slate-200 rounded-xl">Log in</Link>
                <Link to="/register" onClick={closeMobileMenu} className="block text-center bg-brand-500 text-white px-4 py-2 rounded-xl font-medium shadow-sm">Get Started</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
