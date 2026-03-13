import React, { useState } from 'react';
import { FiUserPlus } from 'react-icons/fi';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
    const navigate = useNavigate();
    const [name, setname] = useState("");
    const [email, seteamil] = useState("");
    const [password, setpassword] = useState("");
    const [confirmpass, setconfirmpass] = useState("");

    const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const validatePassword = (password) =>
        /^(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{6,}$/.test(password);
    const namePattern = /^[A-Za-z\s]{3,}$/;

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!namePattern.test(name.trim())) {
            toast.error("Name must be at least 3 characters and contain only letters");
            return;
        }

        if (!validateEmail(email)) {
            toast.error("Please enter a valid email");
            return;
        }

        if (!validatePassword(password)) {
            toast.error("Password must be at least 6 characters, include 1 number & 1 special character");
            return;
        }

        if (password !== confirmpass) {
            toast.error("Passwords do not match");
            return;
        }

        // **Frontend only allows student signup**
        fetch("http://localhost:2000/users/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password, role: "student" }) // role auto student
        })
            .then(res => res.json())
            .then(res => {
                if (res.status) {
                    toast.success("Signup successful. Please login.");
                    setTimeout(() => {
                        navigate("/login");
                    }, 1000);
                } else {
                    toast.error(res.message);
                }
            })
            .catch(() => {
                toast.error("Server error");
            });
    };

    const inputCls = "w-full border border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition bg-white placeholder-gray-400";

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
            <ToastContainer />
            <div className="w-full max-w-md bg-white border border-gray-200 rounded-2xl shadow-sm p-8">

                <div className="flex items-center gap-2 mb-6">
                    <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center">
                        <FiUserPlus className="text-white" size={18} />
                    </div>
                    <span className="text-xl font-extrabold bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">DocStore</span>
                </div>

                <h2 className="text-2xl font-extrabold text-gray-900 mb-1">Create your account</h2>
                <p className="text-sm text-gray-500 mb-6">Register as a student to start using the platform.</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                        <input
                            type="text"
                            placeholder="Your full name"
                            className={inputCls}
                            value={name}
                            onChange={(e) => {
                                const value = e.target.value;
                                const onlyLetters = /^[A-Za-z\s]*$/;
                                if (onlyLetters.test(value)) setname(value);
                            }}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
                        <input
                            type="email"
                            placeholder="you@email.com"
                            className={inputCls}
                            value={email}
                            onChange={(e) => seteamil(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                        <input
                            type="password"
                            placeholder="Min 6 chars, 1 number, 1 symbol"
                            className={inputCls}
                            value={password}
                            onChange={(e) => setpassword(e.target.value)}
                        required
                    />

                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm Password</label>
                        <input
                            type="password"
                            placeholder="Re-enter your password"
                            className={inputCls}
                            value={confirmpass}
                            onChange={(e) => setconfirmpass(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3.5 rounded-xl shadow-md shadow-indigo-200 transition-all hover:-translate-y-0.5 mt-2">
                        Create Account
                    </button>
                </form>

                <p className="mt-5 text-center text-sm text-gray-500">
                    Already have an account?{' '}
                    <a href="/login" className="text-indigo-600 font-semibold hover:underline">Login here</a>
                </p>
                <p className="mt-2 text-center text-sm text-gray-500">
                    Want to sign up as faculty?{' '}
                    <a href="/facultysignup" className="text-indigo-600 font-semibold hover:underline">Click here</a>
                </p>
            </div>
        </div>
    );
};

export default Signup;
