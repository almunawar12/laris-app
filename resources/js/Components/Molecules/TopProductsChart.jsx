import React from "react";

export default function TopProductsChart({ products }) {
    return (
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col h-full">
            <h3 className="text-xl font-bold text-slate-900 mb-2 leading-tight">
                Produk Terlaris
            </h3>
            <p className="text-sm text-slate-500 font-medium mb-8">
                Persentase kontribusi item
            </p>

            <div className="flex-1 space-y-6">
                {products.map((product, index) => (
                    <div key={index} className="group cursor-default">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-bold text-slate-700 group-hover:text-primary-600 transition-colors">
                                {product.name}
                            </span>
                            <span className="text-xs font-black text-slate-900 bg-slate-50 px-2 py-1 rounded-md">
                                {product.sales}
                            </span>
                        </div>
                        <div className="w-full bg-slate-50 h-2 rounded-full overflow-hidden">
                            <div
                                className="h-full rounded-full group-hover:opacity-80 transition-all duration-1000"
                                style={{
                                    width: `${(product.sales / 500) * 100}%`,
                                    backgroundColor: product.color,
                                }}
                            ></div>
                        </div>
                    </div>
                ))}
            </div>

            <button className="w-full mt-8 py-3 bg-slate-50 hover:bg-primary-50 text-slate-600 hover:text-primary-600 font-bold text-xs rounded-xl transition-all border border-slate-100 border-dashed hover:border-primary-200">
                Lihat Laporan Lengkap
            </button>
        </div>
    );
}
