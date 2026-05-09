import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';
import { FiMenu } from 'react-icons/fi';
import { useState } from 'react';
import { Link } from 'react-router-dom';

const DashboardLayout = ({ children }) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Desktop Sidebar */}
            <Sidebar />

            {/* Main Content Area */}
            <main className="flex-1 md:ml-64 min-h-screen transition-all">
                {/* Mobile Header */}
                <header className="bg-white shadow-sm p-4 md:hidden flex justify-between items-center sticky top-0 z-30">
                    <Link to="/" className="text-xl font-bold text-primary">
                        Innovate<span className="text-dark">Connect</span>
                    </Link>
                    <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-2xl text-dark">
                        <FiMenu />
                    </button>
                </header>

                {/* Mobile Sidebar Overlay */}
                {isMobileMenuOpen && (
                    <div className="fixed inset-0 z-50 bg-black/50 md:hidden" onClick={() => setIsMobileMenuOpen(false)}>
                        <Sidebar className="flex h-full shadow-2xl" />
                    </div>
                )}

                <div className="p-4 md:p-8 max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;
