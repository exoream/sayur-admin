import React from 'react';

const DashboardTabs = ({ activeTab, setActiveTab }) => {
    const tabs = [
        {
            id: 'main',
            label: 'Dashboard',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v0a2 2 0 01-2 2H10a2 2 0 01-2-2v0z" />
                </svg>
            )
        },
        {
            id: 'lov',
            label: 'Daftar Item',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
            )
        }
    ];

    const getTabClass = (tab) => {
        const isActive = activeTab === tab.id;
        return `group relative flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 cursor-pointer ${isActive
            ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg transform scale-105'
            : 'text-gray-700 hover:bg-green-50 hover:text-green-700 hover:transform hover:scale-102'
            }`;
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-2">
            <div className="space-y-1">
                {tabs.map((tab) => (
                    <div
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={getTabClass(tab)}
                    >
                        {/* Icon */}
                        <div className={`flex-shrink-0 transition-colors duration-200 ${activeTab === tab.id ? 'text-white' : 'text-gray-500 group-hover:text-green-600'
                            }`}>
                            {tab.icon}
                        </div>

                        {/* Label */}
                        <span className="font-medium text-sm">
                            {tab.label}
                        </span>

                        {/* Active Indicator */}
                        {activeTab === tab.id && (
                            <div className="absolute right-2 w-2 h-2 bg-white rounded-full opacity-80"></div>
                        )}

                        {/* Hover Effect */}
                        <div className={`absolute inset-0 rounded-lg transition-opacity duration-200 ${activeTab !== tab.id ? 'opacity-0 group-hover:opacity-10 bg-green-500' : 'opacity-0'
                            }`}></div>
                    </div>
                ))}
            </div>

            {/* Bottom Accent */}
            <div className="mt-4 pt-2 border-t border-gray-100">
                <div className="text-xs text-gray-500 text-center font-medium">
                    Admin Panel
                </div>
            </div>
        </div>
    );
};

export default DashboardTabs;