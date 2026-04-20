<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1 admin user
        \App\Models\User::factory()->create([
            'name' => 'Admin User',
            'email' => 'admin@laris.test',
            'role' => 'admin',
        ]);

        // 5 user kasir
        $cashiers = \App\Models\User::factory(5)->create([
            'role' => 'cashier',
        ]);

        // 5 kategori
        $categories = \App\Models\Category::factory(5)->create();

        // 20 produk, distributed across categories
        $products = \App\Models\Product::factory(20)->make()->each(function ($product) use ($categories) {
            $product->category_id = $categories->random()->id;
            $product->save();
        });

        // 10 transaksi
        \App\Models\Transaction::factory(10)->make()->each(function ($transaction) use ($cashiers, $products) {
            $transaction->user_id = $cashiers->random()->id;
            // set customer_id optionally
            $transaction->customer_id = fake()->boolean(50) ? \App\Models\Customer::factory()->create()->id : null;
            $transaction->save();

            // Create 1-3 items per transaction
            $itemCount = fake()->numberBetween(1, 3);
            $transactionProducts = $products->random($itemCount);

            $totalPrice = 0;

            $transactionProducts->each(function ($product) use ($transaction, &$totalPrice) {
                $quantity = fake()->numberBetween(1, 5);
                $subtotal = $quantity * $product->price;

                \App\Models\TransactionItem::create([
                    'transaction_id' => $transaction->id,
                    'product_id' => $product->id,
                    'quantity' => $quantity,
                    'price' => $product->price,
                    'subtotal' => $subtotal,
                ]);

                $totalPrice += $subtotal;
            });

            // Update transaction totals
            $transaction->total_price = $totalPrice;
            $transaction->total_paid = $totalPrice + fake()->randomElement([0, 10000, 50000]); // Exact amount or slightly more
            $transaction->change = $transaction->total_paid - $transaction->total_price;
            $transaction->save();
        });
    }
}
