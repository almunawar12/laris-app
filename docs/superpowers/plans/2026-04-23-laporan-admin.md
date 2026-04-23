# Laporan Admin Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Tambah halaman Laporan untuk admin dengan filter periode, 3 tab (Penjualan, Produk Terlaris, Per Kasir), dan export PDF per tab.

**Architecture:** Single route `GET /reports` dengan query params `date_from`/`date_to`, ReportController mengagregasi data dari Transaction + TransactionItem + User, dikirim ke satu halaman Inertia React dengan tab UI dan print export menggunakan `window.open()` + `window.print()`.

**Tech Stack:** Laravel 11, Inertia.js, React, Tailwind CSS, Carbon (sudah ada), DB facade (sudah ada)

---

## File Map

| File | Action | Tanggung jawab |
|------|--------|---------------|
| `app/Http/Controllers/ReportController.php` | Create | Query + agregasi data laporan |
| `routes/web.php` | Modify | Tambah route `/reports` dalam admin middleware |
| `resources/js/Pages/Reports/Index.jsx` | Create | UI: filter, tabs, tabel, export PDF |
| `resources/js/Components/Organisms/Sidebar.jsx` | Modify | Tambah menu Laporan untuk admin |

---

## Task 1: ReportController

**Files:**
- Create: `app/Http/Controllers/ReportController.php`

- [ ] **Step 1: Buat file controller**

```php
<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use Carbon\Carbon;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ReportController extends Controller
{
    public function index(Request $request)
    {
        $dateFrom = $request->input('date_from')
            ? Carbon::parse($request->input('date_from'))->startOfDay()
            : Carbon::now()->startOfMonth();

        $dateTo = $request->input('date_to')
            ? Carbon::parse($request->input('date_to'))->endOfDay()
            : Carbon::now()->endOfDay();

        // Summary
        $transactions = Transaction::with(['transactionItems', 'user'])
            ->whereBetween('created_at', [$dateFrom, $dateTo])
            ->get();

        $totalOmzet = $transactions->sum('total_price');
        $totalTransaksi = $transactions->count();
        $totalItems = $transactions->flatMap->transactionItems->sum('quantity');
        $cashOmzet = $transactions->where('payment_method', 'cash')->sum('total_price');
        $qrisOmzet = $transactions->where('payment_method', 'qris')->sum('total_price');

        // Daily breakdown
        $daily = DB::table('transactions')
            ->selectRaw('DATE(created_at) as date, SUM(total_price) as omzet, COUNT(*) as jumlah')
            ->whereBetween('created_at', [$dateFrom, $dateTo])
            ->groupByRaw('DATE(created_at)')
            ->orderBy('date')
            ->get();

        // Top products
        $topProducts = DB::table('transaction_items')
            ->join('products', 'transaction_items.product_id', '=', 'products.id')
            ->join('transactions', 'transaction_items.transaction_id', '=', 'transactions.id')
            ->whereBetween('transactions.created_at', [$dateFrom, $dateTo])
            ->select(
                'products.name',
                DB::raw('SUM(transaction_items.quantity) as total_qty'),
                DB::raw('SUM(transaction_items.subtotal) as total_pendapatan')
            )
            ->groupBy('products.id', 'products.name')
            ->orderByDesc('total_qty')
            ->limit(10)
            ->get();

        // Per kasir
        $perKasir = DB::table('transactions')
            ->join('users', 'transactions.user_id', '=', 'users.id')
            ->whereBetween('transactions.created_at', [$dateFrom, $dateTo])
            ->select(
                'users.name as kasir',
                DB::raw('COUNT(*) as total_transaksi'),
                DB::raw('SUM(total_price) as total_omzet')
            )
            ->groupBy('users.id', 'users.name')
            ->orderByDesc('total_omzet')
            ->get();

        return Inertia::render('Reports/Index', [
            'summary' => [
                'total_omzet'      => $totalOmzet,
                'total_transaksi'  => $totalTransaksi,
                'total_items'      => $totalItems,
                'cash_omzet'       => $cashOmzet,
                'qris_omzet'       => $qrisOmzet,
            ],
            'daily'       => $daily,
            'topProducts' => $topProducts,
            'perKasir'    => $perKasir,
            'date_from'   => $dateFrom->toDateString(),
            'date_to'     => $dateTo->toDateString(),
        ]);
    }
}
```

- [ ] **Step 2: Commit**

```bash
git add app/Http/Controllers/ReportController.php
git commit -m "feat: add ReportController with sales/products/cashier aggregation"
```

---

## Task 2: Route

**Files:**
- Modify: `routes/web.php`

- [ ] **Step 1: Tambah use statement dan route**

Di bagian atas `routes/web.php`, tambah:
```php
use App\Http\Controllers\ReportController;
```

Di dalam `Route::middleware('role:admin')->group(function () {`, tambah setelah route settings:
```php
Route::get('/reports', [ReportController::class, 'index'])->name('reports.index');
```

Hasil blok admin routes:
```php
Route::middleware('role:admin')->group(function () {
    Route::resource('users', UserController::class);
    Route::resource('products', ProductController::class)->except(['index']);
    Route::resource('categories', CategoryController::class)->except(['index']);
    Route::resource('customers', CustomerController::class)->except(['index']);
    Route::resource('transactions', TransactionController::class)->only(['destroy']);
    Route::get('/settings', [SettingController::class, 'index'])->name('settings.index');
    Route::post('/settings', [SettingController::class, 'update'])->name('settings.update');
    Route::delete('/settings/logo', [SettingController::class, 'removeLogo'])->name('settings.logo.remove');
    Route::get('/reports', [ReportController::class, 'index'])->name('reports.index');
});
```

- [ ] **Step 2: Verifikasi route terdaftar**

```bash
php artisan route:list --name=reports
```

Expected output mengandung:
```
GET|HEAD  reports  reports.index  App\Http\Controllers\ReportController@index
```

- [ ] **Step 3: Commit**

```bash
git add routes/web.php
git commit -m "feat: register /reports route for admin"
```

---

## Task 3: Sidebar — Tambah Menu Laporan

**Files:**
- Modify: `resources/js/Components/Organisms/Sidebar.jsx`

- [ ] **Step 1: Tambah link Laporan untuk admin**

Di `Sidebar.jsx`, dalam blok `{user.role === 'admin' && (...)}` yang pertama (setelah link Dashboard), tambah link Laporan setelah Dashboard dan sebelum Transaksi (yaitu sebelum `</>`). Ganti blok admin pertama:

```jsx
{user.role === "admin" && (
    <Link
        href={route("dashboard")}
        className={`font-semibold rounded-xl px-4 py-3 flex items-center gap-3 active:scale-95 transition-transform ${
            route().current("dashboard")
                ? "bg-primary-500 text-white shadow-lg shadow-primary-500/30"
                : "text-primary-800 hover:bg-primary-200"
        }`}
    >
        <span className="material-symbols-outlined text-xl">dashboard</span>
        <span className="text-sm">Dashboard</span>
    </Link>
)}
```

Menjadi:
```jsx
{user.role === "admin" && (
    <>
        <Link
            href={route("dashboard")}
            className={`font-semibold rounded-xl px-4 py-3 flex items-center gap-3 active:scale-95 transition-transform ${
                route().current("dashboard")
                    ? "bg-primary-500 text-white shadow-lg shadow-primary-500/30"
                    : "text-primary-800 hover:bg-primary-200"
            }`}
        >
            <span className="material-symbols-outlined text-xl">dashboard</span>
            <span className="text-sm">Dashboard</span>
        </Link>
        <Link
            href={route("reports.index")}
            className={`font-medium rounded-xl px-4 py-3 flex items-center gap-3 active:scale-95 transition-transform ${
                route().current("reports.*")
                    ? "bg-primary-500 text-white shadow-lg shadow-primary-500/30"
                    : "text-primary-800 hover:bg-primary-200"
            }`}
        >
            <span className="material-symbols-outlined text-xl">bar_chart</span>
            <span className="text-sm">Laporan</span>
        </Link>
    </>
)}
```

- [ ] **Step 2: Commit**

```bash
git add resources/js/Components/Organisms/Sidebar.jsx
git commit -m "feat: add Laporan menu item in sidebar for admin"
```

---

## Task 4: Reports/Index.jsx

**Files:**
- Create: `resources/js/Pages/Reports/Index.jsx`

- [ ] **Step 1: Buat folder dan file**

```bash
mkdir -p resources/js/Pages/Reports
```

- [ ] **Step 2: Tulis komponen**

```jsx
import React, { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";

const fmt = (n) => new Intl.NumberFormat("id-ID").format(n);
const fmtDate = (d) =>
    new Date(d).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });

const TABS = [
    { key: "penjualan", label: "Penjualan", icon: "payments" },
    { key: "produk", label: "Produk Terlaris", icon: "inventory_2" },
    { key: "kasir", label: "Per Kasir", icon: "group" },
];

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
    const [from, setFrom] = useState(date_from);
    const [to, setTo] = useState(date_to);

    const applyFilter = (f, t) => {
        router.get(route("reports.index"), { date_from: f, date_to: t }, { preserveState: false });
    };

    const setPreset = (preset) => {
        const today = new Date();
        const pad = (n) => String(n).padStart(2, "0");
        const fmt = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
        let f, t;
        if (preset === "today") {
            f = t = fmt(today);
        } else if (preset === "7d") {
            const d = new Date(today);
            d.setDate(d.getDate() - 6);
            f = fmt(d);
            t = fmt(today);
        } else if (preset === "month") {
            f = fmt(new Date(today.getFullYear(), today.getMonth(), 1));
            t = fmt(today);
        }
        setFrom(f);
        setTo(t);
        applyFilter(f, t);
    };

    const handleCustomApply = () => applyFilter(from, to);

    const exportPDF = () => {
        let content = "";
        const title =
            activeTab === "penjualan"
                ? "Laporan Penjualan"
                : activeTab === "produk"
                ? "Laporan Produk Terlaris"
                : "Laporan Per Kasir";

        const period = `${fmtDate(date_from)} – ${fmtDate(date_to)}`;

        if (activeTab === "penjualan") {
            content = `
<h2>Ringkasan</h2>
<table>
  <tr><td>Total Omzet</td><td>Rp ${fmt(summary.total_omzet)}</td></tr>
  <tr><td>Total Transaksi</td><td>${summary.total_transaksi}</td></tr>
  <tr><td>Total Item Terjual</td><td>${summary.total_items}</td></tr>
  <tr><td>Omzet Cash</td><td>Rp ${fmt(summary.cash_omzet)}</td></tr>
  <tr><td>Omzet QRIS</td><td>Rp ${fmt(summary.qris_omzet)}</td></tr>
</table>
<h2>Penjualan Harian</h2>
<table>
  <thead><tr><th>Tanggal</th><th>Transaksi</th><th>Omzet</th></tr></thead>
  <tbody>
    ${daily
        .map(
            (d) =>
                `<tr><td>${fmtDate(d.date)}</td><td>${d.jumlah}</td><td>Rp ${fmt(d.omzet)}</td></tr>`,
        )
        .join("")}
  </tbody>
</table>`;
        } else if (activeTab === "produk") {
            content = `
<table>
  <thead><tr><th>#</th><th>Produk</th><th>Qty Terjual</th><th>Pendapatan</th></tr></thead>
  <tbody>
    ${topProducts
        .map(
            (p, i) =>
                `<tr><td>${i + 1}</td><td>${p.name}</td><td>${p.total_qty}</td><td>Rp ${fmt(p.total_pendapatan)}</td></tr>`,
        )
        .join("")}
  </tbody>
</table>`;
        } else {
            content = `
<table>
  <thead><tr><th>Kasir</th><th>Transaksi</th><th>Total Omzet</th></tr></thead>
  <tbody>
    ${perKasir
        .map(
            (k) =>
                `<tr><td>${k.kasir}</td><td>${k.total_transaksi}</td><td>Rp ${fmt(k.total_omzet)}</td></tr>`,
        )
        .join("")}
  </tbody>
</table>`;
        }

        const html = `<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8"/>
<title>${title}</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: Arial, sans-serif; font-size: 13px; color: #1e293b; padding: 32px; }
  h1 { font-size: 20px; font-weight: 900; margin-bottom: 4px; }
  h2 { font-size: 14px; font-weight: 700; margin: 20px 0 8px; color: #475569; }
  .period { font-size: 11px; color: #64748b; margin-bottom: 24px; }
  table { width: 100%; border-collapse: collapse; margin-bottom: 16px; }
  th, td { border: 1px solid #e2e8f0; padding: 8px 12px; text-align: left; }
  th { background: #f8fafc; font-weight: 700; font-size: 11px; text-transform: uppercase; }
  @media print { button { display: none; } }
</style>
</head>
<body>
<h1>${title}</h1>
<div class="period">Periode: ${period}</div>
${content}
</body>
</html>`;

        const win = window.open("", "_blank", "width=900,height=700");
        win.document.write(html);
        win.document.close();
        win.focus();
        setTimeout(() => win.print(), 300);
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Laporan" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-black text-slate-800">Laporan</h2>
                        <p className="text-xs text-slate-500">
                            {fmtDate(date_from)} – {fmtDate(date_to)}
                        </p>
                    </div>
                    <button
                        onClick={exportPDF}
                        className="flex items-center gap-2 px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-sm font-bold rounded-xl shadow-sm shadow-primary-600/20 transition-all active:scale-95"
                    >
                        <span className="material-symbols-outlined text-lg">print</span>
                        Export PDF
                    </button>
                </div>

                {/* Filter */}
                <div className="bg-white rounded-2xl border border-slate-200 p-4 flex flex-wrap gap-3 items-end">
                    <div className="flex gap-2 flex-wrap">
                        {[
                            { key: "today", label: "Hari Ini" },
                            { key: "7d", label: "7 Hari" },
                            { key: "month", label: "Bulan Ini" },
                        ].map((p) => (
                            <button
                                key={p.key}
                                onClick={() => setPreset(p.key)}
                                className="px-4 py-2 rounded-xl text-sm font-bold bg-slate-100 hover:bg-primary-100 hover:text-primary-700 text-slate-600 transition-colors"
                            >
                                {p.label}
                            </button>
                        ))}
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                        <input
                            type="date"
                            value={from}
                            onChange={(e) => setFrom(e.target.value)}
                            className="rounded-xl border-slate-200 text-sm focus:ring-primary-500 focus:border-primary-500"
                        />
                        <span className="text-slate-400 text-sm font-bold">–</span>
                        <input
                            type="date"
                            value={to}
                            onChange={(e) => setTo(e.target.value)}
                            className="rounded-xl border-slate-200 text-sm focus:ring-primary-500 focus:border-primary-500"
                        />
                        <button
                            onClick={handleCustomApply}
                            className="px-4 py-2 rounded-xl text-sm font-bold bg-primary-600 hover:bg-primary-700 text-white transition-colors"
                        >
                            Terapkan
                        </button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-1 bg-slate-100 p-1 rounded-xl w-fit">
                    {TABS.map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                                activeTab === tab.key
                                    ? "bg-white text-primary-700 shadow-sm"
                                    : "text-slate-500 hover:text-slate-700"
                            }`}
                        >
                            <span className="material-symbols-outlined text-base">{tab.icon}</span>
                            <span className="hidden sm:inline">{tab.label}</span>
                        </button>
                    ))}
                </div>

                {/* Tab: Penjualan */}
                {activeTab === "penjualan" && (
                    <div className="space-y-6">
                        {/* Summary Cards */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            {[
                                { label: "Total Omzet", value: `Rp ${fmt(summary.total_omzet)}`, icon: "payments" },
                                { label: "Total Transaksi", value: summary.total_transaksi, icon: "receipt_long" },
                                { label: "Item Terjual", value: `${summary.total_items} pcs`, icon: "inventory_2" },
                                { label: "Cash / QRIS", value: `${fmt(summary.cash_omzet)} / ${fmt(summary.qris_omzet)}`, icon: "qr_code_2" },
                            ].map((s) => (
                                <div key={s.label} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">{s.label}</p>
                                    <p className="text-lg font-black text-slate-800 truncate">{s.value}</p>
                                    <span className="material-symbols-outlined text-slate-100 text-4xl mt-1">{s.icon}</span>
                                </div>
                            ))}
                        </div>

                        {/* Daily Table */}
                        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                            <div className="px-6 py-4 border-b border-slate-100">
                                <h3 className="font-black text-slate-800">Penjualan Harian</h3>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] tracking-wider border-y border-slate-100">
                                        <tr>
                                            <th className="px-6 py-3">Tanggal</th>
                                            <th className="px-6 py-3 text-right">Transaksi</th>
                                            <th className="px-6 py-3 text-right">Omzet</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {daily.length === 0 && (
                                            <tr>
                                                <td colSpan={3} className="px-6 py-10 text-center text-slate-400 italic">
                                                    Tidak ada data pada periode ini.
                                                </td>
                                            </tr>
                                        )}
                                        {daily.map((d) => (
                                            <tr key={d.date} className="hover:bg-slate-50 transition-colors">
                                                <td className="px-6 py-4 text-slate-700 font-medium">{fmtDate(d.date)}</td>
                                                <td className="px-6 py-4 text-right text-slate-600">{d.jumlah}</td>
                                                <td className="px-6 py-4 text-right font-black text-slate-800 font-mono">
                                                    Rp {fmt(d.omzet)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    {daily.length > 0 && (
                                        <tfoot className="bg-slate-50 border-t-2 border-slate-200">
                                            <tr>
                                                <td className="px-6 py-3 font-black text-slate-700">Total</td>
                                                <td className="px-6 py-3 text-right font-black text-slate-700">{summary.total_transaksi}</td>
                                                <td className="px-6 py-3 text-right font-black text-slate-900 font-mono">
                                                    Rp {fmt(summary.total_omzet)}
                                                </td>
                                            </tr>
                                        </tfoot>
                                    )}
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {/* Tab: Produk Terlaris */}
                {activeTab === "produk" && (
                    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-100">
                            <h3 className="font-black text-slate-800">Top 10 Produk Terlaris</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] tracking-wider border-y border-slate-100">
                                    <tr>
                                        <th className="px-6 py-3">#</th>
                                        <th className="px-6 py-3">Produk</th>
                                        <th className="px-6 py-3 text-right">Qty Terjual</th>
                                        <th className="px-6 py-3 text-right">Pendapatan</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {topProducts.length === 0 && (
                                        <tr>
                                            <td colSpan={4} className="px-6 py-10 text-center text-slate-400 italic">
                                                Tidak ada data pada periode ini.
                                            </td>
                                        </tr>
                                    )}
                                    {topProducts.map((p, i) => (
                                        <tr key={p.name} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black ${i < 3 ? "bg-orange-100 text-orange-600" : "bg-slate-100 text-slate-500"}`}>
                                                    {i + 1}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 font-bold text-slate-800">{p.name}</td>
                                            <td className="px-6 py-4 text-right text-slate-600 font-medium">{p.total_qty} pcs</td>
                                            <td className="px-6 py-4 text-right font-black text-slate-800 font-mono">
                                                Rp {fmt(p.total_pendapatan)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Tab: Per Kasir */}
                {activeTab === "kasir" && (
                    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-100">
                            <h3 className="font-black text-slate-800">Performa Per Kasir</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] tracking-wider border-y border-slate-100">
                                    <tr>
                                        <th className="px-6 py-3">Kasir</th>
                                        <th className="px-6 py-3 text-right">Jumlah Transaksi</th>
                                        <th className="px-6 py-3 text-right">Total Omzet</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {perKasir.length === 0 && (
                                        <tr>
                                            <td colSpan={3} className="px-6 py-10 text-center text-slate-400 italic">
                                                Tidak ada data pada periode ini.
                                            </td>
                                        </tr>
                                    )}
                                    {perKasir.map((k) => (
                                        <tr key={k.kasir} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-black text-xs">
                                                        {k.kasir.charAt(0).toUpperCase()}
                                                    </div>
                                                    <span className="font-bold text-slate-800">{k.kasir}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right text-slate-600 font-medium">{k.total_transaksi}</td>
                                            <td className="px-6 py-4 text-right font-black text-slate-800 font-mono">
                                                Rp {fmt(k.total_omzet)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
```

- [ ] **Step 3: Commit**

```bash
git add resources/js/Pages/Reports/Index.jsx
git commit -m "feat: add Reports/Index page with tabs, filter, and PDF export"
```

---

## Task 5: Verifikasi Manual

- [ ] **Step 1: Build assets**

```bash
npm run dev
```

- [ ] **Step 2: Test di browser**

1. Login sebagai admin
2. Klik menu "Laporan" di sidebar
3. Verifikasi halaman `/reports` terbuka, data bulan ini tampil
4. Klik preset "7 Hari" → data berubah
5. Klik custom date → isi tanggal → Terapkan → data berubah
6. Klik tab "Produk Terlaris" → tabel tampil
7. Klik tab "Per Kasir" → tabel tampil
8. Klik "Export PDF" → popup print muncul

- [ ] **Step 3: Verifikasi responsive**

Resize browser ke mobile width. Pastikan:
- Filter wrap dengan baik
- Tab labels tersembunyi di mobile (icon only)
- Summary cards 2-kolom
- Tabel horizontally scrollable

- [ ] **Step 4: Commit final**

```bash
git add -A
git commit -m "feat: laporan admin — sales report with tabs, filter, and PDF export"
```
