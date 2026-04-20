import React from "react";
import Icon from "../Atoms/Icon";

export default function StatCard({
    title,
    value,
    trend,
    icon,
    variant = "white",
}) {
    const isPrimary = variant === "primary";

    return (
        <div
            className={`${isPrimary ? "bg-orange-600 text-white shadow-xl shadow-orange-600/20" : "bg-white text-slate-900 border border-slate-100 shadow-sm"} p-6 rounded-xl relative overflow-hidden group`}
        >
            <div className="relative z-10">
                <p
                    className={`text-xs font-bold uppercase tracking-wider mb-2 ${isPrimary ? "text-white/70" : "text-slate-500"}`}
                >
                    {title}
                </p>
                <h3 className="text-2xl font-extrabold mb-1">{value}</h3>
                {trend && (
                    <p
                        className={`text-xs font-semibold flex items-center gap-1 ${isPrimary ? "text-white/80" : "text-green-600"}`}
                    >
                        {!isPrimary && (
                            <Icon name="trending_up" className="text-sm" />
                        )}
                        {trend}
                    </p>
                )}
            </div>
            <div
                className={`absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform ${isPrimary ? "text-white" : "text-orange-600"}`}
            >
                <Icon name={icon} className="text-8xl" fill={true} />
            </div>
        </div>
    );
}
