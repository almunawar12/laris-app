import React, { useState, useMemo, useEffect } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm } from "@inertiajs/react";
import { toast } from "sonner";
import SearchableSelect from "@/Components/SearchableSelect";
import Modal from "@/Components/Modal";

export default function POSIndex({ auth, products, categories, customers }) {
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [cart, setCart] = useState([]);
    const [showAddCustomer, setShowAddCustomer] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);

    const { data, setData, post, processing, reset } = useForm({
        customer_id: "",
        items: [],
        payment_method: "cash",
        paid_amount: "",
    });

    useEffect(() => {
        setData("items", cart);
    }, [cart]);

    const {
        data: customerForm,
        setData: setCustomerForm,
        post: postCustomer,
        processing: customerProcessing,
        errors: customerErrors,
        reset: resetCustomerForm,
    } = useForm({ name: "", phone: "" });

    const handleAddCustomer = (e) => {
        e.preventDefault();
        postCustomer(route("pos.customers.store"), {
            onSuccess: () => {
                toast.success("Pelanggan berhasil ditambahkan!");
                resetCustomerForm();
                setShowAddCustomer(false);
            },
            onError: () => {
                toast.error("Gagal menyimpan pelanggan.");
            },
        });
    };

    const filteredProducts = useMemo(() => {
        return products.filter((product) => {
            const matchesCategory = selectedCategory
                ? product.category_id === selectedCategory
                : true;
            const matchesSearch = (product.name || "")
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

    useEffect(() => {
        if (data.payment_method === "qris") {
            setData("paid_amount", total);
        }
    }, [data.payment_method, total]);

    const openPaymentModal = () => {
        if (cart.length === 0) {
            toast.error("Keranjang kosong");
            return;
        }
        setShowPaymentModal(true);
    };

    const handleCheckout = (e) => {
        e.preventDefault();

        if (data.payment_method === "cash" && Number(data.paid_amount) < total) {
            toast.error("Nominal pembayaran kurang");
            return;
        }

        post(route("pos.checkout"), {
            onSuccess: () => {
                setCart([]);
                reset();
                setShowPaymentModal(false);
                toast.success("Transaksi berhasil!");
            },
            onError: (errors) => {
                toast.error(Object.values(errors)[0] || "Transaksi gagal");
            },
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
        >
            <Head title="POS - Kasir" />

            <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-160px)]">
                {/* Product Selection Section */}
                <div className="flex-1 flex flex-col gap-4 overflow-hidden">
                    <div className="flex flex-col md:flex-row gap-4">
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
                                <div className="flex items-center justify-between">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                        Pelanggan (Opsional)
                                    </label>
                                    <button
                                        type="button"
                                        onClick={() => setShowAddCustomer(true)}
                                        className="flex items-center gap-1 text-[10px] font-bold text-primary-600 hover:text-primary-700 transition-colors"
                                    >
                                        <span className="material-symbols-outlined text-sm">
                                            person_add
                                        </span>
                                        Tambah
                                    </button>
                                </div>
                                <SearchableSelect
                                    options={customers.map((c) => ({
                                        value: c.id,
                                        label: c.name,
                                    }))}
                                    value={data.customer_id}
                                    onChange={(val) =>
                                        setData("customer_id", val)
                                    }
                                    placeholder="Cari pelanggan..."
                                    placement="top"
                                />
                            </div>

                            <button
                                onClick={openPaymentModal}
                                disabled={cart.length === 0}
                                className="w-full py-3 bg-primary-600 hover:bg-primary-700 disabled:bg-slate-300 text-white font-black rounded-xl shadow-lg shadow-primary-600/20 transition-all active:scale-95 mt-2"
                            >
                                PROSES TRANSAKSI
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Payment Modal */}
            <Modal
                show={showPaymentModal}
                maxWidth="md"
                onClose={() => setShowPaymentModal(false)}
            >
                <form onSubmit={handleCheckout} className="p-6">
                    <div className="flex items-center justify-between mb-5">
                        <h2 className="text-lg font-black text-slate-800">
                            Detail Pembayaran
                        </h2>
                        <button
                            type="button"
                            onClick={() => setShowPaymentModal(false)}
                            className="text-slate-400 hover:text-slate-600 transition-colors"
                        >
                            <span className="material-symbols-outlined">close</span>
                        </button>
                    </div>

                    {/* Items */}
                    <div className="bg-slate-50 rounded-xl p-4 space-y-2 max-h-48 overflow-y-auto mb-4">
                        {cart.map((item) => (
                            <div key={item.product_id} className="flex justify-between items-center text-sm">
                                <span className="text-slate-700 font-medium truncate flex-1 mr-2">
                                    {item.name}
                                    <span className="text-slate-400 ml-1">×{item.quantity}</span>
                                </span>
                                <span className="font-bold text-slate-800 font-mono whitespace-nowrap">
                                    Rp {new Intl.NumberFormat("id-ID").format(item.price * item.quantity)}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Total */}
                    <div className="flex justify-between items-center py-3 border-t border-b border-slate-200 mb-5">
                        <span className="font-bold text-slate-600">Total</span>
                        <span className="text-2xl font-black text-slate-900 font-mono">
                            Rp {new Intl.NumberFormat("id-ID").format(total)}
                        </span>
                    </div>

                    {/* Payment Method */}
                    <div className="mb-4">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                            Metode Pembayaran
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                            <button
                                type="button"
                                onClick={() => setData({ ...data, payment_method: "cash", paid_amount: "" })}
                                className={`flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm border-2 transition-all ${
                                    data.payment_method === "cash"
                                        ? "bg-primary-600 border-primary-600 text-white shadow-md shadow-primary-600/20"
                                        : "bg-white border-slate-200 text-slate-600 hover:border-primary-300"
                                }`}
                            >
                                <span className="material-symbols-outlined text-lg">payments</span>
                                Cash
                            </button>
                            <button
                                type="button"
                                onClick={() => setData("payment_method", "qris")}
                                className={`flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm border-2 transition-all ${
                                    data.payment_method === "qris"
                                        ? "bg-primary-600 border-primary-600 text-white shadow-md shadow-primary-600/20"
                                        : "bg-white border-slate-200 text-slate-600 hover:border-primary-300"
                                }`}
                            >
                                <span className="material-symbols-outlined text-lg">qr_code_2</span>
                                QRIS
                            </button>
                        </div>
                    </div>

                    {/* Nominal — cash only */}
                    {data.payment_method === "cash" && (
                        <div className="space-y-3 mb-4">
                            <div className="flex flex-col gap-1">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                    Nominal Bayar
                                </label>
                                <input
                                    type="number"
                                    className="w-full text-lg font-mono font-black rounded-xl border-slate-200 focus:ring-primary-500 focus:border-primary-500"
                                    placeholder="Masukkan nominal..."
                                    value={data.paid_amount}
                                    onChange={(e) => setData("paid_amount", e.target.value)}
                                    autoFocus
                                />
                            </div>

                            {data.paid_amount !== "" && Number(data.paid_amount) >= total && (
                                <div className="flex justify-between items-center text-sm text-green-600 font-bold bg-green-50 px-4 py-3 rounded-xl">
                                    <span>Kembalian</span>
                                    <span className="font-mono text-lg">
                                        Rp {new Intl.NumberFormat("id-ID").format(Number(data.paid_amount) - total)}
                                    </span>
                                </div>
                            )}
                        </div>
                    )}

                    {data.payment_method === "qris" && (
                        <div className="flex justify-between items-center text-sm text-blue-600 font-bold bg-blue-50 px-4 py-3 rounded-xl mb-4">
                            <span>Total QRIS</span>
                            <span className="font-mono text-lg">
                                Rp {new Intl.NumberFormat("id-ID").format(total)}
                            </span>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full py-3 bg-primary-600 hover:bg-primary-700 disabled:bg-slate-300 text-white font-black rounded-xl shadow-lg shadow-primary-600/20 transition-all active:scale-95"
                    >
                        {processing ? "Memproses..." : "KONFIRMASI PEMBAYARAN"}
                    </button>
                </form>
            </Modal>

            <Modal
                show={showAddCustomer}
                maxWidth="sm"
                onClose={() => setShowAddCustomer(false)}
            >
                <form onSubmit={handleAddCustomer} className="p-6">
                    <div className="flex items-center justify-between mb-5">
                        <h2 className="text-lg font-black text-slate-800">
                            Tambah Pelanggan
                        </h2>
                        <button
                            type="button"
                            onClick={() => setShowAddCustomer(false)}
                            className="text-slate-400 hover:text-slate-600 transition-colors"
                        >
                            <span className="material-symbols-outlined">
                                close
                            </span>
                        </button>
                    </div>

                    <div className="space-y-4">
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-bold text-slate-500">
                                Nama Pelanggan <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                className="w-full rounded-xl border-slate-200 focus:ring-primary-500 focus:border-primary-500 text-sm"
                                placeholder="Masukkan nama..."
                                value={customerForm.name}
                                onChange={(e) =>
                                    setCustomerForm("name", e.target.value)
                                }
                                required
                            />
                            {customerErrors.name && (
                                <p className="text-xs text-red-500 font-medium">
                                    {customerErrors.name}
                                </p>
                            )}
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-bold text-slate-500">
                                No. Telepon (Opsional)
                            </label>
                            <input
                                type="tel"
                                className="w-full rounded-xl border-slate-200 focus:ring-primary-500 focus:border-primary-500 text-sm"
                                placeholder="Masukkan nomor..."
                                value={customerForm.phone}
                                onChange={(e) =>
                                    setCustomerForm("phone", e.target.value)
                                }
                            />
                            {customerErrors.phone && (
                                <p className="text-xs text-red-500 font-medium">
                                    {customerErrors.phone}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={() => setShowAddCustomer(false)}
                            className="px-4 py-2 text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={customerProcessing}
                            className="px-5 py-2 text-sm font-bold text-white bg-primary-600 hover:bg-primary-700 disabled:bg-slate-300 rounded-xl shadow-sm shadow-primary-600/20 transition-colors"
                        >
                            {customerProcessing ? "Menyimpan..." : "Simpan"}
                        </button>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}
