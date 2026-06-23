"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { getDashboard, getTurnos, updateEstadoTurno } from "@/lib/api";
import { getToken } from "@/lib/auth";
import { DashboardStats, Turno } from "@/types";
import StatCard from "@/components/admin/StatCard";
import TurnoCard from "@/components/admin/TurnoCard";
import StatusBottomSheet from "@/components/admin/StatusBottomSheet";
import Toast from "@/components/admin/Toast";
import { Calendar, CheckCircle2, AlertCircle, Loader2, CalendarDays, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [turnosHoy, setTurnosHoy] = useState<Turno[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedTurno, setSelectedTurno] = useState<Turno | null>(null);
    const [toast, setToast] = useState<string | null>(null);

    const showToast = (msg: string) => {
        setToast(msg);
        setTimeout(() => setToast(null), 2000);
    };

    const load = useCallback(async () => {
        const token = getToken();
        if (!token) return;
        try {
            const [statsData, turnosData] = await Promise.all([
                getDashboard(token),
                getTurnos(token, new Date().toISOString().split("T")[0]),
            ]);
            setStats(statsData);
            setTurnosHoy(turnosData);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { load(); }, [load]);

    const handleChangeEstado = async (id: number, estado: string) => {
        // Optimistic update
        setTurnosHoy(prev =>
            prev.map(t => t.id === id ? { ...t, estado: estado as Turno["estado"] } : t)
        );
        showToast("Estado actualizado");
        try {
            const token = getToken();
            if (token) await updateEstadoTurno(token, id, estado);
        } catch {
            // Revert on failure
            load();
        }
    };

    const TOP_TURNOS = 4;
    const turnosMostrados = turnosHoy.slice(0, TOP_TURNOS);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh]">
                <Loader2 className="animate-spin text-rojo" size={32} />
                <p className="text-texto-muted text-xs uppercase tracking-widest font-bold mt-4">Cargando...</p>
            </div>
        );
    }

    return (
        <>
            <Toast message={toast} />
            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-black italic uppercase tracking-tighter">
                        Dashboard <span className="text-rojo">General</span>
                    </h1>
                    <p className="text-texto-muted text-[11px] font-medium">
                        {new Date().toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "long" })}
                    </p>
                </div>

                {/* Stats — 2x2 compacto */}
                <div className="grid grid-cols-2 gap-3">
                    {[
                        { label: "Hoy", value: stats?.turnosHoy?.cantidad || 0, icon: Calendar, color: "text-rojo" },
                        { label: "Pendientes", value: stats?.porEstado?.pendiente || 0, icon: AlertCircle, color: "text-yellow-500" },
                        { label: "Mes", value: stats?.turnosMes?.cantidad || 0, icon: CalendarDays, color: "text-blue-400" },
                        { label: "Confirmados", value: stats?.porEstado?.confirmado || 0, icon: CheckCircle2, color: "text-green-500" },
                    ].map((s, i) => (
                        <motion.div
                            key={s.label}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.08, duration: 0.25 }}
                        >
                            <StatCard label={s.label} value={s.value} icon={s.icon} color={s.color} />
                        </motion.div>
                    ))}
                </div>

                {/* Turnos del día */}
                <div>
                    <div className="flex items-center justify-between mb-3">
                        <h2 className="text-base font-black uppercase italic">Turnos de Hoy</h2>
                        {turnosHoy.length > TOP_TURNOS && (
                            <Link
                                href="/admin/turnos"
                                className="flex items-center gap-1 text-rojo text-xs font-bold uppercase tracking-widest"
                            >
                                Ver todos <ArrowRight size={14} />
                            </Link>
                        )}
                    </div>

                    {turnosMostrados.length > 0 ? (
                        <div className="space-y-3">
                            {turnosMostrados.map((t, i) => (
                                <TurnoCard
                                    key={t.id}
                                    turno={t}
                                    index={i}
                                    onStatusPress={setSelectedTurno}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-16 text-center">
                            <Calendar size={56} className="text-rojo/20 mb-4" />
                            <p className="font-bold text-white text-lg italic uppercase">Sin turnos hoy</p>
                            <p className="text-texto-muted text-sm mt-1">Disfrutá el día 🔧</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Bottom sheet */}
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
