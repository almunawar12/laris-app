import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import Heading from "@/Components/Atoms/Heading";
import SummaryGrid from "@/Components/Organisms/SummaryGrid";

export default function DashboardTemplate({ auth, stats, children }) {
    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Dashboard" />
            <div className="bg-slate-50 min-h-screen">
                <main className="p-8 space-y-8 max-w-7xl mx-auto">
                    <div className="flex justify-between items-end">
                        <div>
                            <Heading level={2} className="text-slate-900">
                                Ringkasan Performa
                            </Heading>
                            <p className="text-slate-500 font-medium">
                                Pantau pertumbuhan bisnis Anda hari ini secara
                                real-time.
                            </p>
                        </div>
                        <button className="bg-orange-600 hover:opacity-90 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all active:scale-95 shadow-lg shadow-orange-600/20">
                            <span className="material-symbols-outlined">
                                add_shopping_cart
                            </span>
                            Transaksi Baru
                        </button>
                    </div>

                    <SummaryGrid stats={stats} />

                    {children}
                </main>
            </div>
        </AuthenticatedLayout>
    );
}
