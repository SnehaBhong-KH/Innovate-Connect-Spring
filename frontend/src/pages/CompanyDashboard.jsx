import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { FiPlusSquare, FiUsers, FiCpu, FiCheck, FiGithub, FiCode } from 'react-icons/fi';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from 'recharts';
import StudentModal from '../components/StudentModal';

const CompanyDashboard = ({ initialTab = 'manage-applications' }) => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState(initialTab);
    const [internships, setInternships] = useState([]);
    const [selectedInternship, setSelectedInternship] = useState(null);
    const [applicants, setApplicants] = useState([]);
    const [ideas, setIdeas] = useState([]); // Real ideas state
    const [openApplicant, setOpenApplicant] = useState(null); // For modal
    // Form State
    const [formData, setFormData] = useState({
        title: '',
        stipend: '',
        technologyUsed: '',
        description: ''
    });

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePostInternship = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            // Stipend needs to be decimal, remove any non-numeric chars if needed or handle in backend
            // For now assuming simple number input or handling parse error
            // Backend expects decimal(18,2)

            const payload = {
                ...formData,
                stipend: parseFloat(formData.stipend) || 0 // Ensure it's a number
            };

            await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/internships`, payload, {
                headers: { Authorization: `Bearer ${token}` }
            });

            alert('Internship posted successfully!');
            setFormData({ title: '', stipend: '', technologyUsed: '', description: '' });
            setActiveTab('manage-applications'); // Switch to view it
        } catch (error) {
            console.error('Error posting internship:', error);
            const errorMsg = error.response?.data || error.message;
            alert('Failed to post internship: ' + (typeof errorMsg === 'string' ? errorMsg : JSON.stringify(errorMsg)));
        }
    };

    // Fetch Internships
    useEffect(() => {
        if (activeTab === 'manage-applications') {
            fetchInternships();
        }
        if (activeTab === 'view-ideas') {
            fetchIdeas();
        }
    }, [activeTab]);

    const fetchIdeas = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/ideas`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setIdeas(response.data);
        } catch (error) {
            console.error('Error fetching ideas:', error);
        }
    };

    const fetchInternships = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/internships/my-internships`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (Array.isArray(response.data)) {
                setInternships(response.data);
            } else {
                setInternships([]);
                console.error('Unexpected response format for internships:', response.data);
            }
        } catch (error) {
            console.error('Error fetching internships:', error);
            const errorMsg = error.response?.data || error.message;
            console.error('Fetch error details:', errorMsg);
            setInternships([]);
        }
    };

    const fetchApplicants = async (internshipId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/internships/${internshipId}/applicants`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (Array.isArray(response.data)) {
                setApplicants(response.data);
                setSelectedInternship(internshipId);
            } else {
                setApplicants([]);
                console.error('Unexpected response format for applicants:', response.data);
            }
        } catch (error) {
            console.error('Error fetching applicants:', error);
            setApplicants([]);
        }
    };

    const handleUpdateStatus = async (applicationId, status) => {
        try {
            const token = localStorage.getItem('token');
            // Returning quotes around status string as backend expects [FromBody] raw JSON string
            await axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/applications/${applicationId}/status`, `"${status}"`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            alert(`Application ${status} successfully!`);
            setOpenApplicant(null);
            if (selectedInternship) {
                fetchApplicants(selectedInternship);
            }
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Failed to update status.');
        }
    };

    // Removed mock ideas

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Header */}
            <div className="bg-white p-6 rounded-xl shadow-md mb-8 border border-gray-100">
                <div>
                    <h1 className="text-2xl font-bold text-dark">Company Portal</h1>
                    <p className="text-gray-500">{user?.name}</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 mb-6 border-b border-gray-200">
                <button
                    onClick={() => setActiveTab('manage-applications')}
                    className={`pb-2 px-4 font-medium transition-all ${activeTab === 'manage-applications' ? 'text-primary border-b-2 border-primary' : 'text-gray-500 hover:text-dark'}`}
                >
                    Manage Applications
                </button>
                <button
                    onClick={() => setActiveTab('post-internship')}
                    className={`pb-2 px-4 font-medium transition-all ${activeTab === 'post-internship' ? 'text-primary border-b-2 border-primary' : 'text-gray-500 hover:text-dark'}`}
                >
                    Post Internship
                </button>
                <button
                    onClick={() => setActiveTab('view-ideas')}
                    className={`pb-2 px-4 font-medium transition-all ${activeTab === 'view-ideas' ? 'text-primary border-b-2 border-primary' : 'text-gray-500 hover:text-dark'}`}
                >
                    View Student Ideas
                </button>
            </div>

            {/* Tab Content: Post Internship */}
            {activeTab === 'post-internship' && (
                <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-gray-100 animate-fade-in">
                    <h3 className="text-xl font-bold text-dark mb-6">Create New Opportunity</h3>
                    <form onSubmit={handlePostInternship} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary/20 outline-none"
                                placeholder="e.g. Junior React Developer"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Stipend (Amount)</label>
                                <input
                                    type="number"
                                    name="stipend"
                                    value={formData.stipend}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary/20 outline-none"
                                    placeholder="1000"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Technology Stack</label>
                                <input
                                    type="text"
                                    name="technologyUsed"
                                    value={formData.technologyUsed}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary/20 outline-none"
                                    placeholder="React, Node.js"
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <textarea
                                rows="4"
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary/20 outline-none"
                                placeholder="Job requirements and perks..."
                                required
                            ></textarea>
                        </div>
                        <button className="w-full py-2 bg-primary text-white rounded-lg hover:bg-secondary transition-colors font-semibold">
                            Publish Application
                        </button>
                    </form>
                </div>
            )}

            {/* Tab Content: Applications */}
            {activeTab === 'manage-applications' && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden animate-fade-in p-6">
                    {!selectedInternship ? (
                        <div>
                            <h3 className="text-xl font-bold text-dark mb-4">Select an Internship to View Applicants</h3>
                            {internships.length === 0 ? (
                                <p className="text-gray-500">No internships posted yet.</p>
                            ) : (
                                <div className="grid gap-4">
                                    {internships.map(internship => (
                                        <div
                                            key={internship.id}
                                            onClick={() => fetchApplicants(internship.id)}
                                            className="p-4 border rounded-lg hover:shadow-md cursor-pointer transition-all flex justify-between items-center"
                                        >
                                            <div>
                                                <h4 className="font-semibold text-lg">{internship.title}</h4>
                                                <p className="text-sm text-gray-500">Posted on: {internship.postedDate ? new Date(internship.postedDate).toLocaleDateString() : 'N/A'}</p>
                                            </div>
                                            <span className="text-primary font-medium">View Applicants &rarr;</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div>
                            <button
                                onClick={() => { setSelectedInternship(null); setApplicants([]); }}
                                className="mb-4 text-sm text-gray-500 hover:text-dark flex items-center gap-1"
                            >
                                &larr; Back to Internships
                            </button>
                            <h3 className="text-xl font-bold text-dark mb-4">Applicants</h3>
                            {applicants.length === 0 ? (
                                <p className="text-gray-500">No applicants for this internship yet.</p>
                            ) : (
                                <table className="w-full text-left">
                                    <thead className="bg-gray-50 border-b border-gray-200">
                                        <tr>
                                            <th className="px-6 py-3 text-sm font-semibold text-gray-700">Student Name</th>
                                            <th className="px-6 py-3 text-sm font-semibold text-gray-700">University</th>
                                            <th className="px-6 py-3 text-sm font-semibold text-gray-700">Status</th>
                                            <th className="px-6 py-3 text-sm font-semibold text-gray-700">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {applicants.map(app => (
                                            <tr key={app.id} className="hover:bg-gray-50">
                                                <td
                                                    className="px-6 py-4 text-dark font-medium cursor-pointer hover:text-primary"
                                                    onClick={() => setOpenApplicant({ ...app.student, applicationId: app.id })}
                                                >
                                                    {app.student?.fullName || 'N/A'}
                                                </td>
                                                <td className="px-6 py-4 text-gray-500">{app.student.university}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-3 py-1 text-xs rounded-full font-bold uppercase ${app.status === 'Accepted' ? 'bg-green-100 text-green-700' :
                                                        app.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                                                            'bg-blue-100 text-blue-700'
                                                        }`}>
                                                        {app.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <button
                                                        onClick={() => setOpenApplicant({ ...app.student, applicationId: app.id })}
                                                        className="text-primary hover:underline text-sm font-medium"
                                                    >
                                                        View Profile
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* Student Profile Modal */}
            {openApplicant && (
                <StudentModal
                    applicant={openApplicant}
                    onClose={() => setOpenApplicant(null)}
                    onAccept={() => handleUpdateStatus(openApplicant.applicationId, 'Accepted')}
                    onReject={() => handleUpdateStatus(openApplicant.applicationId, 'Rejected')}
                />
            )}

            {/* Tab Content: Ideas */}
            {activeTab === 'view-ideas' && (
                <div className="grid md:grid-cols-2 gap-6 animate-fade-in">
                    {ideas.length === 0 ? (
                        <div className="md:col-span-2 bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center text-gray-500">
                            No student ideas found.
                        </div>
                    ) : (
                        ideas.map(item => (
                            <div key={item.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-xl font-bold text-dark">{item.title}</h3>
                                    <span className="text-xs text-gray-400">{new Date(item.postedDate).toLocaleDateString()}</span>
                                </div>
                                <p className="text-sm text-gray-600 mb-2">By:
                                    <button
                                        onClick={() => setOpenApplicant(item.student)}
                                        className="ml-1 font-semibold text-primary hover:underline"
                                    >
                                        {item.student?.fullName || item.student?.user?.name || 'Anonymous'}
                                    </button>
                                </p>
                                <div className="mb-4">
                                    <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-md">{item.technologyStack}</span>
                                </div>
                                <p className="text-sm text-gray-500 mb-4 line-clamp-3">{item.description}</p>
                                <a
                                    href={`mailto:${item.student?.user?.email}`}
                                    className="block w-full text-center py-2 border border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition-colors"
                                >
                                    Contact Student
                                </a>
                            </div>
                        ))
                    )}
                </div>
            )}

        </div>
    );
};
export default CompanyDashboard;
