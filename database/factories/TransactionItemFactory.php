<?php

namespace Database\Factories;

use App\Models\TransactionItem;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<TransactionItem>
 */
class TransactionItemFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'transaction_id' => \App\Models\Transaction::factory(),
            'product_id' => \App\Models\Product::factory(),
            'quantity' => fake()->numberBetween(1, 5),
            'price' => 0, // Will be set in seeder based on product snapshot
            'subtotal' => 0, // Will be set in seeder
        ];
    }
}
