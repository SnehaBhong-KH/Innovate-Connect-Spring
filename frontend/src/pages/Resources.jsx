import { FiDownload, FiExternalLink, FiVideo, FiBook } from 'react-icons/fi';

const Resources = () => {
    return (
        <div className="container mx-auto px-4 py-8 animate-fade-in">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-12 mb-12 text-white relative overflow-hidden">
                <div className="relative z-10">
                    <h1 className="text-4xl font-bold mb-4">Student Resources</h1>
                    <p className="text-blue-100 text-lg max-w-2xl">
                        Everything you need to succeed in your internship search and career development. Guides, templates, and learning paths.
                    </p>
                </div>
                <div className="absolute right-0 top-0 h-full w-1/3 bg-white/10 transform skew-x-12"></div>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                {/* Guide Card */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-all group">
                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center text-orange-600 mb-4 group-hover:scale-110 transition-transform">
                        <FiBook className="text-2xl" />
                    </div>
                    <h3 className="text-xl font-bold text-dark mb-2">Resume Guide</h3>
                    <p className="text-gray-600 text-sm mb-4">Learn how to craft a perfect tech resume that gets past ATS and catches recruiters' eyes.</p>
                    <button className="text-primary font-semibold flex items-center gap-2 hover:gap-3 transition-all">
                        Read Guide <FiExternalLink />
                    </button>
                </div>

                {/* Template Card */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-all group">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center text-green-600 mb-4 group-hover:scale-110 transition-transform">
                        <FiDownload className="text-2xl" />
                    </div>
                    <h3 className="text-xl font-bold text-dark mb-2">Cover Letter Templates</h3>
                    <p className="text-gray-600 text-sm mb-4">Professional templates for various roles: Software Engineer, Product Manager, and Design.</p>
                    <button className="text-primary font-semibold flex items-center gap-2 hover:gap-3 transition-all">
                        Download Pack <FiDownload />
                    </button>
                </div>

                {/* Video Card */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-all group">
                    <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center text-red-600 mb-4 group-hover:scale-110 transition-transform">
                        <FiVideo className="text-2xl" />
                    </div>
                    <h3 className="text-xl font-bold text-dark mb-2">Interview Prep</h3>
                    <p className="text-gray-600 text-sm mb-4">Mock interview sessions and technical algorithm walkthroughs to prepare you for the big day.</p>
                    <button className="text-primary font-semibold flex items-center gap-2 hover:gap-3 transition-all">
                        Watch Videos <FiExternalLink />
                    </button>
                </div>
            </div>

            <div className="mt-12">
                <h2 className="text-2xl font-bold text-dark mb-6">Popular Articles</h2>
                <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="bg-white p-4 rounded-xl border border-gray-100 flex items-center justify-between hover:bg-gray-50 transition-colors cursor-pointer">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 bg-gray-200 rounded-lg object-cover"></div>
                                <div>
                                    <h4 className="font-bold text-dark">Top 10 Questions to Ask Your Interviewer</h4>
                                    <p className="text-sm text-gray-500">Career Advice • 5 min read</p>
                                </div>
                            </div>
                            <FiExternalLink className="text-gray-400" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Resources;
