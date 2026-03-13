import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import logo from '../Images/logo-head.png'
import { FiMenu, FiX } from 'react-icons/fi'

const Header = ({ isLoggedIn, setIsLoggedIn }) => {
  const navigate = useNavigate();
  const userRole = sessionStorage.getItem("userRole");
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    sessionStorage.removeItem("isLoggedIn");
    sessionStorage.removeItem("userRole");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("userEmail");
    sessionStorage.removeItem("userName");
    setIsLoggedIn(false);
    navigate("/");
  };

  const navLinkCls = "text-sm font-medium text-gray-600 hover:text-indigo-600 transition";

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 no-underline">
          <img src={logo} alt="logo" className="w-8 h-8 object-contain" />
          <span className="text-lg font-extrabold bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">Doc Store</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/" className={navLinkCls}>Home</Link>
          <Link to="/upload" className={navLinkCls}>Upload</Link>
          <Link to="/view" className={navLinkCls}>View</Link>
          {isLoggedIn && userRole === "student" && (
            <Link to="/my-tasks" className={navLinkCls}>My Tasks</Link>
          )}
          <Link to="/about" className={navLinkCls}>About</Link>
          <Link to="/contact" className={navLinkCls}>Contact</Link>
        </nav>

        {/* Auth buttons */}
        <div className="hidden md:flex items-center gap-3">
          {!isLoggedIn ? (
            <>
              <Link to="/login" className="text-sm font-semibold text-gray-700 hover:text-indigo-600 transition">Login</Link>
              <Link to="/signup" className="text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl shadow-sm shadow-indigo-200 transition">Sign Up</Link>
            </>
          ) : (
            <button onClick={handleLogout} className="text-sm font-semibold text-red-500 hover:text-red-700 border border-red-200 hover:border-red-400 px-4 py-2 rounded-xl transition">
              Logout
            </button>
          )}
        </div>

        {/* Mobile hamburger */}
        <button className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition" onClick={() => setMenuOpen(o => !o)}>
          {menuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-4 flex flex-col gap-3">
          {[['/', 'Home'], ['/upload', 'Upload'], ['/view', 'View'], ['/about', 'About'], ['/contact', 'Contact']].map(([to, label]) => (
            <Link key={to} to={to} className={navLinkCls} onClick={() => setMenuOpen(false)}>{label}</Link>
          ))}
          {isLoggedIn && userRole === "student" && (
            <Link to="/my-tasks" className={navLinkCls} onClick={() => setMenuOpen(false)}>My Tasks</Link>
          )}
          <div className="pt-2 border-t border-gray-100 flex flex-col gap-2">
            {!isLoggedIn ? (
              <>
                <Link to="/login" className="text-sm font-semibold text-gray-700 text-center border border-gray-200 rounded-xl py-2" onClick={() => setMenuOpen(false)}>Login</Link>
                <Link to="/signup" className="text-sm font-semibold text-white text-center bg-indigo-600 rounded-xl py-2" onClick={() => setMenuOpen(false)}>Sign Up</Link>
              </>
            ) : (
              <button onClick={() => { handleLogout(); setMenuOpen(false); }} className="text-sm font-semibold text-red-500 border border-red-200 rounded-xl py-2">Logout</button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header
