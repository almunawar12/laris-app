import React from "react";

export default function Icon({ name, className = "", fill = false }) {
    return (
        <span
            className={`material-symbols-outlined ${className}`}
            style={{ fontVariationSettings: `'FILL' ${fill ? 1 : 0}` }}
        >
            {name}
        </span>
    );
}
