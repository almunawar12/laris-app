export default function Navbar({ setIsSidebarOpen }) {
    return (
        <header className="sticky top-0 w-full z-30 bg-white/80 backdrop-blur-xl flex justify-between items-center px-4 md:px-8 py-4 border-b border-slate-100">
            <div className="flex items-center gap-4 flex-1">
                {/* Hamburger Menu Button */}
                <button
                    onClick={() => setIsSidebarOpen(true)}
                    className="lg:hidden p-2 rounded-xl text-slate-500 hover:bg-primary-50 hover:text-primary-600 focus:outline-none transition-colors flex items-center justify-center"
                >
                    <span className="material-symbols-outlined text-2xl">
                        menu
                    </span>
                </button>

                <div className="relative w-full max-w-md hidden md:block">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">
                        search
                    </span>
                    <input
                        className="w-full bg-slate-50 border-none rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary-500 transition-all"
                        placeholder="Cari transaksi atau produk..."
                        type="text"
                    />
                </div>
            </div>
            <div className="flex items-center gap-4 md:gap-6">
                <div className="hidden md:flex items-center gap-2 text-slate-500 cursor-pointer hover:text-primary-600 transition-colors">
                    <span className="material-symbols-outlined text-2xl">
                        notifications
                    </span>
                    <div className="w-2 h-2 bg-primary-600 rounded-full -ml-4 -mt-3 ring-2 ring-white"></div>
                </div>
                <div className="hidden md:block h-8 w-[1px] bg-slate-100"></div>
                <div className="flex items-center gap-3">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-bold text-slate-900">
                            Kedai UMK Laris
                        </p>
                        <div className="flex items-center justify-end gap-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                            <p className="text-[10px] text-green-600 font-bold uppercase tracking-wider">
                                Online
                            </p>
                        </div>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center text-primary-600 shadow-sm border border-primary-100">
                        <span className="material-symbols-outlined text-2xl">
                            store
                        </span>
                    </div>
                </div>
            </div>
        </header>
    );
}
