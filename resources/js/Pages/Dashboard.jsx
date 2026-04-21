import React from "react";
import DashboardTemplate from "@/Components/Templates/DashboardTemplate";
import SalesChart from "@/Components/Molecules/SalesChart";
import TopProductsChart from "@/Components/Molecules/TopProductsChart";

export default function Dashboard({ auth, stats, salesData, topProducts }) {
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
