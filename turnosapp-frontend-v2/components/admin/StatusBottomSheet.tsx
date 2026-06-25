"use client";

import { Turno } from "@/types";
import BottomSheet from "@/components/BottomSheet";
import { IconCheck, IconXCircle, IconX } from "@/components/icons";

interface Props {
    turno: Turno | null;
    onClose: () => void;
    onChangeEstado: (id: number, estado: string) => void;
}

const ACCIONES = [
    { label: "Confirmar",  estado: "confirmado", bg: "#22c55e", icon: IconCheck },
    { label: "Completar",  estado: "completado", bg: "#888888", icon: IconCheck },
    { label: "Cancelar",   estado: "cancelado",  bg: "#e63946", icon: IconXCircle },
];

export default function StatusBottomSheet({ turno, onClose, onChangeEstado }: Props) {
    if (!turno) return null;

    return (
        <BottomSheet open={true} onClose={onClose}>
            <p style={{ fontSize: 10, fontWeight: 800, letterSpacing: 2, color: "#888", textTransform: "uppercase", marginBottom: 4 }}>
                Cambiar Estado
            </p>
            <p style={{ fontSize: 18, fontWeight: 800, textTransform: "uppercase", color: "#f5f5f5", marginBottom: 20 }}>
                {turno.nombreCliente}
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {ACCIONES.map(a => {
                    const Icon = a.icon;
                    const disabled = turno.estado === a.estado;
                    return (
                        <button
                            key={a.estado}
                            disabled={disabled}
                            onClick={() => { onChangeEstado(turno.id, a.estado); onClose(); }}
                            style={{
                                display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                                height: 52, borderRadius: 14, border: "none",
                                background: disabled ? "#1a1a1a" : a.bg,
                                color: disabled ? "#555" : "#fff",
                                fontWeight: 800, fontSize: 15,
                                cursor: disabled ? "not-allowed" : "pointer",
                                opacity: disabled ? 0.4 : 1,
                                transition: "opacity 0.15s",
                            }}
                        >
                            <Icon size={18} />
                            {a.label}
                        </button>
                    );
                })}

                <button
                    onClick={onClose}
                    style={{
                        display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                        height: 52, borderRadius: 14, background: "#1a1a1a",
                        border: "1px solid #2a2a2a", color: "#888",
                        fontWeight: 700, fontSize: 15, cursor: "pointer",
                        marginTop: 4,
                    }}
                >
                    <IconX size={16} /> Cerrar
                </button>
            </div>
        </BottomSheet>
    );
}
