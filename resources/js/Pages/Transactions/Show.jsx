import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import InvoiceDownload from "@/Components/Organisms/InvoiceDownload";

const fmt = (n) => new Intl.NumberFormat("id-ID").format(n);
const fmtDate = (d) =>
    new Date(d).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });

const METHOD_LABEL = { cash: "Cash", qris: "QRIS" };

export default function TransactionShow({ auth, transaction }) {
    const items = transaction.transaction_items ?? transaction.transactionItems ?? [];

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title={`Transaksi ${transaction.invoice_code}`} />

            {/* Back + Actions */}
            <div className="flex items-center justify-between mb-6">
                <Link
                    href={route("transactions.index")}
                    className="flex items-center gap-1.5 text-sm font-bold text-slate-500 hover:text-primary-600 transition-colors"
                >
                    <span className="material-symbols-outlined text-lg">
                        arrow_back
                    </span>
                    Kembali
                </Link>
                <InvoiceDownload transaction={transaction} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left — Items */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Invoice Header */}
                    <div className="bg-white rounded-2xl border border-slate-200 p-6">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                                    No. Invoice
                                </p>
                                <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                                    {transaction.invoice_code}
                                </h1>
                                <p className="text-sm text-slate-500 mt-1">
                                    {fmtDate(transaction.transaction_date ?? transaction.created_at)}
                                </p>
                            </div>
                            <span className="bg-green-100 text-green-700 px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider">
                                Lunas
                            </span>
                        </div>
                    </div>

                    {/* Items Table */}
                    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-100">
                            <h2 className="font-black text-slate-800">
                                Daftar Produk
                            </h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                                    <tr>
                                        <th className="px-6 py-3 text-left">
                                            Produk
                                        </th>
                                        <th className="px-6 py-3 text-center">
                                            Qty
                                        </th>
                                        <th className="px-6 py-3 text-right">
                                            Harga Satuan
                                        </th>
                                        <th className="px-6 py-3 text-right">
                                            Subtotal
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {items.map((item) => (
                                        <tr
                                            key={item.id}
                                            className="hover:bg-slate-50 transition-colors"
                                        >
                                            <td className="px-6 py-4 font-semibold text-slate-800">
                                                {item.product?.name ?? "-"}
                                            </td>
                                            <td className="px-6 py-4 text-center text-slate-600">
                                                {item.quantity}
                                            </td>
                                            <td className="px-6 py-4 text-right text-slate-600 font-mono">
                                                Rp {fmt(item.price)}
                                            </td>
                                            <td className="px-6 py-4 text-right font-black text-slate-800 font-mono">
                                                Rp {fmt(item.subtotal)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot className="bg-slate-50 border-t-2 border-slate-200">
                                    <tr>
                                        <td
                                            colSpan="3"
                                            className="px-6 py-4 font-black text-slate-700 text-right"
                                        >
                                            Total
                                        </td>
                                        <td className="px-6 py-4 text-right font-black text-slate-900 text-lg font-mono">
                                            Rp {fmt(transaction.total_price)}
                                        </td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Right — Summary & Info */}
                <div className="space-y-6">
                    {/* Payment Summary */}
                    <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
                        <h2 className="font-black text-slate-800">
                            Ringkasan Pembayaran
                        </h2>

                        <div className="space-y-3">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-500">Subtotal</span>
                                <span className="font-bold text-slate-700 font-mono">
                                    Rp {fmt(transaction.total_price)}
                                </span>
                            </div>

                            <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-500">
                                    Metode Bayar
                                </span>
                                <span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-black uppercase tracking-wider">
                                    {METHOD_LABEL[transaction.payment_method] ?? transaction.payment_method}
                                </span>
                            </div>

                            <div className="border-t border-slate-100 pt-3 flex justify-between items-center">
                                <span className="text-slate-500 text-sm">
                                    Dibayar
                                </span>
                                <span className="font-bold text-slate-700 font-mono">
                                    Rp {fmt(transaction.total_paid)}
                                </span>
                            </div>

                            <div className="flex justify-between items-center">
                                <span className="font-bold text-slate-700">
                                    Kembalian
                                </span>
                                <span className="font-black text-green-600 font-mono text-lg">
                                    Rp {fmt(transaction.change)}
                                </span>
                            </div>
                        </div>

                        <div className="pt-3 border-t border-slate-100">
                            <div className="flex justify-between items-center">
                                <span className="text-xl font-black text-slate-900">
                                    Total
                                </span>
                                <span className="text-2xl font-black text-primary-600 font-mono">
                                    Rp {fmt(transaction.total_price)}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Transaction Info */}
                    <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
                        <h2 className="font-black text-slate-800">
                            Info Transaksi
                        </h2>

                        <div className="space-y-3">
                            <div className="flex flex-col gap-0.5">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                    Kasir
                                </span>
                                <span className="font-semibold text-slate-800">
                                    {transaction.user?.name ?? "-"}
                                </span>
                            </div>

                            <div className="flex flex-col gap-0.5">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                    Pelanggan
                                </span>
                                <span className="font-semibold text-slate-800">
                                    {transaction.customer?.name ?? (
                                        <span className="text-slate-400 italic">
                                            Umum
                                        </span>
                                    )}
                                </span>
                                {transaction.customer?.phone && (
                                    <span className="text-xs text-slate-500">
                                        {transaction.customer.phone}
                                    </span>
                                )}
                            </div>

                            <div className="flex flex-col gap-0.5">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                    Tanggal
                                </span>
                                <span className="font-semibold text-slate-800">
                                    {fmtDate(transaction.transaction_date ?? transaction.created_at)}
                                </span>
                            </div>

                            <div className="flex flex-col gap-0.5">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                    Jumlah Item
                                </span>
                                <span className="font-semibold text-slate-800">
                                    {items.reduce((s, i) => s + i.quantity, 0)} produk ({items.length} jenis)
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
