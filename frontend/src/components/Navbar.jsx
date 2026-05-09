import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiMenu, FiX } from 'react-icons/fi';
import { useState } from 'react';

import logo from '../assets/logo.png';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100 sticky top-0 z-50">
            <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                <Link to="/" className="text-2xl font-bold text-primary flex items-center gap-3 hover:opacity-90 transition-opacity">
                    <img src={logo} alt="Logo" className="w-10 h-10 object-contain" />
                    <span>
                        Innovate<span className="text-dark">Connect</span>
                    </span>
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-8">
                    <Link to="/" className="text-dark hover:text-primary font-medium transition-colors">Home</Link>
                    <Link to="/about" className="text-dark hover:text-primary font-medium transition-colors">About Us</Link>
                    <Link to="/contact" className="text-dark hover:text-primary font-medium transition-colors">Contact Us</Link>

                    {!user ? (
                        <>
                            <Link to="/login" className="px-5 py-2 bg-white text-primary border-2 border-primary rounded-full font-medium hover:bg-primary hover:text-white transition-all shadow-md hover:shadow-lg">
                                Sign In
                            </Link>
                            <Link to="/register" className="px-5 py-2 bg-primary text-white rounded-full font-medium hover:bg-secondary transition-all shadow-md hover:shadow-lg">
                                Join Us
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link to="/dashboard" className="px-5 py-2 bg-white text-primary border-2 border-primary rounded-full font-medium hover:bg-primary hover:text-white transition-all shadow-md hover:shadow-lg">
                                Dashboard
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="px-5 py-2 bg-primary text-white rounded-full font-medium hover:bg-secondary transition-all shadow-md hover:shadow-lg"
                            >
                                Logout
                            </button>
                        </>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <button className="md:hidden text-2xl text-dark" onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? <FiX /> : <FiMenu />}
                </button>
            </div>

            {/* Mobile Dropdown */}
            {isOpen && (
                <div className="md:hidden bg-white border-t p-4 flex flex-col gap-4 shadow-lg">
                    <Link to="/" className="text-dark hover:text-primary" onClick={() => setIsOpen(false)}>Home</Link>
                    <Link to="/about" className="text-dark hover:text-primary" onClick={() => setIsOpen(false)}>About Us</Link>
                    <Link to="/contact" className="text-dark hover:text-primary" onClick={() => setIsOpen(false)}>Contact Us</Link>
                    {!user ? (
                        <>
                            <Link to="/login" className="px-5 py-2 bg-white text-primary border-2 border-primary rounded-full font-medium hover:bg-primary hover:text-white transition-all text-center" onClick={() => setIsOpen(false)}>
                                Sign In
                            </Link>
                            <Link to="/register" className="px-5 py-2 bg-primary text-white rounded-full font-medium hover:bg-secondary transition-all text-center" onClick={() => setIsOpen(false)}>Join Us</Link>
                        </>
                    ) : (
                        <>
                            <Link to="/dashboard" className="px-5 py-2 bg-white text-primary border-2 border-primary rounded-full font-medium hover:bg-primary hover:text-white transition-all text-center" onClick={() => setIsOpen(false)}>
                                Dashboard
                            </Link>
                            <button
                                onClick={() => { handleLogout(); setIsOpen(false); }}
                                className="px-5 py-2 bg-primary text-white rounded-full font-medium hover:bg-secondary transition-all text-center"
                            >
                                Logout
                            </button>
                        </>
                    )}
                </div>
            )}
        </nav>
    );
};
export default Navbar;
