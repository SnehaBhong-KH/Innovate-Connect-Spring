import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { FiUser, FiMail, FiMapPin, FiBriefcase, FiGithub, FiLinkedin, FiEdit2, FiSave, FiX, FiGlobe, FiCode, FiActivity, FiStar, FiFileText } from 'react-icons/fi';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UserProfile = () => {
    const { user, token } = useAuth();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});
    const [uploading, setUploading] = useState(false);

    const handleResumeUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Simple validation
        const allowedExtensions = ['pdf', 'docx'];
        const extension = file.name.split('.').pop().toLowerCase();
        if (!allowedExtensions.includes(extension)) {
            toast.error('Only PDF and DOCX files are allowed.');
            return;
        }

        const formDataUpload = new FormData();
        formDataUpload.append('file', file);

        try {
            setUploading(true);
            await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/students/upload-resume`, formDataUpload, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            toast.success('Resume uploaded successfully!');
            // Refresh profile to get updated resume info
            const endpoint = `${import.meta.env.VITE_API_BASE_URL}/api/students/profile`;
            const response = await axios.get(endpoint, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setProfile(response.data);
        } catch (error) {
            console.error('Error uploading resume:', error);
            toast.error('Failed to upload resume.');
        } finally {
            setUploading(false);
        }
    };

    // Fetch Profile Data
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const endpoint = user?.role === 'Student' ? `${import.meta.env.VITE_API_BASE_URL}/api/students/profile` : `${import.meta.env.VITE_API_BASE_URL}/api/companies/profile`;
                const response = await axios.get(endpoint, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setProfile(response.data);
                setFormData(response.data);
            } catch (error) {
                console.error("Error fetching profile:", error);
                // toast.error("Failed to load profile data."); // Suppress on load to avoid spam if just empty
            } finally {
                setLoading(false);
            }
        };

        if (user && token) {
            fetchProfile();
        }
    }, [user, token]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        try {
            const endpoint = user?.role === 'Student' ? `${import.meta.env.VITE_API_BASE_URL}/api/students/profile` : `${import.meta.env.VITE_API_BASE_URL}/api/companies/profile`;

            // Validate basic fields
            if (user?.role === 'Student' && !formData.fullName) {
                toast.error("Full Name is required.");
                return;
            }
            if (user?.role === 'Company' && !formData.companyName) {
                toast.error("Company Name is required.");
                return;
            }

            // Construct DTO
            const updateData = user?.role === 'Student' ? {
                fullName: formData.fullName,
                university: formData.university || "",
                location: formData.location || "",
                gitHubLink: formData.gitHubLink || "",
                leetCodeLink: formData.leetCodeLink || "",
                bio: formData.bio || "",
                skills: formData.skills || ""
            } : {
                companyName: formData.companyName,
                location: formData.location || "",
                website: formData.website || ""
            };

            const response = await axios.put(endpoint, updateData, {
                headers: { Authorization: `Bearer ${token}` }
            });

            console.log("Update Success:", response.data);
            setProfile(response.data);
            setIsEditing(false);
            toast.success("Profile updated successfully!");
        } catch (error) {
            console.error("Error updating profile:", error);
            const msg = error.response?.data?.message || "Failed to update profile. Please try again.";
            toast.error(msg);
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
    );

    const userRole = user?.role || 'Student';
    const joinDate = new Date().toLocaleDateString();

    const displayName = userRole === 'Student' ? profile?.fullName : profile?.companyName;
    const displaySub = userRole === 'Student' ? profile?.university : profile?.location;

    const handleCoverChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formDataUpload = new FormData();
        formDataUpload.append('file', file);

        try {
            const uploadEndpoint = user?.role === 'Student'
                ? `${import.meta.env.VITE_API_BASE_URL}/api/students/upload-cover`
                : `${import.meta.env.VITE_API_BASE_URL}/api/companies/upload-cover`;

            await axios.post(uploadEndpoint, formDataUpload, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });

            toast.success('Cover image updated successfully!');

            // Refresh profile
            const profileEndpoint = user?.role === 'Student' ? `${import.meta.env.VITE_API_BASE_URL}/api/students/profile` : `${import.meta.env.VITE_API_BASE_URL}/api/companies/profile`;
            const response = await axios.get(profileEndpoint, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setProfile(response.data);

        } catch (error) {
            console.error('Error uploading cover:', error);
            toast.error('Failed to update cover image.');
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 animate-fade-in pb-20">
            <ToastContainer position="top-right" autoClose={3000} />
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden relative">

                {/* Cover Image */}
                <div className="h-48 relative overflow-hidden group bg-gray-200">
                    {profile?.hasCoverImage ? (
                        <img
                            src={`${import.meta.env.VITE_API_BASE_URL}/api/${userRole === 'Student' ? 'students' : 'companies'}/${profile.id}/cover?t=${new Date().getTime()}`}
                            alt="Cover"
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-r from-primary to-accent"></div>
                    )}

                    <label className="absolute bottom-4 right-4 bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-white/30 transition-all flex items-center gap-2 cursor-pointer">
                        <FiEdit2 /> Change Cover
                        <input type="file" accept="image/*" className="hidden" onChange={handleCoverChange} />
                    </label>
                </div>

                {/* Profile Header */}
                <div className="px-8 pb-8">
                    <div className="relative flex justify-between items-end -mt-16 mb-6">
                        <div className="relative">
                            <div className="w-32 h-32 bg-white rounded-full p-1 shadow-xl">
                                <div className="w-full h-full bg-light rounded-full flex items-center justify-center text-5xl font-bold text-gray-400 overflow-hidden">
                                    {displayName?.charAt(0).toUpperCase() || <FiUser />}
                                </div>
                            </div>
                            <span className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 border-4 border-white rounded-full"></span>
                        </div>

                        {!isEditing ? (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="bg-primary text-white px-6 py-2 rounded-full font-medium hover:bg-secondary transition-colors shadow-md flex items-center gap-2"
                            >
                                <FiEdit2 /> Edit Profile
                            </button>
                        ) : (
                            <div className="flex gap-2">
                                <button
                                    onClick={() => { setIsEditing(false); setFormData(profile); }} // Reset form data on cancel
                                    className="bg-white text-gray-600 border border-gray-300 px-4 py-2 rounded-full font-medium hover:bg-gray-50 transition-colors flex items-center gap-2"
                                >
                                    <FiX /> Cancel
                                </button>
                                <button
                                    onClick={handleSave}
                                    className="bg-green-600 text-white px-6 py-2 rounded-full font-medium hover:bg-green-700 transition-colors shadow-md flex items-center gap-2"
                                >
                                    <FiSave /> Save Changes
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="mb-8">
                        {isEditing ? (
                            <div className="grid md:grid-cols-2 gap-4 max-w-2xl mb-4 p-4 bg-blue-50 rounded-xl border border-blue-100">
                                <div className="col-span-2 text-sm text-blue-800 font-semibold mb-2">Edit Basic Info</div>
                                <div>
                                    <label className="text-xs font-bold text-gray-600 block mb-1">
                                        {userRole === 'Student' ? 'Full Name' : 'Company Name'} *
                                    </label>
                                    <input
                                        type="text"
                                        name={userRole === 'Student' ? 'fullName' : 'companyName'}
                                        value={userRole === 'Student' ? formData.fullName : formData.companyName}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none transition-all"
                                    />
                                </div>
                                {userRole === 'Student' && (
                                    <div>
                                        <label className="text-xs font-bold text-gray-600 block mb-1">University</label>
                                        <input
                                            type="text"
                                            name="university"
                                            value={formData.university || ''}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none transition-all"
                                        />
                                    </div>
                                )}
                                <div>
                                    <label className="text-xs font-bold text-gray-600 block mb-1">Location</label>
                                    <input
                                        type="text"
                                        name="location"
                                        value={formData.location || ''}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none transition-all"
                                    />
                                </div>
                            </div>
                        ) : (
                            <>
                                <h1 className="text-3xl font-bold text-dark mb-1">{displayName || user?.name || user?.email?.split('@')[0] || 'User'}</h1>
                                <p className="text-gray-500 font-medium flex items-center gap-2">
                                    <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs uppercase tracking-wider">{userRole}</span>
                                    <span className="text-gray-300">•</span>
                                    <span>Joined {joinDate}</span>
                                    {displaySub && (
                                        <>
                                            <span className="text-gray-300">•</span>
                                            <span className="flex items-center gap-1"><FiMapPin /> {displaySub}</span>
                                        </>
                                    )}
                                </p>
                            </>
                        )}
                    </div>

                    {/* Details Grid */}
                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Left Column: Contact & Socials */}
                        <div className="md:col-span-1 space-y-6">

                            {/* Contact Info Card */}
                            <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                                <h3 className="font-bold text-dark mb-4">Contact Info</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 text-gray-600">
                                        <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-sm text-primary">
                                            <FiMail />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-xs text-gray-400 uppercase font-bold">Email</p>
                                            <span className="text-sm font-medium">{user?.email}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 text-gray-600">
                                        <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-sm text-primary">
                                            <FiMapPin />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-xs text-gray-400 uppercase font-bold">Location</p>
                                            <span className="text-sm font-medium">{formData.location || "Not set"}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Socials Card */}
                            <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                                <h3 className="font-bold text-dark mb-4">Social Profiles</h3>

                                {isEditing ? (
                                    <div className="space-y-3">
                                        {userRole === 'Student' && (
                                            <>
                                                <div>
                                                    <label className="text-xs font-bold text-gray-600 block mb-1">GitHub URL</label>
                                                    <input type="text" name="gitHubLink" value={formData.gitHubLink || ''} onChange={handleChange} className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:ring-primary outline-none" placeholder="https://github.com/..." />
                                                </div>
                                                <div>
                                                    <label className="text-xs font-bold text-gray-600 block mb-1">LeetCode URL</label>
                                                    <input type="text" name="leetCodeLink" value={formData.leetCodeLink || ''} onChange={handleChange} className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:ring-primary outline-none" placeholder="https://leetcode.com/..." />
                                                </div>
                                            </>
                                        )}
                                        {userRole === 'Company' && (
                                            <div>
                                                <label className="text-xs font-bold text-gray-600 block mb-1">Website URL</label>
                                                <input type="text" name="website" value={formData.website || ''} onChange={handleChange} className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:ring-primary outline-none" placeholder="https://company.com" />
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {userRole === 'Student' && (
                                            <>
                                                {profile?.gitHubLink ? (
                                                    <a href={profile.gitHubLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200 text-gray-700 hover:border-primary hover:text-primary transition-all group">
                                                        <FiGithub className="text-xl group-hover:scale-110 transition-transform" />
                                                        <span className="text-sm font-medium truncate">GitHub Profile</span>
                                                    </a>
                                                ) : <span className="text-sm text-gray-400 italic">No GitHub link added</span>}

                                                {profile?.leetCodeLink ? (
                                                    <a href={profile.leetCodeLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200 text-gray-700 hover:border-orange-500 hover:text-orange-600 transition-all group">
                                                        <FiCode className="text-xl group-hover:scale-110 transition-transform" />
                                                        <span className="text-sm font-medium truncate">LeetCode Profile</span>
                                                    </a>
                                                ) : <div className="text-sm text-gray-400 italic">No LeetCode link added</div>}
                                            </>
                                        )}

                                        {userRole === 'Company' && (
                                            <>
                                                {profile?.website ? (
                                                    <a href={profile.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200 text-gray-700 hover:border-blue-500 hover:text-blue-600 transition-all group">
                                                        <FiGlobe className="text-xl group-hover:scale-110 transition-transform" />
                                                        <span className="text-sm font-medium truncate">Company Website</span>
                                                    </a>
                                                ) : <div className="text-sm text-gray-400 italic">No Website added</div>}
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Resume Card (Student Only) */}
                            {userRole === 'Student' && (
                                <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                                    <h3 className="font-bold text-dark mb-4">Resume</h3>
                                    <div className="space-y-4">
                                        {(profile?.resume?.resumeFileName || profile?.resumeFileName) ? (
                                            <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
                                                <div className="flex items-center gap-3 overflow-hidden">
                                                    <FiFileText className="text-primary text-xl flex-shrink-0" />
                                                    <span className="text-sm font-medium truncate">{profile?.resume?.resumeFileName || profile?.resumeFileName}</span>
                                                </div>
                                                <a
                                                    href={`${import.meta.env.VITE_API_BASE_URL}/api/students/${profile.id}/resume`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-primary hover:underline text-sm font-bold ml-2"
                                                >
                                                    View
                                                </a>
                                            </div>
                                        ) : (
                                            <p className="text-sm text-gray-400 italic">No resume uploaded</p>
                                        )}

                                        <label className="block w-full text-center py-2 bg-primary/10 text-primary rounded-lg border border-primary/20 hover:bg-primary/20 transition-all cursor-pointer font-bold text-sm">
                                            {uploading ? 'Uploading...' : (profile?.resume?.resumeFileName || profile?.resumeFileName ? 'Update Resume' : 'Upload Resume')}
                                            <input type="file" className="hidden" onChange={handleResumeUpload} accept=".pdf,.docx" />
                                        </label>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Right Column: Bio / Skills / Activity */}
                        <div className="md:col-span-2 space-y-6">

                            {/* About Me */}
                            <div>
                                <h3 className="font-bold text-xl text-dark mb-3">About Me</h3>
                                {isEditing ? (
                                    <textarea
                                        name="bio"
                                        value={formData.bio || ''}
                                        onChange={handleChange}
                                        rows="4"
                                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all resize-none"
                                        placeholder="Tell us about yourself..."
                                    />
                                ) : (
                                    <p className="text-gray-600 leading-relaxed bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                                        {profile?.bio || (userRole === 'Student'
                                            ? "Passionate computer science student dedicated to solving complex problems through technology. Looking for opportunities to collaborate on innovative projects and grow my skills in full-stack development. I love turning ideas into reality using code."
                                            : "We are a forward-thinking company looking for the brightest minds to join our team. We value innovation, integrity, and a passion for technology. Manage your company profile here.")}
                                    </p>
                                )}
                            </div>

                            {/* Skills Section */}
                            {userRole === 'Student' && (
                                <div>
                                    <h3 className="font-bold text-xl text-dark mb-3 flex items-center gap-2"><FiStar className="text-yellow-500" /> Skills</h3>
                                    {isEditing ? (
                                        <div>
                                            <input
                                                type="text"
                                                name="skills"
                                                value={formData.skills || ''}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all"
                                                placeholder="React, Node.js, Python (comma separated)"
                                            />
                                            <p className="text-xs text-gray-500 mt-2 ml-1">Separate skills with commas</p>
                                        </div>
                                    ) : (
                                        <div className="flex flex-wrap gap-2">
                                            {(profile?.skills ? profile.skills.split(',') : ['React', 'Node.js', 'C#', '.NET Core', 'SQL', 'Git', 'UI/UX', 'Tailwind']).map((skill, index) => (
                                                <span key={index} className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-600 text-sm font-medium hover:border-primary hover:text-primary transition-colors cursor-default shadow-sm">
                                                    {skill.trim()}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}


                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
