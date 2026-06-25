"use client";

import { useEffect, useState, useCallback } from "react";
import { getDashboard, getTurnos, updateEstadoTurno } from "@/lib/api";
import { getToken } from "@/lib/auth";
import { DashboardStats, Turno } from "@/types";
import TurnoCard from "@/components/admin/TurnoCard";
import StatusBottomSheet from "@/components/admin/StatusBottomSheet";
import { IconBolt, IconCheck, IconCalendarCheck, IconLoader } from "@/components/icons";
import Link from "next/link";

function getSaludo(): string {
    const h = new Date().getHours();
    if (h < 12) return "Buenos días";
    if (h < 18) return "Buenas tardes";
    return "Buenas noches";
}

export default function DashboardPage() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [turnosHoy, setTurnosHoy] = useState<Turno[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedTurno, setSelectedTurno] = useState<Turno | null>(null);

    const load = useCallback(async () => {
        const token = getToken();
        if (!token) return;
        try {
            const [statsData, turnosData] = await Promise.all([
                getDashboard(token),
                getTurnos(token, new Date().toISOString().split("T")[0]),
            ]);
            setStats(statsData);
            setTurnosHoy(turnosData.sort((a, b) => a.hora.localeCompare(b.hora)));
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { load(); }, [load]);

    const handleChangeEstado = async (id: number, estado: string) => {
        setTurnosHoy(prev =>
            prev.map(t => t.id === id ? { ...t, estado: estado as Turno["estado"] } : t)
        );
        try {
            const token = getToken();
            if (token) await updateEstadoTurno(token, id, estado);
        } catch { load(); }
    };

    if (loading) {
        return (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "50vh" }}>
                <IconLoader size={28} className="text-[#e63946]" />
                <p style={{ color: "#888", fontSize: 11, fontWeight: 800, letterSpacing: 1, textTransform: "uppercase", marginTop: 12 }}>Cargando...</p>
            </div>
        );
    }

    const hoy = new Date().toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit" });
    const proximoTurno = turnosHoy.find(t => t.estado === "pendiente" || t.estado === "confirmado");

    return (
        <>
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                {/* Saludo */}
                <div>
                    <p style={{ fontSize: 14, color: "#888", fontWeight: 500 }}>
                        {getSaludo()} · {hoy}
                    </p>
                </div>

                {/* Próximo turno destacado */}
                {proximoTurno && (
                    <div style={{
                        background: "#1a0500", border: "1px solid #e6394640",
                        borderRadius: 18, padding: "18px 18px 16px",
                    }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 14 }}>
                            <IconBolt size={14} className="text-[#e63946]" />
                            <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: 2, color: "#e63946", textTransform: "uppercase" }}>
                                PRÓXIMO TURNO
                            </span>
                        </div>
                        <TurnoCard turno={proximoTurno} onStatusPress={setSelectedTurno} />
                    </div>
                )}

                {/* Stats row — 3 cols */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
                    {[
                        { label: "HOY", value: stats?.turnosHoy?.cantidad || 0, color: "#e63946" },
                        { label: "PENDIENT.", value: stats?.porEstado?.pendiente || 0, color: "#f59e0b" },
                        { label: "CONFIRM.", value: stats?.porEstado?.confirmado || 0, color: "#22c55e" },
                    ].map(s => (
                        <div key={s.label} style={{
                            background: "#1a1a1a", borderRadius: 14, padding: "16px 12px",
                            textAlign: "center", border: "1px solid #2a2a2a",
                        }}>
                            <div style={{ fontSize: 28, fontWeight: 800, color: s.color, lineHeight: 1 }}>
                                {s.value}
                            </div>
                            <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: 1, color: "#888", marginTop: 6, textTransform: "uppercase" }}>
                                {s.label}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Agenda hoy */}
                <div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                        <h2 style={{ fontSize: 13, fontWeight: 800, letterSpacing: 1, color: "#888", textTransform: "uppercase" }}>
                            AGENDA HOY
                        </h2>
                        {turnosHoy.length > 4 && (
                            <Link href="/admin/turnos" style={{ fontSize: 11, fontWeight: 700, color: "#e63946", textDecoration: "none" }}>
                                Ver todos
                            </Link>
                        )}
                    </div>

                    {turnosHoy.length > 0 ? (
                        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                            {turnosHoy.slice(0, 4).map(t => (
                                <TurnoCard key={t.id} turno={t} onStatusPress={setSelectedTurno} />
                            ))}
                        </div>
                    ) : (
                        <div style={{ textAlign: "center", padding: "48px 0" }}>
                            <IconCalendarCheck size={48} className="text-[#2a2a2a]" />
                            <p style={{ fontSize: 16, fontWeight: 800, color: "#f5f5f5", marginTop: 12 }}>Sin más turnos por hoy</p>
                            <p style={{ fontSize: 13, color: "#888", marginTop: 4 }}>No hay nada agendado hoy.</p>
                        </div>
                    )}
                </div>
            </div>

            {selectedTurno && (
                <StatusBottomSheet
                    turno={selectedTurno}
                    onClose={() => setSelectedTurno(null)}
                    onChangeEstado={handleChangeEstado}
                />
            )}
        </>
    );
}
