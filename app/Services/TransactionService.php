<?php

namespace App\Services;

use App\Models\Transaction;
use App\Models\Product;
use App\Models\StockMovement;
use Illuminate\Support\Facades\DB;

class TransactionService
{
    /**
     * Handle checkout process.
     */
    public function checkout(array $data)
    {
        return DB::transaction(function () use ($data) {
            $transaction = Transaction::create([
                'customer_id' => $data['customer_id'] ?? null,
                'user_id' => auth()->id(),
                'total_price' => $data['total_price'],
                'paid_amount' => $data['paid_amount'],
                'change_amount' => $data['change_amount'],
                'transaction_date' => now(),
            ]);

            foreach ($data['items'] as $item) {
                $product = Product::findOrFail($item['product_id']);

                // Create Transaction Item
                $transaction->items()->create([
                    'product_id' => $product->id,
                    'quantity' => $item['quantity'],
                    'unit_price' => $item['unit_price'],
                    'subtotal' => $item['quantity'] * $item['unit_price'],
                ]);

                // Update Stock
                $product->decrement('stock', $item['quantity']);

                // Record Stock Movement
                StockMovement::create([
                    'product_id' => $product->id,
                    'user_id' => auth()->id(),
                    'type' => 'out',
                    'quantity' => $item['quantity'],
                    'description' => "Penjualan Transaksi #{$transaction->id}",
                ]);
            }

            return $transaction;
        });
    }
}
