import { motion } from 'framer-motion';
import { FiUsers, FiTarget, FiAward } from 'react-icons/fi';

// Import team images
import snehaImg from '../assets/250840320199 (1).png';
import shivanjalImg from '../assets/shivanjali mote (photo).jpg';
import somaImg from '../assets/SomaVasudev.jpg';
import mohiniImg from '../assets/250840320101.png';
import purvaImg from '../assets/WhatsApp Image 2026-01-02 at 1.30.54 PM.jpeg';

const AboutUs = () => {
    return (
        <div className="min-h-screen bg-light pt-20 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Hero Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-20"
                >
                    <div className="relative rounded-3xl overflow-hidden mb-12 shadow-2xl h-[400px]">
                        <img
                            src="/images/team.png"
                            alt="Innovate Connect Team"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-dark/80 to-transparent flex items-end justify-center pb-12">
                            <h1 className="text-4xl font-extrabold text-white sm:text-5xl sm:tracking-tight lg:text-6xl drop-shadow-lg">
                                Empowering <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Innovation</span>
                            </h1>
                        </div>
                    </div>
                    <p className="mt-5 max-w-2xl mx-auto text-xl text-gray-500">
                        Bridging the gap between ambitious students and industry leaders to build the future of technology.
                    </p>
                </motion.div>

                {/* Mission Cards */}
                <div className="grid grid-cols-1 gap-8 md:grid-cols-3 mb-24">
                    {/* ... keeping existing cards ... */}
                    <motion.div
                        whileHover={{ y: -5 }}
                        className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 text-center group hover:border-primary/20 transition-all"
                    >
                        <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                            <FiTarget className="text-3xl text-primary" />
                        </div>
                        <h3 className="text-xl font-bold text-dark mb-3">Our Mission</h3>
                        <p className="text-gray-600">
                            To create a seamless ecosystem where student creativity meets corporate resources, fostering a culture of practical innovation.
                        </p>
                    </motion.div>

                    <motion.div
                        whileHover={{ y: -5 }}
                        className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 text-center group hover:border-accent/20 transition-all"
                    >
                        <div className="bg-pink-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                            <FiUsers className="text-3xl text-accent" />
                        </div>
                        <h3 className="text-xl font-bold text-dark mb-3">Community First</h3>
                        <p className="text-gray-600">
                            Building a strong, inclusive community where mentorship and collaboration drive exceptional growth and learning.
                        </p>
                    </motion.div>

                    <motion.div
                        whileHover={{ y: -5 }}
                        className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 text-center group hover:border-purple-500/20 transition-all"
                    >
                        <div className="bg-purple-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                            <FiAward className="text-3xl text-purple-600" />
                        </div>
                        <h3 className="text-xl font-bold text-dark mb-3">Excellence</h3>
                        <p className="text-gray-600">
                            Setting high standards for quality and integrity in every connection made and every project realized through our platform.
                        </p>
                    </motion.div>
                </div>

                {/* Team Section */}
                <div className="mb-16">
                    <h2 className="text-3xl font-bold text-dark text-center mb-4">Meet the Minds Behind Innovate Connect</h2>
                    <p className="text-center text-gray-500 mb-12 max-w-2xl mx-auto">Our diverse team of experts is dedicated to revolutionizing how talent meets opportunity.</p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 justify-items-center">
                        {[
                            { name: "Sneha Bhong", role: "Developer", img: snehaImg },
                            { name: "Shivanjali Mote", role: "Developer", img: shivanjalImg },
                            { name: "Soma Vasudev", role: "Developer", img: somaImg },
                            { name: "Mohini Kasar", role: "Developer", img: mohiniImg },
                            { name: "Purva Thavai", role: "Developer", img: purvaImg },

                        ].map((member, index) => (
                            <motion.div
                                key={index}
                                whileHover={{ y: -5 }}
                                className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 w-full max-w-[240px]"
                            >
                                <div className="h-56 overflow-hidden bg-gray-100">
                                    <img
                                        src={member.img}
                                        alt={member.name}
                                        className="w-full h-full object-cover object-top transition-transform duration-500 hover:scale-110"
                                    />
                                </div>
                                <div className="p-4 text-center">
                                    <h4 className="font-bold text-lg text-dark">{member.name}</h4>
                                    <p className="text-primary font-medium text-sm mb-2">{member.role}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutUs;