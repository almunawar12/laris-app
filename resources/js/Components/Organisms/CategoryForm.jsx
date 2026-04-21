import React, { useEffect } from "react";
import { useForm } from "@inertiajs/react";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";

export default function CategoryForm({ category = null, onClose }) {
    const isEditing = !!category;

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

    const submit = (e) => {
        e.preventDefault();
        if (isEditing) {
            patch(route("categories.update", category.id), {
                onSuccess: () => {
                    onClose();
                },
            });
        } else {
            post(route("categories.store"), {
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
    );
}
