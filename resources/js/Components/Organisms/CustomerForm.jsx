import React, { useEffect, useState } from "react";
import { useForm } from "@inertiajs/react";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";
import ConfirmationModal from "@/Components/Molecules/ConfirmationModal";
import { toast } from "sonner";

export default function CustomerForm({ customer = null, onClose }) {
    const isEditing = !!customer;
    const [showConfirm, setShowConfirm] = useState(false);

    const { data, setData, post, patch, processing, errors, reset } = useForm({
        name: customer?.name || "",
        phone: customer?.phone || "",
    });

    useEffect(() => {
        if (customer) {
            setData({
                name: customer.name,
                phone: customer.phone || "",
            });
        } else {
            reset();
        }
    }, [customer]);

    const handleOpenConfirm = (e) => {
        e.preventDefault();
        setShowConfirm(true);
    };

    const handleConfirm = () => {
        setShowConfirm(false);
        const toastId = isEditing ? "update-customer" : "create-customer";

        if (isEditing) {
            patch(route("customers.update", customer.id), {
                onStart: () => toast.loading("Memperbarui data pelanggan...", { id: toastId }),
                onSuccess: () => {
                    toast.success("Data pelanggan berhasil diperbarui!", { id: toastId });
                    onClose();
                },
                onError: () => {
                    toast.error("Gagal memperbarui data pelanggan.", { id: toastId });
                }
            });
        } else {
            post(route("customers.store"), {
                onStart: () => toast.loading("Menyimpan data pelanggan...", { id: toastId }),
                onSuccess: () => {
                    toast.success("Pelanggan berhasil ditambahkan!", { id: toastId });
                    reset();
                    onClose();
                },
                onError: () => {
                    toast.error("Gagal menyimpan data pelanggan.", { id: toastId });
                }
            });
        }
    };

    return (
        <>
            <form onSubmit={handleOpenConfirm} className="p-6">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-black text-slate-800">
                    {isEditing ? "Edit Pelanggan" : "Tambah Pelanggan Baru"}
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
                    <InputLabel htmlFor="name" value="Nama Pelanggan" />
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
                    <InputLabel htmlFor="phone" value="No. Telepon / WhatsApp (Opsional)" />
                    <TextInput
                        id="phone"
                        type="tel"
                        className="mt-1 block w-full"
                        value={data.phone}
                        onChange={(e) => setData("phone", e.target.value)}
                    />
                    <InputError message={errors.phone} className="mt-2" />
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
                    {processing ? "Menyimpan..." : "Simpan Pelanggan"}
                </PrimaryButton>
            </div>
            </form>

            <ConfirmationModal
                show={showConfirm}
                onClose={() => setShowConfirm(false)}
                onConfirm={handleConfirm}
                title={isEditing ? "Update Pelanggan?" : "Simpan Pelanggan Baru?"}
                message={isEditing 
                    ? "Apakah Anda yakin ingin menyimpan perubahan pada data pelanggan ini?" 
                    : "Apakah Anda yakin data pelanggan yang dimasukkan sudah benar?"
                }
                type="info"
                confirmLabel="Ya, Simpan"
                cancelLabel="Batal"
            />
        </>
    );
}
