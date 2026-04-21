import React, { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";
import Modal from "@/Components/Modal";
import UserForm from "@/Components/Organisms/UserForm";
import { toast } from "sonner";

export default function UserIndex({ auth, users }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    const openCreateModal = () => {
        setSelectedUser(null);
        setIsModalOpen(true);
    };

    const openEditModal = (user) => {
        setSelectedUser(user);
        setIsModalOpen(true);
    };

    const deleteUser = (id) => {
        if (id === auth.user.id) {
            toast.error("Anda tidak bisa menghapus akun Anda sendiri.");
            return;
        }

        if (confirm("Apakah Anda yakin ingin menghapus user ini?")) {
            router.delete(route("users.destroy", id), {
                onSuccess: () => toast.success("User berhasil dihapus"),
                onError: (e) => toast.error(e.error || "Gagal menghapus user"),
            });
        }
    };

    const filteredUsers = users.filter((user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Manajemen User" />

            <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-black text-slate-800">Manajemen User</h1>
                        <p className="text-sm text-slate-500">Kelola akses admin dan kasir toko.</p>
                    </div>
                    <button
                        onClick={openCreateModal}
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl shadow-lg shadow-primary-600/20 transition-all active:scale-95"
                    >
                        <span className="material-symbols-outlined">person_add</span>
                        Tambah User
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
                                placeholder="Cari nama atau email..."
                                className="w-full pl-10 pr-4 py-2 text-sm border-slate-200 rounded-xl focus:ring-primary-500 focus:border-primary-500"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="text-xs font-medium text-slate-500">
                            Total: <span className="text-slate-900 font-bold">{filteredUsers.length}</span> User
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-wider">
                                    <th className="px-6 py-4">User</th>
                                    <th className="px-6 py-4">Role</th>
                                    <th className="px-6 py-4">Email</th>
                                    <th className="px-6 py-4">Tergabung</th>
                                    <th className="px-6 py-4 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredUsers.length > 0 ? (
                                    filteredUsers.map((user) => (
                                        <tr key={user.id} className="hover:bg-slate-50/80 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center text-primary-600 font-bold text-xs border border-primary-100">
                                                        {user.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-slate-800">{user.name}</p>
                                                        {user.id === auth.user.id && (
                                                            <span className="text-[9px] bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded font-black uppercase ring-1 ring-slate-300">You</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase ${
                                                    user.role === 'admin' 
                                                    ? 'bg-purple-50 text-purple-600' 
                                                    : 'bg-blue-50 text-blue-600'
                                                }`}>
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-slate-600">
                                                {user.email}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-slate-500">
                                                {new Date(user.created_at).toLocaleDateString("id-ID", {
                                                    day: "numeric",
                                                    month: "short",
                                                    year: "numeric"
                                                })}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        onClick={() => openEditModal(user)}
                                                        className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                                                        title="Edit"
                                                    >
                                                        <span className="material-symbols-outlined text-xl">edit</span>
                                                    </button>
                                                    {user.id !== auth.user.id && (
                                                        <button
                                                            onClick={() => deleteUser(user.id)}
                                                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                            title="Hapus"
                                                        >
                                                            <span className="material-symbols-outlined text-xl">delete</span>
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-12 text-center text-slate-400">
                                            <div className="flex flex-col items-center gap-2">
                                                <span className="material-symbols-outlined text-4xl opacity-20">group</span>
                                                <p className="text-sm font-medium">Belum ada user yang ditemukan.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)} maxWidth="2xl">
                <UserForm 
                    user={selectedUser} 
                    onClose={() => setIsModalOpen(false)} 
                />
            </Modal>
        </AuthenticatedLayout>
    );
}
