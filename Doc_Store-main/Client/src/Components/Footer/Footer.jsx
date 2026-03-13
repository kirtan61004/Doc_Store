import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-indigo-600 via-indigo-500 to-blue-500">
      <div className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">

        <div>
          <h3 className="text-lg font-extrabold text-white mb-2">Doc Store</h3>
          <p className="text-sm text-indigo-100 leading-relaxed">Empowering students and faculty to share and learn better through digital documentation.</p>
        </div>

        <div>
          <h4 className="text-sm font-bold text-white uppercase tracking-wide mb-4">Quick Links</h4>
          <ul className="space-y-2">
            {[['/', 'Home'], ['/upload', 'Upload'], ['/view', 'View'], ['/about', 'About'], ['/contact', 'Contact']].map(([to, label]) => (
              <li key={to}>
                <Link to={to} className="text-sm text-indigo-100 hover:text-white transition">{label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-bold text-white uppercase tracking-wide mb-4">Contact</h4>
          <div className="space-y-2">
            <p className="text-sm text-indigo-100">Email: <a href="mailto:docstore@email.com" className="text-white hover:underline">docstore@email.com</a></p>
            <p className="text-sm text-indigo-100">Phone: +91-9876543210</p>
          </div>
        </div>

      </div>
      <div className="border-t border-indigo-400/40 py-4 text-center">
        <p className="text-xs text-indigo-100">&copy; {new Date().getFullYear()} Doc Store. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
