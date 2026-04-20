import React from "react";
import StatCard from "@/Components/Molecules/StatCard";

export default function SummaryGrid({ stats = [] }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
                <StatCard key={index} {...stat} />
            ))}
        </div>
    );
}
