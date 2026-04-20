<?php

namespace Database\Factories;

use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Product>
 */
class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $costPrice = fake()->randomFloat(2, 1000, 500000);
        $price = $costPrice + ($costPrice * fake()->randomFloat(2, 0.1, 0.5)); // 10% - 50% profit margin

        return [
            'name' => fake()->unique()->words(3, true),
            'sku' => fake()->unique()->ean13(),
            'barcode' => fake()->unique()->ean13(),
            'price' => $price,
            'cost_price' => $costPrice,
            'stock' => fake()->numberBetween(0, 100),
            'category_id' => \App\Models\Category::factory(),
        ];
    }
}
