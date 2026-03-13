import React from 'react';
import { Link } from 'react-router-dom';
import { FiUploadCloud, FiFolder, FiUsers, FiCheckCircle } from 'react-icons/fi';

const About = () => {
  const features = [
    { icon: <FiUploadCloud className="text-indigo-500" size={22} />, text: 'Upload and categorize documents (PPTs, Assignments, Notes, Lab Manuals)' },
    { icon: <FiFolder className="text-blue-500" size={22} />, text: 'View and download documents from any device, anytime' },
    { icon: <FiUsers className="text-green-500" size={22} />, text: 'Faculty task assignment and student response submissions' },
    { icon: <FiCheckCircle className="text-purple-500" size={22} />, text: 'Faculty review workflow with approve/reject options' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-3">
            About{' '}
            <span className="bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">
              Doc Store
            </span>
          </h1>
          <p className="text-gray-500 max-w-xl mx-auto">
            Doc Store is a collaborative platform designed to streamline the sharing of educational materials between students and faculty.
          </p>
        </div>

        {/* Mission */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8 mb-5">
          <div className="flex items-center gap-3 mb-3">
            <span className="w-9 h-9 flex items-center justify-center bg-indigo-50 rounded-xl text-xl">🎯</span>
            <h2 className="text-xl font-bold text-gray-800">Our Mission</h2>
          </div>
          <p className="text-gray-600 leading-relaxed">
            We aim to make learning and resource sharing simple, centralized, and accessible to all. By bridging the gap between faculty and students, Doc Store encourages seamless academic collaboration.
          </p>
        </div>

        {/* Features */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8 mb-5">
          <div className="flex items-center gap-3 mb-5">
            <span className="w-9 h-9 flex items-center justify-center bg-amber-50 rounded-xl text-xl">💡</span>
            <h2 className="text-xl font-bold text-gray-800">Key Features</h2>
          </div>
          <ul className="space-y-4">
            {features.map((f, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="mt-0.5 flex-shrink-0">{f.icon}</span>
                <span className="text-gray-600">{f.text}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Built For */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8 mb-8">
          <div className="flex items-center gap-3 mb-3">
            <span className="w-9 h-9 flex items-center justify-center bg-green-50 rounded-xl text-xl">👨‍🏫</span>
            <h2 className="text-xl font-bold text-gray-800">Built For</h2>
          </div>
          <p className="text-gray-600 leading-relaxed">
            Doc Store is ideal for schools, colleges, and institutions aiming to digitize and simplify their academic workflow.
          </p>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link
            to="/signup"
            className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-8 py-3.5 rounded-xl shadow-md shadow-indigo-200 transition-all hover:-translate-y-0.5 no-underline"
          >
            Get Started — It's Free
          </Link>
        </div>

      </div>
    </div>
  );
};

export default About;
