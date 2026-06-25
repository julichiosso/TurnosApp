"use client";

import { useEffect, useState, useCallback } from "react";
import { getBloqueos, crearBloqueo, eliminarBloqueo } from "@/lib/api";
import { getToken } from "@/lib/auth";
import { Bloqueo } from "@/types";
import Toast from "@/components/admin/Toast";
import BottomSheet from "@/components/BottomSheet";
import {
    IconPlusCircle,
    IconBan,
    IconTrash,
    IconCalendarCheck,
    IconWarning,
    IconX,
    IconLoader
} from "@/components/icons";

export default function BloqueosPage() {
    const [bloqueos, setBloqueos] = useState<Bloqueo[]>([]);
    const [loading, setLoading] = useState(true);
    const [sheetOpen, setSheetOpen] = useState(false);
    const [form, setForm] = useState({ fecha: new Date().toISOString().split("T")[0], motivo: "" });
    const [toast, setToast] = useState<string | null>(null);

    const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 2000); };

    const load = useCallback(async () => {
        setLoading(true);
        try {
            setBloqueos(await getBloqueos());
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
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
        } catch {
            showToast("Error al bloquear");
        }
    };

    const handleEliminar = async (id: number) => {
        const token = getToken();
        if (!token) return;
        try {
            await eliminarBloqueo(token, id);
            setBloqueos(prev => prev.filter(b => b.id !== id));
            showToast("Bloqueo eliminado");
        } catch {
            showToast("Error al eliminar");
        }
    };

    return (
        <>
            <Toast message={toast} />
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                {/* Header */}
                <div style={{ display: "flex", alignItems: "flex-start", justifyItems: "center", justifyContent: "space-between" }}>
                    <div>
                        <h1 style={{ fontSize: 24, fontWeight: 900, textTransform: "uppercase", letterSpacing: "-0.05em", fontStyle: "italic" }}>
                            Fechas <span style={{ color: "#e63946" }}>Bloqueadas</span>
                        </h1>
                        <p style={{ color: "#888", fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: 1, marginTop: 4 }}>
                            Feriados, vacaciones, mantenimiento.
                        </p>
                    </div>
                    <button
                        onClick={() => setSheetOpen(true)}
                        style={{
                            height: 44, padding: "0 16px", background: "#e63946", color: "#fff",
                            border: "none", borderRadius: 14, fontWeight: "bold", fontSize: 14,
                            display: "flex", alignItems: "center", gap: 8, cursor: "pointer",
                            boxShadow: "0 10px 15px -3px rgba(230, 57, 70, 0.25)"
                        }}
                    >
                        <IconPlusCircle size={18} /> Bloquear
                    </button>
                </div>

                {/* List */}
                {loading ? (
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 0" }}>
                        <IconLoader size={28} className="text-[#e63946]" />
                        <p style={{ color: "#888", fontSize: 11, fontWeight: 800, letterSpacing: 1, textTransform: "uppercase", marginTop: 12 }}>Cargando...</p>
                    </div>
                ) : bloqueos.length > 0 ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                        {bloqueos.map((b) => (
                            <div
                                key={b.id}
                                style={{
                                    background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: 18,
                                    padding: 16, display: "flex", alignItems: "center", gap: 16
                                }}
                            >
                                <div style={{
                                    width: 44, height: 44, background: "#141414", border: "1px solid #2a2a2a",
                                    borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
                                }}>
                                    <IconBan size={18} className="text-[#e63946]" />
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <p style={{ fontSize: 15, fontWeight: 900, textTransform: "uppercase", fontStyle: "italic", color: "#f5f5f5", margin: 0 }}>
                                        {new Date(b.fecha + "T12:00:00").toLocaleDateString("es-AR", { day: "numeric", month: "long", year: "numeric" })}
                                    </p>
                                    {b.motivo && <p style={{ color: "#888", fontSize: 12, fontStyle: "italic", marginTop: 4, marginBottom: 0 }}>{b.motivo}</p>}
                                </div>
                                <button
                                    onClick={() => handleEliminar(b.id)}
                                    style={{
                                        width: 40, height: 40, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center",
                                        background: "rgba(230, 57, 70, 0.1)", border: "1px solid rgba(230, 57, 70, 0.2)",
                                        color: "#e63946", cursor: "pointer", flexShrink: 0
                                    }}
                                >
                                    <IconTrash size={18} />
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "64px 20px", textAlign: "center" }}>
                        <IconCalendarCheck size={48} className="text-[#2a2a2a]" />
                        <p style={{ fontSize: 16, fontWeight: 800, color: "#f5f5f5", marginTop: 12 }}>Todos los días disponibles</p>
                        <p style={{ fontSize: 13, color: "#888", marginTop: 4 }}>No hay fechas bloqueadas en este momento.</p>
                    </div>
                )}
            </div>

            {/* Bottom Sheet para bloquear fecha */}
            <BottomSheet open={sheetOpen} onClose={() => setSheetOpen(false)}>
                {/* Header */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                    <h2 style={{ fontSize: 18, fontWeight: 900, textTransform: "uppercase", color: "#f5f5f5" }}>
                        Bloquear <span style={{ color: "#e63946" }}>Fecha</span>
                    </h2>
                    <button
                        onClick={() => setSheetOpen(false)}
                        style={{
                            border: "none", background: "#1a1a1a", color: "#888",
                            width: 36, height: 36, borderRadius: 10, display: "flex",
                            alignItems: "center", justifyContent: "center", cursor: "pointer"
                        }}
                    >
                        <IconX size={18} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    <div>
                        <label style={{ fontSize: 10, color: "#888", fontWeight: 800, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 6 }}>
                            Fecha *
                        </label>
                        <input
                            required
                            type="date"
                            value={form.fecha}
                            onChange={e => setForm({ ...form, fecha: e.target.value })}
                            style={{
                                background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: 10,
                                padding: "13px 14px", color: "#f5f5f5", fontSize: 15, width: "100%",
                                outline: "none", fontWeight: "bold", boxSizing: "border-box"
                            }}
                            className="focus:border-[#e63946]"
                        />
                    </div>
                    <div>
                        <label style={{ fontSize: 10, color: "#888", fontWeight: 800, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 6 }}>
                            Motivo
                        </label>
                        <input
                            type="text"
                            value={form.motivo}
                            onChange={e => setForm({ ...form, motivo: e.target.value })}
                            placeholder="Ej: Feriado puente"
                            style={{
                                background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: 10,
                                padding: "13px 14px", color: "#f5f5f5", fontSize: 15, width: "100%",
                                outline: "none", boxSizing: "border-box"
                            }}
                            className="focus:border-[#e63946]"
                        />
                    </div>

                    <div style={{
                        background: "#1a1000", border: "1px solid #f59e0b30", borderRadius: 12,
                        padding: 12, display: "flex", gap: 10, alignItems: "center"
                    }}>
                        <IconWarning size={15} className="text-[#f59e0b] flex-shrink-0" />
                        <p style={{ color: "#f59e0b", fontSize: 12, margin: 0 }}>Esta fecha no quedará disponible para los clientes.</p>
                    </div>

                    <button
                        type="submit"
                        style={{
                            background: "#e63946", color: "#fff", border: "none", borderRadius: 12,
                            padding: 15, fontWeight: 800, fontSize: 15, width: "100%", cursor: "pointer",
                            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                            boxSizing: "border-box", marginTop: 8
                        }}
                    >
                        <IconBan size={18} /> Bloquear Ahora
                    </button>
                </form>
            </BottomSheet>
        </>
    );
}
