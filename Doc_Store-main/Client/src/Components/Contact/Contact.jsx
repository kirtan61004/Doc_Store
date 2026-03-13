import React, { useState } from 'react';
import { FaInstagram, FaGithub, FaLinkedin } from "react-icons/fa";
import { IoMdMail } from "react-icons/io";
import { FiMapPin, FiPhone, FiSend } from "react-icons/fi";
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Contact = () => {
    const navigate = useNavigate();
    const [name, setname] = useState("");
    const [email, setemail] = useState("");
    const [message, setmessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handlesubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        fetch("http://localhost:2000/users/contact", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, message })
        })
            .then(r => r.json())
            .then(res => {
                if (res.status) {
                    toast.success("Message sent! We'll reply within 24 hours.");
                    setname(''); setemail(''); setmessage('');
                    setTimeout(() => navigate("/"), 1500);
                } else {
                    toast.error("Something went wrong. Please try again.");
                }
            })
            .catch(() => toast.error("Server error. Check your connection."))
            .finally(() => setLoading(false));
    };

    const inputCls = "w-full border border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition bg-white placeholder-gray-400";

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <ToastContainer />
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
                        Get in{' '}
                        <span className="bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">Touch</span>
                    </h1>
                    <p className="text-gray-500">Have a question or want to work with us? We'd love to hear from you.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                    <div className="md:col-span-2 bg-gradient-to-br from-indigo-600 to-blue-500 rounded-2xl p-8 text-white shadow-md shadow-indigo-200">
                        <h2 className="text-xl font-bold mb-6">Contact Information</h2>
                        <div className="space-y-5 mb-8">
                            <div className="flex items-start gap-3">
                                <FiMapPin className="mt-0.5 flex-shrink-0 opacity-80" size={18} />
                                <a href="https://www.marwadiuniversity.ac.in/" target="_blank" rel="noreferrer" className="text-white no-underline hover:underline">
                                    <p className="text-sm leading-relaxed opacity-90">Marwadi University,<br />Morbi Road, Rajkot.</p>
                                </a>
                            </div>
                            <div className="flex items-center gap-3">
                                <IoMdMail className="flex-shrink-0 opacity-80" size={18} />
                                <span className="text-sm opacity-90">docstore@email.com</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <FiPhone className="flex-shrink-0 opacity-80" size={18} />
                                <span className="text-sm opacity-90">+91-9876543210</span>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <a href="https://www.instagram.com/" target="_blank" rel="noreferrer" className="w-9 h-9 flex items-center justify-center bg-white/20 hover:bg-white/30 rounded-lg transition"><FaInstagram size={18} /></a>
                            <a href="https://github.com/kirtankacha" target="_blank" rel="noreferrer" className="w-9 h-9 flex items-center justify-center bg-white/20 hover:bg-white/30 rounded-lg transition"><FaGithub size={18} /></a>
                            <a href="https://www.linkedin.com/in/kirtan-kacha" target="_blank" rel="noreferrer" className="w-9 h-9 flex items-center justify-center bg-white/20 hover:bg-white/30 rounded-lg transition"><FaLinkedin size={18} /></a>
                        </div>
                    </div>
                    <div className="md:col-span-3 bg-white border border-gray-200 rounded-2xl shadow-sm p-8">
                        <h2 className="text-xl font-bold text-gray-800 mb-6">Send a Message</h2>
                        <form onSubmit={handlesubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                                <input className={inputCls} type="text" placeholder="Your name" value={name} onChange={e => setname(e.target.value)} required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
                                <input className={inputCls} type="email" placeholder="you@email.com" value={email} onChange={e => setemail(e.target.value)} required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Message</label>
                                <textarea className={`${inputCls} resize-none`} rows={5} placeholder="How can we help you?" value={message} onChange={e => setmessage(e.target.value)} required />
                            </div>
                            <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-semibold py-3.5 rounded-xl shadow-md shadow-indigo-200 transition-all hover:-translate-y-0.5">
                                <FiSend size={16} />
                                {loading ? "Sending..." : "Send Message"}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
