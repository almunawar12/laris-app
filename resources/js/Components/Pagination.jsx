import { Link } from "@inertiajs/react";

export default function Pagination({ links, total, perPage = 10, onPerPageChange }) {
    if (links.length === 0) return null;

    return (
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 bg-white border-t border-slate-100">
            {/* Per Page Selector & Info */}
            <div className="flex items-center gap-4 order-2 md:order-1">
                <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Tampilkan:</span>
                    <select
                        value={perPage}
                        onChange={(e) => onPerPageChange(e.target.value)}
                        className="text-xs font-bold text-slate-600 bg-slate-50 border-slate-200 rounded-lg focus:ring-primary-500 focus:border-primary-500 py-1 pl-2 pr-8 transition-all"
                    >
                        {[10, 25, 50, 100].map(val => (
                            <option key={val} value={val}>{val}</option>
                        ))}
                    </select>
                </div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest hidden sm:block">
                    Total: <span className="text-slate-900">{total}</span> Data
                </div>
            </div>

            {/* Navigation Links */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 order-1 md:order-2">
                {links.length > 3 && links.map((link, index) => {
                    if (link.url === null) {
                        return (
                            <div
                                key={index}
                                className="px-3 py-1.5 text-xs text-slate-300 border border-transparent rounded-lg cursor-not-allowed select-none"
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        );
                    }

                    return (
                        <Link
                            key={index}
                            href={link.url}
                            className={`px-3 py-1.5 text-xs rounded-lg transition-all duration-200 ${
                                link.active
                                    ? "bg-primary-600 text-white font-black shadow-lg shadow-primary-600/20 z-10"
                                    : "bg-white text-slate-500 border border-slate-100 hover:border-slate-300 hover:text-slate-800 hover:bg-slate-50"
                            }`}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    );
                })}
            </div>
        </div>
    );
}
