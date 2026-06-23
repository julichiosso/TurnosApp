"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Save, X } from "lucide-react";
import { useState, useEffect } from "react";
import { Servicio } from "../../types";

interface Props {
    open: boolean;
    servicio: Servicio | null; // null = crear nuevo
    onClose: () => void;
    onSave: (data: { nombre: string; descripcion: string; duracion: number; precio: number; activo: boolean }) => Promise<void>;
}

export default function ServicioBottomSheet({ open, servicio, onClose, onSave }: Props) {
    const [form, setForm] = useState({ nombre: "", descripcion: "", duracion: 30, precio: 0, activo: true });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (servicio) {
            setForm({
                nombre: servicio.nombre,
                descripcion: servicio.descripcion || "",
                duracion: servicio.duracion,
                precio: servicio.precio || 0,
                activo: servicio.activo,
            });
        } else {
            setForm({ nombre: "", descripcion: "", duracion: 30, precio: 0, activo: true });
        }
    }, [servicio, open]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await onSave(form);
            onClose();
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {open && (
                <div className="fixed inset-0 z-50 flex flex-col justify-end">
                    {/* Overlay */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                        onClick={onClose}
                    />

                    {/* Sheet */}
                    <motion.div
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "100%" }}
                        transition={{ type: "spring", damping: 28, stiffness: 280 }}
                        className="relative bg-[#141414] border-t border-borde rounded-t-3xl z-10 pb-10"
                    >
                        <div className="w-10 h-1 bg-gray-700 rounded-full mx-auto mt-4 mb-0" />

                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-borde">
                            <h2 className="text-lg font-black italic uppercase">
                                {servicio ? "Editar" : "Nuevo"} <span className="text-rojo">Servicio</span>
                            </h2>
                            <button onClick={onClose} className="w-9 h-9 flex items-center justify-center rounded-xl bg-surface-2 text-texto-muted">
                                <X size={18} />
                            </button>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="px-6 pt-5 space-y-4">
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-texto-muted block mb-1.5">Nombre *</label>
                                <input
                                    required
                                    value={form.nombre}
                                    onChange={e => setForm({ ...form, nombre: e.target.value })}
                                    placeholder="Ej: Reparación de chapa"
                                    style={{ fontSize: "16px" }}
                                    className="w-full h-[52px] bg-bg border border-borde rounded-2xl px-4 outline-none focus:border-rojo text-white transition-colors"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-texto-muted block mb-1.5">Duración (min) *</label>
                                    <input
                                        required
                                        type="number"
                                        min={15}
                                        step={15}
                                        value={form.duracion}
                                        onChange={e => setForm({ ...form, duracion: parseInt(e.target.value) })}
                                        style={{ fontSize: "16px" }}
                                        className="w-full h-[52px] bg-bg border border-borde rounded-2xl px-4 outline-none focus:border-rojo text-white transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-texto-muted block mb-1.5">Precio $</label>
                                    <input
                                        type="number"
                                        min={0}
                                        value={form.precio}
                                        onChange={e => setForm({ ...form, precio: parseInt(e.target.value) || 0 })}
                                        style={{ fontSize: "16px" }}
                                        className="w-full h-[52px] bg-bg border border-borde rounded-2xl px-4 outline-none focus:border-rojo text-white transition-colors"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-texto-muted block mb-1.5">Descripción</label>
                                <textarea
                                    value={form.descripcion}
                                    onChange={e => setForm({ ...form, descripcion: e.target.value })}
                                    rows={2}
                                    placeholder="Breve descripción del servicio..."
                                    style={{ fontSize: "16px" }}
                                    className="w-full bg-bg border border-borde rounded-2xl px-4 py-3 outline-none focus:border-rojo text-white transition-colors resize-none"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full h-[52px] bg-rojo text-white rounded-2xl font-bold text-[16px] flex items-center justify-center gap-2 shadow-lg shadow-rojo/30 active:scale-[0.98] transition-all disabled:opacity-60 mt-2"
                            >
                                {loading ? "Guardando..." : <><Save size={20} /> Guardar Cambios</>}
                            </button>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
