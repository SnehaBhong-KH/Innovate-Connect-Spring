import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { FiGithub, FiBriefcase, FiPlusCircle, FiList, FiCheckCircle, FiUpload } from 'react-icons/fi';
import GitHubStats from '../components/GitHubStats';
import LeetCodeStats from '../components/LeetCodeStats';

const StudentDashboard = ({ initialTab = 'internships' }) => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState(initialTab);
    const [internships, setInternships] = useState([]);
    const [recommendedInternships, setRecommendedInternships] = useState([]);
    const [myApplications, setMyApplications] = useState([]);
    const [studentProfile, setStudentProfile] = useState(null);
    const [myIdeas, setMyIdeas] = useState([]);
    const [githubUsername, setGithubUsername] = useState(null);
    const [leetcodeUsername, setLeetcodeUsername] = useState(null);
    const [ideaFormData, setIdeaFormData] = useState({ title: '', technologyUsed: '', description: '' });
    const [uploading, setUploading] = useState(false);

    const handleResumeUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Simple validation
        const allowedExtensions = ['pdf', 'docx'];
        const extension = file.name.split('.').pop().toLowerCase();
        if (!allowedExtensions.includes(extension)) {
            alert('Only PDF and DOCX files are allowed.');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            setUploading(true);
            const token = localStorage.getItem('token');
            await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/students/upload-resume`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            alert('Resume uploaded successfully!');
            fetchStudentProfile(); // To update the resume name display
        } catch (error) {
            console.error('Error uploading resume:', error);
            alert('Failed to upload resume.');
        } finally {
            setUploading(false);
        }
    };

    useEffect(() => {
        fetchInternships();
        fetchMyApplications();
        fetchStudentProfile();
        fetchMyIdeas();
        fetchRecommendedInternships();
    }, []);

    const fetchInternships = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/internships`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setInternships(response.data);
        } catch (error) {
            console.error('Error fetching internships:', error);
        }
    };

    const fetchRecommendedInternships = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/internships/recommendations`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setRecommendedInternships(response.data);
        } catch (error) {
            console.error('Error fetching recommendations:', error);
        }
    };

    const fetchMyApplications = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/applications/my`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMyApplications(response.data);
        } catch (error) {
            console.error('Error fetching applications:', error);
        }
    };

    const fetchMyIdeas = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/ideas/my`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log("My Ideas Response:", response.data);
            setMyIdeas(response.data);
        } catch (error) {
            console.error('Error fetching ideas:', error);
        }
    };

    const fetchStudentProfile = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/students/profile`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setStudentProfile(response.data);
            console.log("Student Profile Data:", response.data);

            const githubLink = response.data.gitHubLink || response.data.GitHubLink;
            const leetcodeLink = response.data.leetCodeLink || response.data.LeetCodeLink;

            if (githubLink) {
                // Extract username from URL (e.g., https://github.com/username or https://github.com/username/)
                const parts = githubLink.split('/').filter(p => p);
                const username = parts[parts.length - 1];
                setGithubUsername(username);
            }

            if (leetcodeLink) {
                const parts = leetcodeLink.split('/').filter(p => p);
                const username = parts[parts.length - 1];
                setLeetcodeUsername(username);
            }

        } catch (error) {
            console.error('Error fetching profile:', error);
        }
    };

    const handleApply = async (internshipId) => {
        try {
            const token = localStorage.getItem('token');
            await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/applications/${internshipId}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('Application submitted successfully!');
            fetchMyApplications(); // Refresh to update status
        } catch (error) {
            console.error('Error applying:', error);
            const errorMessage = error.response?.data || error.message;
            alert('Failed to apply: ' + errorMessage);
        }
    };

    const getApplicationStatus = (internshipId) => {
        const app = myApplications.find(a => a.internship?.id === internshipId);
        return app ? app.status : null;
    };

    const handlePostIdea = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/ideas`, ideaFormData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('Idea posted successfully!');
            setIdeaFormData({ title: '', technologyUsed: '', description: '' });
            fetchMyIdeas();
            setActiveTab('my-ideas');
        } catch (error) {
            console.error('Error posting idea:', error);
            alert('Failed to post idea.');
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Header with Stats */}
            <div className="bg-white p-6 rounded-xl shadow-md mb-8 flex flex-col md:flex-row justify-between items-center border border-gray-100">
                <div>
                    <h1 className="text-2xl font-bold text-dark">Welcome back, {user?.name || user?.email || 'User'} 👋</h1>
                    <p className="text-gray-500">Student Dashboard</p>
                </div>
                <div className="flex gap-6 mt-4 md:mt-0">
                    <div className="flex flex-col items-center">
                        <label className="cursor-pointer bg-primary/10 text-primary px-4 py-2 rounded-lg hover:bg-primary/20 transition-all flex items-center gap-2 font-medium border border-primary/20">
                            <FiUpload /> {uploading ? 'Uploading...' : 'Upload Resume'}
                            <input type="file" className="hidden" onChange={handleResumeUpload} accept=".pdf,.docx" />
                        </label>
                        {(studentProfile?.resumeFileName || studentProfile?.resume?.resumeFileName) && (
                            <div className="flex items-center gap-2 mt-1">
                                <p className="text-[10px] text-gray-400 max-w-[150px] truncate">
                                    📄 {studentProfile?.resumeFileName || studentProfile?.resume?.resumeFileName}
                                </p>
                                <a
                                    href={`${import.meta.env.VITE_API_BASE_URL}/api/students/${studentProfile.id || studentProfile.Id}/resume`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[10px] text-primary hover:underline font-bold"
                                >
                                    View
                                </a>
                            </div>
                        )}
                    </div>
                    <div className="text-center">
                        <div className="flex items-center gap-2 text-gray-600 font-medium">
                            <FiCheckCircle /> Applied
                        </div>
                        <p className="text-2xl font-bold text-accent">{myApplications.length}</p>
                    </div>
                </div>
            </div>

            {/* Extrnal Stats */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
                <GitHubStats username={githubUsername} />
                <LeetCodeStats username={leetcodeUsername} />
            </div>

            {/* Tabs */}
            <div className="flex gap-4 mb-6 border-b border-gray-200">
                <button
                    onClick={() => setActiveTab('internships')}
                    className={`pb-2 px-4 font-medium transition-all ${activeTab === 'internships' ? 'text-primary border-b-2 border-primary' : 'text-gray-500 hover:text-dark'}`}
                >
                    Browse Internships
                </button>
                <button
                    onClick={() => setActiveTab('applications')}
                    className={`pb-2 px-4 font-medium transition-all ${activeTab === 'applications' ? 'text-primary border-b-2 border-primary' : 'text-gray-500 hover:text-dark'}`}
                >
                    My Applications
                </button>
                <button
                    onClick={() => setActiveTab('my-ideas')}
                    className={`pb-2 px-4 font-medium transition-all ${activeTab === 'my-ideas' ? 'text-primary border-b-2 border-primary' : 'text-gray-500 hover:text-dark'}`}
                >
                    My Ideas
                </button>
                <button
                    onClick={() => setActiveTab('post-idea')}
                    className={`pb-2 px-4 font-medium transition-all ${activeTab === 'post-idea' ? 'text-primary border-b-2 border-primary' : 'text-gray-500 hover:text-dark'}`}
                >
                    Post New Idea
                </button>
            </div>

            {/* Content Content - Internships */}
            {activeTab === 'internships' && (
                <div className="space-y-8 animate-fade-in">
                    {/* Recommendations Section */}
                    {recommendedInternships.length > 0 && (
                        <div className="bg-gradient-to-r from-primary/5 to-accent/5 p-6 rounded-2xl border border-primary/10">
                            <div className="flex items-center gap-2 mb-6">
                                <div className="p-2 bg-primary text-white rounded-lg shadow-lg shadow-primary/20">
                                    <FiBriefcase size={20} />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-dark">Recommended for You</h2>
                                    <p className="text-xs text-gray-500 font-medium">Based on your location: {studentProfile?.location}</p>
                                </div>
                            </div>
                            <div className="grid md:grid-cols-2 gap-6">
                                {recommendedInternships.map(item => {
                                    const status = getApplicationStatus(item.id);
                                    return (
                                        <div key={`rec-${item.id}`} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 group">
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="flex items-start gap-4">
                                                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                                                        🏢
                                                    </div>
                                                    <div>
                                                        <h3 className="text-lg font-bold text-dark">{item.title}</h3>
                                                        <p className="text-gray-500 text-xs font-medium">{item.company?.companyName || 'Unknown Company'}</p>
                                                    </div>
                                                </div>
                                                <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-[10px] font-bold rounded-full border border-yellow-200">Matched Location</span>
                                            </div>
                                            <div className="space-y-2 mb-4 text-sm">
                                                <p className="text-gray-600 flex items-center gap-2">
                                                    <span className="font-semibold w-16">💰 Stipend:</span> ${item.stipend}/mo
                                                </p>
                                                <p className="text-gray-600 flex items-center gap-2">
                                                    <span className="font-semibold w-16">💻 Tech:</span>
                                                    <span className="px-2 py-0.5 bg-gray-100 rounded text-[10px] font-medium">{item.technologyUsed}</span>
                                                </p>
                                            </div>
                                            {status ? (
                                                <div className={`text-center py-2 rounded-lg text-xs font-bold uppercase tracking-wider ${status === 'Accepted' ? 'bg-green-100 text-green-700' : status === 'Rejected' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'}`}>
                                                    {status}
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => handleApply(item.id)}
                                                    className="w-full py-2 bg-primary text-white rounded-lg font-bold hover:bg-secondary transition-all text-xs shadow-md shadow-primary/20"
                                                >
                                                    Apply Now
                                                </button>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    <div className="flex items-center gap-2 mb-4 px-2">
                        <FiList className="text-primary" />
                        <h2 className="text-xl font-bold text-dark">All Opportunities</h2>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                    {internships.map(item => {
                        const status = getApplicationStatus(item.id);
                        return (
                            <div key={item.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 bg-indigo-50 rounded-lg flex items-center justify-center text-2xl">
                                            🏢
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-dark">{item.title}</h3>
                                            <p className="text-gray-500 text-sm font-medium">{item.company?.companyName || 'Unknown Company'}</p>
                                        </div>
                                    </div>
                                    <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full border border-green-200">Open</span>
                                </div>
                                <div className="space-y-3 mb-6 bg-gray-50 p-4 rounded-lg">
                                    <p className="text-sm text-gray-700 flex items-center gap-2">
                                        <span className="font-semibold w-20">💰 Stipend:</span> ${item.stipend}/mo
                                    </p>
                                    <p className="text-sm text-gray-700 flex items-center gap-2">
                                        <span className="font-semibold w-20">💻 Tech:</span>
                                        <span className="px-2 py-0.5 bg-white border rounded text-xs text-gray-600">{item.technologyUsed}</span>
                                    </p>
                                    <p className="text-sm text-gray-400 flex items-center gap-2">
                                        <span className="font-semibold w-20">📅 Posted:</span> {new Date(item.postedDate).toLocaleDateString()}
                                    </p>
                                </div>
                                {status ? (
                                    <button
                                        disabled
                                        className={`w-full py-2.5 rounded-lg font-bold transition-colors uppercase text-sm tracking-wide shadow-sm flex items-center justify-center gap-2 ${status === 'Accepted' ? 'bg-green-600 text-white' :
                                            status === 'Rejected' ? 'bg-red-600 text-white' :
                                                'bg-primary text-white'
                                            }`}
                                    >
                                        {status === 'Applied' && <FiCheckCircle />}
                                        {status}
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => handleApply(item.id)}
                                        className="w-full py-2.5 border-2 border-primary text-primary rounded-lg font-bold hover:bg-primary hover:text-white transition-all uppercase text-sm tracking-wide shadow-sm hover:shadow-md"
                                    >
                                        Apply Now
                                    </button>
                                )}
                            </div>
                        );
                    })}
                    </div>
                </div>
            )}

            {/* Content - Applications */}
            {activeTab === 'applications' && (
                <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden animate-fade-in">
                    {myApplications.length === 0 ? (
                        <div className="p-12 text-center text-gray-500 flex flex-col items-center">
                            <div className="text-6xl mb-4">📂</div>
                            <p className="text-lg">You haven't applied to any internships yet.</p>
                            <button onClick={() => setActiveTab('internships')} className="mt-4 text-primary font-semibold hover:underline">Browse Internships</button>
                        </div>
                    ) : (
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Role</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Company</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Applied Date</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {myApplications.map(app => (
                                    <tr key={app.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 text-dark font-semibold">{app.internship?.title}</td>
                                        <td className="px-6 py-4 text-gray-600">{app.internship?.company?.companyName}</td>
                                        <td className="px-6 py-4 text-gray-500 text-sm">{new Date(app.appliedDate).toLocaleDateString()}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 text-xs rounded-full font-bold uppercase tracking-wide ${app.status === 'Accepted' ? 'bg-green-100 text-green-700 border border-green-200' :
                                                app.status === 'Rejected' ? 'bg-red-100 text-red-700 border border-red-200' :
                                                    'bg-yellow-100 text-yellow-700 border border-yellow-200'
                                                }`}>
                                                {app.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            )}

            {/* Content - My Ideas */}
            {activeTab === 'my-ideas' && (
                <div className="grid md:grid-cols-2 gap-6 animate-fade-in">
                    {myIdeas.length === 0 ? (
                        <div className="md:col-span-2 bg-white p-12 rounded-xl shadow-sm border border-gray-100 text-center text-gray-500 flex flex-col items-center">
                            <div className="text-6xl mb-4">💡</div>
                            <p className="text-lg">You haven't posted any ideas yet.</p>
                            <button onClick={() => setActiveTab('post-idea')} className="mt-4 text-primary font-semibold hover:underline">Share your innovation!</button>
                        </div>
                    ) : (
                        myIdeas.map(item => (
                            <div key={item.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
                                <div className="flex justify-between items-start mb-3">
                                    <h3 className="text-xl font-bold text-dark group-hover:text-primary transition-colors">{item.title || item.Title}</h3>
                                    <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">{new Date(item.postedDate || item.PostedDate).toLocaleDateString()}</span>
                                </div>
                                <div className="mb-4">
                                    <span className="px-2 py-1 bg-indigo-50 text-indigo-700 text-xs font-semibold rounded-md border border-indigo-100">{item.technologyUsed || item.TechnologyUsed}</span>
                                </div>
                                <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">{item.description || item.Description}</p>
                            </div>
                        ))
                    )}
                </div>
            )}

            {/* Content - Post Idea */}
            {activeTab === 'post-idea' && (
                <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-gray-100 animate-fade-in">
                    <h3 className="text-xl font-bold text-dark mb-6">Share Your Innovation</h3>
                    <form onSubmit={handlePostIdea} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Title of Idea</label>
                            <input
                                type="text"
                                required
                                value={ideaFormData.title}
                                onChange={(e) => setIdeaFormData({ ...ideaFormData, title: e.target.value })}
                                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary/20 outline-none"
                                placeholder="e.g. AI Plant Disease Detector"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Technology Stack</label>
                            <input
                                type="text"
                                required
                                value={ideaFormData.technologyUsed}
                                onChange={(e) => setIdeaFormData({ ...ideaFormData, technologyUsed: e.target.value })}
                                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary/20 outline-none"
                                placeholder="Python, TensorFlow, React"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <textarea
                                rows="4"
                                required
                                value={ideaFormData.description}
                                onChange={(e) => setIdeaFormData({ ...ideaFormData, description: e.target.value })}
                                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary/20 outline-none"
                                placeholder="Describe your idea in detail..."
                            ></textarea>
                        </div>
                        <button type="submit" className="w-full py-2 bg-primary text-white rounded-lg hover:bg-secondary transition-colors font-semibold">
                            Post Idea
                        </button>
                    </form>
                </div>
            )}

        </div>
    );
};

export default StudentDashboard;
