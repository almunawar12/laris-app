import { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";

const fmt = (n) => new Intl.NumberFormat("id-ID").format(n ?? 0);
const fmtDate = (d) =>
    new Date(d).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });

const TABS = [
    { key: "penjualan", label: "Penjualan", icon: "bar_chart" },
    { key: "produk", label: "Produk Terlaris", icon: "trending_up" },
    { key: "kasir", label: "Per Kasir", icon: "group" },
];

const PRESETS = [
    { label: "Hari Ini", key: "today" },
    { label: "7 Hari", key: "7days" },
    { label: "Bulan Ini", key: "month" },
];

function getPresetDates(key) {
    const now = new Date();
    const pad = (n) => String(n).padStart(2, "0");
    const fmt = (d) =>
        `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
    if (key === "today") {
        const t = fmt(now);
        return { date_from: t, date_to: t };
    }
    if (key === "7days") {
        const from = new Date(now);
        from.setDate(now.getDate() - 6);
        return { date_from: fmt(from), date_to: fmt(now) };
    }
    // month
    const from = new Date(now.getFullYear(), now.getMonth(), 1);
    return { date_from: fmt(from), date_to: fmt(now) };
}

export default function ReportsIndex({
    auth,
    summary,
    daily,
    topProducts,
    perKasir,
    date_from,
    date_to,
}) {
    const [activeTab, setActiveTab] = useState("penjualan");
    const [customFrom, setCustomFrom] = useState(date_from ?? "");
    const [customTo, setCustomTo] = useState(date_to ?? "");

    const handlePreset = (key) => {
        const { date_from: df, date_to: dt } = getPresetDates(key);
        router.get(route("reports.index"), { date_from: df, date_to: dt });
    };

    const handleApply = () => {
        if (!customFrom || !customTo) return;
        router.get(route("reports.index"), {
            date_from: customFrom,
            date_to: customTo,
        });
    };

    // ── PDF export ────────────────────────────────────────────────────────────
    const handleExportPDF = () => {
        const periodLabel =
            date_from && date_to
                ? `${fmtDate(date_from)} – ${fmtDate(date_to)}`
                : "Semua Periode";

        let contentHtml = "";

        if (activeTab === "penjualan") {
            const totalOmzet = (daily ?? []).reduce(
                (s, r) => s + (r.omzet ?? 0),
                0,
            );
            const totalTrx = (daily ?? []).reduce(
                (s, r) => s + (r.jumlah ?? 0),
                0,
            );
            contentHtml = `
        <h2 style="font-size:15px;font-weight:800;margin-bottom:12px;color:#1e293b;">Ringkasan</h2>
        <table style="width:100%;border-collapse:collapse;margin-bottom:20px;font-size:12px;">
          <tr style="background:#f8fafc;">
            <td style="padding:8px 12px;border:1px solid #e2e8f0;font-weight:700;">Total Omzet</td>
            <td style="padding:8px 12px;border:1px solid #e2e8f0;text-align:right;font-weight:900;">Rp ${fmt(summary?.total_omzet)}</td>
          </tr>
          <tr>
            <td style="padding:8px 12px;border:1px solid #e2e8f0;font-weight:700;">Total Transaksi</td>
            <td style="padding:8px 12px;border:1px solid #e2e8f0;text-align:right;">${fmt(summary?.total_transaksi)}</td>
          </tr>
          <tr style="background:#f8fafc;">
            <td style="padding:8px 12px;border:1px solid #e2e8f0;font-weight:700;">Item Terjual</td>
            <td style="padding:8px 12px;border:1px solid #e2e8f0;text-align:right;">${fmt(summary?.total_items)}</td>
          </tr>
          <tr>
            <td style="padding:8px 12px;border:1px solid #e2e8f0;font-weight:700;">Cash</td>
            <td style="padding:8px 12px;border:1px solid #e2e8f0;text-align:right;">Rp ${fmt(summary?.cash_omzet)}</td>
          </tr>
          <tr style="background:#f8fafc;">
            <td style="padding:8px 12px;border:1px solid #e2e8f0;font-weight:700;">QRIS</td>
            <td style="padding:8px 12px;border:1px solid #e2e8f0;text-align:right;">Rp ${fmt(summary?.qris_omzet)}</td>
          </tr>
          <tr>
            <td style="padding:8px 12px;border:1px solid #e2e8f0;font-weight:700;">Transfer</td>
            <td style="padding:8px 12px;border:1px solid #e2e8f0;text-align:right;">Rp ${fmt(summary?.transfer_omzet)}</td>
          </tr>
        </table>

        <h2 style="font-size:15px;font-weight:800;margin-bottom:12px;color:#1e293b;">Penjualan Harian</h2>
        <table style="width:100%;border-collapse:collapse;font-size:12px;">
          <thead>
            <tr style="background:#f1f5f9;">
              <th style="padding:8px 12px;border:1px solid #e2e8f0;text-align:left;">Tanggal</th>
              <th style="padding:8px 12px;border:1px solid #e2e8f0;text-align:right;">Jumlah Transaksi</th>
              <th style="padding:8px 12px;border:1px solid #e2e8f0;text-align:right;">Omzet</th>
            </tr>
          </thead>
          <tbody>
            ${
                (daily ?? []).length === 0
                    ? `<tr><td colspan="3" style="padding:16px;text-align:center;color:#94a3b8;border:1px solid #e2e8f0;">Tidak ada data</td></tr>`
                    : (daily ?? [])
                          .map(
                              (row, i) => `
              <tr style="${i % 2 === 0 ? "background:#f8fafc;" : ""}">
                <td style="padding:8px 12px;border:1px solid #e2e8f0;">${fmtDate(row.date)}</td>
                <td style="padding:8px 12px;border:1px solid #e2e8f0;text-align:right;">${fmt(row.jumlah)}</td>
                <td style="padding:8px 12px;border:1px solid #e2e8f0;text-align:right;font-weight:700;">Rp ${fmt(row.omzet)}</td>
              </tr>`,
                          )
                          .join("")
            }
          </tbody>
          <tfoot>
            <tr style="background:#f1f5f9;font-weight:900;">
              <td style="padding:8px 12px;border:1px solid #e2e8f0;">TOTAL</td>
              <td style="padding:8px 12px;border:1px solid #e2e8f0;text-align:right;">${fmt(totalTrx)}</td>
              <td style="padding:8px 12px;border:1px solid #e2e8f0;text-align:right;">Rp ${fmt(totalOmzet)}</td>
            </tr>
          </tfoot>
        </table>`;
        } else if (activeTab === "produk") {
            contentHtml = `
        <h2 style="font-size:15px;font-weight:800;margin-bottom:12px;color:#1e293b;">Produk Terlaris</h2>
        <table style="width:100%;border-collapse:collapse;font-size:12px;">
          <thead>
            <tr style="background:#f1f5f9;">
              <th style="padding:8px 12px;border:1px solid #e2e8f0;text-align:center;width:40px;">#</th>
              <th style="padding:8px 12px;border:1px solid #e2e8f0;text-align:left;">Produk</th>
              <th style="padding:8px 12px;border:1px solid #e2e8f0;text-align:right;">Qty Terjual</th>
              <th style="padding:8px 12px;border:1px solid #e2e8f0;text-align:right;">Pendapatan</th>
            </tr>
          </thead>
          <tbody>
            ${
                (topProducts ?? []).length === 0
                    ? `<tr><td colspan="4" style="padding:16px;text-align:center;color:#94a3b8;border:1px solid #e2e8f0;">Tidak ada data</td></tr>`
                    : (topProducts ?? [])
                          .map(
                              (row, i) => `
              <tr style="${i % 2 === 0 ? "background:#f8fafc;" : ""}">
                <td style="padding:8px 12px;border:1px solid #e2e8f0;text-align:center;font-weight:900;color:${i < 3 ? "#ea580c" : "#64748b"};">${i + 1}</td>
                <td style="padding:8px 12px;border:1px solid #e2e8f0;font-weight:600;">${row.name}</td>
                <td style="padding:8px 12px;border:1px solid #e2e8f0;text-align:right;">${fmt(row.total_qty)}</td>
                <td style="padding:8px 12px;border:1px solid #e2e8f0;text-align:right;font-weight:700;">Rp ${fmt(row.total_pendapatan)}</td>
              </tr>`,
                          )
                          .join("")
            }
          </tbody>
        </table>`;
        } else {
            contentHtml = `
        <h2 style="font-size:15px;font-weight:800;margin-bottom:12px;color:#1e293b;">Laporan Per Kasir</h2>
        <table style="width:100%;border-collapse:collapse;font-size:12px;">
          <thead>
            <tr style="background:#f1f5f9;">
              <th style="padding:8px 12px;border:1px solid #e2e8f0;text-align:left;">Kasir</th>
              <th style="padding:8px 12px;border:1px solid #e2e8f0;text-align:right;">Jumlah Transaksi</th>
              <th style="padding:8px 12px;border:1px solid #e2e8f0;text-align:right;">Total Omzet</th>
            </tr>
          </thead>
          <tbody>
            ${
                (perKasir ?? []).length === 0
                    ? `<tr><td colspan="3" style="padding:16px;text-align:center;color:#94a3b8;border:1px solid #e2e8f0;">Tidak ada data</td></tr>`
                    : (perKasir ?? [])
                          .map(
                              (row, i) => `
              <tr style="${i % 2 === 0 ? "background:#f8fafc;" : ""}">
                <td style="padding:8px 12px;border:1px solid #e2e8f0;font-weight:600;">${row.kasir}</td>
                <td style="padding:8px 12px;border:1px solid #e2e8f0;text-align:right;">${fmt(row.total_transaksi)}</td>
                <td style="padding:8px 12px;border:1px solid #e2e8f0;text-align:right;font-weight:700;">Rp ${fmt(row.total_omzet)}</td>
              </tr>`,
                          )
                          .join("")
            }
          </tbody>
        </table>`;
        }

        const tabLabel = TABS.find((t) => t.key === activeTab)?.label ?? "";

        const html = `<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8" />
<title>Laporan ${tabLabel}</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: Arial, sans-serif; font-size: 13px; color: #1e293b; background: #fff; padding: 32px; }
  h1 { font-size: 20px; font-weight: 900; margin-bottom: 4px; }
  .subtitle { font-size: 12px; color: #64748b; margin-bottom: 24px; }
  @media print { body { padding: 16px; } }
</style>
</head>
<body>
  <h1>Laporan ${tabLabel}</h1>
  <div class="subtitle">Periode: ${periodLabel}</div>
  ${contentHtml}
</body>
</html>`;

        const win = window.open("", "_blank", "width=900,height=700");
        win.document.write(html);
        win.document.close();
        win.focus();
        setTimeout(() => win.print(), 300);
    };

    // ── derived totals ────────────────────────────────────────────────────────
    const dailyTotalOmzet = (daily ?? []).reduce(
        (s, r) => s + (r.omzet ?? 0),
        0,
    );
    const dailyTotalTrx = (daily ?? []).reduce(
        (s, r) => s + (r.jumlah ?? 0),
        0,
    );

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Laporan" />

            <div className="space-y-6">
                {/* ── Page header ── */}
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-black text-slate-900">
                            Laporan
                        </h1>
                        <p className="text-sm text-slate-500 mt-0.5">
                            Analisis penjualan, produk, dan kinerja kasir.
                        </p>
                    </div>

                    {/* Export PDF button */}
                    <button
                        onClick={handleExportPDF}
                        className="flex items-center gap-2 px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-sm font-bold rounded-xl shadow-sm shadow-primary-600/20 transition-all active:scale-95"
                    >
                        <span className="material-symbols-outlined text-lg">
                            picture_as_pdf
                        </span>
                        <span className="hidden sm:inline">Export PDF</span>
                    </button>
                </div>

                {/* ── Filter bar ── */}
                <div className="bg-white rounded-2xl border border-slate-200 p-4">
                    <div className="flex flex-wrap items-center gap-3">
                        {/* Preset buttons */}
                        <div className="flex gap-2">
                            {PRESETS.map((p) => (
                                <button
                                    key={p.key}
                                    onClick={() => handlePreset(p.key)}
                                    className="px-3 py-1.5 text-xs font-bold rounded-lg bg-slate-100 hover:bg-primary-100 hover:text-primary-700 text-slate-600 transition-colors"
                                >
                                    {p.label}
                                </button>
                            ))}
                        </div>

                        <div className="h-5 w-px bg-slate-200 hidden sm:block" />

                        {/* Custom date range */}
                        <div className="flex flex-wrap items-center gap-2">
                            <input
                                type="date"
                                value={customFrom}
                                onChange={(e) => setCustomFrom(e.target.value)}
                                className="text-xs rounded-lg border-slate-200 focus:ring-primary-500 focus:border-primary-500 py-1.5 px-2 font-medium text-slate-700"
                            />
                            <span className="text-xs text-slate-400 font-bold">
                                –
                            </span>
                            <input
                                type="date"
                                value={customTo}
                                onChange={(e) => setCustomTo(e.target.value)}
                                className="text-xs rounded-lg border-slate-200 focus:ring-primary-500 focus:border-primary-500 py-1.5 px-2 font-medium text-slate-700"
                            />
                            <button
                                onClick={handleApply}
                                className="px-3 py-1.5 text-xs font-bold rounded-lg bg-primary-600 hover:bg-primary-700 text-white transition-colors"
                            >
                                Terapkan
                            </button>
                        </div>

                        {/* Active period badge */}
                        {date_from && date_to && (
                            <span className="ml-auto text-[10px] font-bold text-slate-400 hidden md:block">
                                {fmtDate(date_from)} – {fmtDate(date_to)}
                            </span>
                        )}
                    </div>
                </div>

                {/* ── Summary cards (always visible) ── */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Total Omzet */}
                    <div className="bg-white rounded-2xl border border-slate-200 p-5">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center">
                                <span className="material-symbols-outlined text-xl text-primary-600">
                                    payments
                                </span>
                            </div>
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                                Total Omzet
                            </span>
                        </div>
                        <div className="text-2xl font-black text-slate-900 font-mono">
                            Rp {fmt(summary?.total_omzet)}
                        </div>
                    </div>

                    {/* Total Transaksi */}
                    <div className="bg-white rounded-2xl border border-slate-200 p-5">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
                                <span className="material-symbols-outlined text-xl text-green-600">
                                    receipt_long
                                </span>
                            </div>
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                                Transaksi
                            </span>
                        </div>
                        <div className="text-2xl font-black text-slate-900 font-mono">
                            {fmt(summary?.total_transaksi)}
                        </div>
                    </div>

                    {/* Item Terjual */}
                    <div className="bg-white rounded-2xl border border-slate-200 p-5">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                                <span className="material-symbols-outlined text-xl text-blue-600">
                                    inventory_2
                                </span>
                            </div>
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                                Item Terjual
                            </span>
                        </div>
                        <div className="text-2xl font-black text-slate-900 font-mono">
                            {fmt(summary?.total_items)}
                        </div>
                    </div>

                    {/* Payment breakdown card */}
                    <div className="bg-white rounded-2xl border border-slate-200 p-5">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
                                <span className="material-symbols-outlined text-xl text-orange-500">
                                    account_balance_wallet
                                </span>
                            </div>
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                                Metode Bayar
                            </span>
                        </div>
                        <div className="space-y-1.5">
                            <div className="flex justify-between text-xs">
                                <span className="text-slate-500 font-medium">
                                    Cash
                                </span>
                                <span className="font-bold text-slate-700 font-mono">
                                    Rp {fmt(summary?.cash_omzet)}
                                </span>
                            </div>
                            <div className="flex justify-between text-xs">
                                <span className="text-slate-500 font-medium">
                                    QRIS
                                </span>
                                <span className="font-bold text-slate-700 font-mono">
                                    Rp {fmt(summary?.qris_omzet)}
                                </span>
                            </div>
                            <div className="flex justify-between text-xs">
                                <span className="text-slate-500 font-medium">
                                    Transfer
                                </span>
                                <span className="font-bold text-slate-700 font-mono">
                                    Rp {fmt(summary?.transfer_omzet)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Tabs ── */}
                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                    {/* Tab nav */}
                    <div className="flex border-b border-slate-100">
                        {TABS.map((tab) => (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key)}
                                className={`flex items-center gap-2 px-5 py-4 text-sm font-bold transition-colors border-b-2 -mb-px ${
                                    activeTab === tab.key
                                        ? "border-primary-600 text-primary-700 bg-primary-50/40"
                                        : "border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50"
                                }`}
                            >
                                <span className="material-symbols-outlined text-[18px]">
                                    {tab.icon}
                                </span>
                                <span className="hidden sm:inline">
                                    {tab.label}
                                </span>
                            </button>
                        ))}
                    </div>

                    {/* ── Tab: Penjualan ── */}
                    {activeTab === "penjualan" && (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] tracking-wider border-b border-slate-100">
                                    <tr>
                                        <th className="px-5 py-3">Tanggal</th>
                                        <th className="px-5 py-3 text-right">
                                            Jumlah Transaksi
                                        </th>
                                        <th className="px-5 py-3 text-right">
                                            Omzet
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {(daily ?? []).length === 0 ? (
                                        <tr>
                                            <td
                                                colSpan="3"
                                                className="px-5 py-12 text-center text-slate-400 italic"
                                            >
                                                Tidak ada data penjualan untuk
                                                periode ini.
                                            </td>
                                        </tr>
                                    ) : (
                                        (daily ?? []).map((row) => (
                                            <tr
                                                key={row.date}
                                                className="hover:bg-slate-50 transition-colors"
                                            >
                                                <td className="px-5 py-4 text-slate-700 font-medium">
                                                    {fmtDate(row.date)}
                                                </td>
                                                <td className="px-5 py-4 text-right text-slate-600 font-mono">
                                                    {fmt(row.jumlah)}
                                                </td>
                                                <td className="px-5 py-4 text-right font-black text-slate-800 font-mono">
                                                    Rp {fmt(row.omzet)}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                                {(daily ?? []).length > 0 && (
                                    <tfoot className="bg-slate-100 border-t-2 border-slate-200">
                                        <tr>
                                            <td className="px-5 py-3 font-black text-slate-800 uppercase text-xs tracking-wider">
                                                Total
                                            </td>
                                            <td className="px-5 py-3 text-right font-black text-slate-800 font-mono">
                                                {fmt(dailyTotalTrx)}
                                            </td>
                                            <td className="px-5 py-3 text-right font-black text-slate-900 font-mono text-base">
                                                Rp {fmt(dailyTotalOmzet)}
                                            </td>
                                        </tr>
                                    </tfoot>
                                )}
                            </table>
                        </div>
                    )}

                    {/* ── Tab: Produk Terlaris ── */}
                    {activeTab === "produk" && (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] tracking-wider border-b border-slate-100">
                                    <tr>
                                        <th className="px-5 py-3 text-center w-12">
                                            #
                                        </th>
                                        <th className="px-5 py-3">Produk</th>
                                        <th className="px-5 py-3 text-right">
                                            Qty Terjual
                                        </th>
                                        <th className="px-5 py-3 text-right">
                                            Pendapatan
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {(topProducts ?? []).length === 0 ? (
                                        <tr>
                                            <td
                                                colSpan="4"
                                                className="px-5 py-12 text-center text-slate-400 italic"
                                            >
                                                Tidak ada data produk untuk
                                                periode ini.
                                            </td>
                                        </tr>
                                    ) : (
                                        (topProducts ?? []).map((row, i) => (
                                            <tr
                                                key={row.name + i}
                                                className="hover:bg-slate-50 transition-colors"
                                            >
                                                <td className="px-5 py-4 text-center">
                                                    <span
                                                        className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-black ${
                                                            i < 3
                                                                ? "bg-orange-100 text-orange-600"
                                                                : "bg-slate-100 text-slate-500"
                                                        }`}
                                                    >
                                                        {i + 1}
                                                    </span>
                                                </td>
                                                <td className="px-5 py-4 font-semibold text-slate-700">
                                                    {row.name}
                                                </td>
                                                <td className="px-5 py-4 text-right text-slate-600 font-mono">
                                                    {fmt(row.total_qty)}
                                                </td>
                                                <td className="px-5 py-4 text-right font-black text-slate-800 font-mono">
                                                    Rp{" "}
                                                    {fmt(row.total_pendapatan)}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* ── Tab: Per Kasir ── */}
                    {activeTab === "kasir" && (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] tracking-wider border-b border-slate-100">
                                    <tr>
                                        <th className="px-5 py-3">Kasir</th>
                                        <th className="px-5 py-3 text-right">
                                            Jumlah Transaksi
                                        </th>
                                        <th className="px-5 py-3 text-right">
                                            Total Omzet
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {(perKasir ?? []).length === 0 ? (
                                        <tr>
                                            <td
                                                colSpan="3"
                                                className="px-5 py-12 text-center text-slate-400 italic"
                                            >
                                                Tidak ada data kasir untuk
                                                periode ini.
                                            </td>
                                        </tr>
                                    ) : (
                                        (perKasir ?? []).map((row, i) => (
                                            <tr
                                                key={row.kasir + i}
                                                className="hover:bg-slate-50 transition-colors"
                                            >
                                                <td className="px-5 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-9 h-9 rounded-full bg-primary-100 flex items-center justify-center shrink-0">
                                                            <span className="text-sm font-black text-primary-700 uppercase">
                                                                {(
                                                                    row.kasir ??
                                                                    "?"
                                                                )
                                                                    .charAt(0)}
                                                            </span>
                                                        </div>
                                                        <span className="font-semibold text-slate-700">
                                                            {row.kasir}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-5 py-4 text-right text-slate-600 font-mono">
                                                    {fmt(row.total_transaksi)}
                                                </td>
                                                <td className="px-5 py-4 text-right font-black text-slate-800 font-mono">
                                                    Rp {fmt(row.total_omzet)}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
