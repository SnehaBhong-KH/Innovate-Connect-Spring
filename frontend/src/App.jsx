import { BrowserRouter as Router, Routes, Route, useLocation, Link, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { motion } from 'framer-motion';
import { FiTrendingUp, FiZap, FiUsers, FiArrowRight, FiLogIn } from 'react-icons/fi';
import Navbar from './components/Navbar';
import DashboardLayout from './components/DashboardLayout';
import Footer from './components/Footer';
import Login from './pages/Login';
import Register from './pages/Register';
import AboutUs from './pages/AboutUs';
import ContactUs from './pages/ContactUs';
import UserProfile from './pages/UserProfile';
import Settings from './pages/Settings';
import Resources from './pages/Resources';
import StudentDashboard from './pages/StudentDashboard';
import CompanyDashboard from './pages/CompanyDashboard';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';

// Home Component
const Home = () => {
  const { user } = useAuth();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1 flex flex-col items-center justify-center bg-light text-center px-4 pt-10 pb-20 relative overflow-hidden">
        {/* Background blobs */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], x: [0, 50, 0], y: [0, 30, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-0 left-0 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70"
        ></motion.div>
        <motion.div
          animate={{ scale: [1.2, 1, 1.2], x: [0, -50, 0], y: [0, -30, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute top-0 right-0 w-96 h-96 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-70"
        ></motion.div>
        <motion.div
          animate={{ scale: [1, 1.1, 1], x: [0, 30, 0], y: [0, 50, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 4 }}
          className="absolute -bottom-8 left-20 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70"
        ></motion.div>

        <div className="max-w-6xl mx-auto z-10">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="flex flex-col md:flex-row items-center gap-12 mb-16"
          >
            <motion.div variants={itemVariants} className="text-left md:w-1/2">
              <h1 className="text-5xl md:text-7xl font-extrabold text-dark mb-6 leading-tight">
                Where <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Ideas</span> <br />
                Meet <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-purple-600">Industry</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Innovate Connect bridges the gap between talented students and forward-thinking companies.
                Share ideas, find internships, and build the future together.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/register" className="px-8 py-4 bg-primary text-white text-lg rounded-full font-bold hover:bg-secondary transition-all shadow-lg hover:shadow-primary/50 transform hover:-translate-y-1 text-center flex items-center justify-center gap-2 group">
                  Join Us <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                </Link>
                {!user && (
                  <Link to="/login" className="px-8 py-4 bg-white text-primary border-2 border-primary text-lg rounded-full font-bold hover:bg-primary/5 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-1 text-center flex items-center justify-center gap-2">
                    <FiLogIn /> Login
                  </Link>
                )}
              </div>
            </motion.div>
            <motion.div variants={itemVariants} className="md:w-1/2 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-3xl transform rotate-6 opacity-20 blur-lg"></div>
              <img
                src="/images/hero.png"
                alt="Collaboration"
                className="relative rounded-3xl shadow-2xl transform transition-transform hover:scale-105 duration-500 border-4 border-white"
              />
            </motion.div>
          </motion.div>

          {/* Simple Features Grid */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
            className="grid md:grid-cols-3 gap-8 mt-10 text-left"
          >
            <motion.div
              variants={itemVariants}
              whileHover={{ y: -10 }}
              className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-sm border border-white hover:shadow-2xl transition-all duration-300"
            >
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6 text-3xl shadow-inner text-blue-600">
                <FiTrendingUp />
              </div>
              <h3 className="font-bold text-2xl mb-3 text-dark">Launch Career</h3>
              <p className="text-gray-500 leading-relaxed">Find premium internships that match your specific skills and passion for technology.</p>
            </motion.div>
            <motion.div
              variants={itemVariants}
              whileHover={{ y: -10 }}
              className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-sm border border-white hover:shadow-2xl transition-all duration-300"
            >
              <div className="w-16 h-16 bg-pink-100 rounded-2xl flex items-center justify-center mb-6 text-3xl shadow-inner text-pink-600">
                <FiZap />
              </div>
              <h3 className="font-bold text-2xl mb-3 text-dark">Share Ideas</h3>
              <p className="text-gray-500 leading-relaxed">Get discovered by top tier companies looking for fresh innovation and new perspectives.</p>
            </motion.div>
            <motion.div
              variants={itemVariants}
              whileHover={{ y: -10 }}
              className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-sm border border-white hover:shadow-2xl transition-all duration-300"
            >
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mb-6 text-3xl shadow-inner text-purple-600">
                <FiUsers />
              </div>
              <h3 className="font-bold text-2xl mb-3 text-dark">Connect</h3>
              <p className="text-gray-500 leading-relaxed">Direct networking between students and industry leaders without the middleman.</p>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Testimonials Section */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="w-full bg-white py-20 px-4 relative z-20"
      >
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-16">
          <div className="md:w-1/2 relative">
            <div className="absolute inset-0 bg-secondary rounded-3xl transform rotate-3 opacity-20"></div>
            <img
              src="/images/success.png"
              alt="Student Success"
              className="relative rounded-3xl shadow-2xl transform -rotate-2 hover:rotate-0 transition-transform duration-500 border-4 border-white"
            />
          </div>
          <div className="md:w-1/2 text-left">
            <span className="text-primary font-bold tracking-wider uppercase text-sm mb-2 block">Success Stories</span>
            <h2 className="text-4xl font-extrabold text-dark mb-6 leading-tight">From Campus to <span className="text-primary">Career</span></h2>
            <blockquote className="text-xl text-gray-600 italic mb-8 border-l-4 border-primary pl-6 py-2 bg-gray-50 rounded-r-lg shadow-sm">
              "Innovate Connect helped me find an internship that perfectly aligned with my skills. The projects I worked on gave me the confidence to land a full-time role at a top tech company."
            </blockquote>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gray-200 rounded-full overflow-hidden border-2 border-white shadow-md">
                <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop" alt="Student" />
              </div>
              <div>
                <h4 className="font-bold text-dark text-lg">Sarah Miller</h4>
                <p className="text-sm text-gray-500 font-medium">Software Engineer @ TechFlow</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// Dashboard Router
const DashboardRouter = () => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;

  if (user.role === 'Student') return <StudentDashboard />;
  if (user.role === 'Company') return <CompanyDashboard />;
  if (user.role === 'Admin') return <AdminDashboard />;

  return <div className="p-10">Unknown Role</div>;
};

// App Layout
const AppLayout = () => {
  const location = useLocation();
  const isDashboard = location.pathname.startsWith('/dashboard');

  return (
    <div className="min-h-screen bg-light text-dark font-sans flex flex-col">
      {!isDashboard && <Navbar />}
      <div className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/dashboard" element={
            <ProtectedRoute>
              <DashboardLayout>
                <DashboardRouter />
              </DashboardLayout>
            </ProtectedRoute>
          } />

          <Route path="/profile" element={
            <ProtectedRoute>
              <DashboardLayout>
                <UserProfile />
              </DashboardLayout>
            </ProtectedRoute>
          } />

          <Route path="/settings" element={
            <ProtectedRoute>
              <DashboardLayout>
                <Settings />
              </DashboardLayout>
            </ProtectedRoute>
          } />

          <Route path="/resources" element={
            <ProtectedRoute>
              <DashboardLayout>
                <Resources />
              </DashboardLayout>
            </ProtectedRoute>
          } />

          <Route path="/post-internship" element={
            <ProtectedRoute allowedRoles={['Company']}>
              <DashboardLayout>
                <CompanyDashboard initialTab="post-internship" />
              </DashboardLayout>
            </ProtectedRoute>
          } />

          <Route path="/candidates" element={
            <ProtectedRoute allowedRoles={['Company']}>
              <DashboardLayout>
                <div className="p-10 text-center">
                  <h2 className="text-2xl font-bold mb-4">Candidates</h2>
                  <p className="text-gray-500">Feature coming soon.</p>
                </div>
              </DashboardLayout>
            </ProtectedRoute>
          } />

          <Route path="/admin/users" element={
            <ProtectedRoute allowedRoles={['Admin']}>
              <DashboardLayout>
                <div className="p-10 text-center">
                  <h2 className="text-2xl font-bold mb-4">User Management</h2>
                  <p className="text-gray-500">Admin User Management Interface</p>
                </div>
              </DashboardLayout>
            </ProtectedRoute>
          } />

          <Route path="/admin/moderation" element={
            <ProtectedRoute allowedRoles={['Admin']}>
              <DashboardLayout>
                <div className="p-10 text-center">
                  <h2 className="text-2xl font-bold mb-4">Content Moderation</h2>
                  <p className="text-gray-500">Admin Moderation Interface</p>
                </div>
              </DashboardLayout>
            </ProtectedRoute>
          } />

          <Route path="/applications" element={
            <ProtectedRoute allowedRoles={['Student']}>
              <DashboardLayout>
                <StudentDashboard initialTab="applications" />
              </DashboardLayout>
            </ProtectedRoute>
          } />
        </Routes>
      </div>
      {!isDashboard && <Footer />}
    </div>
  );
};

// Main App Component
function App() {
  return (
    <AuthProvider>
      <Router>
        <AppLayout />
      </Router>
    </AuthProvider>
  );
}

export default App;
