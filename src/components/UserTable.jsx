import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ChevronDown, ChevronUp, Users, TrendingUp, TrendingDown } from 'lucide-react';

const UserTable = () => {
    const [users, setUsers] = useState([]);
    const [expandedUserId, setExpandedUserId] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const toggleExpand = (userId) => {
        setExpandedUserId(expandedUserId === userId ? null : userId);
    };

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('https://sayur-one.vercel.app/rekaptulasi/user-inputs', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setUsers(response.data.data || []);
            } catch (err) {
                console.error('Gagal mengambil data:', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUsers();
    }, []);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-48">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
            </div>
        );
    }

    return (
        <div>
            {/* Header Section */}
            <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                    <Users className="w-4 h-4 text-white" />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-gray-800">User Management</h2>
                    <p className="text-sm text-gray-500">Monitor user activities and transactions</p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white p-4 rounded-xl">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-green-100 text-sm">Total Users</p>
                            <p className="text-2xl font-bold">{users.length}</p>
                        </div>
                        <Users className="w-8 h-8 text-green-200" />
                    </div>
                </div>
                <div className="bg-white border border-gray-100 p-4 rounded-xl">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm">Total Income (Kg)</p>
                            <p className="text-2xl font-bold text-gray-800">
                                {users.reduce((sum, user) =>
                                    sum + (user.incomes?.reduce((incSum, income) => incSum + (income.totalQuantityKg || 0), 0) || 0), 0
                                )}
                            </p>
                        </div>
                        <TrendingUp className="w-8 h-8 text-green-500" />
                    </div>
                </div>
                <div className="bg-white border border-gray-100 p-4 rounded-xl">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm">Total Expense (Kg)</p>
                            <p className="text-2xl font-bold text-gray-800">
                                {users.reduce((sum, user) =>
                                    sum + (user.expenses?.reduce((expSum, expense) => expSum + (expense.totalQuantityKg || 0), 0) || 0), 0
                                )}
                            </p>
                        </div>
                        <TrendingDown className="w-8 h-8 text-red-500" />
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">
                            <tr>
                                <th className="p-4 text-left text-sm font-semibold">No</th>
                                <th className="p-4 text-left text-sm font-semibold">Name</th>
                                <th className="p-4 text-left text-sm font-semibold">Email</th>
                                <th className="p-4 text-left text-sm font-semibold">Items</th>
                                <th className="p-4 text-left text-sm font-semibold">Income (Kg)</th>
                                <th className="p-4 text-left text-sm font-semibold">Expense (Kg)</th>
                                <th className="p-4 text-left text-sm font-semibold">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {users.map((user, idx) => {
                                const totalIncomeKg = user.incomes?.reduce((sum, income) => sum + (income.totalQuantityKg || 0), 0) || 0;
                                const totalExpenseKg = user.expenses?.reduce((sum, expense) => sum + (expense.totalQuantityKg || 0), 0) || 0;
                                const isExpanded = expandedUserId === user.id;

                                return (
                                    <React.Fragment key={user.id}>
                                        <tr className="hover:bg-green-50 transition-colors duration-150">
                                            <td className="p-4 text-sm text-gray-600">{idx + 1}</td>
                                            <td className="p-4">
                                                <div className="font-medium text-gray-900">{user.name}</div>
                                            </td>
                                            <td className="p-4 text-sm text-gray-600">{user.email}</td>
                                            <td className="p-4">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                    {user.items?.length || 0} items
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                <span className="text-green-600 font-medium">{totalIncomeKg}</span>
                                            </td>
                                            <td className="p-4">
                                                <span className="text-red-600 font-medium">{totalExpenseKg}</span>
                                            </td>
                                            <td className="p-4">
                                                <button
                                                    className="flex items-center gap-1 px-3 py-1.5 text-sm text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-150"
                                                    onClick={() => toggleExpand(user.id)}
                                                >
                                                    {isExpanded ? (
                                                        <>
                                                            <ChevronUp className="w-4 h-4" />
                                                            Hide
                                                        </>
                                                    ) : (
                                                        <>
                                                            <ChevronDown className="w-4 h-4" />
                                                            View
                                                        </>
                                                    )}
                                                </button>
                                            </td>
                                        </tr>

                                        {isExpanded && (
                                            <tr>
                                                <td colSpan="7" className="p-6 bg-gray-50">
                                                    <div className="space-y-6">
                                                        {/* Income Section */}
                                                        <div className="bg-white rounded-lg p-4 border border-gray-200">
                                                            <div className="flex items-center gap-2 mb-4">
                                                                <TrendingUp className="w-5 h-5 text-green-500" />
                                                                <h3 className="font-semibold text-gray-800">Income Transactions</h3>
                                                            </div>
                                                            {user.incomes?.length ? (
                                                                <div className="overflow-x-auto">
                                                                    <table className="w-full text-sm">
                                                                        <thead className="bg-green-50">
                                                                            <tr>
                                                                                <th className="p-3 text-left font-medium text-gray-700">Item</th>
                                                                                <th className="p-3 text-left font-medium text-gray-700">Type</th>
                                                                                <th className="p-3 text-left font-medium text-gray-700">Qty (Kg)</th>
                                                                                <th className="p-3 text-left font-medium text-gray-700">Note</th>
                                                                                <th className="p-3 text-left font-medium text-gray-700">Date</th>
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody className="divide-y divide-gray-100">
                                                                            {user.incomes.map((income) => (
                                                                                <tr key={income.id} className="hover:bg-gray-50">
                                                                                    <td className="p-3 font-medium">{income.item?.name || '-'}</td>
                                                                                    <td className="p-3">
                                                                                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${income.item?.type === 'VEGETABLES'
                                                                                            ? 'bg-green-100 text-green-800'
                                                                                            : 'bg-blue-100 text-blue-800'
                                                                                            }`}>
                                                                                            {income.item?.type || '-'}
                                                                                        </span>
                                                                                    </td>
                                                                                    <td className="p-3 text-green-600 font-medium">{income.totalQuantityKg || '-'}</td>
                                                                                    <td className="p-3 text-gray-600">{income.note || '-'}</td>
                                                                                    <td className="p-3 text-gray-500">{new Date(income.createdAt).toLocaleDateString()}</td>
                                                                                </tr>
                                                                            ))}
                                                                        </tbody>
                                                                    </table>
                                                                </div>
                                                            ) : (
                                                                <p className="text-gray-500 text-center py-4">No income data available</p>
                                                            )}
                                                        </div>

                                                        {/* Expense Section */}
                                                        <div className="bg-white rounded-lg p-4 border border-gray-200">
                                                            <div className="flex items-center gap-2 mb-4">
                                                                <TrendingDown className="w-5 h-5 text-red-500" />
                                                                <h3 className="font-semibold text-gray-800">Expense Transactions</h3>
                                                            </div>
                                                            {user.expenses?.length ? (
                                                                <div className="overflow-x-auto">
                                                                    <table className="w-full text-sm">
                                                                        <thead className="bg-red-50">
                                                                            <tr>
                                                                                <th className="p-3 text-left font-medium text-gray-700">Item</th>
                                                                                <th className="p-3 text-left font-medium text-gray-700">Type</th>
                                                                                <th className="p-3 text-left font-medium text-gray-700">Qty (Kg)</th>
                                                                                <th className="p-3 text-left font-medium text-gray-700">Note</th>
                                                                                <th className="p-3 text-left font-medium text-gray-700">Date</th>
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody className="divide-y divide-gray-100">
                                                                            {user.expenses.map((expense) => (
                                                                                <tr key={expense.id} className="hover:bg-gray-50">
                                                                                    <td className="p-3 font-medium">{expense.item?.name || '-'}</td>
                                                                                    <td className="p-3">
                                                                                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${expense.item?.type === 'VEGETABLES'
                                                                                            ? 'bg-green-100 text-green-800'
                                                                                            : 'bg-blue-100 text-blue-800'
                                                                                            }`}>
                                                                                            {expense.item?.type || '-'}
                                                                                        </span>
                                                                                    </td>
                                                                                    <td className="p-3 text-red-600 font-medium">{expense.totalQuantityKg || '-'}</td>
                                                                                    <td className="p-3 text-gray-600">{expense.note || '-'}</td>
                                                                                    <td className="p-3 text-gray-500">{new Date(expense.createdAt).toLocaleDateString()}</td>
                                                                                </tr>
                                                                            ))}
                                                                        </tbody>
                                                                    </table>
                                                                </div>
                                                            ) : (
                                                                <p className="text-gray-500 text-center py-4">No expense data available</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default UserTable;