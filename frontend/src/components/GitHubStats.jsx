import { useState, useEffect } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const GitHubStats = ({ username }) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

    useEffect(() => {
        if (!username) return;

        const fetchRepos = async () => {
            setLoading(true);
            try {
                // Fetch user repos (up to 100)
                const response = await axios.get(`https://api.github.com/users/${username}/repos?per_page=100`);
                const repos = response.data;

                const languages = {};
                repos.forEach(repo => {
                    if (repo.language) {
                        languages[repo.language] = (languages[repo.language] || 0) + 1;
                    }
                });

                const chartData = Object.keys(languages).map(lang => ({
                    name: lang,
                    value: languages[lang]
                })).sort((a, b) => b.value - a.value).slice(0, 5); // Top 5 languages

                setData(chartData);
                setLoading(false);
            } catch (err) {
                console.error("GitHub API Error:", err);
                setError("Failed to load GitHub data");
                setLoading(false);
            }
        };

        fetchRepos();
    }, [username]);

    if (!username) return <div className="text-gray-500 text-sm">No GitHub link provided.</div>;
    if (loading) return <div className="animate-pulse h-48 bg-gray-100 rounded-xl"></div>;
    if (error) return <div className="text-red-500 text-sm">{error}</div>;
    if (data.length === 0) return <div className="text-gray-500 text-sm">No language data found.</div>;

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-full">
            <h3 className="text-lg font-bold text-dark mb-4 border-b pb-2">GitHub Languages</h3>
            <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={40}
                            outerRadius={70}
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend iconSize={8} wrapperStyle={{ fontSize: '12px' }} />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default GitHubStats;
