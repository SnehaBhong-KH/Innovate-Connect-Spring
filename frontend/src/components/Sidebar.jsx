import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiHome, FiUser, FiBriefcase, FiLogOut, FiSettings, FiGrid, FiLayers, FiUsers } from 'react-icons/fi';

import logo from '../assets/logo.png';

const Sidebar = ({ className = "hidden md:flex" }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const getNavItems = () => {
        switch (user?.role) {
            case 'Student':
                return [
                    { name: 'Dashboard', path: '/dashboard', icon: <FiGrid /> },
                    { name: 'My Profile', path: '/profile', icon: <FiUser /> },
                    { name: 'My Applications', path: '/applications', icon: <FiBriefcase /> },
                    { name: 'Resources', path: '/resources', icon: <FiLayers /> },
                ];
            case 'Company':
                return [
                    { name: 'Dashboard', path: '/dashboard', icon: <FiGrid /> },
                    { name: 'My Profile', path: '/profile', icon: <FiUser /> },
                    { name: 'Post Internship', path: '/post-internship', icon: <FiBriefcase /> },
                    { name: 'Candidates', path: '/candidates', icon: <FiUsers /> },
                ];
            case 'Admin':
                return [
                    { name: 'Dashboard', path: '/dashboard', icon: <FiGrid /> },
                ];
            default:
                return [];
        }
    };

    const navItems = getNavItems();

    return (
        <aside className={`fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 z-40 flex-col ${className}`}>
            {/* Logo area */}
            <div className="p-6 border-b border-gray-100 flex items-center justify-start gap-3">
                <img src={logo} alt="Logo" className="w-8 h-8 object-contain" />
                <h1 className="text-xl font-bold text-primary">
                    Innovate<span className="text-dark">Connect</span>
                </h1>
            </div>

            {/* Profile Summary */}
            <div className="p-6 flex flex-col items-center border-b border-gray-100 bg-gray-50/50">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-2xl font-bold text-primary mb-3">
                    {user?.name ? user.name.charAt(0).toUpperCase() : (user?.email?.charAt(0).toUpperCase() || 'U')}
                </div>
                <h3 className="font-semibold text-dark">{user?.name || user?.email?.split('@')[0] || 'User'}</h3>
                <span className="text-xs text-uppercase tracking-wider text-gray-500 bg-gray-200 px-2 py-0.5 rounded-full mt-1">
                    {user?.role}
                </span>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                <div className="space-y-1">
                    <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Menu</p>
                    {navItems.map((item, index) => (
                        <NavLink
                            key={index}
                            to={item.path}
                            end
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive && item.path !== '/' // simple check, strict matching usually better
                                    ? 'bg-primary text-white shadow-md shadow-primary/30'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-dark'
                                }`
                            }
                        >
                            <span className="text-xl">{item.icon}</span>
                            <span className="font-medium">{item.name}</span>
                        </NavLink>
                    ))}

                    <div className="my-4 border-t border-gray-100 mx-2"></div>

                    <NavLink
                        to="/"
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-50 hover:text-dark transition-all"
                    >
                        <FiHome className="text-xl" />
                        <span className="font-medium">Back to Home</span>
                    </NavLink>
                </div>
            </nav>

            {/* Footer / Logout */}
            <div className="p-4 border-t border-gray-100">
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl transition-all font-medium"
                >
                    <FiLogOut className="text-xl" />
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
