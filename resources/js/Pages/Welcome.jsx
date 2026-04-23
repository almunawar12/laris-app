import { Head, Link } from '@inertiajs/react';

export default function Welcome({ auth, laravelVersion, phpVersion }) {
    const features = [
        {
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                </svg>
            ),
            color: '#0369A1',
            bg: '#EFF6FF',
            title: 'Kasir Digital',
            desc: 'Proses transaksi dalam hitungan detik. Interface intuitif, cocok untuk kasir baru sekalipun.',
        },
        {
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
                </svg>
            ),
            color: '#059669',
            bg: '#ECFDF5',
            title: 'Manajemen Produk',
            desc: 'Tambah, edit, dan kategorikan produk dengan mudah. Pantau stok secara real-time.',
        },
        {
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
                </svg>
            ),
            color: '#7C3AED',
            bg: '#F5F3FF',
            title: 'Data Pelanggan',
            desc: 'Simpan data pelanggan dan riwayat pembelian. Bangun loyalitas dengan mudah.',
        },
        {
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
                </svg>
            ),
            color: '#EA580C',
            bg: '#FFF7ED',
            title: 'Laporan Penjualan',
            desc: 'Analisis performa bisnis harian hingga bulanan. Export laporan ke PDF dengan sekali klik.',
        },
        {
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" />
                </svg>
            ),
            color: '#0891B2',
            bg: '#ECFEFF',
            title: 'Riwayat Transaksi',
            desc: 'Semua transaksi tercatat lengkap dan aman. Cari, filter, dan cetak ulang struk kapan saja.',
        },
        {
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                </svg>
            ),
            color: '#BE185D',
            bg: '#FDF2F8',
            title: 'Multi-User & Pengaturan',
            desc: 'Atur peran kasir dan admin secara terpisah. Konfigurasi toko, pajak, dan preferensi bisnis.',
        },
    ];

    return (
        <>
            <Head title="Selamat Datang" />
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&display=swap');

                *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

                .w { font-family: 'DM Sans', sans-serif; background: #FFFFFF; color: #111827; min-height: 100vh; }

                /* ── NAV ── */
                .w-nav {
                    display: flex; align-items: center; justify-content: space-between;
                    padding: 0 48px; height: 68px;
                    border-bottom: 1px solid #F3F4F6;
                    background: rgba(255,255,255,0.92);
                    backdrop-filter: blur(8px);
                    position: sticky; top: 0; z-index: 50;
                }
                .w-nav-logo { display: flex; align-items: center; text-decoration: none; }
                .w-nav-logo img { height: 32px; width: auto; }
                .w-nav-links { display: flex; gap: 8px; align-items: center; }
                .w-btn-ghost {
                    padding: 8px 18px; border-radius: 8px; font-size: 14px; font-weight: 500;
                    text-decoration: none; color: #6B7280; transition: all 0.15s;
                    border: 1px solid transparent;
                }
                .w-btn-ghost:hover { color: #111827; background: #F9FAFB; border-color: #E5E7EB; }
                .w-btn-solid {
                    padding: 8px 20px; border-radius: 8px; font-size: 14px; font-weight: 600;
                    text-decoration: none; background: #F97316; color: #fff; transition: all 0.15s;
                    box-shadow: 0 1px 3px rgba(249,115,22,0.3);
                }
                .w-btn-solid:hover { background: #EA580C; box-shadow: 0 4px 12px rgba(249,115,22,0.35); transform: translateY(-1px); }

                /* ── HERO ── */
                .w-hero {
                    max-width: 1160px; margin: 0 auto;
                    padding: 88px 48px 72px;
                    display: grid; grid-template-columns: 1fr 1fr; gap: 64px; align-items: center;
                }
                .w-hero-left { display: flex; flex-direction: column; gap: 0; }
                .w-tag {
                    display: inline-flex; align-items: center; gap: 6px;
                    background: #FFF7ED; border: 1px solid #FED7AA;
                    border-radius: 999px; padding: 5px 14px;
                    font-size: 12px; font-weight: 600; color: #EA580C;
                    letter-spacing: 0.5px; margin-bottom: 24px; width: fit-content;
                    animation: fadeUp 0.5s ease both;
                }
                .w-tag-dot { width: 6px; height: 6px; border-radius: 50%; background: #F97316; }
                .w-h1 {
                    font-family: 'DM Serif Display', serif;
                    font-size: clamp(38px, 5vw, 58px);
                    font-weight: 400; line-height: 1.1; letter-spacing: -1px;
                    color: #0F172A; margin-bottom: 20px;
                    animation: fadeUp 0.5s 0.08s ease both;
                }
                .w-h1 em { font-style: italic; color: #0369A1; }
                .w-sub {
                    font-size: 17px; line-height: 1.7; color: #6B7280;
                    font-weight: 400; margin-bottom: 36px; max-width: 440px;
                    animation: fadeUp 0.5s 0.15s ease both;
                }
                .w-cta { display: flex; gap: 12px; flex-wrap: wrap; animation: fadeUp 0.5s 0.22s ease both; }
                .w-btn-cta-primary {
                    display: inline-flex; align-items: center; gap: 8px;
                    background: #F97316; color: #fff; font-weight: 600; font-size: 15px;
                    padding: 13px 28px; border-radius: 10px; text-decoration: none;
                    transition: all 0.2s; box-shadow: 0 2px 8px rgba(249,115,22,0.3);
                }
                .w-btn-cta-primary:hover { background: #EA580C; transform: translateY(-2px); box-shadow: 0 6px 20px rgba(249,115,22,0.35); }
                .w-btn-cta-secondary {
                    display: inline-flex; align-items: center; gap: 8px;
                    background: #fff; color: #374151; font-weight: 500; font-size: 15px;
                    padding: 13px 28px; border-radius: 10px; text-decoration: none;
                    border: 1px solid #E5E7EB; transition: all 0.2s;
                }
                .w-btn-cta-secondary:hover { border-color: #D1D5DB; background: #F9FAFB; transform: translateY(-2px); }

                /* ── HERO RIGHT: mock card ── */
                .w-hero-right { animation: fadeUp 0.5s 0.3s ease both; }
                .w-mock {
                    background: #F9FAFB; border: 1px solid #E5E7EB; border-radius: 20px;
                    padding: 28px; box-shadow: 0 4px 24px rgba(0,0,0,0.06);
                    position: relative; overflow: hidden;
                }
                .w-mock::before {
                    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px;
                    background: linear-gradient(90deg, #0369A1, #F97316);
                }
                .w-mock-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
                .w-mock-title { font-weight: 600; font-size: 14px; color: #374151; }
                .w-mock-badge {
                    background: #DCFCE7; color: #166534; font-size: 11px; font-weight: 600;
                    padding: 3px 10px; border-radius: 999px;
                }
                .w-mock-items { display: flex; flex-direction: column; gap: 10px; margin-bottom: 20px; }
                .w-mock-item {
                    display: flex; align-items: center; justify-content: space-between;
                    background: #fff; border: 1px solid #F3F4F6; border-radius: 10px; padding: 12px 16px;
                }
                .w-mock-item-name { font-size: 13px; font-weight: 500; color: #374151; }
                .w-mock-item-price { font-size: 13px; font-weight: 600; color: #0369A1; }
                .w-mock-divider { height: 1px; background: #E5E7EB; margin-bottom: 16px; }
                .w-mock-total { display: flex; justify-content: space-between; align-items: center; }
                .w-mock-total-label { font-size: 13px; color: #6B7280; }
                .w-mock-total-value { font-size: 20px; font-weight: 700; color: #0F172A; font-family: 'DM Serif Display', serif; }
                .w-mock-btn {
                    display: block; width: 100%; margin-top: 16px;
                    background: #F97316; color: #fff; text-align: center;
                    padding: 13px; border-radius: 10px; font-weight: 600; font-size: 14px;
                    border: none; cursor: pointer;
                }
                .w-mock-floating {
                    position: absolute; top: -12px; right: 24px;
                    background: #fff; border: 1px solid #E5E7EB; border-radius: 10px;
                    padding: 8px 14px; font-size: 12px; font-weight: 600; color: #059669;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.08);
                    display: flex; align-items: center; gap: 6px;
                }

                /* ── STATS ── */
                .w-stats {
                    background: #0369A1; margin: 0;
                    padding: 40px 48px;
                }
                .w-stats-inner {
                    max-width: 1160px; margin: 0 auto;
                    display: grid; grid-template-columns: repeat(3, 1fr); gap: 0;
                }
                .w-stat { text-align: center; padding: 8px 24px; position: relative; }
                .w-stat + .w-stat::before {
                    content: ''; position: absolute; left: 0; top: 10%; bottom: 10%;
                    width: 1px; background: rgba(255,255,255,0.2);
                }
                .w-stat-val { font-family: 'DM Serif Display', serif; font-size: 36px; color: #fff; margin-bottom: 4px; }
                .w-stat-label { font-size: 13px; color: rgba(255,255,255,0.7); font-weight: 400; }

                /* ── FEATURES ── */
                .w-features {
                    max-width: 1160px; margin: 0 auto;
                    padding: 88px 48px;
                }
                .w-features-head { text-align: center; margin-bottom: 56px; }
                .w-section-label {
                    display: inline-flex; align-items: center; gap: 8px;
                    font-size: 11px; font-weight: 700; letter-spacing: 2px;
                    text-transform: uppercase; color: #0369A1; margin-bottom: 16px;
                }
                .w-section-label::before, .w-section-label::after {
                    content: ''; flex: 1; height: 1px; background: #BFDBFE; width: 32px;
                }
                .w-h2 {
                    font-family: 'DM Serif Display', serif;
                    font-size: clamp(30px, 4vw, 42px);
                    font-weight: 400; color: #0F172A; line-height: 1.2; letter-spacing: -0.5px;
                    margin-bottom: 12px;
                }
                .w-h2 em { font-style: italic; color: #0369A1; }
                .w-h2-sub { font-size: 16px; color: #9CA3AF; max-width: 460px; margin: 0 auto; line-height: 1.6; }
                .w-features-grid {
                    display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px;
                }
                .w-feat-card {
                    background: #fff; border: 1px solid #F3F4F6; border-radius: 16px;
                    padding: 28px 24px; transition: all 0.2s;
                    box-shadow: 0 1px 4px rgba(0,0,0,0.04);
                }
                .w-feat-card:hover {
                    border-color: #E5E7EB;
                    box-shadow: 0 8px 24px rgba(0,0,0,0.08);
                    transform: translateY(-3px);
                }
                .w-feat-icon {
                    width: 44px; height: 44px; border-radius: 12px;
                    display: flex; align-items: center; justify-content: center;
                    margin-bottom: 16px;
                }
                .w-feat-title { font-weight: 600; font-size: 15px; color: #111827; margin-bottom: 8px; }
                .w-feat-desc { font-size: 13.5px; line-height: 1.65; color: #9CA3AF; }

                /* ── CTA BOTTOM ── */
                .w-cta-section { padding: 0 48px 88px; }
                .w-cta-inner {
                    max-width: 1160px; margin: 0 auto;
                    background: #F0F9FF; border: 1px solid #BAE6FD; border-radius: 24px;
                    padding: 72px 60px; text-align: center; position: relative; overflow: hidden;
                }
                .w-cta-deco {
                    position: absolute; border-radius: 50%; background: #0369A1; opacity: 0.05;
                }
                .w-cta-deco-1 { width: 300px; height: 300px; top: -100px; right: -80px; }
                .w-cta-deco-2 { width: 200px; height: 200px; bottom: -60px; left: -40px; }
                .w-cta-h { font-family: 'DM Serif Display', serif; font-size: clamp(28px, 4vw, 42px); color: #0F172A; margin-bottom: 12px; letter-spacing: -0.5px; position: relative; }
                .w-cta-h em { font-style: italic; color: #0369A1; }
                .w-cta-sub { font-size: 16px; color: #6B7280; margin-bottom: 36px; position: relative; }
                .w-cta-btns { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; position: relative; }

                /* ── FOOTER ── */
                .w-footer {
                    border-top: 1px solid #F3F4F6;
                    padding: 24px 48px;
                    display: flex; align-items: center; justify-content: space-between;
                    max-width: 1160px; margin: 0 auto;
                    flex-wrap: wrap; gap: 8px;
                }
                .w-footer-brand img { height: 26px; width: auto; opacity: 0.6; }
                .w-footer-meta { font-size: 12px; color: #D1D5DB; font-family: monospace; }

                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(16px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                @media (max-width: 900px) {
                    .w-nav { padding: 0 20px; }
                    .w-hero { grid-template-columns: 1fr; padding: 56px 24px 48px; gap: 40px; }
                    .w-hero-right { order: -1; }
                    .w-mock-floating { display: none; }
                    .w-stats { padding: 32px 24px; }
                    .w-stats-inner { grid-template-columns: 1fr; }
                    .w-stat + .w-stat::before { display: none; }
                    .w-stat { padding: 12px; border-top: 1px solid rgba(255,255,255,0.15); }
                    .w-features { padding: 56px 24px; }
                    .w-features-grid { grid-template-columns: 1fr; }
                    .w-cta-section { padding: 0 24px 56px; }
                    .w-cta-inner { padding: 48px 28px; }
                    .w-footer { padding: 20px 24px; justify-content: center; }
                }

                @media (min-width: 901px) and (max-width: 1100px) {
                    .w-features-grid { grid-template-columns: repeat(2, 1fr); }
                }
            `}</style>

            <div className="w">
                {/* Nav */}
                <nav className="w-nav">
                    <a href="/" className="w-nav-logo">
                        <img src="/images/laris-logo-tranparent.png" alt="Laris App" />
                    </a>
                    <div className="w-nav-links">
                        {auth.user ? (
                            <Link href={route('dashboard')} className="w-btn-solid">
                                Buka Dashboard →
                            </Link>
                        ) : (
                            <>
                                <Link href={route('login')} className="w-btn-ghost">Masuk</Link>
                                <Link href={route('register')} className="w-btn-solid">Mulai Gratis</Link>
                            </>
                        )}
                    </div>
                </nav>

                {/* Hero */}
                <section className="w-hero">
                    <div className="w-hero-left">
                        <div className="w-tag">
                            <span className="w-tag-dot" />
                            Aplikasi Kasir Modern untuk UMKM
                        </div>
                        <h1 className="w-h1">
                            Jual Lebih Cepat,<br />
                            <em>Kelola Lebih Mudah</em>
                        </h1>
                        <p className="w-sub">
                            Sistem POS berbasis web untuk toko dan UMKM Indonesia.
                            Transaksi kilat, laporan lengkap, stok terkontrol — semua dalam satu platform.
                        </p>
                        <div className="w-cta">
                            {auth.user ? (
                                <Link href={route('dashboard')} className="w-btn-cta-primary">
                                    Buka Dashboard
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" /></svg>
                                </Link>
                            ) : (
                                <>
                                    <Link href={route('register')} className="w-btn-cta-primary">
                                        Mulai Sekarang — Gratis
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" /></svg>
                                    </Link>
                                    <Link href={route('login')} className="w-btn-cta-secondary">
                                        Sudah punya akun? Masuk
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Mock POS UI */}
                    <div className="w-hero-right">
                        <div style={{ position: 'relative' }}>
                            <div className="w-mock-floating">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
                                Transaksi berhasil
                            </div>
                            <div className="w-mock">
                                <div className="w-mock-header">
                                    <span className="w-mock-title">Transaksi Baru</span>
                                    <span className="w-mock-badge">Kasir Aktif</span>
                                </div>
                                <div className="w-mock-items">
                                    {[
                                        { name: 'Kopi Susu', qty: '2×', price: 'Rp 30.000' },
                                        { name: 'Roti Bakar', qty: '1×', price: 'Rp 18.000' },
                                        { name: 'Es Teh Manis', qty: '3×', price: 'Rp 21.000' },
                                    ].map((item, i) => (
                                        <div key={i} className="w-mock-item">
                                            <span className="w-mock-item-name">
                                                <span style={{ color: '#9CA3AF', fontSize: '12px', marginRight: '8px' }}>{item.qty}</span>
                                                {item.name}
                                            </span>
                                            <span className="w-mock-item-price">{item.price}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="w-mock-divider" />
                                <div className="w-mock-total">
                                    <span className="w-mock-total-label">Total Pembayaran</span>
                                    <span className="w-mock-total-value">Rp 69.000</span>
                                </div>
                                <button className="w-mock-btn">Proses Pembayaran</button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Stats */}
                <div className="w-stats">
                    <div className="w-stats-inner">
                        {[
                            { val: '< 3 detik', label: 'Waktu proses per transaksi' },
                            { val: '100% Web', label: 'Tanpa instalasi, langsung pakai' },
                            { val: '24/7', label: 'Data tersimpan aman di cloud' },
                        ].map((s, i) => (
                            <div key={i} className="w-stat">
                                <div className="w-stat-val">{s.val}</div>
                                <div className="w-stat-label">{s.label}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Features */}
                <section className="w-features">
                    <div className="w-features-head">
                        <div className="w-section-label">Fitur Unggulan</div>
                        <h2 className="w-h2">
                            Semua yang kamu butuhkan<br />
                            untuk <em>bisnis yang laris</em>
                        </h2>
                        <p className="w-h2-sub">
                            Dari kasir hingga laporan, semua fitur dirancang untuk kemudahan sehari-hari.
                        </p>
                    </div>
                    <div className="w-features-grid">
                        {features.map((f, i) => (
                            <div key={i} className="w-feat-card">
                                <div className="w-feat-icon" style={{ background: f.bg, color: f.color }}>
                                    {f.icon}
                                </div>
                                <h3 className="w-feat-title">{f.title}</h3>
                                <p className="w-feat-desc">{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* CTA */}
                <div className="w-cta-section">
                    <div className="w-cta-inner">
                        <div className="w-cta-deco w-cta-deco-1" />
                        <div className="w-cta-deco w-cta-deco-2" />
                        <h2 className="w-cta-h">Siap <em>jualan lebih laris</em><br />mulai hari ini?</h2>
                        <p className="w-cta-sub">Daftar dalam 30 detik. Tidak perlu kartu kredit. Langsung bisa dipakai.</p>
                        <div className="w-cta-btns">
                            {auth.user ? (
                                <Link href={route('dashboard')} className="w-btn-cta-primary">
                                    Buka Dashboard →
                                </Link>
                            ) : (
                                <>
                                    <Link href={route('register')} className="w-btn-cta-primary">
                                        Buat Akun Sekarang — Gratis
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" /></svg>
                                    </Link>
                                    <Link href={route('login')} className="w-btn-cta-secondary">
                                        Sudah punya akun? Masuk
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <footer style={{ borderTop: '1px solid #F3F4F6', padding: '24px 48px' }}>
                    <div style={{ maxWidth: '1160px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                        <img src="/images/laris-logo-tranparent.png" alt="Laris App" style={{ height: '26px', opacity: 0.5 }} />
                        <span style={{ fontSize: '12px', color: '#D1D5DB', fontFamily: 'monospace' }}>
                            Laravel v{laravelVersion} · PHP v{phpVersion}
                        </span>
                    </div>
                </footer>
            </div>
        </>
    );
}
