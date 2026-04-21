<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use App\Models\Product;
use App\Models\User;
use App\Models\Customer;
use Carbon\Carbon;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $today = Carbon::today();

        // Data for charts and stats
        $totalSalesToday = Transaction::whereDate('created_at', $today)->sum('total_price');
        $transactionCountToday = Transaction::whereDate('created_at', $today)->count();
        $productsSoldToday = DB::table('transaction_items')
            ->join('transactions', 'transaction_items.transaction_id', '=', 'transactions.id')
            ->whereDate('transactions.created_at', $today)
            ->sum('quantity');

        $lowStockProducts = Product::where('stock', '<=', 10)->count();

        // Chart Data (Last 7 Days)
        $salesData = [];
        for ($i = 6; $i >= 0; $i--) {
            $date = Carbon::today()->subDays($i);
            $salesData[] = [
                'name' => $date->format('D'),
                'sales' => (int)Transaction::whereDate('created_at', $date)->sum('total_price'),
            ];
        }

        // Top Products
        $topProducts = DB::table('transaction_items')
            ->join('products', 'transaction_items.product_id', '=', 'products.id')
            ->select('products.name', DB::raw('SUM(transaction_items.quantity) as sales'))
            ->groupBy('products.id', 'products.name')
            ->orderByDesc('sales')
            ->limit(5)
            ->get();

        return Inertia::render('Dashboard', [
            'stats' => [
                [
                    'title' => 'Total Penjualan Hari Ini',
                    'value' => 'Rp ' . number_format($totalSalesToday, 0, ',', '.'),
                    'trend' => 'Real-time hari ini',
                    'icon' => 'payments',
                ],
                [
                    'title' => 'Jumlah Transaksi',
                    'value' => (string)$transactionCountToday,
                    'trend' => 'Total checkout hari ini',
                    'icon' => 'receipt_long',
                ],
                [
                    'title' => 'Produk Terjual',
                    'value' => (int)$productsSoldToday . ' pcs',
                    'trend' => 'Total kuantitas barang',
                    'icon' => 'inventory_2',
                ],
                [
                    'title' => 'Produk Stok Rendah',
                    'value' => (string)$lowStockProducts,
                    'trend' => 'Perlu segera restock',
                    'icon' => 'warning',
                    'variant' => $lowStockProducts > 0 ? 'danger' : 'primary',
                ],
            ],
            'salesData' => $salesData,
            'topProducts' => $topProducts,
        ]);
    }
}
