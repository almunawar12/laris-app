import React, { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";
import Modal from "@/Components/Modal";
import CustomerForm from "@/Components/Organisms/CustomerForm";
import { toast } from "sonner";

export default function CustomerIndex({ auth, customers }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    const openCreateModal = () => {
        setSelectedCustomer(null);
        setIsModalOpen(true);
    };

    const openEditModal = (customer) => {
        setSelectedCustomer(customer);
        setIsModalOpen(true);
    };

    const deleteCustomer = (id) => {
        if (confirm("Apakah Anda yakin ingin menghapus pelanggan ini?")) {
            router.delete(route("customers.destroy", id), {
                onSuccess: () => toast.success("Pelanggan berhasil dihapus"),
            });
        }
    };

    const filteredCustomers = customers.filter((customer) =>
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (customer.phone && customer.phone.includes(searchTerm))
    );

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Manajemen Pelanggan" />

            <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-black text-slate-800">Manajemen Pelanggan</h1>
                        <p className="text-sm text-slate-500">Kelola daftar pelanggan tetap toko Anda.</p>
                    </div>
                    <button
                        onClick={openCreateModal}
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl shadow-lg shadow-primary-600/20 transition-all active:scale-95"
                    >
                        <span className="material-symbols-outlined">add_reaction</span>
                        Tambah Pelanggan
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
                                placeholder="Cari nama atau telepon..."
                                className="w-full pl-10 pr-4 py-2 text-sm border-slate-200 rounded-xl focus:ring-primary-500 focus:border-primary-500"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="text-xs font-medium text-slate-500">
                            Total: <span className="text-slate-900 font-bold">{filteredCustomers.length}</span> Pelanggan
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-wider">
                                    <th className="px-6 py-4">Pelanggan</th>
                                    <th className="px-6 py-4">No. Telepon</th>
                                    <th className="px-6 py-4">Tgl Daftar</th>
                                    <th className="px-6 py-4 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredCustomers.length > 0 ? (
                                    filteredCustomers.map((customer) => (
                                        <tr key={customer.id} className="hover:bg-slate-50/80 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600">
                                                        <span className="material-symbols-outlined text-xl">person</span>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-slate-800">{customer.name}</p>
                                                        <p className="text-[10px] text-slate-400">ID: #{customer.id}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-slate-600 font-mono">
                                                {customer.phone || "-"}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-slate-500 font-medium">
                                                {new Date(customer.created_at).toLocaleDateString("id-ID", {
                                                    day: "numeric",
                                                    month: "short",
                                                    year: "numeric"
                                                })}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        onClick={() => openEditModal(customer)}
                                                        className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                                                        title="Edit"
                                                    >
                                                        <span className="material-symbols-outlined text-xl">edit</span>
                                                    </button>
                                                    <button
                                                        onClick={() => deleteCustomer(customer.id)}
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
                                        <td colSpan="4" className="px-6 py-12 text-center text-slate-400">
                                            <div className="flex flex-col items-center gap-2">
                                                <span className="material-symbols-outlined text-4xl opacity-20">person_off</span>
                                                <p className="text-sm font-medium">Belum ada pelanggan yang ditemukan.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)} maxWidth="md">
                <CustomerForm 
                    customer={selectedCustomer} 
                    onClose={() => setIsModalOpen(false)} 
                />
            </Modal>
        </AuthenticatedLayout>
    );
}
