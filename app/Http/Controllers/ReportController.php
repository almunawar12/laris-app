<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ReportController extends Controller
{
    public function index(Request $request)
    {
        abort_if(auth()->user()->role !== 'admin', 403);

        $request->validate([
            'date_from' => 'nullable|date',
            'date_to'   => 'nullable|date|after_or_equal:date_from',
        ]);

        $dateFrom = $request->input('date_from')
            ? Carbon::parse($request->input('date_from'))->startOfDay()
            : Carbon::now()->startOfMonth();

        $dateTo = $request->input('date_to')
            ? Carbon::parse($request->input('date_to'))->endOfDay()
            : Carbon::now()->endOfDay();

        // Summary — aggregate in DB, no collection load
        $summaryRow = DB::table('transactions')
            ->selectRaw('
                COALESCE(SUM(total_price), 0) as total_omzet,
                COUNT(*) as total_transaksi,
                COALESCE(SUM(CASE WHEN payment_method = "cash" THEN total_price ELSE 0 END), 0) as cash_omzet,
                COALESCE(SUM(CASE WHEN payment_method = "qris" THEN total_price ELSE 0 END), 0) as qris_omzet,
                COALESCE(SUM(CASE WHEN payment_method = "transfer" THEN total_price ELSE 0 END), 0) as transfer_omzet
            ')
            ->whereBetween('transaction_date', [$dateFrom, $dateTo])
            ->first();

        $totalItems = (int) DB::table('transaction_items')
            ->join('transactions', 'transaction_items.transaction_id', '=', 'transactions.id')
            ->whereBetween('transactions.transaction_date', [$dateFrom, $dateTo])
            ->sum('transaction_items.quantity');

        // Daily breakdown — use transaction_date
        $daily = DB::table('transactions')
            ->selectRaw('DATE(transaction_date) as date, CAST(SUM(total_price) AS DECIMAL(14,2)) as omzet, COUNT(*) as jumlah')
            ->whereBetween('transaction_date', [$dateFrom, $dateTo])
            ->groupByRaw('DATE(transaction_date)')
            ->orderBy('date')
            ->get()
            ->map(fn ($r) => [
                'date'   => $r->date,
                'omzet'  => (float) $r->omzet,
                'jumlah' => (int)   $r->jumlah,
            ]);

        // Top products — filter by transaction_date
        $topProducts = DB::table('transaction_items')
            ->join('products', 'transaction_items.product_id', '=', 'products.id')
            ->join('transactions', 'transaction_items.transaction_id', '=', 'transactions.id')
            ->whereBetween('transactions.transaction_date', [$dateFrom, $dateTo])
            ->select(
                'products.name',
                DB::raw('SUM(transaction_items.quantity) as total_qty'),
                DB::raw('SUM(transaction_items.subtotal) as total_pendapatan')
            )
            ->groupBy('products.id', 'products.name')
            ->orderByDesc('total_qty')
            ->limit(10)
            ->get();

        // Per kasir — filter by transaction_date
        $perKasir = DB::table('transactions')
            ->join('users', 'transactions.user_id', '=', 'users.id')
            ->whereBetween('transactions.transaction_date', [$dateFrom, $dateTo])
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
                'total_omzet'      => (float) $summaryRow->total_omzet,
                'total_transaksi'  => (int)   $summaryRow->total_transaksi,
                'total_items'      => $totalItems,
                'cash_omzet'       => (float) $summaryRow->cash_omzet,
                'qris_omzet'       => (float) $summaryRow->qris_omzet,
                'transfer_omzet'   => (float) $summaryRow->transfer_omzet,
            ],
            'daily'       => $daily,
            'topProducts' => $topProducts,
            'perKasir'    => $perKasir,
            'date_from'   => $dateFrom->toDateString(),
            'date_to'     => $dateTo->toDateString(),
        ]);
    }
}
