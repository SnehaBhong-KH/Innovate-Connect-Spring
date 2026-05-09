import { FiLock, FiBell, FiEye, FiGlobe, FiSave } from 'react-icons/fi';

const Settings = () => {
    return (
        <div className="container mx-auto px-4 py-8 animate-fade-in">
            <h1 className="text-3xl font-bold text-dark mb-8">Account Settings</h1>

            <div className="grid md:grid-cols-4 gap-8">
                {/* Sidebar */}
                <div className="md:col-span-1">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden sticky top-8">
                        <nav className="flex flex-col">
                            <button className="text-left px-6 py-4 font-medium text-primary bg-primary/5 border-l-4 border-primary transition-colors">
                                General
                            </button>
                            <button className="text-left px-6 py-4 font-medium text-gray-600 hover:bg-gray-50 hover:text-dark transition-colors border-l-4 border-transparent">
                                Security
                            </button>
                            <button className="text-left px-6 py-4 font-medium text-gray-600 hover:bg-gray-50 hover:text-dark transition-colors border-l-4 border-transparent">
                                Notifications
                            </button>
                            <button className="text-left px-6 py-4 font-medium text-gray-600 hover:bg-gray-50 hover:text-dark transition-colors border-l-4 border-transparent">
                                Privacy
                            </button>
                        </nav>
                    </div>
                </div>

                {/* Content */}
                <div className="md:col-span-3 space-y-6">
                    {/* Profile Section */}
                    <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex items-center gap-2 mb-6 text-dark">
                            <FiGlobe className="text-xl" />
                            <h2 className="text-xl font-bold">Public Profile</h2>
                        </div>

                        <div className="space-y-4">
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Display Name</label>
                                    <input type="text" defaultValue="John Doe" className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Username</label>
                                    <input type="text" defaultValue="johndoe123" className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Bio</label>
                                <textarea rows="3" className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"></textarea>
                            </div>
                        </div>
                    </div>

                    {/* Notifications Section */}
                    <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex items-center gap-2 mb-6 text-dark">
                            <FiBell className="text-xl" />
                            <h2 className="text-xl font-bold">Notifications</h2>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                <div>
                                    <h4 className="font-semibold text-dark">Email Notifications</h4>
                                    <p className="text-sm text-gray-500">Receive emails about new internship opportunities.</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" className="sr-only peer" defaultChecked />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                </label>
                            </div>
                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                <div>
                                    <h4 className="font-semibold text-dark">Application Updates</h4>
                                    <p className="text-sm text-gray-500">Get notified when your application status changes.</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" className="sr-only peer" defaultChecked />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Save Button */}
                    <div className="flex justify-end">
                        <button className="px-8 py-3 bg-primary text-white rounded-lg font-bold hover:bg-secondary transition-all shadow-lg flex items-center gap-2">
                            <FiSave /> Save Changes
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
