import React, { useEffect, useState } from "react";
import { useForm } from "@inertiajs/react";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";
import ConfirmationModal from "@/Components/Molecules/ConfirmationModal";
import { toast } from "sonner";

export default function CategoryForm({ category = null, onClose }) {
    const isEditing = !!category;
    const [showConfirm, setShowConfirm] = useState(false);

    const { data, setData, post, patch, processing, errors, reset } = useForm({
        name: category?.name || "",
    });

    useEffect(() => {
        if (category) {
            setData({
                name: category.name,
            });
        } else {
            reset();
        }
    }, [category]);

    const handleOpenConfirm = (e) => {
        e.preventDefault();
        setShowConfirm(true);
    };

    const handleConfirm = () => {
        setShowConfirm(false);
        const toastId = isEditing ? "update-category" : "create-category";

        if (isEditing) {
            patch(route("categories.update", category.id), {
                onStart: () => toast.loading("Memperbarui kategori...", { id: toastId }),
                onSuccess: () => {
                    toast.success("Kategori berhasil diperbarui!", { id: toastId });
                    onClose();
                },
                onError: () => {
                    toast.error("Gagal memperbarui kategori.", { id: toastId });
                }
            });
        } else {
            post(route("categories.store"), {
                onStart: () => toast.loading("Menyimpan kategori...", { id: toastId }),
                onSuccess: () => {
                    toast.success("Kategori berhasil ditambahkan!", { id: toastId });
                    reset();
                    onClose();
                },
                onError: () => {
                    toast.error("Gagal menyimpan kategori.", { id: toastId });
                }
            });
        }
    };

    return (
        <>
            <form onSubmit={handleOpenConfirm} className="p-6">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-black text-slate-800">
                    {isEditing ? "Edit Kategori" : "Tambah Kategori Baru"}
                </h2>
                <button
                    type="button"
                    onClick={onClose}
                    className="text-slate-400 hover:text-slate-600 transition-colors"
                >
                    <span className="material-symbols-outlined">close</span>
                </button>
            </div>

            <div className="space-y-4">
                <div>
                    <InputLabel htmlFor="name" value="Nama Kategori" />
                    <TextInput
                        id="name"
                        className="mt-1 block w-full"
                        value={data.name}
                        onChange={(e) => setData("name", e.target.value)}
                        placeholder="Contoh: Makanan, Minuman, Elektronik..."
                        required
                    />
                    <InputError message={errors.name} className="mt-2" />
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
                    {processing ? "Menyimpan..." : "Simpan Kategori"}
                </PrimaryButton>
            </div>
            </form>

            <ConfirmationModal
                show={showConfirm}
                onClose={() => setShowConfirm(false)}
                onConfirm={handleConfirm}
                title={isEditing ? "Update Kategori?" : "Simpan Kategori Baru?"}
                message={isEditing 
                    ? "Apakah Anda yakin ingin menyimpan perubahan pada kategori ini?" 
                    : "Apakah Anda yakin data kategori yang dimasukkan sudah benar?"
                }
                type="info"
                confirmLabel="Ya, Simpan"
                cancelLabel="Batal"
            />
        </>
    );
}
