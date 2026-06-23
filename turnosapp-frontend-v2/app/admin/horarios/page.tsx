"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { getConfig, actualizarConfig } from "@/lib/api";
import { getToken } from "@/lib/auth";
import { HorarioConfig } from "@/types";
import Toast from "@/components/admin/Toast";
import { Clock, Save, Loader2, CheckCircle2, AlertCircle } from "lucide-react";

const DIAS = [
    { id: 1, name: "Lunes" }, { id: 2, name: "Martes" }, { id: 3, name: "Miércoles" },
    { id: 4, name: "Jueves" }, { id: 5, name: "Viernes" }, { id: 6, name: "Sábado" },
    { id: 0, name: "Domingo" },
];

export default function HorariosPage() {
    const [configs, setConfigs] = useState<HorarioConfig[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState<string | null>(null);

    const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 2000); };

    useEffect(() => {
        getConfig().then(setConfigs).catch(console.error).finally(() => setLoading(false));
    }, []);

    const handleChange = (dia: number, field: string, value: any) => {
        setConfigs(prev => prev.map(c => c.diaSemana === dia ? { ...c, [field]: value } : c));
    };

    const getConfigForDia = (id: number): HorarioConfig =>
        configs.find(c => c.diaSemana === id) || { diaSemana: id, abierto: false, horaInicio: "08:00", horaFin: "18:00" };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = getToken();
        if (!token) return;
        setSaving(true);
        try {
            await actualizarConfig(token, configs);
            showToast("Horarios guardados");
        } catch {
            showToast("Error al guardar");
        } finally {
            setSaving(false);
        }
    };

    return (
        <>
            <Toast message={toast} />
            <div className="space-y-5">
                <div>
                    <h1 className="text-2xl font-black italic uppercase tracking-tighter">
                        Horarios <span className="text-rojo">Laborales</span>
                    </h1>
                    <p className="text-texto-muted text-[11px] font-medium">Definí tu disponibilidad semanal.</p>
                </div>

                {loading ? (
                    <div className="py-16 flex justify-center"><Loader2 className="animate-spin text-rojo" size={28} /></div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-2">
                        {DIAS.map((d, i) => {
                            const cfg = getConfigForDia(d.id);
                            return (
                                <motion.div
                                    key={d.id}
                                    initial={{ opacity: 0, y: 6 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    className="bg-surface border border-borde rounded-2xl"
                                >
                                    {/* Toggle row */}
                                    <div className="flex items-center justify-between px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${cfg.abierto ? "bg-green-500 shadow-[0_0_6px_rgba(34,197,94,0.6)]" : "bg-gray-700"}`} />
                                            <span className="font-black uppercase italic text-base">{d.name}</span>
                                        </div>
                                        {/* Toggle */}
                                        <button
                                            type="button"
                                            onClick={() => handleChange(d.id, "abierto", !cfg.abierto)}
                                            className={`w-14 h-7 rounded-full relative transition-colors duration-300 ${cfg.abierto ? "bg-rojo" : "bg-gray-800"}`}
                                        >
                                            <span className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow transition-all ${cfg.abierto ? "right-1" : "left-1"}`} />
                                        </button>
                                    </div>

                                    {/* Time inputs */}
                                    {cfg.abierto && (
                                        <div className="flex items-center gap-3 px-4 pb-4">
                                            <div className="flex items-center gap-2 flex-1 bg-bg border border-borde rounded-xl px-3 py-2">
                                                <Clock size={14} className="text-rojo flex-shrink-0" />
                                                <input
                                                    type="time"
                                                    value={cfg.horaInicio}
                                                    onChange={e => handleChange(d.id, "horaInicio", e.target.value)}
                                                    style={{ fontSize: "16px" }}
                                                    className="bg-transparent text-white font-bold outline-none flex-1"
                                                />
                                            </div>
                                            <span className="text-texto-muted font-black">—</span>
                                            <div className="flex items-center gap-2 flex-1 bg-bg border border-borde rounded-xl px-3 py-2">
                                                <input
                                                    type="time"
                                                    value={cfg.horaFin}
                                                    onChange={e => handleChange(d.id, "horaFin", e.target.value)}
                                                    style={{ fontSize: "16px" }}
                                                    className="bg-transparent text-white font-bold outline-none flex-1"
                                                />
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            );
                        })}

                        {/* Warning */}
                        <div className="bg-rojo/5 border border-rojo/15 rounded-2xl p-4 flex gap-3 items-start mt-4">
                            <AlertCircle className="text-rojo flex-shrink-0 mt-0.5" size={16} />
                            <p className="text-texto-muted text-[12px] leading-relaxed">
                                Los cambios afectan la disponibilidad en tiempo real. Turnos ya agendados no serán cancelados automáticamente.
                            </p>
                        </div>

                        <button
                            type="submit"
                            disabled={saving}
                            className="w-full h-[52px] bg-rojo text-white rounded-2xl font-bold text-[16px] flex items-center justify-center gap-2 shadow-lg shadow-rojo/25 active:scale-[0.98] transition-all disabled:opacity-60"
                        >
                            {saving ? <Loader2 className="animate-spin" size={20} /> : <><Save size={20} /> Guardar Configuración</>}
                        </button>
                    </form>
                )}
            </div>
        </>
    );
}
