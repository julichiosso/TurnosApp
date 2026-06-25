"use client";

import { IconCheck } from "@/components/icons";

interface Props {
    message: string | null;
}

export default function Toast({ message }: Props) {
    if (!message) return null;

    return (
        <div
            style={{
                position: "fixed",
                top: 16,
                left: "50%",
                transform: "translateX(-50%)",
                zIndex: 100,
                background: "#22c55e",
                color: "#fff",
                fontSize: 14,
                fontWeight: 700,
                padding: "12px 20px",
                borderRadius: 16,
                boxShadow: "0 10px 25px rgba(0,0,0,0.4)",
                display: "flex",
                alignItems: "center",
                gap: 8,
                whiteSpace: "nowrap",
                animation: "slideDownFade 0.25s ease",
            }}
        >
            <IconCheck size={16} />
            {message}
        </div>
    );
}
