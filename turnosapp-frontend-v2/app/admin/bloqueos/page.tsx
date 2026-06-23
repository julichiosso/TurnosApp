"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getBloqueos, crearBloqueo, eliminarBloqueo } from "@/lib/api";
import { getToken } from "@/lib/auth";
import { Bloqueo } from "@/types";
import Toast from "@/components/admin/Toast";
import { Ban, Plus, Trash2, Loader2, AlertTriangle, X } from "lucide-react";

export default function BloqueosPage() {
    const [bloqueos, setBloqueos] = useState<Bloqueo[]>([]);
    const [loading, setLoading] = useState(true);
    const [sheetOpen, setSheetOpen] = useState(false);
    const [form, setForm] = useState({ fecha: new Date().toISOString().split("T")[0], motivo: "" });
    const [toast, setToast] = useState<string | null>(null);

    const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 2000); };

    const load = useCallback(async () => {
        setLoading(true);
        try { setBloqueos(await getBloqueos()); }
        catch (e) { console.error(e); }
        finally { setLoading(false); }
    }, []);

    useEffect(() => { load(); }, [load]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = getToken();
        if (!token) return;
        try {
            await crearBloqueo(token, form);
            showToast("Fecha bloqueada");
            setSheetOpen(false);
            setForm({ fecha: new Date().toISOString().split("T")[0], motivo: "" });
            load();
        } catch { showToast("Error al bloquear"); }
    };

    const handleEliminar = async (id: number) => {
        const token = getToken();
        if (!token) return;
        try {
            await eliminarBloqueo(token, id);
            setBloqueos(prev => prev.filter(b => b.id !== id));
            showToast("Bloqueo eliminado");
        } catch { showToast("Error al eliminar"); }
    };

    return (
        <>
            <Toast message={toast} />
            <div className="space-y-5">
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-2xl font-black italic uppercase tracking-tighter">
                            Fechas <span className="text-rojo">Bloqueadas</span>
                        </h1>
                        <p className="text-texto-muted text-[11px] font-medium">Feriados, vacaciones, mantenimiento.</p>
                    </div>
                    <button
                        onClick={() => setSheetOpen(true)}
                        className="h-11 px-4 bg-rojo text-white rounded-2xl font-bold text-sm flex items-center gap-2 shadow-lg shadow-rojo/25 active:scale-95 transition-all flex-shrink-0"
                    >
                        <Plus size={18} /> Bloquear
                    </button>
                </div>

                {loading ? (
                    <div className="py-16 flex justify-center"><Loader2 className="animate-spin text-rojo" size={28} /></div>
                ) : bloqueos.length > 0 ? (
                    <div className="space-y-3">
                        {bloqueos.map((b, i) => (
                            <motion.div
                                key={b.id}
                                initial={{ opacity: 0, y: 6 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.06 }}
                                className="bg-surface border border-borde rounded-2xl p-4 min-h-[72px] flex items-center gap-4"
                            >
                                <div className="w-12 h-12 bg-surface-2 rounded-xl flex items-center justify-center border border-borde flex-shrink-0">
                                    <Ban size={20} className="text-rojo" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-black uppercase italic text-base">
                                        {new Date(b.fecha + "T12:00:00").toLocaleDateString("es-AR", { day: "numeric", month: "long", year: "numeric" })}
                                    </p>
                                    {b.motivo && <p className="text-texto-muted text-[11px] italic mt-0.5">{b.motivo}</p>}
                                </div>
                                <button
                                    onClick={() => handleEliminar(b.id)}
                                    className="w-11 h-11 flex-shrink-0 flex items-center justify-center bg-red-500/10 text-red-500 rounded-xl border border-red-500/15 active:scale-95 transition-all"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <Ban size={52} className="text-rojo/20 mb-4" />
                        <p className="font-black uppercase italic text-white">Sin bloqueos activos</p>
                        <p className="text-texto-muted text-sm mt-1">Todos los días están disponibles.</p>
                    </div>
                )}
            </div>

            {/* Bottom Sheet para bloquear fecha */}
            <AnimatePresence>
                {sheetOpen && (
                    <div className="fixed inset-0 z-50 flex flex-col justify-end">
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                            onClick={() => setSheetOpen(false)}
                        />
                        <motion.div
                            initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
                            transition={{ type: "spring", damping: 28, stiffness: 280 }}
                            className="relative bg-[#141414] border-t border-borde rounded-t-3xl z-10 pb-10"
                        >
                            <div className="w-10 h-1 bg-gray-700 rounded-full mx-auto mt-4" />
                            <div className="flex items-center justify-between px-6 py-4 border-b border-borde">
                                <h2 className="text-lg font-black italic uppercase"><span className="text-rojo">Bloquear</span> Fecha</h2>
                                <button onClick={() => setSheetOpen(false)} className="w-9 h-9 flex items-center justify-center rounded-xl bg-surface-2 text-texto-muted">
                                    <X size={18} />
                                </button>
                            </div>
                            <form onSubmit={handleSubmit} className="px-6 pt-5 space-y-4">
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-texto-muted block mb-1.5">Fecha *</label>
                                    <input
                                        required
                                        type="date"
                                        value={form.fecha}
                                        onChange={e => setForm({ ...form, fecha: e.target.value })}
                                        style={{ fontSize: "16px" }}
                                        className="w-full h-[52px] bg-bg border border-borde rounded-2xl px-4 outline-none focus:border-rojo text-white font-bold transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-texto-muted block mb-1.5">Motivo</label>
                                    <input
                                        type="text"
                                        value={form.motivo}
                                        onChange={e => setForm({ ...form, motivo: e.target.value })}
                                        placeholder="Ej: Feriado puente"
                                        style={{ fontSize: "16px" }}
                                        className="w-full h-[52px] bg-bg border border-borde rounded-2xl px-4 outline-none focus:border-rojo text-white transition-colors"
                                    />
                                </div>
                                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-3 flex gap-2.5 items-center">
                                    <AlertTriangle size={15} className="text-yellow-500 flex-shrink-0" />
                                    <p className="text-yellow-500/80 text-[11px]">Esta fecha no quedará disponible para los clientes.</p>
                                </div>
                                <button
                                    type="submit"
                                    className="w-full h-[52px] bg-rojo text-white rounded-2xl font-bold text-[16px] flex items-center justify-center gap-2 shadow-lg shadow-rojo/25 active:scale-[0.98] transition-all"
                                >
                                    <Ban size={18} /> Bloquear Ahora
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}
