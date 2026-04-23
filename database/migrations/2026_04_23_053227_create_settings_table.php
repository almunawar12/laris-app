<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('settings', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique();
            $table->text('value')->nullable();
            $table->timestamps();
        });

        // Default values
        DB::table('settings')->insert([
            ['key' => 'store_name', 'value' => 'Kedai UMK Laris', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'store_address', 'value' => '', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'store_phone', 'value' => '', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'logo_path', 'value' => '', 'created_at' => now(), 'updated_at' => now()],
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('settings');
    }
};
