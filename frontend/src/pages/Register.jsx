import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { FiUser, FiMail, FiLock, FiGithub, FiCode, FiMapPin, FiBriefcase, FiGlobe } from 'react-icons/fi';

// Components for fields
// eslint-disable-next-line no-unused-vars
const InputField = ({ icon: Icon, ...props }) => (
    <div className="relative">
        <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
            {...props}
            className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
        />
    </div>
);

const Register = () => {
    const [formData, setFormData] = useState({
        role: 'Student',
        fullName: '',
        companyName: '',
        email: '',
        password: '',
        university: '',
        gitHubLink: '',
        leetCodeLink: '',
        location: '',
        website: ''
    });

    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { role } = formData;

    // Update formData when role changes
    const handleRoleChange = (newRole) => {
        setFormData({ ...formData, role: newRole });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        // Clear error for this field when user starts typing
        if (errors[name]) {
            setErrors({ ...errors, [name]: '' });
        }
    };

    const validateForm = () => {
        const newErrors = {};

        // Validate name fields (no leading spaces, but internal spaces allowed)
        const nameField = role === 'Student' ? 'fullName' : 'companyName';
        const nameValue = formData[nameField];
        if (!nameValue || !nameValue.trim()) {
            newErrors[nameField] = `${role === 'Student' ? 'Full Name' : 'Company Name'} cannot be empty or contain only spaces`;
        } else if (nameValue !== nameValue.trimStart()) {
            newErrors[nameField] = `${role === 'Student' ? 'Full Name' : 'Company Name'} cannot start with spaces`;
        }

        // Validate email (no spaces allowed)
        if (!formData.email || !formData.email.trim()) {
            newErrors.email = 'Email cannot be empty or contain only spaces';
        } else if (formData.email.includes(' ')) {
            newErrors.email = 'Email cannot contain spaces';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        // Validate password (strong requirements)
        if (!formData.password || !formData.password.trim()) {
            newErrors.password = 'Password cannot be empty or contain only spaces';
        } else if (formData.password.includes(' ')) {
            newErrors.password = 'Password cannot contain spaces';
        } else if (formData.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters long';
        } else if (!/[A-Z]/.test(formData.password)) {
            newErrors.password = 'Password must contain at least one uppercase letter';
        } else if (!/[0-9]/.test(formData.password)) {
            newErrors.password = 'Password must contain at least one number';
        } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(formData.password)) {
            newErrors.password = 'Password must contain at least one special character (!@#$%^&*(),.?":{}|<>)';
        }

        // Validate company location if role is Company
        if (role === 'Company' && (!formData.location || !formData.location.trim())) {
            newErrors.location = 'Location cannot be empty or contain only spaces';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate form before submission
        if (!validateForm()) {
            return;
        }

        setIsLoading(true);

        try {
            // Prepare payload based on role
            const payload = {
                email: formData.email.trim(),
                password: formData.password,
                role: role,
                // Common/Specific fields mapping
                fullName: role === 'Student' ? formData.fullName.trim() : undefined,
                university: role === 'Student' ? formData.university.trim() : undefined,
                gitHubLink: role === 'Student' ? formData.gitHubLink.trim() : undefined,
                leetCodeLink: role === 'Student' ? formData.leetCodeLink.trim() : undefined,
                companyName: role === 'Company' ? formData.companyName.trim() : undefined,
                location: role === 'Company' ? formData.location.trim() : undefined,
                website: role === 'Company' ? formData.website.trim() : undefined
            };

            await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/auth/register`, payload);
            alert('Registration successful! Please login.');
            navigate('/login');
        } catch (error) {
            console.error('Registration failed:', error);
            alert('Registration failed: ' + (error.response?.data || error.message));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-4 py-10 bg-light">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-lg animate-fade-in border border-gray-100">
                <h2 className="text-3xl font-bold text-center text-dark mb-2">Create Account</h2>
                <p className="text-center text-gray-500 mb-6">Join as a Student or Company</p>

                <div className="flex bg-gray-100 p-1 rounded-lg mb-8">
                    <button
                        className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${role === 'Student' ? 'bg-white text-primary shadow-sm' : 'text-gray-500 hover:text-gray-700'
                            }`}
                        onClick={() => handleRoleChange('Student')}
                    >
                        Student
                    </button>
                    <button
                        className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${role === 'Company' ? 'bg-white text-primary shadow-sm' : 'text-gray-500 hover:text-gray-700'
                            }`}
                        onClick={() => handleRoleChange('Company')}
                    >
                        Company
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Common Fields */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            {role === 'Company' ? 'Company Name' : 'Full Name'}
                        </label>
                        <InputField
                            icon={role === 'Company' ? FiBriefcase : FiUser}
                            type="text"
                            name={role === 'Company' ? "companyName" : "fullName"}
                            value={role === 'Company' ? formData.companyName : formData.fullName}
                            onChange={handleChange}
                            placeholder={role === 'Company' ? "Tech Corp Inc." : "John Doe"}
                            required
                        />
                        {errors[role === 'Company' ? 'companyName' : 'fullName'] && (
                            <p className="text-red-500 text-xs mt-1">{errors[role === 'Company' ? 'companyName' : 'fullName']}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                        <InputField
                            icon={FiMail}
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="you@example.com"
                            required
                        />
                        {errors.email && (
                            <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <InputField
                            icon={FiLock}
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="••••••••"
                            required
                        />
                        {errors.password && (
                            <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                        )}
                    </div>

                    {/* Student Specific Fields */}
                    {role === 'Student' && (
                        <>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">University / College</label>
                                <InputField
                                    icon={FiMapPin}
                                    type="text"
                                    name="university"
                                    value={formData.university}
                                    onChange={handleChange}
                                    placeholder="Stanford University"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">GitHub Profile</label>
                                    <InputField
                                        icon={FiGithub}
                                        type="url"
                                        name="gitHubLink"
                                        value={formData.gitHubLink}
                                        onChange={handleChange}
                                        placeholder="github.com/username"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">LeetCode Profile</label>
                                    <InputField
                                        icon={FiCode}
                                        type="url"
                                        name="leetCodeLink"
                                        value={formData.leetCodeLink}
                                        onChange={handleChange}
                                        placeholder="leetcode.com/username"
                                    />
                                </div>
                            </div>
                        </>
                    )}

                    {/* Company Specific Fields */}
                    {role === 'Company' && (
                        <>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                                <InputField
                                    icon={FiMapPin}
                                    type="text"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleChange}
                                    placeholder="San Francisco, CA"
                                    required
                                />
                                {errors.location && (
                                    <p className="text-red-500 text-xs mt-1">{errors.location}</p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                                <InputField
                                    icon={FiGlobe}
                                    type="url"
                                    name="website"
                                    value={formData.website}
                                    onChange={handleChange}
                                    placeholder="https://company.com"
                                />
                            </div>
                        </>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full py-3 mt-4 text-white rounded-lg font-semibold transition-colors shadow-md hover:shadow-lg ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-primary hover:bg-secondary'}`}
                    >
                        {isLoading ? 'Registering...' : `Register as ${role}`}
                    </button>
                </form>

                <p className="mt-6 text-center text-gray-600">
                    Already have an account?{' '}
                    <Link to="/login" className="text-primary font-semibold hover:underline">
                        Sign In
                    </Link>
                </p>
            </div>
        </div>
    );
};
export default Register;
