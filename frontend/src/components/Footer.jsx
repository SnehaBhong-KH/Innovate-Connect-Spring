import { Link } from 'react-router-dom';
import { FiGithub, FiTwitter, FiLinkedin, FiInstagram, FiMail, FiPhone } from 'react-icons/fi';
import logo from '../assets/logo.png';

const Footer = () => {
    return (
        <footer className="bg-white border-t border-gray-100 pt-16 pb-8">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    {/* Brand Column */}
                    <div className="col-span-1 md:col-span-1">
                        <Link to="/" className="text-2xl font-bold text-primary mb-4 flex items-center gap-3">
                            <img src={logo} alt="Logo" className="w-8 h-8 object-contain" />
                            <span>
                                Innovate<span className="text-dark">Connect</span>
                            </span>
                        </Link>
                        <p className="text-gray-500 mb-6 leading-relaxed">
                            Bridging the gap between academic potential and industry innovation. Join us in shaping the future of technology.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-600 hover:bg-primary hover:text-white transition-all">
                                <FiGithub className="text-xl" />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-600 hover:bg-blue-400 hover:text-white transition-all">
                                <FiTwitter className="text-xl" />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-600 hover:bg-blue-600 hover:text-white transition-all">
                                <FiLinkedin className="text-xl" />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-600 hover:bg-pink-600 hover:text-white transition-all">
                                <FiInstagram className="text-xl" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-bold text-dark mb-6">Platform</h4>
                        <ul className="space-y-4">
                            <li><Link to="/" className="text-gray-500 hover:text-primary transition-colors">Home</Link></li>
                            <li><Link to="/about" className="text-gray-500 hover:text-primary transition-colors">About Us</Link></li>
                            <li><Link to="/contact" className="text-gray-500 hover:text-primary transition-colors">Contact</Link></li>
                            <li><Link to="/internships" className="text-gray-500 hover:text-primary transition-colors">Browse Internships</Link></li>
                        </ul>
                    </div>

                    {/* Resources */}
                    <div>
                        <h4 className="font-bold text-dark mb-6">Resources</h4>
                        <ul className="space-y-4">
                            <li><a href="#" className="text-gray-500 hover:text-primary transition-colors">Blog</a></li>
                            <li><a href="#" className="text-gray-500 hover:text-primary transition-colors">Case Studies</a></li>
                            <li><a href="#" className="text-gray-500 hover:text-primary transition-colors">Success Stories</a></li>
                            <li><a href="#" className="text-gray-500 hover:text-primary transition-colors">Help Center</a></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="font-bold text-dark mb-6">Contact</h4>
                        <ul className="space-y-4">
                            <li className="flex items-center gap-3 text-gray-500">
                                <FiMail className="text-primary" />
                                <span>hello@innovateconnect.com</span>
                            </li>
                            <li className="flex items-center gap-3 text-gray-500">
                                <FiPhone className="text-primary" />
                                <span>+1 (555) 123-4567</span>
                            </li>
                            <li className="text-gray-500 leading-relaxed mt-2">
                                123 Innovation Drive<br />
                                Tech Valley, CA 94043
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-gray-400 text-sm">
                        © {new Date().getFullYear()} Innovate Connect. All rights reserved.
                    </p>
                    <div className="flex gap-8 text-sm text-gray-500">
                        <a href="#" className="hover:text-dark transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-dark transition-colors">Terms of Service</a>
                        <a href="#" className="hover:text-dark transition-colors">Cookies Settings</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
