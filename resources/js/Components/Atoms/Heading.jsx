import React from "react";

export default function Heading({ level = 2, children, className = "" }) {
    const Tag = `h${level}`;
    const baseStyles =
        {
            1: "text-4xl font-black tracking-tight",
            2: "text-3xl font-extrabold tracking-tight",
            3: "text-xl font-bold",
            4: "text-lg font-bold",
        }[level] || "text-base";

    return <Tag className={`${baseStyles} ${className}`}>{children}</Tag>;
}
