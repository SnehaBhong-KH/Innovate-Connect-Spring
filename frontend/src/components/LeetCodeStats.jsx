import { useState, useEffect } from 'react';
import axios from 'axios';

const LeetCodeStats = ({ username }) => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!username) return;

        const fetchStats = async () => {
            setLoading(true);
            try {
                // Use our backend proxy
                const response = await axios.get(`http://localhost:5098/api/external/leetcode/${username}`);
                if (response.data.status === 'success') {
                    setStats(response.data);
                } else {
                    setError(response.data.message || 'Error fetching stats');
                }
                setLoading(false);
            } catch (err) {
                console.error("LeetCode API Error:", err);
                setError("Failed to load LeetCode data");
                setLoading(false);
            }
        };

        fetchStats();
    }, [username]);

    if (!username) return <div className="text-gray-500 text-sm">No LeetCode link provided.</div>;
    if (loading) return <div className="animate-pulse h-48 bg-gray-100 rounded-xl"></div>;
    if (error) return <div className="text-red-500 text-sm">{error}</div>;

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-full">
            <h3 className="text-lg font-bold text-dark mb-4 border-b pb-2">LeetCode Progress</h3>

            <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500 uppercase">Ranking</p>
                    <p className="text-xl font-bold text-gray-800">{stats?.ranking.toLocaleString() || 'N/A'}</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500 uppercase">Total Solved</p>
                    <p className="text-xl font-bold text-primary">{stats?.totalSolved}</p>
                </div>
            </div>

            <div className="space-y-3">
                <div>
                    <div className="flex justify-between text-xs mb-1">
                        <span className="text-green-600 font-medium">Easy</span>
                        <span className="font-bold">{stats?.easySolved}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div className="bg-green-500 h-1.5 rounded-full" style={{ width: `${(stats?.easySolved / (stats?.totalSolved || 1)) * 100}%` }}></div>
                    </div>
                </div>
                <div>
                    <div className="flex justify-between text-xs mb-1">
                        <span className="text-yellow-600 font-medium">Medium</span>
                        <span className="font-bold">{stats?.mediumSolved}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div className="bg-yellow-500 h-1.5 rounded-full" style={{ width: `${(stats?.mediumSolved / (stats?.totalSolved || 1)) * 100}%` }}></div>
                    </div>
                </div>
                <div>
                    <div className="flex justify-between text-xs mb-1">
                        <span className="text-red-600 font-medium">Hard</span>
                        <span className="font-bold">{stats?.hardSolved}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div className="bg-red-500 h-1.5 rounded-full" style={{ width: `${(stats?.hardSolved / (stats?.totalSolved || 1)) * 100}%` }}></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LeetCodeStats;
