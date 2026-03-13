import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import './App.css';
import Header from './Components/Header/Header';
import Home from './Components/Home/Home';
import Upload from './Components/Upload Page/Upload';
import View from './Components/View Page/View';
import About from './Components/About/About';
import Contact from './Components/Contact/Contact';
import Login from './Components/Login/Login';
import Signup from './Components/Signup/Signup';
import Faculty from './Components/Faculty panel/Faculty';
import Footer from './Components/Footer/Footer';
import { useState, useEffect } from 'react';
import Admin from './Admin Panel/Admin';
import AdminLogin from './Admin Panel/AdminLogin';
import AdminFaculty from './Admin Panel/AdminFaculty';
import AdminStudent from './Admin Panel/AdminStudent';
import AdminDocuments from './Admin Panel/AdminDocuments';
import AdminUploads from './Admin Panel/AdminUploads';
import AdminSettings from './Admin Panel/AdminSettings';
import FacultySignup from './Components/SignupFaculty/FacultySignup';
import StudentTasks from './Components/Student/StudentTasks';



function ProtectedUserRoute({ children }) {
  const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
  const token = sessionStorage.getItem('token');
  if (!isLoggedIn || !token) return <Navigate to="/login" replace />;
  return children;
}

function ProtectedAdminRoute({ children }) {
  const isAdmin = sessionStorage.getItem('isAdmin') === 'true';
  const token = sessionStorage.getItem('adminToken');
  if (!isAdmin || !token) return <Navigate to="/adminlogin" replace />;
  return children;
}

function AppContent() {
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const loggedIn = sessionStorage.getItem("isLoggedIn");
    setIsLoggedIn(loggedIn === "true");
  }, []);


  const hideHeaderFooter = location.pathname.startsWith('/admin');

  return (
    <>
      {!hideHeaderFooter && <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/view" element={<View />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/faculty" element={<Faculty />} />
        <Route path="/adminlogin" element={<AdminLogin />} />
        <Route path="/adminpanel" element={<ProtectedAdminRoute><Admin /></ProtectedAdminRoute>} />
        <Route path="/admin/faculty" element={<ProtectedAdminRoute><AdminFaculty /></ProtectedAdminRoute>} />
        <Route path="/admin/students" element={<ProtectedAdminRoute><AdminStudent /></ProtectedAdminRoute>} />
        <Route path="/admin/documents" element={<ProtectedAdminRoute><AdminDocuments /></ProtectedAdminRoute>} />
        <Route path="/admin/uploads" element={<ProtectedAdminRoute><AdminUploads /></ProtectedAdminRoute>} />
        <Route path="/admin/settings" element={<ProtectedAdminRoute><AdminSettings /></ProtectedAdminRoute>} />
        <Route path="/FacultySignup" element={<FacultySignup />} />
        <Route path="/my-tasks" element={<StudentTasks />} />
 
        
      </Routes>

      {!hideHeaderFooter && <Footer />}
    </>
  );
}


function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
