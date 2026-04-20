<?php

namespace Database\Factories;

use App\Models\Transaction;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Transaction>
 */
class TransactionFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'invoice_code' => 'INV-' . now()->format('Ymd') . '-' . fake()->unique()->numerify('####'),
            'user_id' => \App\Models\User::factory(),
            'customer_id' => \App\Models\Customer::factory(),
            'total_price' => 0, // Will be calculated in seeder
            'total_paid' => 0, // Will be calculated in seeder
            'change' => 0, // Will be calculated in seeder
            'payment_method' => fake()->randomElement(['cash', 'qris', 'transfer']),
            'transaction_date' => fake()->dateTimeBetween('-1 month', 'now'),
        ];
    }
}
