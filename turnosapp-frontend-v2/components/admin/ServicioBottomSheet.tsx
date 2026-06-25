"use client";

import { useState, useEffect } from "react";
import { Servicio } from "../../types";
import BottomSheet from "@/components/BottomSheet";
import { IconSave, IconX, IconLoader } from "@/components/icons";

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
        <BottomSheet open={open} onClose={onClose}>
            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                <h2 style={{ fontSize: 18, fontWeight: 900, textTransform: "uppercase", color: "#f5f5f5" }}>
                    {servicio ? "Editar" : "Nuevo"} <span style={{ color: "#e63946" }}>Servicio</span>
                </h2>
                <button
                    onClick={onClose}
                    style={{
                        border: "none", background: "#1a1a1a", color: "#888",
                        width: 36, height: 36, borderRadius: 10, display: "flex",
                        alignItems: "center", justifyContent: "center", cursor: "pointer"
                    }}
                >
                    <IconX size={18} />
                </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div>
                    <label style={{ fontSize: 10, color: "#888", fontWeight: 800, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 6 }}>
                        Nombre *
                    </label>
                    <input
                        required
                        value={form.nombre}
                        onChange={e => setForm({ ...form, nombre: e.target.value })}
                        placeholder="Ej: Reparación de chapa"
                        style={{
                            background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: 10,
                            padding: "13px 14px", color: "#f5f5f5", fontSize: 15, width: "100%",
                            outline: "none", boxSizing: "border-box"
                        }}
                        className="focus:border-[#e63946]"
                    />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <div>
                        <label style={{ fontSize: 10, color: "#888", fontWeight: 800, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 6 }}>
                            Duración (min) *
                        </label>
                        <input
                            required
                            type="number"
                            min={15}
                            step={15}
                            value={form.duracion}
                            onChange={e => setForm({ ...form, duracion: parseInt(e.target.value) })}
                            style={{
                                background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: 10,
                                padding: "13px 14px", color: "#f5f5f5", fontSize: 15, width: "100%",
                                outline: "none", boxSizing: "border-box"
                            }}
                            className="focus:border-[#e63946]"
                        />
                    </div>
                    <div>
                        <label style={{ fontSize: 10, color: "#888", fontWeight: 800, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 6 }}>
                            Precio
                        </label>
                        <div style={{ position: "relative", width: "100%" }}>
                            <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#888", fontWeight: "bold", fontSize: 15, pointerEvents: "none" }}>$</span>
                            <input
                                type="number"
                                min={0}
                                value={form.precio}
                                onChange={e => setForm({ ...form, precio: parseInt(e.target.value) || 0 })}
                                style={{
                                    background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: 10,
                                    padding: "13px 14px 13px 28px", color: "#f5f5f5", fontSize: 15, width: "100%",
                                    outline: "none", boxSizing: "border-box"
                                }}
                                className="focus:border-[#e63946]"
                            />
                        </div>
                    </div>
                </div>

                <div>
                    <label style={{ fontSize: 10, color: "#888", fontWeight: 800, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 6 }}>
                        Descripción
                    </label>
                    <textarea
                        value={form.descripcion}
                        onChange={e => setForm({ ...form, descripcion: e.target.value })}
                        rows={2}
                        placeholder="Breve descripción del servicio..."
                        style={{
                            background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: 10,
                            padding: "13px 14px", color: "#f5f5f5", fontSize: 15, width: "100%",
                            outline: "none", resize: "none", boxSizing: "border-box"
                        }}
                        className="focus:border-[#e63946]"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    style={{
                        background: "#e63946", color: "#fff", border: "none", borderRadius: 12,
                        padding: 15, fontWeight: 800, fontSize: 15, width: "100%", cursor: "pointer",
                        display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                        boxSizing: "border-box", opacity: loading ? 0.7 : 1, marginTop: 10
                    }}
                >
                    {loading ? <IconLoader size={18} /> : <><IconSave size={18} /> Guardar Cambios</>}
                </button>
            </form>
        </BottomSheet>
    );
}
