"use client";

import { useEffect, useState } from "react";
import { getDashboard, getTurnos } from "@/lib/api";
import { getToken } from "@/lib/auth";
import { DashboardStats, Turno } from "@/types";
import StatCard from "@/components/admin/StatCard";
import TurnoRow from "@/components/admin/TurnoRow";
import {
    Calendar,
    CheckCircle2,
    Clock4,
    AlertCircle,
    Loader2,
    CalendarDays
} from "lucide-react";

export default function DashboardPage() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [turnosHoy, setTurnosHoy] = useState<Turno[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            const token = getToken();
            if (!token) return;

            try {
                const [statsData, turnosData] = await Promise.all([
                    getDashboard(token),
                    getTurnos(token, new Date().toISOString().split('T')[0])
                ]);
                setStats(statsData);
                setTurnosHoy(turnosData);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 bg-bg text-white min-h-[50vh]">
                <Loader2 className="animate-spin text-rojo mb-4" size={32} />
                <p className="text-texto-muted text-xs uppercase tracking-widest font-bold">Iniciando sistema...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black italic uppercase italic tracking-tighter">
                        Dashboard <span className="text-rojo">General</span>
                    </h1>
                    <p className="text-texto-muted text-sm font-medium">Control operativo en tiempo real.</p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                <StatCard
                    label="Hoy"
                    value={stats?.turnosHoy?.cantidad || 0}
                    icon={Calendar}
                    trend="En curso"
                />
                <StatCard
                    label="Pendientes"
                    value={stats?.pendientes || 0}
                    icon={AlertCircle}
                    color="text-yellow-500"
                />
                <StatCard
                    label="Mes"
                    value={stats?.turnosMes?.cantidad || 0}
                    icon={CalendarDays}
                />
                <StatCard
                    label="Confirmados"
                    value={stats?.porEstado?.confirmado || 0}
                    icon={CheckCircle2}
                    color="text-green-500"
                />
            </div>

            {/* Próximos Turnos */}
            <div className="space-y-4 pt-4">
                <div className="flex items-center justify-between mb-2">
                    <h2 className="text-xl font-bold uppercase italic flex items-center gap-2">
                        <Clock4 className="text-rojo" /> Turnos de Hoy
                    </h2>
                    <span className="text-[10px] text-texto-muted font-bold tracking-widest uppercase bg-surface-2 px-3 py-1 rounded-full border border-borde">
                        {new Date().toLocaleDateString("es-AR", { day: 'numeric', month: 'long' })}
                    </span>
                </div>

                <div className="space-y-3">
                    {turnosHoy.length > 0 ? (
                        turnosHoy.map(t => <TurnoRow key={t.id} turno={t} />)
                    ) : (
                        <div className="bg-surface border border-dashed border-borde rounded-2xl p-12 text-center">
                            <p className="text-texto-muted text-sm italic">No hay turnos agendados para lo que resta del día.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
