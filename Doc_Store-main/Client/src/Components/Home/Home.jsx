import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiUploadCloud, FiSearch, FiShield, FiShare2, FiSmartphone, FiRefreshCw, FiArrowRight, FiStar, FiBarChart2, FiUsers, FiZap, FiLock, FiUserPlus, FiFolder } from 'react-icons/fi';

const Home = () => {
  const navigate = useNavigate();
  const [activeSlide, setActiveSlide] = useState(0);

  const handleGetStart = () => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    navigate(isLoggedIn ? "/upload" : "/login");
  };

  const features = [
    { icon: <FiUploadCloud size={24} />, title: "Upload & Organize", desc: "Upload files and categorize them for easy access and management.", badge: "Popular", to: "/upload", color: "text-indigo-600 bg-indigo-50" },
    { icon: <FiSearch size={24} />, title: "Smart Search", desc: "Find documents quickly with powerful filtering and search capabilities.", badge: "Fast", to: "/view", color: "text-blue-600 bg-blue-50" },
    { icon: <FiShield size={24} />, title: "Secure Access", desc: "Your data is protected with end-to-end encryption and secure protocols.", badge: "Secure", color: "text-green-600 bg-green-50" },
    { icon: <FiShare2 size={24} />, title: "Easy Sharing", desc: "Share documents via secure links in seconds with anyone.", badge: "New", color: "text-purple-600 bg-purple-50" },
    { icon: <FiSmartphone size={24} />, title: "Mobile Friendly", desc: "Access your documents on any device with our responsive design.", color: "text-rose-600 bg-rose-50" },
    { icon: <FiRefreshCw size={24} />, title: "Auto Backup", desc: "Never lose your data with automatic backup and version control.", color: "text-amber-600 bg-amber-50" },
  ];

  const steps = [
    { num: "1", icon: <FiUserPlus size={28} className="text-indigo-500" />, title: "Sign Up", desc: "Create your free account in seconds and get started with secure document storage." },
    { num: "2", icon: <FiUploadCloud size={28} className="text-blue-500" />, title: "Upload Files", desc: "Drag and drop your documents or use our quick upload feature to add files." },
    { num: "3", icon: <FiFolder size={28} className="text-amber-500" />, title: "Organize", desc: "Categorize and tag your documents for easy retrieval and management." },
    { num: "4", icon: <FiSmartphone size={28} className="text-green-500" />, title: "Access Anywhere", desc: "View, download, and share your documents from any device, anytime." },
  ];

  const stats = [
    { icon: <FiBarChart2 size={28} className="text-indigo-500" />, num: "10K+", label: "Documents Stored" },
    { icon: <FiUsers size={28} className="text-blue-500" />, num: "2K+", label: "Active Users" },
    { icon: <FiZap size={28} className="text-amber-500" />, num: "99.9%", label: "Uptime" },
    { icon: <FiLock size={28} className="text-green-500" />, num: "100%", label: "Secure" },
  ];

  const testimonials = [
    { text: "Doc Store transformed how we manage documents. Highly efficient!", author: "Sarah Johnson", role: "Project Manager" },
    { text: "The best document management system we've used. Simple and powerful.", author: "Michael Chen", role: "Developer" },
    { text: "Secure, fast, and reliable. Everything we needed in one platform.", author: "Emily Rodriguez", role: "Team Lead" },
  ];

  useEffect(() => {
    const id = setInterval(() => setActiveSlide(p => (p + 1) % testimonials.length), 4000);
    return () => clearInterval(id);
  }, [testimonials.length]);

  return (
    <div className="bg-gray-50 min-h-screen font-sans">

      {/* Hero */}
      <section className="relative overflow-hidden bg-white border-b border-gray-100">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-40 pointer-events-none" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-100 rounded-full blur-3xl opacity-40 pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-blue-100 rounded-full blur-3xl opacity-30 pointer-events-none" />
        <div className="relative max-w-5xl mx-auto px-4 py-24 text-center">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-50 border border-indigo-200 rounded-full text-xs font-semibold text-indigo-700 mb-6">
            Trusted by 2,000+ students & faculty
          </span>
          <h1 className="text-5xl sm:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
            Access Your Documents{' '}
            <span className="bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">
              Anytime, Anywhere
            </span>
          </h1>
          <p className="text-lg text-gray-500 max-w-xl mx-auto mb-10">
            A secure and efficient platform to store, organize, and manage your academic documents online.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <button
              onClick={handleGetStart}
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-8 py-3.5 rounded-xl shadow-md shadow-indigo-200 transition-all hover:shadow-lg hover:-translate-y-0.5"
            >
              Get Started <FiArrowRight />
            </button>
            <Link
              to="/view"
              className="inline-flex items-center gap-2 bg-white border border-gray-200 hover:border-indigo-300 text-gray-700 font-semibold px-8 py-3.5 rounded-xl shadow-sm transition-all hover:shadow-md"
            >
              Browse Docs
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-5xl mx-auto px-4 py-14">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {stats.map((s) => (
            <div key={s.label} className="bg-white border border-gray-200 rounded-2xl p-6 text-center shadow-sm">
              <div className="flex justify-center mb-2">{s.icon}</div>
              <div className="text-2xl font-extrabold text-gray-900">{s.num}</div>
              <div className="text-sm text-gray-500 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-5xl mx-auto px-4 pb-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">How It Works</h2>
          <p className="text-gray-500">Simple steps to manage your documents efficiently</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {steps.map((step) => (
            <div key={step.num} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm relative">
              <span className="absolute top-4 right-4 w-7 h-7 flex items-center justify-center bg-indigo-600 text-white text-xs font-bold rounded-full">
                {step.num}
              </span>
              <div className="mb-3">{step.icon}</div>
              <h3 className="font-bold text-gray-800 mb-1">{step.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="bg-white border-t border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 py-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Key Features</h2>
            <p className="text-gray-500">Everything you need to manage documents efficiently</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f) => {
              const card = (
                <div className="group bg-gray-50 hover:bg-white border border-gray-200 hover:border-indigo-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all cursor-pointer h-full">
                  <div className={`w-11 h-11 flex items-center justify-center rounded-xl mb-4 ${f.color}`}>
                    {f.icon}
                  </div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-gray-800">{f.title}</h3>
                    {f.badge && (
                      <span className="px-2 py-0.5 bg-indigo-50 border border-indigo-200 rounded-full text-xs font-semibold text-indigo-600">
                        {f.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
                </div>
              );
              return f.to ? (
                <Link key={f.title} to={f.to} className="no-underline">
                  {card}
                </Link>
              ) : (
                <div key={f.title}>{card}</div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-3xl mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">What Our Users Say</h2>
        </div>
        <div className="relative bg-white border border-gray-200 rounded-2xl shadow-sm p-10 text-center">
          <FiStar className="absolute top-6 left-6 text-amber-300 text-2xl" />
          <FiStar className="absolute top-6 right-6 text-amber-300 text-2xl" />
          <p className="text-xl text-gray-700 font-medium leading-relaxed mb-6">
            "{testimonials[activeSlide].text}"
          </p>
          <div className="font-bold text-gray-900">{testimonials[activeSlide].author}</div>
          <div className="text-sm text-gray-400 mt-1">{testimonials[activeSlide].role}</div>
          <div className="flex justify-center gap-2 mt-6">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveSlide(i)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${i === activeSlide ? 'bg-indigo-600 w-6' : 'bg-gray-300 hover:bg-gray-400'}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-white">
        <div className="max-w-3xl mx-auto px-4 py-16 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Ready to Get Started?</h2>
          <p className="text-gray-500 mb-8">Join thousands of users managing their documents efficiently</p>
          <button
            onClick={handleGetStart}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-10 py-3.5 rounded-xl shadow-lg transition-all hover:-translate-y-0.5"
          >
            Start Now — It's Free
          </button>
        </div>
      </section>

    </div>
  );
};

export default Home;