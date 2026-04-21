import React, { useState, useMemo } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm } from "@inertiajs/react";
import { toast } from "sonner";

export default function POSIndex({ auth, products, categories, customers }) {
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [cart, setCart] = useState([]);

    const { data, setData, post, processing, reset } = useForm({
        customer_id: "",
        items: [],
        payment_method: "cash",
        paid_amount: 0,
    });

    const filteredProducts = useMemo(() => {
        return products.filter((product) => {
            const matchesCategory = selectedCategory
                ? product.category_id === selectedCategory
                : true;
            const matchesSearch = product.name
                .toLowerCase()
                .includes(searchQuery.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    }, [products, selectedCategory, searchQuery]);

    const addToCart = (product) => {
        const existingItem = cart.find(
            (item) => item.product_id === product.id,
        );
        if (existingItem) {
            if (existingItem.quantity >= product.stock) {
                toast.error("Stok tidak mencukupi");
                return;
            }
            setCart(
                cart.map((item) =>
                    item.product_id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item,
                ),
            );
        } else {
            setCart([
                ...cart,
                {
                    product_id: product.id,
                    name: product.name,
                    price: product.price,
                    quantity: 1,
                    stock: product.stock,
                },
            ]);
        }
    };

    const updateQuantity = (productId, delta) => {
        setCart(
            cart
                .map((item) => {
                    if (item.product_id === productId) {
                        const newQty = item.quantity + delta;
                        if (newQty > item.stock) {
                            toast.error("Stok tidak mencukupi");
                            return item;
                        }
                        return newQty > 0
                            ? { ...item, quantity: newQty }
                            : null;
                    }
                    return item;
                })
                .filter(Boolean),
        );
    };

    const removeFromCart = (productId) => {
        setCart(cart.filter((item) => item.product_id !== productId));
    };

    const total = cart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
    );

    const handleCheckout = (e) => {
        e.preventDefault();
        if (cart.length === 0) {
            toast.error("Keranjang kosong");
            return;
        }

        if (data.paid_amount < total) {
            toast.error("Pembayaran kurang");
            return;
        }

        post(route("pos.checkout"), {
            data: {
                ...data,
                items: cart,
            },
            onSuccess: () => {
                setCart([]);
                reset();
                toast.success("Transaksi berhasil!");
            },
        });
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="POS - Kasir" />

            <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-160px)]">
                {/* Product Selection Section */}
                <div className="flex-1 flex flex-col gap-4 overflow-hidden">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                                search
                            </span>
                            <input
                                type="text"
                                placeholder="Cari produk..."
                                className="w-full pl-10 pr-4 py-2 rounded-xl border-slate-200 focus:ring-primary-500 focus:border-primary-500"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-2 overflow-x-auto pb-2 min-w-0">
                            <button
                                onClick={() => setSelectedCategory(null)}
                                className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-colors ${
                                    selectedCategory === null
                                        ? "bg-primary-600 text-white"
                                        : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                                }`}
                            >
                                Semua
                            </button>
                            {categories.map((cat) => (
                                <button
                                    key={cat.id}
                                    onClick={() => setSelectedCategory(cat.id)}
                                    className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-colors ${
                                        selectedCategory === cat.id
                                            ? "bg-primary-600 text-white"
                                            : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                                    }`}
                                >
                                    {cat.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 overflow-y-auto pr-2">
                        {filteredProducts.map((product) => (
                            <div
                                key={product.id}
                                onClick={() => addToCart(product)}
                                className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all cursor-pointer group active:scale-95"
                            >
                                <div className="aspect-square bg-slate-50 rounded-xl mb-3 flex items-center justify-center text-slate-300">
                                    <span className="material-symbols-outlined text-4xl group-hover:scale-110 transition-transform">
                                        image
                                    </span>
                                </div>
                                <h3 className="font-bold text-slate-800 text-sm mb-1 truncate">
                                    {product.name}
                                </h3>
                                <p className="text-primary-600 font-black text-sm">
                                    Rp{" "}
                                    {new Intl.NumberFormat("id-ID").format(
                                        product.price,
                                    )}
                                </p>
                                <p className="text-[10px] text-slate-400 mt-1">
                                    Stok: {product.stock}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Cart Section */}
                <div className="w-full lg:w-96 bg-white rounded-2xl border border-slate-200 flex flex-col shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                        <h2 className="font-black text-slate-800">Keranjang</h2>
                        <span className="bg-primary-100 text-primary-700 px-2 py-1 rounded-lg text-xs font-bold">
                            {cart.length} Item
                        </span>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {cart.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-2 opacity-60">
                                <span className="material-symbols-outlined text-4xl">
                                    shopping_basket
                                </span>
                                <p className="text-xs font-medium">
                                    Keranjang masih kosong
                                </p>
                            </div>
                        ) : (
                            cart.map((item) => (
                                <div
                                    key={item.product_id}
                                    className="flex gap-3"
                                >
                                    <div className="flex-1">
                                        <h4 className="text-sm font-bold text-slate-800 truncate">
                                            {item.name}
                                        </h4>
                                        <p className="text-xs text-slate-500">
                                            Rp{" "}
                                            {new Intl.NumberFormat(
                                                "id-ID",
                                            ).format(item.price)}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() =>
                                                updateQuantity(
                                                    item.product_id,
                                                    -1,
                                                )
                                            }
                                            className="w-6 h-6 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-slate-50"
                                        >
                                            -
                                        </button>
                                        <span className="text-sm font-bold w-4 text-center">
                                            {item.quantity}
                                        </span>
                                        <button
                                            onClick={() =>
                                                updateQuantity(
                                                    item.product_id,
                                                    1,
                                                )
                                            }
                                            className="w-6 h-6 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-slate-50"
                                        >
                                            +
                                        </button>
                                        <button
                                            onClick={() =>
                                                removeFromCart(item.product_id)
                                            }
                                            className="ml-2 text-red-400 hover:text-red-600"
                                        >
                                            <span className="material-symbols-outlined text-sm">
                                                delete
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    <div className="p-4 bg-slate-50 border-t border-slate-100 space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="text-slate-500 font-medium">
                                Total
                            </span>
                            <span className="text-xl font-black text-slate-900 font-mono">
                                Rp{" "}
                                {new Intl.NumberFormat("id-ID").format(total)}
                            </span>
                        </div>

                        <div className="space-y-2 pt-2 border-t border-slate-200">
                            <div className="flex flex-col gap-1">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                    Pelanggan (Opsional)
                                </label>
                                <select
                                    className="w-full text-xs rounded-lg border-slate-200 focus:ring-primary-500 focus:border-primary-500"
                                    value={data.customer_id}
                                    onChange={(e) =>
                                        setData("customer_id", e.target.value)
                                    }
                                >
                                    <option value="">Guest / Umum</option>
                                    {customers.map((c) => (
                                        <option key={c.id} value={c.id}>
                                            {c.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                    Bayar Tunai
                                </label>
                                <input
                                    type="number"
                                    className="w-full text-sm font-mono font-bold rounded-lg border-slate-200 focus:ring-primary-500 focus:border-primary-500"
                                    placeholder="Masukkan nominal..."
                                    value={data.paid_amount}
                                    onChange={(e) =>
                                        setData("paid_amount", e.target.value)
                                    }
                                />
                            </div>

                            {data.paid_amount >= total && (
                                <div className="flex justify-between items-center text-xs text-green-600 font-bold bg-green-50 p-2 rounded-lg">
                                    <span>Kembalian:</span>
                                    <span>
                                        Rp{" "}
                                        {new Intl.NumberFormat("id-ID").format(
                                            data.paid_amount - total,
                                        )}
                                    </span>
                                </div>
                            )}

                            <button
                                onClick={handleCheckout}
                                disabled={processing || cart.length === 0}
                                className="w-full py-3 bg-primary-600 hover:bg-primary-700 disabled:bg-slate-300 text-white font-black rounded-xl shadow-lg shadow-primary-600/20 transition-all active:scale-95 mt-2"
                            >
                                {processing
                                    ? "Memproses..."
                                    : "PROSES TRANSAKSI"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
