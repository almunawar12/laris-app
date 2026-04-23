<?php

namespace App\Http\Middleware;

use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $settings = Setting::allAsArray();
        $logoPath = $settings['logo_path'] ?? '';

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user() ? [
                    'id' => $request->user()->id,
                    'name' => $request->user()->name,
                    'email' => $request->user()->email,
                    'role' => strtolower($request->user()->role ?? ''),
                ] : null,
            ],
            'appSettings' => [
                'store_name'    => $settings['store_name'] ?? 'Kedai UMK Laris',
                'store_address' => $settings['store_address'] ?? '',
                'store_phone'   => $settings['store_phone'] ?? '',
                'logo_url'      => $logoPath ? Storage::url($logoPath) : null,
            ],
        ];
    }
}
