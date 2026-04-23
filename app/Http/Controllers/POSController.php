<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Category;
use App\Models\Customer;
use App\Services\TransactionService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class POSController extends Controller
{
    protected $transactionService;

    public function __construct(TransactionService $transactionService)
    {
        $this->transactionService = $transactionService;
    }

    public function index()
    {
        return Inertia::render('POS/Index', [
            'products' => Product::with('category')->where('stock', '>', 0)->get(),
            'categories' => Category::all(),
            'customers' => Customer::all(),
        ]);
    }

    public function storeCustomer(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'nullable|string|max:20',
        ]);

        Customer::create($validated);

        return redirect()->route('pos.index')->with('success', 'Pelanggan berhasil ditambahkan.');
    }

    public function checkout(Request $request)
    {
        $validated = $request->validate([
            'customer_id' => 'nullable|exists:customers,id',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.price' => 'required|numeric|min:0',
            'payment_method' => 'required|string',
            'paid_amount' => 'required|numeric|min:0',
        ]);

        try {
            $transaction = $this->transactionService->checkout($validated);

            return redirect()->route('pos.index')->with('success', 'Transaksi berhasil disimpan.');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => $e->getMessage()]);
        }
    }
}
