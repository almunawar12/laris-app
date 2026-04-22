import React, { useEffect, useState } from "react";
import { useForm } from "@inertiajs/react";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";
import SearchableSelect from "@/Components/SearchableSelect";
import ConfirmationModal from "@/Components/Molecules/ConfirmationModal";
import { toast } from "sonner";

 export default function ProductForm({ product = null, categories = [], onClose }) {
    const isEditing = !!product;
    const [showConfirm, setShowConfirm] = useState(false);

    const { data, setData, post, patch, processing, errors, reset } = useForm({
        name: product?.name || "",
        description: product?.description || "",
        price: product?.price || "",
        cost_price: product?.cost_price || "",
        stock: product?.stock || "",
        category_id: product?.category_id || "",
        sku: product?.sku || "",
    });

    useEffect(() => {
        if (product) {
            setData({
                name: product.name,
                description: product.description || "",
                price: product.price,
                cost_price: product.cost_price,
                stock: product.stock,
                category_id: product.category_id,
                sku: product.sku,
            });
        } else {
            reset();
        }
    }, [product]);

    const handleOpenConfirm = (e) => {
        e.preventDefault();
        setShowConfirm(true);
    };

    const handleConfirm = () => {
        setShowConfirm(false);
        const toastId = isEditing ? "update-product" : "create-product";

        if (isEditing) {
            patch(route("products.update", product.id), {
                onStart: () => toast.loading("Memperbarui produk...", { id: toastId }),
                onSuccess: () => {
                    toast.success("Produk berhasil diperbarui!", { id: toastId });
                    onClose();
                },
                onError: () => {
                    toast.error("Gagal memperbarui produk. Periksa kembali form Anda.", { id: toastId });
                }
            });
        } else {
            post(route("products.store"), {
                onStart: () => toast.loading("Menyimpan produk...", { id: toastId }),
                onSuccess: () => {
                    toast.success("Produk berhasil ditambahkan!", { id: toastId });
                    reset();
                    onClose();
                },
                onError: () => {
                    toast.error("Gagal menyimpan produk. Periksa kembali form Anda.", { id: toastId });
                }
            });
        }
    };

    return (
        <>
            <form onSubmit={handleOpenConfirm} className="overflow-hidden bg-white rounded-3xl">
            {/* Header with Gradient Accent */}
            <div className="relative p-6 pb-0">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-500 to-indigo-500"></div>
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-primary-50 flex items-center justify-center text-primary-600 shadow-inner">
                            <span className="material-symbols-outlined text-2xl font-icon-fill">
                                {isEditing ? "edit_note" : "add_box"}
                            </span>
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-slate-800 leading-tight">
                                {isEditing ? "Edit Produk" : "Produk Baru"}
                            </h2>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                {isEditing ? "Perbarui informasi produk" : "Tambahkan ke inventori"}
                            </p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-50 text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all active:scale-90"
                    >
                        <span className="material-symbols-outlined text-xl">close</span>
                    </button>
                </div>
            </div>

            <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Left Column: Core Info */}
                    <div className="space-y-6">
                        <div className="group">
                            <InputLabel htmlFor="name" className="flex items-center gap-2 mb-1.5 text-slate-600 font-bold text-xs uppercase">
                                <span className="material-symbols-outlined text-lg text-primary-500">label</span>
                                Nama Produk
                            </InputLabel>
                            <TextInput
                                id="name"
                                className="mt-1 block w-full bg-slate-50 border-slate-200 focus:bg-white transition-all duration-300"
                                value={data.name}
                                onChange={(e) => setData("name", e.target.value)}
                                placeholder="Contoh: Kopi Susu Aren"
                                required
                            />
                            <InputError message={errors.name} className="mt-2 text-[10px]" />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <InputLabel htmlFor="category_id" className="flex items-center gap-2 mb-1.5 text-slate-600 font-bold text-xs uppercase">
                                    <span className="material-symbols-outlined text-lg text-indigo-500">category</span>
                                    Kategori
                                </InputLabel>
                                <SearchableSelect
                                    id="category_id"
                                    className="mt-1"
                                    options={categories.map((cat) => ({
                                        value: cat.id,
                                        label: cat.name,
                                    }))}
                                    value={data.category_id}
                                    onChange={(val) => setData("category_id", val)}
                                    placeholder="Cari kategori..."
                                />
                                <InputError message={errors.category_id} className="mt-2 text-[10px]" />
                            </div>

                            <div>
                                <InputLabel htmlFor="sku" className="flex items-center gap-2 mb-1.5 text-slate-600 font-bold text-xs uppercase">
                                    <span className="material-symbols-outlined text-lg text-orange-500">barcode</span>
                                    SKU / Kode
                                </InputLabel>
                                <TextInput
                                    id="sku"
                                    className="mt-1 block w-full bg-slate-50 border-slate-200 focus:bg-white transition-all uppercase font-mono text-xs tracking-wider"
                                    value={data.sku}
                                    onChange={(e) => setData("sku", e.target.value)}
                                    placeholder="SKU-XXXX"
                                    required
                                />
                                <InputError message={errors.sku} className="mt-2 text-[10px]" />
                            </div>
                        </div>

                        <div>
                            <InputLabel htmlFor="description" className="flex items-center gap-2 mb-1.5 text-slate-600 font-bold text-xs uppercase">
                                <span className="material-symbols-outlined text-lg text-slate-400">description</span>
                                Deskripsi
                            </InputLabel>
                            <textarea
                                id="description"
                                className="mt-1 block w-full border-slate-200 bg-slate-50 focus:bg-white focus:border-primary-500 focus:ring-primary-500 rounded-2xl shadow-sm transition-all min-h-[80px] text-sm"
                                value={data.description}
                                onChange={(e) => setData("description", e.target.value)}
                                placeholder="Jelaskan detail produk..."
                            />
                            <InputError message={errors.description} className="mt-2 text-[10px]" />
                        </div>
                    </div>

                    {/* Right Column: Pricing & Inventory */}
                    <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100 space-y-4">
                        <div className="p-3 bg-white rounded-xl shadow-sm border border-slate-100 group transition-all hover:shadow-md">
                            <InputLabel htmlFor="cost_price" className="flex items-center gap-2 mb-1 text-slate-500 font-bold text-[10px] uppercase tracking-widest group-hover:text-primary-600 transition-colors">
                                <span className="material-symbols-outlined text-lg">request_quote</span>
                                Harga Modal
                            </InputLabel>
                            <div className="relative flex items-center">
                                <span className="absolute left-0 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-lg select-none">Rp</span>
                                <input
                                    id="cost_price"
                                    type="number"
                                    className="w-full border-none p-0 pl-8 focus:ring-0 text-xl font-black text-slate-800 placeholder:text-slate-200"
                                    value={data.cost_price}
                                    onChange={(e) => setData("cost_price", e.target.value)}
                                    placeholder="0"
                                    required
                                />
                            </div>
                            <InputError message={errors.cost_price} className="mt-1 text-[10px]" />
                        </div>

                        <div className="p-3 bg-white rounded-xl shadow-sm border border-slate-100 group transition-all hover:shadow-md">
                            <InputLabel htmlFor="price" className="flex items-center gap-2 mb-1 text-slate-500 font-bold text-[10px] uppercase tracking-widest group-hover:text-primary-600 transition-colors">
                                <span className="material-symbols-outlined text-lg">payments</span>
                                Harga Jual
                            </InputLabel>
                            <div className="relative flex items-center">
                                <span className="absolute left-0 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-lg select-none">Rp</span>
                                <input
                                    id="price"
                                    type="number"
                                    className="w-full border-none p-0 pl-8 focus:ring-0 text-xl font-black text-slate-800 placeholder:text-slate-200"
                                    value={data.price}
                                    onChange={(e) => setData("price", e.target.value)}
                                    placeholder="0"
                                    required
                                />
                            </div>
                            <InputError message={errors.price} className="mt-1 text-[10px]" />
                        </div>

                        <div className="p-3 bg-white rounded-xl shadow-sm border border-slate-100 group transition-all hover:shadow-md">
                            <InputLabel htmlFor="stock" className="flex items-center gap-2 mb-1 text-slate-500 font-bold text-[10px] uppercase tracking-widest group-hover:text-primary-600 transition-colors">
                                <span className="material-symbols-outlined text-lg">inventory</span>
                                Level Stok
                            </InputLabel>
                            <div className="flex items-center gap-4">
                                <input
                                    id="stock"
                                    type="number"
                                    className="w-full border-none p-0 focus:ring-0 text-xl font-black text-slate-800 placeholder:text-slate-200"
                                    value={data.stock}
                                    onChange={(e) => setData("stock", e.target.value)}
                                    placeholder="0"
                                    required
                                />
                                <div className={`hidden sm:block px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter ${data.stock > 10 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                    {data.stock > 10 ? 'Aman' : 'Tipis'}
                                </div>
                            </div>
                            <InputError message={errors.stock} className="mt-1 text-[10px]" />
                        </div>

                        <div className="pt-2 border-t border-slate-200/60 font-medium text-[9px] text-amber-700 italic">
                            * Pastikan harga jual sudah termasuk pajak.
                        </div>
                    </div>
                </div>

                <div className="mt-8 flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t border-slate-100">
                    <SecondaryButton 
                        type="button" 
                        onClick={onClose} 
                        className="rounded-xl px-8 py-3 border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition-all flex items-center justify-center gap-2"
                    >
                        Batal
                    </SecondaryButton>
                    <PrimaryButton
                        className="rounded-xl px-12 py-3 bg-primary-600 hover:bg-primary-700 shadow-xl shadow-primary-600/20 flex items-center justify-center gap-2 group transition-all"
                        disabled={processing}
                    >
                        {processing ? (
                            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                        ) : (
                            <>
                                <span className="material-symbols-outlined text-lg group-hover:scale-110 transition-transform">save</span>
                                {isEditing ? "Simpan Perubahan" : "Simpan Produk"}
                            </>
                        )}
                    </PrimaryButton>
                </div>
            </div>
            </form>

            <ConfirmationModal
                show={showConfirm}
                onClose={() => setShowConfirm(false)}
                onConfirm={handleConfirm}
                title={isEditing ? "Update Produk?" : "Simpan Produk Baru?"}
                message={isEditing 
                    ? "Apakah Anda yakin ingin menyimpan perubahan pada produk ini?" 
                    : "Apakah Anda yakin data produk yang dimasukkan sudah benar?"
                }
                type="info"
                confirmLabel="Ya, Simpan"
                cancelLabel="Batal"
            />
        </>
    );
}
