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
