"use client";

import { Turno } from "@/types";
import { IconGear, IconPhone, IconClockSmall } from "@/components/icons";

interface Props {
    turno: Turno;
    onStatusPress?: (turno: Turno) => void;
    compact?: boolean;
}

const ESTADO_STYLE: Record<string, { bg: string; color: string; label: string }> = {
    pendiente:  { bg: "#f59e0b18", color: "#f59e0b", label: "PENDIENTE" },
    confirmado: { bg: "#22c55e18", color: "#22c55e", label: "CONFIRMADO" },
    cancelado:  { bg: "#e6394618", color: "#e63946", label: "CANCELADO" },
    completado: { bg: "#88888818", color: "#888888", label: "COMPLETADO" },
};

export default function TurnoCard({ turno, onStatusPress, compact }: Props) {
    const est = ESTADO_STYLE[turno.estado] ?? ESTADO_STYLE.pendiente;

    return (
        <div style={{
            display: "flex", alignItems: "center", gap: 14,
            background: "#1a1a1a", border: "1px solid #2a2a2a",
            borderRadius: 14, padding: compact ? "10px 14px" : "14px 16px",
        }}>
            {/* Hora block */}
            <div style={{
                minWidth: 64, background: "#141414", borderLeft: "3px solid #e63946",
                borderRadius: 10, padding: "10px 12px", textAlign: "center", flexShrink: 0,
            }}>
                <div style={{ fontSize: 9, fontWeight: 800, color: "#888", letterSpacing: 1, textTransform: "uppercase" }}>
                    HORA
                </div>
                <div style={{ fontSize: compact ? 18 : 22, fontWeight: 800, color: "#f5f5f5", lineHeight: 1.1, marginTop: 2 }}>
                    {turno.hora}
                </div>
            </div>

            {/* Info */}
            <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                    fontSize: 15, fontWeight: 800, color: "#f5f5f5",
                    textTransform: "uppercase", whiteSpace: "nowrap",
                    overflow: "hidden", textOverflow: "ellipsis",
                }}>
                    {turno.nombreCliente}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 4, fontSize: 12, color: "#e63946" }}>
                    <IconGear size={13} className="text-[#e63946]" />
                    <span>{turno.servicio?.nombre}</span>
                    <span style={{ color: "#555", margin: "0 2px" }}>·</span>
                    <IconClockSmall size={12} className="text-[#e63946]" />
                    <span>{turno.servicio?.duracion} min</span>
                </div>
                {turno.telefonoCliente && (
                    <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 3, fontSize: 12, color: "#888" }}>
                        <IconPhone size={13} className="text-[#888]" />
                        <span>{turno.telefonoCliente}</span>
                    </div>
                )}
            </div>

            {/* Status badge */}
            <button
                onClick={() => onStatusPress?.(turno)}
                style={{
                    background: est.bg, color: est.color,
                    border: "none", borderRadius: 8,
                    padding: "6px 10px", fontSize: 11, fontWeight: 700,
                    fontFamily: "monospace", letterSpacing: 1,
                    cursor: onStatusPress ? "pointer" : "default",
                    flexShrink: 0, lineHeight: 1.2,
                }}
            >
                {est.label}
            </button>
        </div>
    );
}
