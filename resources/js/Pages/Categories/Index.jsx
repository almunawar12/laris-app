import React, { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";
import Modal from "@/Components/Modal";
import CategoryForm from "@/Components/Organisms/CategoryForm";
import Pagination from "@/Components/Pagination";
import ConfirmationModal from "@/Components/Molecules/ConfirmationModal";
import { toast } from "sonner";
import { useCallback, useRef } from "react";

export default function CategoryIndex({ auth, categories, filters }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [searchTerm, setSearchTerm] = useState(filters.search || "");
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    const openCreateModal = () => {
        setSelectedCategory(null);
        setIsModalOpen(true);
    };

    const openEditModal = (category) => {
        setSelectedCategory(category);
        setIsModalOpen(true);
    };

    // Server-side search with debounce implementation
    const debounceTimeout = useRef(null);

    const handleSearch = (query) => {
        if (debounceTimeout.current) clearTimeout(debounceTimeout.current);

        debounceTimeout.current = setTimeout(() => {
            router.get(
                route("categories.index"),
                { search: query },
                { preserveState: true, replace: true }
            );
        }, 500);
    };

    const onSearchChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        handleSearch(value);
    };

    const onPerPageChange = (value) => {
        router.get(
            route("categories.index"),
            { search: searchTerm, per_page: value },
            { preserveState: true, replace: true }
        );
    };

    const handleOpenDeleteConfirm = (id) => {
        setDeleteId(id);
        setShowDeleteConfirm(true);
    };

    const handleConfirmDelete = () => {
        if (!deleteId) return;

        router.delete(route("categories.destroy", deleteId), {
            onStart: () => toast.loading("Menghapus kategori..."),
            onSuccess: () => {
                toast.success("Kategori berhasil dihapus");
                setShowDeleteConfirm(false);
                setDeleteId(null);
            },
            onError: () => {
                toast.error("Gagal menghapus kategori. Pastikan tidak ada produk yang terkait dengan kategori ini.");
                setShowDeleteConfirm(false);
            },
        });
    };

    const data = categories.data;

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Master Kategori" />

            <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-black text-slate-800">Master Kategori</h1>
                        <p className="text-sm text-slate-500">Kelola kategori produk untuk pengelompokan yang lebih baik.</p>
                    </div>
                    <button
                        onClick={openCreateModal}
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl shadow-lg shadow-primary-600/20 transition-all active:scale-95"
                    >
                        <span className="material-symbols-outlined">category</span>
                        Tambah Kategori
                    </button>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row gap-4 justify-between items-center">
                        <div className="relative w-full md:max-w-xs">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                                search
                            </span>
                            <input
                                type="text"
                                placeholder="Cari nama kategori..."
                                className="w-full pl-10 pr-4 py-2 text-sm border-slate-200 rounded-xl focus:ring-primary-500 focus:border-primary-500"
                                value={searchTerm}
                                onChange={onSearchChange}
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-wider">
                                    <th className="px-6 py-4">Nama Kategori</th>
                                    <th className="px-6 py-4">Dibuat Pada</th>
                                    <th className="px-6 py-4 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {data.length > 0 ? (
                                    data.map((cat) => (
                                        <tr key={cat.id} className="hover:bg-slate-50/80 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                                                        <span className="material-symbols-outlined text-lg">label</span>
                                                    </div>
                                                    <p className="text-sm font-bold text-slate-800">{cat.name}</p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-slate-500 font-medium">
                                                {new Date(cat.created_at).toLocaleDateString("id-ID", {
                                                    day: "numeric",
                                                    month: "short",
                                                    year: "numeric"
                                                })}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        onClick={() => openEditModal(cat)}
                                                        className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                                                        title="Edit"
                                                    >
                                                        <span className="material-symbols-outlined text-xl">edit</span>
                                                    </button>
                                                    <button
                                                        onClick={() => handleOpenDeleteConfirm(cat.id)}
                                                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                        title="Hapus"
                                                    >
                                                        <span className="material-symbols-outlined text-xl">delete</span>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="3" className="px-6 py-12 text-center text-slate-400">
                                            <div className="flex flex-col items-center gap-2">
                                                <span className="material-symbols-outlined text-4xl opacity-20">inventory</span>
                                                <p className="text-sm font-medium">Belum ada kategori yang ditemukan.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <Pagination 
                        links={categories.links} 
                        total={categories.total}
                        perPage={filters.per_page || 10}
                        onPerPageChange={onPerPageChange}
                    />
                </div>
            </div>

            <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)} maxWidth="md">
                <CategoryForm 
                    category={selectedCategory} 
                    onClose={() => setIsModalOpen(false)} 
                />
            </Modal>

            <ConfirmationModal
                show={showDeleteConfirm}
                onClose={() => setShowDeleteConfirm(false)}
                onConfirm={handleConfirmDelete}
                title="Hapus Kategori?"
                message="Apakah Anda yakin ingin menghapus kategori ini? Semua produk dalam kategori ini mungkin akan terpengaruh."
                type="danger"
                confirmLabel="Ya, Hapus"
                cancelLabel="Batal"
            />
        </AuthenticatedLayout>
    );
}
