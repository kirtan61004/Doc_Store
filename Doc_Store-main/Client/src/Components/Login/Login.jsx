import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link, useNavigate } from 'react-router-dom';
import { FiLogIn, FiMail, FiLock, FiChevronDown } from 'react-icons/fi';

const Login = ({ setIsLoggedIn }) => {
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [role, setRole] = useState("student");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    // Admin uses OTP flow — redirect to admin login page
    if (role === "admin") {
      navigate("/adminlogin");
      return;
    }

    fetch("http://localhost:2000/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    })
      .then(res => res.json())
      .then(res => {
        if (res.status) {
          // Verify that the role in DB matches the selected role
          if (res.role !== role) {
            toast.error(`Access denied. You are not registered as a ${role}.`);
            return;
          }

          toast.success("Login Successful!");
          sessionStorage.setItem("token", res.token);
          sessionStorage.setItem("isLoggedIn", "true");
          sessionStorage.setItem("userRole", res.role);
          sessionStorage.setItem("userEmail", res.email);
          sessionStorage.setItem("userName", res.name);
          setIsLoggedIn(true);

          setTimeout(() => {
            navigate("/");
          }, 1000);
        } else {
          toast.error(res.message);
        }
      })
      .catch(err => {
        console.error(err);
        toast.error("Something went wrong. Try again.");
      });
  };

  const inputCls = "w-full border border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition bg-white placeholder-gray-400";

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <ToastContainer />
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-2xl shadow-sm p-8">

        {/* Logo / Brand */}
        <div className="flex items-center gap-2 mb-6">
          <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center">
            <FiLogIn className="text-white" size={18} />
          </div>
          <span className="text-xl font-extrabold bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">DocStore</span>
        </div>

        <h2 className="text-2xl font-extrabold text-gray-900 mb-1">Welcome back</h2>
        <p className="text-sm text-gray-500 mb-6">Sign in to access your document hub.</p>

        <form onSubmit={handleLogin} className="space-y-4">
          {/* Role */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Login as</label>
            <div className="relative">
              <select
                className={`${inputCls} appearance-none pr-10`}
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="student">Student</option>
                <option value="faculty">Faculty</option>
                <option value="admin">Admin</option>
              </select>
              <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
            </div>
          </div>

          {role !== "admin" && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
                <div className="relative">
                  <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input type="email" placeholder="you@email.com" className={`${inputCls} pl-10`} value={email} onChange={(e) => setemail(e.target.value)} required />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                <div className="relative">
                  <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input type="password" placeholder="Your password" className={`${inputCls} pl-10`} value={password} onChange={(e) => setpassword(e.target.value)} required />
                </div>
              </div>
            </>
          )}

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3.5 rounded-xl shadow-md shadow-indigo-200 transition-all hover:-translate-y-0.5 mt-2"
          >
            {role === "admin" ? "Go to Admin Login" : "Login"}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-gray-500">
          Don't have an account?{' '}
          <Link to="/signup" className="text-indigo-600 font-semibold hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
