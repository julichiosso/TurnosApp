"use client";

import { useEffect, useState, useCallback } from "react";
import { getBloqueos, crearBloqueo, eliminarBloqueo } from "@/lib/api";
import { getToken } from "@/lib/auth";
import { Bloqueo } from "@/types";
import Toast from "@/components/admin/Toast";
import BottomSheet from "@/components/BottomSheet";
import { toISOLocal } from "@/lib/dateUtils";
import {
    IconPlusCircle,
    IconBan,
    IconTrash,
    IconCalendarCheck,
    IconWarning,
    IconX,
    IconLoader,
    IconCalendar,
} from "@/components/icons";

type Modo = "dia" | "rango";

function formatFechaBloqueo(iso: string): string {
    return new Date(iso + "T12:00:00").toLocaleDateString("es-AR", {
        day: "numeric", month: "short", year: "numeric"
    });
}

export default function BloqueosPage() {
    const [bloqueos, setBloqueos] = useState<Bloqueo[]>([]);
    const [loading, setLoading] = useState(true);
    const [sheetOpen, setSheetOpen] = useState(false);
    const [modo, setModo] = useState<Modo>("dia");
    const hoy = toISOLocal(new Date());
    const [form, setForm] = useState({ fecha: hoy, fechaFin: hoy, motivo: "" });
    const [formError, setFormError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [toast, setToast] = useState<string | null>(null);

    const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 2000); };

    const load = useCallback(async () => {
        setLoading(true);
        try {
            const token = getToken();
            setBloqueos(await getBloqueos(token || undefined));
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { load(); }, [load]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError(null);

        // Validación de rango
        if (modo === "rango" && form.fechaFin < form.fecha) {
            setFormError("La fecha \"Hasta\" no puede ser anterior a \"Desde\".");
            return;
        }

        const token = getToken();
        if (!token) return;

        setSubmitting(true);
        try {
            const payload = {
                fecha: form.fecha,
                fechaFin: modo === "rango" ? form.fechaFin : undefined,
                motivo: form.motivo || undefined,
            };
            await crearBloqueo(token, payload);
            showToast(modo === "rango" ? "Rango bloqueado" : "Fecha bloqueada");
            setSheetOpen(false);
            setForm({ fecha: hoy, fechaFin: hoy, motivo: "" });
            setModo("dia");
            load();
        } catch {
            showToast("Error al bloquear");
        } finally {
            setSubmitting(false);
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

    const inputStyle: React.CSSProperties = {
        background: "#0d0d0d", border: "1px solid #2a2a2a", borderRadius: 14,
        padding: "16px 20px", color: "#f5f5f5", fontSize: 16, width: "100%",
        outline: "none", fontWeight: "800", boxSizing: "border-box", textAlign: "center",
        appearance: "none", WebkitAppearance: "none"
    };

    const labelStyle: React.CSSProperties = {
        fontSize: 10, color: "#888", fontWeight: 800, letterSpacing: 1,
        textTransform: "uppercase", display: "block", marginBottom: 6
    };

    return (
        <>
            <Toast message={toast} />
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                {/* Header */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                    <div style={{ flex: 1 }}>
                        <h1 style={{ fontSize: 24, fontWeight: 900, textTransform: "uppercase", letterSpacing: "-0.05em", fontStyle: "italic", lineHeight: 1.1 }}>
                            Fechas <span style={{ color: "#e63946" }}>Bloqueadas</span>
                        </h1>
                        <p style={{ color: "#888", fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: 1, marginTop: 6 }}>
                            Feriados, vacaciones, mantenimiento.
                        </p>
                    </div>
                    <button
                        onClick={() => { setSheetOpen(true); setModo("dia"); setFormError(null); }}
                        style={{
                            height: 42, padding: "0 14px", background: "#e63946", color: "#fff",
                            border: "none", borderRadius: 12, fontWeight: "900", fontSize: 13,
                            textTransform: "uppercase", display: "flex", alignItems: "center", gap: 6, cursor: "pointer",
                            boxShadow: "0 8px 15px -4px rgba(230, 57, 70, 0.4)", flexShrink: 0
                        }}
                    >
                        <IconPlusCircle size={16} /> Bloquear
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
                        {bloqueos.map((b) => {
                            const esRango = !!b.fechaFin && b.fechaFin !== b.fecha;
                            const etiqueta = esRango
                                ? `${formatFechaBloqueo(b.fecha)} – ${formatFechaBloqueo(b.fechaFin!)}`
                                : formatFechaBloqueo(b.fecha);

                            return (
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
                                        {esRango
                                            ? <IconCalendar size={18} className="text-[#e63946]" />
                                            : <IconBan size={18} className="text-[#e63946]" />
                                        }
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <p style={{ fontSize: 14, fontWeight: 900, textTransform: "uppercase", fontStyle: "italic", color: "#f5f5f5", margin: 0 }}>
                                            {etiqueta}
                                        </p>
                                        {b.motivo && (
                                            <p style={{ color: "#888", fontSize: 12, fontStyle: "italic", marginTop: 3, marginBottom: 0 }}>
                                                {b.motivo}
                                            </p>
                                        )}
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
                            );
                        })}
                    </div>
                ) : (
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "64px 20px", textAlign: "center" }}>
                        <IconCalendarCheck size={48} className="text-[#2a2a2a]" />
                        <p style={{ fontSize: 16, fontWeight: 800, color: "#f5f5f5", marginTop: 12 }}>Todos los días disponibles</p>
                        <p style={{ fontSize: 13, color: "#888", marginTop: 4 }}>No hay fechas bloqueadas en este momento.</p>
                    </div>
                )}
            </div>

            {/* Bottom Sheet para bloquear fecha / rango */}
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

                {/* Segmented control: Un día / Varios días */}
                <div style={{
                    display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6,
                    background: "#111", borderRadius: 12, padding: 5, marginBottom: 20
                }}>
                    {(["dia", "rango"] as Modo[]).map((m) => (
                        <button
                            key={m}
                            type="button"
                            onClick={() => { setModo(m); setFormError(null); }}
                            style={{
                                height: 38, borderRadius: 8, border: "none",
                                fontWeight: 800, fontSize: 13,
                                background: modo === m ? "#e63946" : "transparent",
                                color: modo === m ? "#fff" : "#888",
                                cursor: "pointer", transition: "all 0.15s"
                            }}
                        >
                            {m === "dia" ? "Un día" : "Varios días"}
                        </button>
                    ))}
                </div>

                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                    {modo === "dia" ? (
                        <div>
                            <label style={labelStyle}>Fecha *</label>
                            <input
                                required
                                type="date"
                                value={form.fecha}
                                onChange={e => setForm({ ...form, fecha: e.target.value })}
                                style={inputStyle}
                                className="focus:border-[#e63946]"
                            />
                        </div>
                    ) : (
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                            <div>
                                <label style={labelStyle}>Desde *</label>
                                <input
                                    required
                                    type="date"
                                    value={form.fecha}
                                    onChange={e => { setForm({ ...form, fecha: e.target.value }); setFormError(null); }}
                                    style={inputStyle}
                                    className="focus:border-[#e63946]"
                                />
                            </div>
                            <div>
                                <label style={labelStyle}>Hasta *</label>
                                <input
                                    required
                                    type="date"
                                    value={form.fechaFin}
                                    min={form.fecha}
                                    onChange={e => { setForm({ ...form, fechaFin: e.target.value }); setFormError(null); }}
                                    style={{
                                        ...inputStyle,
                                        border: formError ? "1px solid #e63946" : "1px solid #2a2a2a"
                                    }}
                                    className="focus:border-[#e63946]"
                                />
                            </div>
                        </div>
                    )}

                    {/* Error inline de rango */}
                    {formError && (
                        <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#e63946", fontSize: 13, fontWeight: "bold" }}>
                            <IconWarning size={14} />
                            <span>{formError}</span>
                        </div>
                    )}

                    <div>
                        <label style={labelStyle}>Motivo</label>
                        <input
                            type="text"
                            value={form.motivo}
                            onChange={e => setForm({ ...form, motivo: e.target.value })}
                            placeholder="Ej: Vacaciones"
                            style={inputStyle}
                            className="focus:border-[#e63946]"
                        />
                    </div>

                    <div style={{
                        background: "#1a1000", border: "1px solid #f59e0b30", borderRadius: 12,
                        padding: 12, display: "flex", gap: 10, alignItems: "center"
                    }}>
                        <IconWarning size={15} className="text-[#f59e0b] flex-shrink-0" />
                        <p style={{ color: "#f59e0b", fontSize: 12, margin: 0 }}>
                            {modo === "rango"
                                ? "Todos los días del rango quedarán sin disponibilidad para los clientes."
                                : "Esta fecha no quedará disponible para los clientes."}
                        </p>
                    </div>

                    <button
                        type="submit"
                        disabled={submitting}
                        style={{
                            background: "#e63946", color: "#fff", border: "none", borderRadius: 12,
                            padding: 15, fontWeight: 800, fontSize: 15, width: "100%", cursor: "pointer",
                            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                            boxSizing: "border-box", marginTop: 4, opacity: submitting ? 0.7 : 1
                        }}
                    >
                        {submitting ? <IconLoader size={18} /> : <><IconBan size={18} /> Bloquear Ahora</>}
                    </button>
                </form>
            </BottomSheet>
        </>
    );
}
