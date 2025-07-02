import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ChevronDown, ChevronUp, Users, TrendingUp, TrendingDown, Package, DollarSign } from 'lucide-react';

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

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-48">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
            </div>
        );
    }

    // Calculate totals
    const totalIncomeKg = users.reduce((sum, user) =>
        sum + (user.incomes?.reduce((incSum, income) => incSum + (income.totalQuantityKg || 0), 0) || 0), 0
    );

    const totalExpenseKg = users.reduce((sum, user) =>
        sum + (user.expenses?.reduce((expSum, expense) => expSum + (expense.totalQuantityKg || 0), 0) || 0), 0
    );

    const totalIncomeValue = users.reduce((sum, user) =>
        sum + (user.incomes?.reduce((incSum, income) => incSum + (income.totalPerItem || 0), 0) || 0), 0
    );

    const totalExpenseValue = users.reduce((sum, user) =>
        sum + (user.expenses?.reduce((expSum, expense) => expSum + (expense.totalPerItem || 0), 0) || 0), 0
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 p-6">
            {/* Header Section */}
            <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                    <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                    <h2 className="text-3xl font-bold text-gray-800">Manajemen Pengguna</h2>
                    <p className="text-gray-600 mt-1">Monitoring aktivitas serta transaksi pengguna</p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white p-6 rounded-2xl shadow-lg transform hover:scale-105 transition-all duration-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-green-100 text-sm font-medium">Total Pengguna</p>
                            <p className="text-3xl font-bold mt-1">{users.length}</p>
                        </div>
                        <Users className="w-10 h-10 text-green-200" />
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 transform hover:scale-105 transition-all duration-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm font-medium">Total Pendapatan (Kg)</p>
                            <p className="text-3xl font-bold text-gray-800 mt-1">{totalIncomeKg.toLocaleString()}</p>
                        </div>
                        <TrendingUp className="w-10 h-10 text-green-500" />
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 transform hover:scale-105 transition-all duration-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm font-medium">Total Pengeluaran (Kg)</p>
                            <p className="text-3xl font-bold text-gray-800 mt-1">{totalExpenseKg.toLocaleString()}</p>
                        </div>
                        <TrendingDown className="w-10 h-10 text-red-500" />
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">
                            <tr>
                                <th className="p-5 text-left text-sm font-semibold">No</th>
                                <th className="p-5 text-left text-sm font-semibold">Nama</th>
                                <th className="p-5 text-left text-sm font-semibold">Email</th>
                                <th className="p-5 text-left text-sm font-semibold">Item</th>
                                <th className="p-5 text-left text-sm font-semibold">Pendapatan</th>
                                <th className="p-5 text-left text-sm font-semibold">Pengeluaran</th>
                                <th className="p-5 text-left text-sm font-semibold">Profit</th>
                                <th className="p-5 text-left text-sm font-semibold">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {users.map((user, idx) => {
                                const totalIncomeKg = user.incomes?.reduce((sum, income) => sum + (income.totalQuantityKg || 0), 0) || 0;
                                const totalExpenseKg = user.expenses?.reduce((sum, expense) => sum + (expense.totalQuantityKg || 0), 0) || 0;
                                const totalIncomeValue = user.incomes?.reduce((sum, income) => sum + (income.totalPerItem || 0), 0) || 0;
                                const totalExpenseValue = user.expenses?.reduce((sum, expense) => sum + (expense.totalPerItem || 0), 0) || 0;
                                const profit = totalIncomeValue - totalExpenseValue;
                                const isExpanded = expandedUserId === user.id;

                                return (
                                    <React.Fragment key={user.id}>
                                        <tr className="hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 transition-all duration-200">
                                            <td className="p-5 text-sm text-gray-600 font-medium">{idx + 1}</td>
                                            <td className="p-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                                                        {user.name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div className="font-semibold text-gray-900">{user.name}</div>
                                                </div>
                                            </td>
                                            <td className="p-5 text-sm text-gray-600">{user.email}</td>
                                            <td className="p-5">
                                                <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                                                    <Package className="w-3 h-3" />
                                                    {user.items?.length || 0} items
                                                </span>
                                            </td>
                                            <td className="p-5">
                                                <div className="text-green-600 font-semibold">{totalIncomeKg} Kg</div>
                                                <div className="text-xs text-gray-500">{formatCurrency(totalIncomeValue)}</div>
                                            </td>
                                            <td className="p-5">
                                                <div className="text-red-600 font-semibold">{totalExpenseKg} Kg</div>
                                                <div className="text-xs text-gray-500">{formatCurrency(totalExpenseValue)}</div>
                                            </td>
                                            <td className="p-5">
                                                <div className={`font-semibold ${profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                    {formatCurrency(profit)}
                                                </div>
                                            </td>
                                            <td className="p-5">
                                                <button
                                                    className="flex items-center gap-2 px-4 py-2 text-sm text-green-600 hover:bg-green-50 rounded-xl transition-all duration-200 font-medium border border-green-200 hover:border-green-300"
                                                    onClick={() => toggleExpand(user.id)}
                                                >
                                                    {isExpanded ? (
                                                        <>
                                                            <ChevronUp className="w-4 h-4" />
                                                            Tutup
                                                        </>
                                                    ) : (
                                                        <>
                                                            <ChevronDown className="w-4 h-4" />
                                                            Detail
                                                        </>
                                                    )}
                                                </button>
                                            </td>
                                        </tr>

                                        {isExpanded && (
                                            <tr>
                                                <td colSpan="8" className="p-0">
                                                    <div className="bg-gradient-to-r from-gray-50 to-green-50 p-8">
                                                        <div className="space-y-6">
                                                            {/* Income Section */}
                                                            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                                                                <div className="flex items-center gap-3 mb-6">
                                                                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                                                                        <TrendingUp className="w-5 h-5 text-green-600" />
                                                                    </div>
                                                                    <h3 className="text-lg font-bold text-gray-800">Transaksi Pendapatan</h3>
                                                                </div>
                                                                {user.incomes?.length ? (
                                                                    <div className="space-y-4">
                                                                        {user.incomes.map((income, incomeIdx) => (
                                                                            <div key={incomeIdx} className="bg-green-50 rounded-xl p-4 border border-green-100">
                                                                                <div className="flex justify-between items-start mb-3">
                                                                                    <div className="flex items-center gap-3">
                                                                                        <div className="w-8 h-8 bg-green-200 rounded-lg flex items-center justify-center">
                                                                                            <Package className="w-4 h-4 text-green-700" />
                                                                                        </div>
                                                                                        <div>
                                                                                            <h4 className="font-semibold text-gray-800">{income.item?.name || '-'}</h4>
                                                                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 mt-1">
                                                                                                {income.item?.type === 'VEGETABLE' ? 'SAYURAN' : 'LAINNYA'}
                                                                                            </span>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="text-right">
                                                                                        <div className="text-lg font-bold text-green-600">{formatCurrency(income.totalPerItem || 0)}</div>
                                                                                        <div className="text-sm text-gray-500">{income.totalQuantityKg || 0} Kg</div>
                                                                                    </div>
                                                                                </div>
                                                                                {income.details && income.details.length > 0 && (
                                                                                    <div className="mt-3 pt-3 border-t border-green-200">
                                                                                        <table className="w-full text-sm">
                                                                                            <thead>
                                                                                                <tr className="border-b border-green-200">
                                                                                                    <th className="text-left py-2 text-gray-600 font-medium">Kuantitas</th>
                                                                                                    <th className="text-left py-2 text-gray-600 font-medium">Harga Jual/Kg</th>
                                                                                                    <th className="text-left py-2 text-gray-600 font-medium">Tanggal</th>
                                                                                                    <th className="text-right py-2 text-gray-600 font-medium">Total</th>
                                                                                                </tr>
                                                                                            </thead>
                                                                                            <tbody>
                                                                                                {income.details.map((detail, detailIdx) => (
                                                                                                    <tr key={detailIdx} className="border-b border-green-100 last:border-b-0">
                                                                                                        <td className="py-2 text-gray-700">{detail.quantityKg} Kg</td>
                                                                                                        <td className="py-2 text-gray-700">{formatCurrency(detail.pricePerKg)}</td>
                                                                                                        <td className="py-2 text-gray-700">
                                                                                                            {new Date(detail.date).toLocaleDateString('id-ID', {
                                                                                                                day: 'numeric',
                                                                                                                month: 'long',
                                                                                                                year: 'numeric',
                                                                                                                timeZone: 'Asia/Makassar'
                                                                                                            })}
                                                                                                        </td>
                                                                                                        <td className="py-2 text-right font-medium text-green-600">{formatCurrency(detail.totalPrice)}</td>
                                                                                                    </tr>
                                                                                                ))}
                                                                                            </tbody>
                                                                                        </table>
                                                                                    </div>
                                                                                )}
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                ) : (
                                                                    <div className="text-center py-8">
                                                                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                                                            <TrendingUp className="w-8 h-8 text-gray-400" />
                                                                        </div>
                                                                        <p className="text-gray-500">Tidak ada transaksi pendapatan</p>
                                                                    </div>
                                                                )}
                                                            </div>

                                                            {/* Expense Section */}
                                                            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                                                                <div className="flex items-center gap-3 mb-6">
                                                                    <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                                                                        <TrendingDown className="w-5 h-5 text-red-600" />
                                                                    </div>
                                                                    <h3 className="text-lg font-bold text-gray-800">Transaksi Pengeluaran</h3>
                                                                </div>
                                                                {user.expenses?.length ? (
                                                                    <div className="space-y-4">
                                                                        {user.expenses.map((expense, expenseIdx) => (
                                                                            <div key={expenseIdx} className="bg-red-50 rounded-xl p-4 border border-red-100">
                                                                                <div className="flex justify-between items-start mb-3">
                                                                                    <div className="flex items-center gap-3">
                                                                                        <div className="w-8 h-8 bg-red-200 rounded-lg flex items-center justify-center">
                                                                                            <Package className="w-4 h-4 text-red-700" />
                                                                                        </div>
                                                                                        <div>
                                                                                            <h4 className="font-semibold text-gray-800">{expense.item?.name || '-'}</h4>
                                                                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 mt-1">
                                                                                                {expense.item?.type === 'VEGETABLE' ? 'SAYURAN' : 'LAINNYA'}
                                                                                            </span>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="text-right">
                                                                                        <div className="text-lg font-bold text-red-600">{formatCurrency(expense.totalPerItem || 0)}</div>
                                                                                        <div className="text-sm text-gray-500">{expense.totalQuantityKg || 0} Kg</div>
                                                                                    </div>
                                                                                </div>
                                                                                {expense.note && (
                                                                                    <div className="mt-3 p-3 bg-red-100 rounded-lg border border-red-200">
                                                                                        <div className="flex items-start gap-2">
                                                                                            <div className="w-4 h-4 bg-red-200 rounded-full flex items-center justify-center mt-0.5">
                                                                                                <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                                                                                            </div>
                                                                                            <div>
                                                                                                <p className="text-sm text-red-800 font-semibold">Catatan:</p>
                                                                                                <p className="text-sm text-red-700 mt-1">{expense.note}</p>
                                                                                                {expense.date && (
                                                                                                    <p className="text-xs text-red-600 mt-2">
                                                                                                        Dicatat pada:{" "}
                                                                                                        {new Date(expense.date).toLocaleDateString('id-ID', {
                                                                                                            day: 'numeric',
                                                                                                            month: 'long',
                                                                                                            year: 'numeric',
                                                                                                            timeZone: 'Asia/Makassar'
                                                                                                        })}
                                                                                                    </p>
                                                                                                )}
                                                                                            </div>

                                                                                        </div>
                                                                                    </div>
                                                                                )}
                                                                                {expense.details && expense.details.length > 0 && (
                                                                                    <div className="mt-3 pt-3 border-t border-red-200">
                                                                                        <table className="w-full text-sm">
                                                                                            <thead>
                                                                                                <tr className="border-b border-red-200">
                                                                                                    <th className="text-left py-2 text-gray-600 font-medium">Kuantitas</th>
                                                                                                    <th className="text-left py-2 text-gray-600 font-medium">Harga Beli/Kg</th>
                                                                                                    <th className="text-left py-2 text-gray-600 font-medium">Tanggal</th>
                                                                                                    <th className="text-right py-2 text-gray-600 font-medium">Total</th>
                                                                                                </tr>
                                                                                            </thead>
                                                                                            <tbody>
                                                                                                {expense.details.map((detail, detailIdx) => (
                                                                                                    <tr key={detailIdx} className="border-b border-red-100 last:border-b-0">
                                                                                                        <td className="py-2 text-gray-700">{detail.quantityKg} Kg</td>
                                                                                                        <td className="py-2 text-gray-700">{formatCurrency(detail.pricePerKg)}</td>
                                                                                                        <td className="py-2 text-gray-700">
                                                                                                            {new Date(detail.date).toLocaleDateString('id-ID', {
                                                                                                                day: 'numeric',
                                                                                                                month: 'long',
                                                                                                                year: 'numeric',
                                                                                                                timeZone: 'Asia/Makassar'
                                                                                                            })}
                                                                                                        </td>
                                                                                                        <td className="py-2 text-right font-medium text-red-600">{formatCurrency(detail.totalPrice)}</td>
                                                                                                    </tr>
                                                                                                ))}
                                                                                            </tbody>
                                                                                        </table>
                                                                                    </div>
                                                                                )}
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                ) : (
                                                                    <div className="text-center py-8">
                                                                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                                                            <TrendingDown className="w-8 h-8 text-gray-400" />
                                                                        </div>
                                                                        <p className="text-gray-500">Tidak ada transaksi pengeluaran</p>
                                                                    </div>
                                                                )}
                                                            </div>
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