// src/pages/DashboardPage.jsx
import React, { useState, useEffect } from 'react';
import DashboardTabs from '../components/DashboardTabs';
import UserTable from '../components/UserTable';
import LovItemPage from './ListOfValuePage';
import Header from '../components/Header';

const DashboardPage = () => {
    const [activeTab, setActiveTab] = useState('main');

    useEffect(() => {
        const token = localStorage.getItem('token');
        const expiryTime = localStorage.getItem('token_expiry');

        if (token && expiryTime) {
            const now = new Date().getTime();
            if (now > parseInt(expiryTime, 10)) {
                localStorage.removeItem('token');
                localStorage.removeItem('token_expiry');
                localStorage.removeItem('email');
                window.location.href = '/';
            }
        }
    }, []);

    const handleLogout = () => {
        // Tambahkan logika logout di sini
        // Misalnya hapus token dari localStorage dan redirect
        localStorage.removeItem('token');
        localStorage.removeItem('email');
        localStorage.removeItem('token_expiry');
        window.location.href = '/';
    };

    return (
        <div className="h-screen flex bg-gradient-to-br from-green-50 via-gray-50 to-emerald-50">
            {/* Sidebar kiri */}
            <aside className="w-64 bg-white shadow-xl border-r border-gray-100 p-6 relative">
                {/* Header Logo/Title */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-gray-800">Admin Panel</h1>
                            <p className="text-xs text-gray-500">Sistem Management</p>
                        </div>
                    </div>
                </div>

                {/* Navigation Tabs */}
                <DashboardTabs activeTab={activeTab} setActiveTab={setActiveTab} />


            </aside>

            {/* Konten kanan */}
            <main className="flex-1 overflow-y-auto bg-gradient-to-b from-white to-gray-50">
                {/* Header with enhanced styling */}
                <div className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-10">
                    <Header title="" onLogout={handleLogout} />
                </div>

                {/* Content Area */}
                <div className="p-6">
                    {/* Page Title & Breadcrumb */}
                    <div className="mb-6">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800">
                                    {activeTab === 'main' ? 'Dashboard' : 'Manajemen List'}
                                </h2>
                                <p className="text-sm text-gray-500">
                                    {activeTab === 'main'
                                        ? 'Pantau aktivitas dan pengelolaan pengguna sistem'
                                        : 'Pengaturan untuk mengelola data referensi'
                                    }
                                </p>
                            </div>
                        </div>

                        {/* Breadcrumb */}
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                            <span>Admin Panel</span>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                            <span className="text-green-600 font-medium">
                                {activeTab === 'main' ? 'Dashboard' : 'Daftar Nilai'}
                            </span>
                        </div>
                    </div>

                    {/* Content Container */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-6">
                            {activeTab === 'main' && <UserTable />}
                            {activeTab === 'lov' && <LovItemPage />}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 mt-8">
                    <div className="text-center text-sm text-gray-500">
                        <div className="flex items-center justify-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span>Admin Panel System © 2025</span>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default DashboardPage;