import { useState, useEffect } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from 'recharts';
import { FiGithub, FiCode, FiFileText } from 'react-icons/fi';

const StudentModal = ({ applicant, onClose, onAccept, onReject }) => {
    const [githubStats, setGithubStats] = useState([]);
    const [leetCodeStats, setLeetCodeStats] = useState(null);
    const [loading, setLoading] = useState(true);

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

    useEffect(() => {
        const fetchStats = async () => {
            setLoading(true);
            try {
                // Fetch GitHub Repos
                if (applicant.gitHubLink) {
                    const username = applicant.gitHubLink.split('/').pop();
                    const ghResponse = await axios.get(`https://api.github.com/users/${username}/repos`);

                    const languages = {};
                    ghResponse.data.forEach(repo => {
                        if (repo.language) {
                            languages[repo.language] = (languages[repo.language] || 0) + 1;
                        }
                    });

                    const chartData = Object.keys(languages).map(lang => ({
                        name: lang,
                        value: languages[lang]
                    }));
                    setGithubStats(chartData);
                }

                // Fetch LeetCode Stats
                if (applicant.leetCodeLink) {
                    const username = applicant.leetCodeLink.split('/').pop();
                    // Using a public proxy for LeetCode API to avoid CORS
                    const lcResponse = await axios.get(`https://leetcode-stats-api.herokuapp.com/${username}`);
                    if (lcResponse.data.status === 'success') {
                        setLeetCodeStats(lcResponse.data);
                    }
                }

            } catch (error) {
                console.error("Error fetching stats:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, [applicant]);

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full p-6 animate-fade-in relative max-h-[90vh] overflow-y-auto">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-dark text-xl"
                >
                    ✕
                </button>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Left Column: Basic Info */}
                    <div>
                        <h2 className="text-3xl font-bold text-dark mb-4">{applicant.fullName}</h2>
                        <div className="space-y-4 mb-6">
                            <div>
                                <label className="text-xs font-semibold text-gray-500 uppercase">University</label>
                                <p className="text-gray-800 text-lg">{applicant.university}</p>
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-gray-500 uppercase">Links</label>
                                <div className="flex gap-4 mt-1">
                                    {applicant.gitHubLink && (
                                        <a href={applicant.gitHubLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-gray-700 hover:text-dark">
                                            <FiGithub /> GitHub
                                        </a>
                                    )}
                                    {applicant.leetCodeLink && (
                                        <a href={applicant.leetCodeLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-yellow-600 hover:text-yellow-700">
                                            <FiCode /> LeetCode
                                        </a>
                                    )}
                                </div>
                            </div>
                            {applicant.skills && (
                                <div>
                                    <label className="text-xs font-semibold text-gray-500 uppercase">Skills</label>
                                    <div className="flex flex-wrap gap-2 mt-1">
                                        {applicant.skills.split(',').map((skill, index) => (
                                            <span 
                                                key={index} 
                                                className="px-2 py-1 bg-primary/10 text-primary text-xs font-medium rounded-md border border-primary/20"
                                            >
                                                {skill.trim()}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {/* Resume Section */}
                            {(applicant.resume?.resumeFileName || applicant.resumeFileName) && (
                                <div>
                                    <label className="text-xs font-semibold text-gray-500 uppercase">Resume</label>
                                    <div className="mt-2">
                                        <a
                                            href={`http://localhost:5098/api/students/${applicant.id}/resume`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100"
                                        >
                                            <FiFileText /> View Resume
                                        </a>
                                        <p className="text-[10px] text-gray-400 mt-1 italic">File: {applicant.resume?.resumeFileName || applicant.resumeFileName}</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* LeetCode Stats Card */}
                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                            <h3 className="font-bold text-gray-700 mb-3 flex items-center gap-2"><FiCode /> Problem Solving</h3>
                            {loading ? <p className="text-sm text-gray-500">Loading stats...</p> : leetCodeStats ? (
                                <div className="grid grid-cols-3 gap-2 text-center">
                                    <div className="bg-green-100 p-2 rounded-lg">
                                        <span className="block text-green-700 font-bold text-xl">{leetCodeStats.easySolved}</span>
                                        <span className="text-xs text-green-600">Easy</span>
                                    </div>
                                    <div className="bg-yellow-100 p-2 rounded-lg">
                                        <span className="block text-yellow-700 font-bold text-xl">{leetCodeStats.mediumSolved}</span>
                                        <span className="text-xs text-yellow-600">Medium</span>
                                    </div>
                                    <div className="bg-red-100 p-2 rounded-lg">
                                        <span className="block text-red-700 font-bold text-xl">{leetCodeStats.hardSolved}</span>
                                        <span className="text-xs text-red-600">Hard</span>
                                    </div>
                                </div>
                            ) : <p className="text-sm text-gray-400">No LeetCode data found.</p>}
                        </div>
                    </div>

                    {/* Right Column: GitHub Chart */}
                    <div className="flex flex-col">
                        <h3 className="font-bold text-gray-700 mb-2 flex items-center gap-2"><FiGithub /> Most Used Languages</h3>
                        <div className="flex-1 min-h-[300px] bg-gray-50 rounded-xl border border-gray-100 p-4 flex items-center justify-center">
                            {loading ? (
                                <p className="text-gray-500">Loading chart...</p>
                            ) : githubStats.length > 0 ? (
                                <ResponsiveContainer width="100%" height={300}>
                                    <PieChart>
                                        <Pie
                                            data={githubStats}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={90}
                                            fill="#8884d8"
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {githubStats.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <RechartsTooltip />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            ) : (
                                <p className="text-gray-400">No GitHub repositories found.</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Actions */}
                {applicant.applicationId && (
                    <div className="mt-8 flex gap-3 border-t pt-6">
                        <button
                            onClick={onAccept}
                            className="flex-1 py-3 bg-primary text-white rounded-xl font-bold hover:bg-secondary transition-colors shadow-lg shadow-primary/30"
                        >
                            Accept Application
                        </button>
                        <button
                            onClick={onReject}
                            className="flex-1 py-3 border-2 border-gray-100 text-gray-400 rounded-xl font-bold hover:bg-gray-50 hover:text-gray-600 transition-colors"
                        >
                            Reject
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentModal;
