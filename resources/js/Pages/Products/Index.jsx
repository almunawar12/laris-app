import React, { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, usePage, router } from "@inertiajs/react";
import Modal from "@/Components/Modal";
import ProductForm from "@/Components/Organisms/ProductForm";
import Pagination from "@/Components/Pagination";
import ConfirmationModal from "@/Components/Molecules/ConfirmationModal";
import { toast } from "sonner";
import { useEffect, useCallback, useRef } from "react";

export default function ProductIndex({ auth, products, categories, filters }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [searchTerm, setSearchTerm] = useState(filters.search || "");
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    const openCreateModal = () => {
        setSelectedProduct(null);
        setIsModalOpen(true);
    };

    const openEditModal = (product) => {
        setSelectedProduct(product);
        setIsModalOpen(true);
    };

    // Server-side search with debounce implementation
    const debounceTimeout = useRef(null);

    const handleSearch = (query) => {
        if (debounceTimeout.current) clearTimeout(debounceTimeout.current);

        debounceTimeout.current = setTimeout(() => {
            router.get(
                route("products.index"),
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
            route("products.index"),
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
        const toastId = "delete-product";

        router.delete(route("products.destroy", deleteId), {
            onStart: () => toast.loading("Menghapus produk...", { id: toastId }),
            onSuccess: () => {
                toast.success("Produk berhasil dihapus", { id: toastId });
                setShowDeleteConfirm(false);
                setDeleteId(null);
            },
            onError: () => {
                toast.error("Gagal menghapus produk.", { id: toastId });
                setShowDeleteConfirm(false);
            },
        });
    };

    const data = products.data;

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Manajemen Produk" />

            <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-black text-slate-800">Manajemen Produk</h1>
                        <p className="text-sm text-slate-500">Kelola stok dan informasi produk toko Anda.</p>
                    </div>
                    <button
                        onClick={openCreateModal}
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl shadow-lg shadow-primary-600/20 transition-all active:scale-95"
                    >
                        <span className="material-symbols-outlined">add</span>
                        Tambah Produk
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
                                placeholder="Cari SKU atau nama..."
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
                                    <th className="px-6 py-4">Produk</th>
                                    <th className="px-6 py-4">Kategori</th>
                                    <th className="px-6 py-4">Harga</th>
                                    <th className="px-6 py-4 text-center">Stok</th>
                                    <th className="px-6 py-4 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {data.length > 0 ? (
                                    data.map((product) => (
                                        <tr key={product.id} className="hover:bg-slate-50/80 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400">
                                                        <span className="material-symbols-outlined text-xl">image</span>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-slate-800">{product.name}</p>
                                                        <p className="text-[10px] text-slate-400 font-mono tracking-tight">{product.sku}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded-lg text-[10px] font-bold uppercase">
                                                    {product.category?.name || "No Category"}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm font-bold text-slate-700">
                                                Rp {new Intl.NumberFormat("id-ID").format(product.price)}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex justify-center">
                                                    <span className={`px-2 py-1 rounded-lg text-[10px] font-black ${
                                                        product.stock <= 5 
                                                        ? 'bg-red-50 text-red-600' 
                                                        : 'bg-green-50 text-green-600'
                                                    }`}>
                                                        {product.stock}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        onClick={() => openEditModal(product)}
                                                        className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                                                        title="Edit"
                                                    >
                                                        <span className="material-symbols-outlined text-xl">edit</span>
                                                    </button>
                                                    <button
                                                        onClick={() => handleOpenDeleteConfirm(product.id)}
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
                                        <td colSpan="5" className="px-6 py-12 text-center text-slate-400">
                                            <div className="flex flex-col items-center gap-2">
                                                <span className="material-symbols-outlined text-4xl opacity-20">inventory_2</span>
                                                <p className="text-sm font-medium">Belum ada produk yang ditemukan.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <Pagination 
                        links={products.links} 
                        total={products.total}
                        perPage={filters.per_page || 10}
                        onPerPageChange={onPerPageChange}
                    />
                </div>
            </div>

            <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)} maxWidth="2xl">
                <ProductForm 
                    product={selectedProduct} 
                    categories={categories} 
                    onClose={() => setIsModalOpen(false)} 
                />
            </Modal>

            <ConfirmationModal
                show={showDeleteConfirm}
                onClose={() => setShowDeleteConfirm(false)}
                onConfirm={handleConfirmDelete}
                title="Hapus Produk?"
                message="Apakah Anda yakin ingin menghapus produk ini? Tindakan ini tidak dapat dibatalkan."
                type="danger"
                confirmLabel="Ya, Hapus"
                cancelLabel="Batal"
            />
        </AuthenticatedLayout>
    );
}
