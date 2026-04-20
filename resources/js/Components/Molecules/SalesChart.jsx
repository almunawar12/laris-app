import React from "react";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

export default function SalesChart({ data }) {
    return (
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 h-full">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h3 className="text-xl font-bold text-slate-900 leading-tight">
                        Grafik Penjualan 7 Hari Terakhir
                    </h3>
                    <p className="text-sm text-slate-500 font-medium">
                        Tren omzet harian bisnis Anda
                    </p>
                </div>
                <div className="flex gap-2">
                    <span className="flex items-center gap-1.5 text-xs font-bold text-primary-600 bg-primary-50 px-3 py-1.5 rounded-lg border border-primary-100">
                        <span className="w-2 h-2 rounded-full bg-primary-600"></span>
                        Penjualan
                    </span>
                </div>
            </div>

            <div className="h-72 w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient
                                id="colorSales"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                            >
                                <stop
                                    offset="5%"
                                    stopColor="#f97316"
                                    stopOpacity={0.2}
                                />
                                <stop
                                    offset="95%"
                                    stopColor="#f97316"
                                    stopOpacity={0}
                                />
                            </linearGradient>
                        </defs>
                        <CartesianGrid
                            strokeDasharray="3 3"
                            vertical={false}
                            stroke="#f1f5f9"
                        />
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{
                                fill: "#94a3b8",
                                fontSize: 12,
                                fontWeight: 600,
                            }}
                            dy={10}
                        />
                        <YAxis hide />
                        <Tooltip
                            contentStyle={{
                                borderRadius: "16px",
                                border: "none",
                                boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                                padding: "12px 16px",
                            }}
                            itemStyle={{ fontWeight: 800, color: "#f97316" }}
                            cursor={{
                                stroke: "#f97316",
                                strokeWidth: 2,
                                strokeDasharray: "5 5",
                            }}
                        />
                        <Area
                            type="monotone"
                            dataKey="sales"
                            stroke="#f97316"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorSales)"
                            animationDuration={1500}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
