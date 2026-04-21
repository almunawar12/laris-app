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
            $totalPrice = 0;
            foreach ($data['items'] as $item) {
                $totalPrice += $item['quantity'] * $item['price'];
            }

            $transaction = Transaction::create([
                'invoice_code' => 'INV-' . strtoupper(uniqid()),
                'customer_id' => $data['customer_id'] ?? null,
                'user_id' => auth()->id(),
                'total_price' => $totalPrice,
                'total_paid' => $data['paid_amount'],
                'change' => $data['paid_amount'] - $totalPrice,
                'payment_method' => $data['payment_method'] ?? 'cash',
                'transaction_date' => now(),
            ]);

            foreach ($data['items'] as $item) {
                $product = Product::findOrFail($item['product_id']);

                // Create Transaction Item
                $transaction->transactionItems()->create([
                    'product_id' => $product->id,
                    'quantity' => $item['quantity'],
                    'price' => $item['price'],
                    'subtotal' => $item['quantity'] * $item['price'],
                ]);

                // Update Stock
                $product->decrement('stock', $item['quantity']);

                // Record Stock Movement
                StockMovement::create([
                    'product_id' => $product->id,
                    'user_id' => auth()->id(),
                    'type' => 'out',
                    'quantity' => $item['quantity'],
                    'description' => "Penjualan Transaksi #{$transaction->invoice_code}",
                ]);
            }

            return $transaction;
        });
    }
}
