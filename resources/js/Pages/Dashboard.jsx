import React from "react";
import DashboardTemplate from "@/Components/Templates/DashboardTemplate";
import SalesChart from "@/Components/Molecules/SalesChart";
import TopProductsChart from "@/Components/Molecules/TopProductsChart";

export default function Dashboard({ auth }) {
    const stats = [
        {
            title: "Total Penjualan Hari Ini",
            value: "Rp 1.250.000",
            trend: "+12% dari kemarin",
            icon: "payments",
        },
        {
            title: "Jumlah Transaksi",
            value: "45",
            trend: "+5 transaksi",
            icon: "receipt_long",
        },
        {
            title: "Produk Terjual",
            value: "128 pcs",
            trend: "Sangat Baik",
            icon: "inventory_2",
        },
        {
            title: "Estimasi Pendapatan",
            value: "Rp 980.000",
            trend: "Bersih setelah pajak",
            icon: "account_balance_wallet",
            variant: "primary",
        },
    ];

    const salesData = [
        { name: "Sen", sales: 4000 },
        { name: "Sel", sales: 3000 },
        { name: "Rab", sales: 5000 },
        { name: "Kam", sales: 2780 },
        { name: "Jum", sales: 1890 },
        { name: "Sab", sales: 2390 },
        { name: "Min", sales: 3490 },
    ];

    const topProducts = [
        { name: "Kopi Susu Gula Aren", sales: 450, color: "#f97316" },
        { name: "Matcha Latte", sales: 320, color: "#10b981" },
        { name: "Cokelat Panas", sales: 280, color: "#8b5cf6" },
        { name: "Croissant Bakar", sales: 190, color: "#3b82f6" },
        { name: "Blueberry Muffin", sales: 150, color: "#f43f5e" },
    ];

    return (
        <DashboardTemplate auth={auth} stats={stats}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <SalesChart data={salesData} />
                </div>

                <div>
                    <TopProductsChart products={topProducts} />
                </div>
            </div>
        </DashboardTemplate>
    );
}
