"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getTurnos, updateEstadoTurno } from "@/lib/api";
import { getToken } from "@/lib/auth";
import { Turno } from "@/types";
import TurnoCard from "@/components/admin/TurnoCard";
import StatusBottomSheet from "@/components/admin/StatusBottomSheet";
import Toast from "@/components/admin/Toast";
import { Calendar, Loader2, ChevronLeft, ChevronRight, CalendarDays } from "lucide-react";

const PAGE_SIZE = 8;

export default function TurnosPage() {
    const [fecha, setFecha] = useState(new Date().toISOString().split("T")[0]);
    const [turnos, setTurnos] = useState<Turno[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [selectedTurno, setSelectedTurno] = useState<Turno | null>(null);
    const [toast, setToast] = useState<string | null>(null);

    const showToast = (msg: string) => {
        setToast(msg);
        setTimeout(() => setToast(null), 2000);
    };

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
        showToast("Estado actualizado");
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
        <>
            <Toast message={toast} />
            <div className="space-y-5">
                {/* Header + Date Nav */}
                <div>
                    <h1 className="text-2xl font-black italic uppercase tracking-tighter">
                        Agenda <span className="text-rojo">del Día</span>
                    </h1>
                    {/* Date picker row */}
                    <div className="flex items-center gap-2 mt-3 bg-surface border border-borde p-1 rounded-2xl">
                        <button onClick={() => cambiarDia(-1)} className="p-2.5 hover:bg-surface-2 rounded-xl text-texto-muted transition-colors">
                            <ChevronLeft size={20} />
                        </button>
                        <div className="flex-1 relative">
                            <CalendarDays className="absolute left-2 top-1/2 -translate-y-1/2 text-rojo" size={15} />
                            <input
                                type="date"
                                value={fecha}
                                onChange={e => setFecha(e.target.value)}
                                style={{ fontSize: "16px" }}
                                className="w-full bg-transparent text-white font-bold h-10 pl-8 outline-none"
                            />
                        </div>
                        <button onClick={() => cambiarDia(1)} className="p-2.5 hover:bg-surface-2 rounded-xl text-texto-muted transition-colors">
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>

                {/* List */}
                {loading ? (
                    <div className="py-20 flex justify-center">
                        <Loader2 className="animate-spin text-rojo" size={32} />
                    </div>
                ) : turnos.length > 0 ? (
                    <>
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={`${fecha}-${page}`}
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className="space-y-3"
                            >
                                {paged.map((t, i) => (
                                    <TurnoCard
                                        key={t.id}
                                        turno={t}
                                        index={i}
                                        onStatusPress={setSelectedTurno}
                                    />
                                ))}
                            </motion.div>
                        </AnimatePresence>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-between gap-3 pt-2">
                                <button
                                    onClick={() => setPage(p => Math.max(0, p - 1))}
                                    disabled={page === 0}
                                    className="flex-1 h-12 rounded-2xl border border-borde font-bold text-sm text-texto-muted disabled:opacity-30 flex items-center justify-center gap-2 active:scale-95 transition-all"
                                >
                                    <ChevronLeft size={18} /> Anterior
                                </button>
                                <span className="text-texto-muted text-xs font-bold whitespace-nowrap">
                                    {page + 1} / {totalPages}
                                </span>
                                <button
                                    onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                                    disabled={page === totalPages - 1}
                                    className="flex-1 h-12 rounded-2xl border border-borde font-bold text-sm text-texto-muted disabled:opacity-30 flex items-center justify-center gap-2 active:scale-95 transition-all"
                                >
                                    Siguiente <ChevronRight size={18} />
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <Calendar size={56} className="text-rojo/20 mb-4" />
                        <p className="font-black uppercase italic text-white text-lg">Agenda vacía</p>
                        <p className="text-texto-muted text-sm mt-1">No hay turnos para este día.</p>
                    </div>
                )}
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
