import { Link } from "@inertiajs/react";
import { usePage } from "@inertiajs/react";

export default function Sidebar({
    user,
    isSidebarOpen,
    setIsSidebarOpen,
    onLogoutClick,
}) {
    const { appSettings } = usePage().props;

    return (
        <>
            {/* Sidebar Overlay for Mobile */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                ></div>
            )}

            {/* SideNavBar */}
            <aside
                className={`fixed left-0 top-0 h-full w-64 z-50 bg-primary-100 flex flex-col gap-2 p-6 shadow-xl shadow-slate-200/50 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
                    isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                }`}
            >
                <div className="flex items-center justify-between mb-8 px-2">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 overflow-hidden flex items-center justify-center rounded-xl bg-primary-200/50">
                            {appSettings?.logo_url ? (
                                <img
                                    src={appSettings.logo_url}
                                    alt="Logo"
                                    className="w-full h-full object-contain"
                                />
                            ) : (
                                <img
                                    src="/images/laris-logo-tranparent.png"
                                    alt="Logo"
                                    className="w-full h-full object-contain"
                                />
                            )}
                        </div>
                        <div>
                            <h1 className="font-black text-lg tracking-tight text-primary-800 leading-none">
                                {appSettings?.store_name ?? "LARIS"}
                            </h1>
                            <p className="text-[10px] font-bold text-primary-600/70 tracking-wider">
                                Smart POS UMKM
                            </p>
                        </div>
                    </div>
                    {/* Close button for mobile */}
                    <button
                        onClick={() => setIsSidebarOpen(false)}
                        className="lg:hidden text-primary-800 hover:text-primary-600 focus:outline-none"
                    >
                        <span className="material-symbols-outlined text-2xl">
                            close
                        </span>
                    </button>
                </div>

                <nav className="flex flex-col gap-1 overflow-y-auto">
                    {user.role === "admin" && (
                        <Link
                            href={route("dashboard")}
                            className={`font-semibold rounded-xl px-4 py-3 flex items-center gap-3 active:scale-95 transition-transform ${
                                route().current("dashboard")
                                    ? "bg-primary-500 text-white shadow-lg shadow-primary-500/30"
                                    : "text-primary-800 hover:bg-primary-200"
                            }`}
                        >
                            <span className="material-symbols-outlined text-xl">
                                dashboard
                            </span>
                            <span className="text-sm">Dashboard</span>
                        </Link>
                    )}

                    {user.role === "kasir" && (
                        <Link
                            href={route("pos.index")}
                            className={`font-semibold rounded-xl px-4 py-3 flex items-center gap-3 active:scale-95 transition-transform ${
                                route().current("pos.*")
                                    ? "bg-primary-500 text-white shadow-lg shadow-primary-500/30"
                                    : "text-primary-800 hover:bg-primary-200"
                            }`}
                        >
                            <span className="material-symbols-outlined text-xl">
                                point_of_sale
                            </span>
                            <span className="text-sm">Kasir / POS</span>
                        </Link>
                    )}

                    <Link
                        href={route("transactions.index")}
                        className={`font-medium px-4 py-3 flex items-center gap-3 rounded-xl transition-all duration-200 active:scale-95 ${
                            route().current("transactions.*")
                                ? "bg-primary-500 text-white shadow-lg shadow-primary-500/30"
                                : "text-primary-800 hover:bg-primary-200"
                        }`}
                    >
                        <span className="material-symbols-outlined text-xl">
                            receipt_long
                        </span>
                        <span className="text-sm">Transaksi</span>
                    </Link>

                    <Link
                        href={route("products.index")}
                        className={`font-medium px-4 py-3 flex items-center gap-3 rounded-xl transition-all duration-200 active:scale-95 ${
                            route().current("products.*")
                                ? "bg-primary-500 text-white shadow-lg shadow-primary-500/30"
                                : "text-primary-800 hover:bg-primary-200"
                        }`}
                    >
                        <span className="material-symbols-outlined text-xl">
                            inventory_2
                        </span>
                        <span className="text-sm">Produk</span>
                    </Link>

                    <Link
                        href={route("categories.index")}
                        className={`font-medium px-4 py-3 flex items-center gap-3 rounded-xl transition-all duration-200 active:scale-95 ${
                            route().current("categories.*")
                                ? "bg-primary-500 text-white shadow-lg shadow-primary-500/30"
                                : "text-primary-800 hover:bg-primary-200"
                        }`}
                    >
                        <span className="material-symbols-outlined text-xl">
                            category
                        </span>
                        <span className="text-sm">Kategori</span>
                    </Link>

                    {user.role === "admin" && (
                        <>
                            <Link
                                href={route("users.index")}
                                className={`font-medium px-4 py-3 flex items-center gap-3 rounded-xl transition-all duration-200 active:scale-95 ${
                                    route().current("users.*")
                                        ? "bg-primary-500 text-white shadow-lg shadow-primary-500/30"
                                        : "text-primary-800 hover:bg-primary-200"
                                }`}
                            >
                                <span className="material-symbols-outlined text-xl">
                                    group
                                </span>
                                <span className="text-sm">Manajemen User</span>
                            </Link>

                            <Link
                                href={route("customers.index")}
                                className={`font-medium px-4 py-3 flex items-center gap-3 rounded-xl transition-all duration-200 active:scale-95 ${
                                    route().current("customers.*")
                                        ? "bg-primary-500 text-white shadow-lg shadow-primary-500/30"
                                        : "text-primary-800 hover:bg-primary-200"
                                }`}
                            >
                                <span className="material-symbols-outlined text-xl">
                                    person
                                </span>
                                <span className="text-sm">Pelanggan</span>
                            </Link>

                            <Link
                                href={route("settings.index")}
                                className={`font-medium px-4 py-3 flex items-center gap-3 rounded-xl transition-all duration-200 active:scale-95 ${
                                    route().current("settings.*")
                                        ? "bg-primary-500 text-white shadow-lg shadow-primary-500/30"
                                        : "text-primary-800 hover:bg-primary-200"
                                }`}
                            >
                                <span className="material-symbols-outlined text-xl">
                                    settings
                                </span>
                                <span className="text-sm">Pengaturan</span>
                            </Link>
                        </>
                    )}
                </nav>

                <div className="mt-auto p-4 bg-primary-50 rounded-2xl">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 rounded-full bg-primary-200 flex items-center justify-center text-primary-700 font-bold text-xs shadow-inner">
                            {user.name.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-primary-900 truncate">
                                {user.name}
                            </p>
                            <p className="text-[10px] text-primary-600 lowercase">
                                {user.email}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onLogoutClick}
                        className="w-full py-2 bg-white text-primary-700 hover:bg-primary-50 text-xs font-bold rounded-lg shadow-sm border border-primary-100 flex items-center justify-center gap-2 transition-colors"
                    >
                        <span className="material-symbols-outlined text-sm">
                            logout
                        </span>
                        Keluar
                    </button>
                </div>
            </aside>
        </>
    );
}
