import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FiUserCheck, FiUpload } from "react-icons/fi";

const FacultySignup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [facultyId, setFacultyId] = useState(null);

  const navigate = useNavigate(); // <-- useNavigate hook

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password || !confirmPass || !facultyId) {
      toast.error("All fields are required");
      return;
    }
    if (password !== confirmPass) {
      toast.error("Passwords do not match");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("confirmPassword", confirmPass);
    formData.append("facultyIdPhoto", facultyId);

    try {
      const res = await fetch("http://localhost:2000/faculty/signup-request", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.status) {
        toast.success(data.message);

        // Clear form
        setName("");
        setEmail("");
        setPassword("");
        setConfirmPass("");
        setFacultyId(null);

        // Redirect to home page after short delay
        setTimeout(() => {
          navigate("/");
        }, 1500); // 1.5 seconds delay to allow toast to show
      } else {
        toast.error(data.message);
      }
    } catch {
      toast.error("Server error");
    }
  };

  const inputCls = "w-full border border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition bg-white placeholder-gray-400";

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <ToastContainer />
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-2xl shadow-sm p-8">

        <div className="flex items-center gap-2 mb-6">
          <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center">
            <FiUserCheck className="text-white" size={18} />
          </div>
          <span className="text-xl font-extrabold bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">DocStore</span>
        </div>

        <h2 className="text-2xl font-extrabold text-gray-900 mb-1">Faculty Signup</h2>
        <p className="text-sm text-gray-500 mb-6">Submit a request to join as a faculty member. Admin will review and approve.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
            <input type="text" placeholder="Your full name" className={inputCls} value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
            <input type="email" placeholder="you@university.edu" className={inputCls} value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
            <input type="password" placeholder="Create a password" className={inputCls} value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm Password</label>
            <input type="password" placeholder="Re-enter your password" className={inputCls} value={confirmPass} onChange={(e) => setConfirmPass(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Faculty ID Photo</label>
            <label className="flex items-center justify-between w-full border border-dashed border-gray-300 hover:border-indigo-400 rounded-xl px-4 py-3 cursor-pointer transition">
              <span className="text-sm text-gray-500">{facultyId ? facultyId.name : 'Upload your faculty ID photo…'}</span>
              <FiUpload className="text-gray-400" size={16} />
              <input type="file" accept="image/*" className="hidden" onChange={(e) => setFacultyId(e.target.files[0])} required />
            </label>
          </div>
          <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3.5 rounded-xl shadow-md shadow-indigo-200 transition-all hover:-translate-y-0.5 mt-2">
            Submit Request
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-gray-500">
          Already registered?{' '}
          <a href="/login" className="text-indigo-600 font-semibold hover:underline">Login here</a>
        </p>
      </div>
    </div>
  );
};

export default FacultySignup;
