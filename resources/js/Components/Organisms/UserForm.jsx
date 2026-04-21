import React, { useEffect } from "react";
import { useForm } from "@inertiajs/react";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";

export default function UserForm({ user = null, onClose }) {
    const isEditing = !!user;

    const { data, setData, post, patch, processing, errors, reset } = useForm({
        name: user?.name || "",
        email: user?.email || "",
        role: user?.role || "kasir",
        password: "",
        password_confirmation: "",
    });

    useEffect(() => {
        if (user) {
            setData({
                name: user.name,
                email: user.email,
                role: user.role,
                password: "",
                password_confirmation: "",
            });
        } else {
            reset();
        }
    }, [user]);

    const submit = (e) => {
        e.preventDefault();
        if (isEditing) {
            patch(route("users.update", user.id), {
                onSuccess: () => {
                    onClose();
                },
            });
        } else {
            post(route("users.store"), {
                onSuccess: () => {
                    reset();
                    onClose();
                },
            });
        }
    };

    return (
        <form onSubmit={submit} className="p-6">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-black text-slate-800">
                    {isEditing ? "Edit User" : "Tambah User Baru"}
                </h2>
                <button
                    type="button"
                    onClick={onClose}
                    className="text-slate-400 hover:text-slate-600 transition-colors"
                >
                    <span className="material-symbols-outlined">close</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <div>
                        <InputLabel htmlFor="name" value="Nama Lengkap" />
                        <TextInput
                            id="name"
                            className="mt-1 block w-full"
                            value={data.name}
                            onChange={(e) => setData("name", e.target.value)}
                            required
                        />
                        <InputError message={errors.name} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel htmlFor="email" value="Email" />
                        <TextInput
                            id="email"
                            type="email"
                            className="mt-1 block w-full"
                            value={data.email}
                            onChange={(e) => setData("email", e.target.value)}
                            required
                        />
                        <InputError message={errors.email} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel htmlFor="role" value="Role / Hak Akses" />
                        <select
                            id="role"
                            className="mt-1 block w-full border-gray-300 focus:border-primary-500 focus:ring-primary-500 rounded-xl shadow-sm transition-all"
                            value={data.role}
                            onChange={(e) => setData("role", e.target.value)}
                            required
                        >
                            <option value="kasir">Kasir</option>
                            <option value="admin">Administrator</option>
                        </select>
                        <InputError message={errors.role} className="mt-2" />
                    </div>
                </div>

                <div className="space-y-4">
                    <div>
                        <InputLabel htmlFor="password" value={isEditing ? "Password Baru (Kosongkan jika tidak ganti)" : "Password"} />
                        <TextInput
                            id="password"
                            type="password"
                            className="mt-1 block w-full"
                            value={data.password}
                            onChange={(e) => setData("password", e.target.value)}
                            required={!isEditing}
                        />
                        <InputError message={errors.password} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel htmlFor="password_confirmation" value="Konfirmasi Password" />
                        <TextInput
                            id="password_confirmation"
                            type="password"
                            className="mt-1 block w-full"
                            value={data.password_confirmation}
                            onChange={(e) => setData("password_confirmation", e.target.value)}
                            required={!isEditing || data.password !== ""}
                        />
                        <InputError message={errors.password_confirmation} className="mt-2" />
                    </div>

                    {isEditing && (
                        <div className="p-4 bg-amber-50 rounded-xl border border-amber-100 flex gap-3">
                            <span className="material-symbols-outlined text-amber-500">info</span>
                            <p className="text-[10px] text-amber-700 leading-relaxed font-medium">
                                Saat mengedit user, biarkan kolom password kosong jika tidak ingin mengubah password akun tersebut.
                            </p>
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-8 flex justify-end gap-3">
                <SecondaryButton type="button" onClick={onClose} className="rounded-xl px-6">
                    Batal
                </SecondaryButton>
                <PrimaryButton
                    className="rounded-xl px-8 bg-primary-600 hover:bg-primary-700 shadow-lg shadow-primary-600/20"
                    disabled={processing}
                >
                    {processing ? "Menyimpan..." : "Simpan User"}
                </PrimaryButton>
            </div>
        </form>
    );
}
