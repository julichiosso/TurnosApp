"use client";

import { useEffect, useState, useCallback } from "react";
import { getTurnos, updateEstadoTurno } from "@/lib/api";
import { getToken } from "@/lib/auth";
import { Turno } from "@/types";
import TurnoCard from "@/components/admin/TurnoCard";
import StatusBottomSheet from "@/components/admin/StatusBottomSheet";
import { IconCalendar, IconChevronLeft, IconChevronRight, IconCalendarX, IconLoader } from "@/components/icons";

const PAGE_SIZE = 8;

export default function TurnosPage() {
    const [fecha, setFecha] = useState(new Date().toISOString().split("T")[0]);
    const [turnos, setTurnos] = useState<Turno[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [selectedTurno, setSelectedTurno] = useState<Turno | null>(null);

    const load = useCallback(async () => {
        const token = getToken();
        if (!token) return;
        setLoading(true);
        try {
            const data = await getTurnos(token, fecha);
            setTurnos(data.sort((a, b) => a.hora.localeCompare(b.hora)));
            setPage(0);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }, [fecha]);

    useEffect(() => { load(); }, [load]);

    const handleChangeEstado = async (id: number, estado: string) => {
        setTurnos(prev =>
            prev.map(t => t.id === id ? { ...t, estado: estado as Turno["estado"] } : t)
        );
        try {
            const token = getToken();
            if (token) await updateEstadoTurno(token, id, estado);
        } catch {
            load();
        }
    };

    const cambiarDia = (offset: number) => {
        const d = new Date(fecha + "T12:00:00");
        d.setDate(d.getDate() + offset);
        setFecha(d.toISOString().split("T")[0]);
    };

    const totalPages = Math.ceil(turnos.length / PAGE_SIZE);
    const paged = turnos.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {/* Header + Date Nav */}
            <div>
                <h1 style={{ fontSize: 24, fontWeight: 900, textTransform: "uppercase", letterSpacing: "-0.05em", fontStyle: "italic" }}>
                    Agenda <span style={{ color: "#e63946" }}>del Día</span>
                </h1>
                {/* Date picker row */}
                <div style={{
                    display: "flex", alignItems: "center", gap: 8, marginTop: 12,
                    background: "#141414", border: "1px solid #2a2a2a", padding: 6, borderRadius: 18
                }}>
                    <button
                        onClick={() => cambiarDia(-1)}
                        style={{
                            border: "none", background: "transparent", color: "#888",
                            width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center",
                            cursor: "pointer", borderRadius: 12
                        }}
                    >
                        <IconChevronLeft size={20} />
                    </button>
                    <div style={{ flex: 1, position: "relative", display: "flex", alignItems: "center" }}>
                        <IconCalendar size={16} className="text-[#e63946]" style={{ position: "absolute", left: 12 }} />
                        <input
                            type="date"
                            value={fecha}
                            onChange={e => setFecha(e.target.value)}
                            style={{
                                width: "100%", height: 40, background: "transparent", border: "none",
                                color: "#fff", fontWeight: "bold", fontSize: 16, outline: "none",
                                paddingLeft: 38, cursor: "pointer"
                            }}
                        />
                    </div>
                    <button
                        onClick={() => cambiarDia(1)}
                        style={{
                            border: "none", background: "transparent", color: "#888",
                            width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center",
                            cursor: "pointer", borderRadius: 12
                        }}
                    >
                        <IconChevronRight size={20} />
                    </button>
                </div>
            </div>

            {/* List */}
            {loading ? (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", py: 40 }}>
                    <IconLoader size={28} className="text-[#e63946]" />
                    <p style={{ color: "#888", fontSize: 11, fontWeight: 800, letterSpacing: 1, textTransform: "uppercase", marginTop: 12 }}>Cargando...</p>
                </div>
            ) : turnos.length > 0 ? (
                <>
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                        {paged.map((t) => (
                            <TurnoCard
                                key={t.id}
                                turno={t}
                                onStatusPress={setSelectedTurno}
                            />
                        ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "between", gap: 12, paddingTop: 8 }}>
                            <button
                                onClick={() => setPage(p => Math.max(0, p - 1))}
                                disabled={page === 0}
                                style={{
                                    flex: 1, height: 44, borderRadius: 14, background: "#1a1a1a",
                                    border: "1px solid #2a2a2a", color: "#888", fontWeight: "bold", fontSize: 14,
                                    cursor: page === 0 ? "not-allowed" : "pointer", opacity: page === 0 ? 0.35 : 1,
                                    display: "flex", alignItems: "center", justifyContent: "center", gap: 6
                                }}
                            >
                                <IconChevronLeft size={16} /> Anterior
                            </button>
                            <span style={{ fontSize: 13, fontWeight: "bold", color: "#888", whiteSpace: "nowrap" }}>
                                {page + 1} / {totalPages}
                            </span>
                            <button
                                onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                                disabled={page === totalPages - 1}
                                style={{
                                    flex: 1, height: 44, borderRadius: 14, background: "#1a1a1a",
                                    border: "1px solid #2a2a2a", color: "#888", fontWeight: "bold", fontSize: 14,
                                    cursor: page === totalPages - 1 ? "not-allowed" : "pointer", opacity: page === totalPages - 1 ? 0.35 : 1,
                                    display: "flex", alignItems: "center", justifyContent: "center", gap: 6
                                }}
                            >
                                Siguiente <IconChevronRight size={16} />
                            </button>
                        </div>
                    )}
                </>
            ) : (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "64px 20px", textAlign: "center" }}>
                    <IconCalendarX size={48} className="text-[#2a2a2a]" />
                    <p style={{ fontSize: 16, fontWeight: 800, color: "#f5f5f5", marginTop: 12 }}>Sin turnos este día</p>
                    <p style={{ fontSize: 13, color: "#888", marginTop: 4 }}>Navegá a otra fecha o cargá uno nuevo.</p>
                </div>
            )}

            {selectedTurno && (
                <StatusBottomSheet
                    turno={selectedTurno}
                    onClose={() => setSelectedTurno(null)}
                    onChangeEstado={handleChangeEstado}
                />
            )}
        </div>
    );
}
