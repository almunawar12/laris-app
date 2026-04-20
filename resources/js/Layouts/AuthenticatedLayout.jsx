import Sidebar from "@/Components/Organisms/Sidebar";
import Navbar from "@/Components/Organisms/Navbar";
import { usePage, router } from "@inertiajs/react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import ConfirmationModal from "@/Components/Molecules/ConfirmationModal";

export default function AuthenticatedLayout({ header, children }) {
    const { auth, flash } = usePage().props;
    const user = auth.user;

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [showingLogoutConfirm, setShowingLogoutConfirm] = useState(false);

    // Handle Flash Messages (Success/Error from Backend)
    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }
        if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash]);

    const handleLogout = () => {
        setShowingLogoutConfirm(false);
        router.post(
            route("logout"),
            {},
            {
                onStart: () =>
                    toast.loading("Memproses keluar...", {
                        id: "logout-toast",
                    }),
                onSuccess: () => {
                    toast.dismiss("logout-toast");
                    // Success toast will be handled by the next page or handleLogout flash if redirecting
                },
                onError: () => {
                    toast.dismiss("logout-toast");
                    toast.error("Gagal keluar, silakan coba lagi");
                },
            },
        );
    };

    return (
        <div className="min-h-screen bg-slate-50 font-body transition-colors duration-300">
            <Sidebar
                user={user}
                isSidebarOpen={isSidebarOpen}
                setIsSidebarOpen={setIsSidebarOpen}
                onLogoutClick={() => setShowingLogoutConfirm(true)}
            />

            <ConfirmationModal
                show={showingLogoutConfirm}
                onClose={() => setShowingLogoutConfirm(false)}
                onConfirm={handleLogout}
                title="Konfirmasi Keluar"
                message="Apakah Anda yakin ingin mengakhiri sesi ini? Semua progres transaksi yang belum tersimpan mungkin akan hilang."
                type="danger"
                confirmLabel="Ya, Keluar"
            />

            {/* Main Wrapper */}
            <div className="lg:ml-64 flex flex-col min-h-screen transition-all duration-300">
                <Navbar setIsSidebarOpen={setIsSidebarOpen} />

                {/* Content */}
                <main className="flex-1 p-4 md:p-8">{children}</main>
            </div>
        </div>
    );
}
