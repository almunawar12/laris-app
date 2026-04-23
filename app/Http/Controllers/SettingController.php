<?php

namespace App\Http\Controllers;

use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class SettingController extends Controller
{
    public function index()
    {
        return Inertia::render('Settings/Index', [
            'settings' => Setting::allAsArray(),
        ]);
    }

    public function update(Request $request)
    {
        $request->validate([
            'store_name'    => 'required|string|max:255',
            'store_address' => 'nullable|string|max:500',
            'store_phone'   => 'nullable|string|max:30',
            'logo'          => 'nullable|image|mimes:png,jpg,jpeg,webp|max:2048',
        ]);

        Setting::set('store_name', $request->store_name);
        Setting::set('store_address', $request->store_address ?? '');
        Setting::set('store_phone', $request->store_phone ?? '');

        if ($request->hasFile('logo')) {
            $old = Setting::get('logo_path');
            if ($old) {
                Storage::disk('public')->delete($old);
            }
            $path = $request->file('logo')->store('settings', 'public');
            Setting::set('logo_path', $path);
        }

        return back()->with('success', 'Pengaturan berhasil disimpan.');
    }

    public function removeLogo()
    {
        $old = Setting::get('logo_path');
        if ($old) {
            Storage::disk('public')->delete($old);
        }
        Setting::set('logo_path', '');

        return back()->with('success', 'Logo berhasil dihapus.');
    }
}
