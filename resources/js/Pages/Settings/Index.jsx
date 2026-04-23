import { useRef, useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, router, usePage } from "@inertiajs/react";
import { toast } from "sonner";

export default function SettingsIndex({ auth, settings }) {
    const { appSettings } = usePage().props;
    const [logoPreview, setLogoPreview] = useState(null);
    const fileRef = useRef();

    const { data, setData, post, processing, errors } = useForm({
        store_name: settings.store_name ?? "",
        store_address: settings.store_address ?? "",
        store_phone: settings.store_phone ?? "",
        logo: null,
    });

    const handleLogoChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setData("logo", file);
        setLogoPreview(URL.createObjectURL(file));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("settings.update"), {
            forceFormData: true,
            onSuccess: () => toast.success("Pengaturan berhasil disimpan!"),
            onError: () => toast.error("Gagal menyimpan pengaturan."),
        });
    };

    const handleRemoveLogo = () => {
        router.delete(route("settings.logo.remove"), {
            onSuccess: () => {
                setLogoPreview(null);
                setData("logo", null);
                toast.success("Logo berhasil dihapus.");
            },
        });
    };

    const currentLogo = logoPreview ?? appSettings?.logo_url ?? null;

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Pengaturan Toko" />

            <div className="max-w-2xl mx-auto space-y-6">
                <div>
                    <h1 className="text-2xl font-black text-slate-900">
                        Pengaturan Toko
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">
                        Informasi toko digunakan pada invoice dan tampilan aplikasi.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Logo */}
                    <div className="bg-white rounded-2xl border border-slate-200 p-6">
                        <h2 className="font-black text-slate-800 mb-4">
                            Logo Toko
                        </h2>

                        <div className="flex items-center gap-6">
                            {/* Preview */}
                            <div className="w-24 h-24 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 flex items-center justify-center overflow-hidden shrink-0">
                                {currentLogo ? (
                                    <img
                                        src={currentLogo}
                                        alt="Logo"
                                        className="w-full h-full object-contain p-1"
                                    />
                                ) : (
                                    <span className="material-symbols-outlined text-3xl text-slate-300">
                                        store
                                    </span>
                                )}
                            </div>

                            <div className="space-y-2 flex-1">
                                <input
                                    ref={fileRef}
                                    type="file"
                                    accept="image/png,image/jpeg,image/webp"
                                    className="hidden"
                                    onChange={handleLogoChange}
                                />
                                <button
                                    type="button"
                                    onClick={() => fileRef.current.click()}
                                    className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                                >
                                    <span className="material-symbols-outlined text-base">
                                        upload
                                    </span>
                                    Pilih Logo
                                </button>
                                <p className="text-[10px] text-slate-400">
                                    PNG, JPG, WEBP — maks 2MB
                                </p>
                                {(currentLogo && !logoPreview) && (
                                    <button
                                        type="button"
                                        onClick={handleRemoveLogo}
                                        className="flex items-center gap-1 text-xs font-bold text-red-500 hover:text-red-700 transition-colors"
                                    >
                                        <span className="material-symbols-outlined text-sm">
                                            delete
                                        </span>
                                        Hapus Logo
                                    </button>
                                )}
                            </div>
                        </div>

                        {errors.logo && (
                            <p className="mt-3 text-sm text-red-500 font-medium">
                                {errors.logo}
                            </p>
                        )}
                    </div>

                    {/* Store Info */}
                    <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
                        <h2 className="font-black text-slate-800">
                            Informasi Toko
                        </h2>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                Nama Toko <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                className="w-full rounded-xl border-slate-200 focus:ring-primary-500 focus:border-primary-500 text-sm font-semibold"
                                value={data.store_name}
                                onChange={(e) =>
                                    setData("store_name", e.target.value)
                                }
                                required
                            />
                            {errors.store_name && (
                                <p className="text-xs text-red-500 font-medium">
                                    {errors.store_name}
                                </p>
                            )}
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                Alamat
                            </label>
                            <textarea
                                rows={3}
                                className="w-full rounded-xl border-slate-200 focus:ring-primary-500 focus:border-primary-500 text-sm resize-none"
                                placeholder="Jl. Contoh No. 1, Kota..."
                                value={data.store_address}
                                onChange={(e) =>
                                    setData("store_address", e.target.value)
                                }
                            />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                No. Telepon / WhatsApp
                            </label>
                            <input
                                type="tel"
                                className="w-full rounded-xl border-slate-200 focus:ring-primary-500 focus:border-primary-500 text-sm"
                                placeholder="08xx-xxxx-xxxx"
                                value={data.store_phone}
                                onChange={(e) =>
                                    setData("store_phone", e.target.value)
                                }
                            />
                        </div>
                    </div>

                    {/* Save */}
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={processing}
                            className="flex items-center gap-2 px-6 py-2.5 bg-primary-600 hover:bg-primary-700 disabled:bg-slate-300 text-white font-black rounded-xl shadow-sm shadow-primary-600/20 transition-all active:scale-95"
                        >
                            <span className="material-symbols-outlined text-lg">
                                save
                            </span>
                            {processing ? "Menyimpan..." : "Simpan Pengaturan"}
                        </button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
