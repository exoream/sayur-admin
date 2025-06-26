'use client';

import React, { useState, useEffect } from 'react';
import { PlusCircle, PencilLine, Trash2 } from 'lucide-react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import axios from 'axios';

const MySwal = withReactContent(Swal);


const LovItemPage = () => {
    const [lovItems, setLovItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [formData, setFormData] = useState({ name: '', type: 'VEGETABLES', file: null });
    const [previewUrl, setPreviewUrl] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        fetchLovItems();
    }, []);

    const fetchLovItems = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('https://sayur-one.vercel.app/lov-items', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            // Validasi apakah responsnya memiliki data
            if (res.data && res.data.status && Array.isArray(res.data.data)) {
                setLovItems(res.data.data);
            } else {
                throw new Error(res.data?.message || 'Gagal memuat data LOV item');
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (selectedItem) {
            setFormData({ name: selectedItem.name || '', type: selectedItem.type || 'VEGETABLES', file: null });
            setPreviewUrl(selectedItem.photo || '');
        } else {
            setFormData({ name: '', type: 'VEGETABLES', file: null });
            setPreviewUrl('');
        }
    }, [selectedItem]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, file });
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleCreate = () => {
        setSelectedItem(null);
        setModalOpen(true);
    };

    const handleEdit = (item) => {
        setSelectedItem(item);
        setModalOpen(true);
    };

    const handleDelete = async (id) => {
        const confirm = await MySwal.fire({
            title: 'Yakin ingin menghapus item ini?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Hapus',
            cancelButtonText: 'Batal',
        });

        if (confirm.isConfirmed) {
            try {
                const token = localStorage.getItem('token');
                setIsSubmitting(true);
                const res = await fetch(`https://sayur-one.vercel.app/lov-items/${id}`, {
                    method: 'DELETE', headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });
                const json = await res.json();
                if (json.status) {
                    await fetchLovItems();
                    MySwal.fire('Berhasil!', 'Item berhasil dihapus', 'success');
                } else {
                    throw new Error(json.message);
                }
            } catch (err) {
                console.error(err);
                MySwal.fire('Error', err.message, 'error');
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { name, type, file } = formData;

        if (!name.trim() || !type || (!file && !previewUrl)) {
            MySwal.fire('Error', 'Semua field wajib diisi', 'error');
            return;
        }

        setIsSubmitting(true);

        const form = new FormData();
        form.append('name', name);
        form.append('type', type);
        if (file) form.append('photo', file);

        try {
            const token = localStorage.getItem('token');
            const url = selectedItem ? `https://sayur-one.vercel.app/lov-items/${selectedItem.id}` : 'https://sayur-one.vercel.app/lov-items';
            const method = selectedItem ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: {
                    Authorization: `Bearer ${token}`
                },
                body: form,
            });

            const json = await res.json();

            if (json.status) {
                MySwal.fire('Berhasil', `Item berhasil ${selectedItem ? 'diperbarui' : 'ditambahkan'}`, 'success');
                fetchLovItems();
                setModalOpen(false);
                setSelectedItem(null);
            } else {
                throw new Error(json.message || 'Terjadi kesalahan');
            }
        } catch (err) {
            console.error(err);
            MySwal.fire('Error', err.message, 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div>
            {/* Header dengan tombol tambah */}
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800">Pengaturan Item</h3>
                        <p className="text-sm text-gray-500">Tambah, edit, dan hapus items</p>
                    </div>
                </div>
                <button
                    onClick={handleCreate}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 shadow-lg transition-all duration-200 transform hover:scale-105"
                >
                    <PlusCircle className="w-5 h-5" /> Tambah Item
                </button>
            </div>

            {/* Content */}
            {isLoading ? (
                <div className="flex justify-center items-center h-48">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {lovItems.map((item) => (
                        <div key={item.id} className="bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden group">
                            <div className="relative">
                                <img src={item.photo} alt={item.name} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                            </div>
                            <div className="p-4">
                                <h3 className="text-lg font-semibold text-gray-800 mb-1">{item.name}</h3>
                                <div className="flex items-center gap-2 mb-4">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${item.type === 'VEGETABLES'
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-blue-100 text-blue-800'
                                        }`}>
                                        {item.type}
                                    </span>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleEdit(item)}
                                        className="flex items-center gap-1 px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-green-50 hover:border-green-200 hover:text-green-700 transition-colors duration-200"
                                    >
                                        <PencilLine className="w-4 h-4" /> Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(item.id)}
                                        disabled={isSubmitting}
                                        className="flex items-center gap-1 px-3 py-1.5 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200 disabled:opacity-50"
                                    >
                                        <Trash2 className="w-4 h-4" /> Hapus
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
            {modalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
                    <div className="bg-white rounded-xl w-full max-w-md shadow-2xl">
                        <div className="p-6 border-b border-gray-100">
                            <h2 className="text-xl font-bold text-gray-800">{selectedItem ? 'Edit' : 'Add'} LOV Item</h2>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    placeholder="Enter item name"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                                <select
                                    value={formData.type}
                                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                >
                                    <option value="VEGETABLE">VEGETABLE</option>
                                    <option value="OTHER">OTHER</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Photo</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                />
                            </div>
                            {previewUrl && (
                                <div className="flex justify-center">
                                    <img src={previewUrl} alt="Preview" className="w-32 h-32 object-cover rounded-lg border border-gray-200" />
                                </div>
                            )}
                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setModalOpen(false)}
                                    className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex-1 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-200 disabled:opacity-50"
                                >
                                    {isSubmitting ? 'Saving...' : selectedItem ? 'Perbarui' : 'Tambah'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LovItemPage;