"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getServicios, crearServicio, actualizarServicio } from "@/lib/api";
import { getToken } from "@/lib/auth";
import { Servicio } from "@/types";
import ServicioBottomSheet from "@/components/admin/ServicioBottomSheet";
import Toast from "@/components/admin/Toast";
import { Plus, Clock, DollarSign, Loader2, ChevronDown, CheckCircle2, XCircle, Edit3 } from "lucide-react";

const PAGE_INIT = 5;

export default function ServiciosPage() {
    const [servicios, setServicios] = useState<Servicio[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAll, setShowAll] = useState(false);
    const [editing, setEditing] = useState<Servicio | null>(null);
    const [sheetOpen, setSheetOpen] = useState(false);
    const [toast, setToast] = useState<string | null>(null);

    const showToast = (msg: string) => {
        setToast(msg);
        setTimeout(() => setToast(null), 2000);
    };

    const load = useCallback(async () => {
        setLoading(true);
        try {
            const data = await getServicios();
            setServicios(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { load(); }, [load]);

    const handleSave = async (form: any) => {
        const token = getToken();
        if (!token) return;
        if (editing) {
            await actualizarServicio(token, editing.id, form);
            showToast("Servicio actualizado");
        } else {
            await crearServicio(token, form);
            showToast("Servicio creado");
        }
        load();
    };

    const toggleActivo = async (s: Servicio) => {
        const token = getToken();
        if (!token) return;
        try {
            await actualizarServicio(token, s.id, { ...s, activo: !s.activo });
            showToast(s.activo ? "Servicio desactivado" : "Servicio activado");
            load();
        } catch {
            showToast("Error al cambiar estado");
        }
    };

    const openNew = () => { setEditing(null); setSheetOpen(true); };
    const openEdit = (s: Servicio) => { setEditing(s); setSheetOpen(true); };

    const displayed = showAll ? servicios : servicios.slice(0, PAGE_INIT);

    return (
        <>
            <Toast message={toast} />
            <div className="space-y-5">
                {/* Header */}
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-2xl font-black italic uppercase tracking-tighter">
                            Nuestros <span className="text-rojo">Servicios</span>
                        </h1>
                        <p className="text-texto-muted text-[11px] font-medium mt-0.5">
                            {servicios.length} servicios configurados
                        </p>
                    </div>
                    <button
                        onClick={openNew}
                        className="h-11 px-4 bg-rojo text-white rounded-2xl font-bold text-sm flex items-center gap-2 shadow-lg shadow-rojo/25 active:scale-95 transition-all flex-shrink-0"
                    >
                        <Plus size={18} /> Nuevo
                    </button>
                </div>

                {/* List */}
                {loading ? (
                    <div className="py-16 flex justify-center">
                        <Loader2 className="animate-spin text-rojo" size={28} />
                    </div>
                ) : (
                    <AnimatePresence>
                        <div className="space-y-3">
                            {displayed.map((s, i) => (
                                <motion.div
                                    key={s.id}
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.06, duration: 0.2 }}
                                    className={`bg-surface border rounded-2xl p-4 min-h-[80px] flex items-center gap-4 transition-all ${s.activo ? "border-borde" : "border-gray-800 opacity-50"
                                        }`}
                                >
                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <p className="font-black text-base uppercase italic truncate">{s.nombre}</p>
                                            {!s.activo && (
                                                <span className="text-[9px] bg-gray-800 text-gray-500 px-2 py-0.5 rounded uppercase font-bold flex-shrink-0">Inactivo</span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-3 mt-1">
                                            <span className="text-[11px] text-texto-muted flex items-center gap-1">
                                                <Clock size={11} className="text-rojo" /> {s.duracion} min
                                            </span>
                                            {s.precio ? (
                                                <span className="text-[11px] text-texto-muted flex items-center gap-1">
                                                    <DollarSign size={11} className="text-rojo" /> {s.precio.toLocaleString()}
                                                </span>
                                            ) : null}
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-2 flex-shrink-0">
                                        <button
                                            onClick={() => toggleActivo(s)}
                                            className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all active:scale-95 ${s.activo
                                                    ? "bg-gray-800/30 border-gray-700 text-gray-500"
                                                    : "bg-green-500/10 border-green-500/20 text-green-500"
                                                }`}
                                        >
                                            {s.activo ? <XCircle size={16} /> : <CheckCircle2 size={16} />}
                                        </button>
                                        <button
                                            onClick={() => openEdit(s)}
                                            className="w-10 h-10 rounded-xl flex items-center justify-center bg-rojo/10 border border-rojo/20 text-rojo active:scale-95 transition-all"
                                        >
                                            <Edit3 size={16} />
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </AnimatePresence>
                )}

                {/* Ver más */}
                {!showAll && servicios.length > PAGE_INIT && (
                    <button
                        onClick={() => setShowAll(true)}
                        className="w-full h-12 border border-dashed border-borde rounded-2xl text-texto-muted text-sm font-bold flex items-center justify-center gap-2 active:scale-95 transition-all"
                    >
                        <ChevronDown size={18} /> Ver {servicios.length - PAGE_INIT} más
                    </button>
                )}
            </div>

            {/* Bottom Sheet */}
            <ServicioBottomSheet
                open={sheetOpen}
                servicio={editing}
                onClose={() => setSheetOpen(false)}
                onSave={handleSave}
            />
        </>
    );
}
