# POS App — Role System & Feature Roadmap

## Context

App sudah punya: login, dashboard, model lengkap (User/Product/Category/Customer/Transaction/StockMovement), semua route CRUD sudah ada. User model sudah punya kolom `role` enum (admin/cashier). Tapi: belum ada middleware role, controller masih stub, frontend page belum dibangun.

Stack: Laravel 12 + Inertia.js + React 18 + Tailwind CSS.

---

## Pembagian Akses: Admin vs Kasir

| Fitur | Admin | Kasir |
|-------|-------|-------|
| Dashboard (full analytics) | ✅ | ❌ |
| Dashboard (ringkasan hari ini) | ✅ | ✅ (terbatas) |
| User Management | ✅ | ❌ |
| Produk CRUD | ✅ | 👁️ view only |
| Kategori CRUD | ✅ | 👁️ view only |
| Stok Masuk (stock in) | ✅ | ❌ |
| Laporan & Ekspor | ✅ | ❌ |
| Pelanggan CRUD | ✅ | ✅ (create + view) |
| Kasir / POS Screen | ❌ | ✅ |
| Riwayat Transaksi | ✅ (semua) | ✅ (milik sendiri) |
| Profil sendiri | ✅ | ✅ |

---

## Fitur Prioritas (Urutan Pengerjaan)

### Fase 1 — Fondasi Role (WAJIB DULU)
- [ ] Role Middleware — buat `EnsureRole` middleware, daftarkan di bootstrap/app.php
- [ ] Route Protection — pisahkan route group: `admin` dan `kasir`
- [ ] Redirect after login — admin → `/dashboard`, kasir → `/pos`
- [ ] Frontend guard — kirim `role` via Inertia shared props, sembunyikan menu berdasarkan role

### Fase 2 — Fitur Kasir (Core POS)
- [ ] POS Screen `/pos` — search produk, keranjang, hitung total, pilih metode bayar
- [ ] Checkout — pakai `TransactionService` yang sudah ada
- [ ] Riwayat Transaksi Kasir `/transactions` — hanya transaksi milik user login

### Fase 3 — Fitur Admin (Management)
- [ ] User Management `/users` — CRUD user, assign role
- [ ] Product Management `/products` — CRUD lengkap
- [ ] Category Management `/categories` — CRUD (halaman ada, lengkapi)
- [ ] Stock Management `/stock` — input stok masuk, histori pergerakan stok

### Fase 4 — Laporan (Admin Only)
- [ ] Laporan Penjualan `/reports/sales` — filter tanggal, total omzet
- [ ] Laporan Stok `/reports/stock` — produk low stock, pergerakan
- [ ] Ekspor — export CSV/PDF transaksi

---

## File Kritis

### Backend
| File | Status | Keterangan |
|------|--------|------------|
| `app/Http/Middleware/EnsureRole.php` | ✅ Dibuat | Role middleware |
| `bootstrap/app.php` | ✅ Diupdate | Alias `role` middleware |
| `routes/web.php` | ✅ Diupdate | Route group per role |
| `app/Models/User.php` | ✅ Diupdate | Helper `isAdmin()`, `isCashier()` |
| `app/Http/Controllers/DashboardController.php` | ⏳ Perlu dibuat | Data berbeda per role |
| `app/Http/Controllers/UserController.php` | ⏳ Perlu dibuat | Admin only |
| `app/Http/Controllers/POSController.php` | ⏳ Perlu dibuat | Kasir only |
| `app/Http/Controllers/TransactionController.php` | ⏳ Perlu diisi | Stub → implementasi |
| `app/Http/Middleware/HandleInertiaRequests.php` | ⏳ Perlu update | Expose role ke frontend |

### Frontend (React/Inertia)
| File | Status | Keterangan |
|------|--------|------------|
| `resources/js/Pages/POS/Index.jsx` | ⏳ Perlu dibuat | Kasir screen |
| `resources/js/Pages/Users/Index.jsx` | ⏳ Perlu dibuat | Admin user management |
| `resources/js/Pages/Products/Index.jsx` | ⏳ Perlu dibuat | Product list |
| `resources/js/Pages/Transactions/Index.jsx` | ⏳ Perlu dibuat | Transaction history |
| `resources/js/Components/Organisms/Sidebar.jsx` | ⏳ Perlu update | Filter menu by role |
| `resources/js/Components/Organisms/Navbar.jsx` | ⏳ Perlu update | Role badge |

---

## Implementasi Role Middleware

```php
// app/Http/Middleware/EnsureRole.php
public function handle(Request $request, Closure $next, string ...$roles): Response
{
    if (!in_array($request->user()?->role, $roles)) {
        abort(403);
    }
    return $next($request);
}
```

```php
// routes/web.php — contoh route groups
Route::middleware(['auth', 'role:admin'])->group(function () {
    Route::resource('users', UserController::class);
    Route::resource('products', ProductController::class);
    // ...
});

Route::middleware(['auth', 'role:kasir'])->group(function () {
    Route::get('/pos', [POSController::class, 'index']);
    // ...
});
```

---

## Inertia Shared Props

```php
// app/Http/Middleware/HandleInertiaRequests.php
public function share(Request $request): array
{
    return [
        ...parent::share($request),
        'auth' => [
            'user' => $request->user() ? [
                'id'   => $request->user()->id,
                'name' => $request->user()->name,
                'role' => $request->user()->role,
            ] : null,
        ],
    ];
}
```

---

## Verifikasi / Testing

1. Login admin → redirect `/dashboard`, menu lengkap tampil
2. Login kasir → redirect `/pos`, menu admin tidak muncul
3. Kasir akses `/users` → 403
4. Admin akses `/pos` → 403
5. Kasir checkout → stok berkurang, transaksi simpan `user_id`
6. Admin lihat laporan → semua transaksi muncul

---

## Urutan Pengerjaan

```
Fase 1 (Role) → Fase 2 (POS Kasir) → Fase 3 (Admin CRUD) → Fase 4 (Laporan)
```
