import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";

export default function TransactionIndex({ auth, transactions }) {
    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Riwayat Transaksi" />

            <div className="bg-white p-6 rounded-2xl border border-slate-200">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-xl font-black text-slate-800">
                            Riwayat Transaksi
                        </h2>
                        <p className="text-xs text-slate-500">
                            Daftar semua transaksi yang disimpan
                        </p>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] tracking-wider border-y border-slate-100">
                            <tr>
                                <th className="px-4 py-3">No. Transaksi</th>
                                <th className="px-4 py-3">Tanggal</th>
                                <th className="px-4 py-3">Pelanggan</th>
                                <th className="px-4 py-3">Kasir</th>
                                <th className="px-4 py-3 text-right">Total</th>
                                <th className="px-4 py-3">Status</th>
                                <th className="px-4 py-3 text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {transactions.map((tr) => (
                                <tr
                                    key={tr.id}
                                    className="hover:bg-slate-50 transition-colors"
                                >
                                    <td className="px-4 py-4 font-bold text-slate-700">
                                        #{tr.id}
                                    </td>
                                    <td className="px-4 py-4 text-slate-600">
                                        {new Date(
                                            tr.created_at,
                                        ).toLocaleDateString("id-ID", {
                                            day: "numeric",
                                            month: "short",
                                            year: "numeric",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </td>
                                    <td className="px-4 py-4 text-slate-600">
                                        {tr.customer?.name || "Umum"}
                                    </td>
                                    <td className="px-4 py-4 font-medium text-slate-600">
                                        {tr.user?.name}
                                    </td>
                                    <td className="px-4 py-4 text-right font-black text-slate-800">
                                        Rp{" "}
                                        {new Intl.NumberFormat("id-ID").format(
                                            tr.total_price,
                                        )}
                                    </td>
                                    <td className="px-4 py-4">
                                        <span className="bg-green-100 text-green-700 px-2 py-1 rounded-lg text-[10px] font-black uppercase">
                                            Selesai
                                        </span>
                                    </td>
                                    <td className="px-4 py-4 text-center">
                                        <Link
                                            href={route(
                                                "transactions.show",
                                                tr.id,
                                            )}
                                            className="text-primary-600 hover:text-primary-800 font-bold text-xs underline"
                                        >
                                            Detail
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                            {transactions.length === 0 && (
                                <tr>
                                    <td
                                        colSpan="7"
                                        className="px-4 py-12 text-center text-slate-400 italic"
                                    >
                                        Belum ada transaksi ditemukan.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
