"use client";

import { useEffect, useState, useCallback } from "react";
import { getServicios, crearServicio, actualizarServicio } from "@/lib/api";
import { getToken } from "@/lib/auth";
import { Servicio } from "@/types";
import ServicioBottomSheet from "@/components/admin/ServicioBottomSheet";
import Toast from "@/components/admin/Toast";
import BottomSheet from "@/components/BottomSheet";
import {
    IconPlusCircle,
    IconWrench,
    IconClockSmall,
    IconEdit,
    IconXCircle,
    IconCheck,
    IconX,
    IconChevronRight,
    IconLoader
} from "@/components/icons";

const PAGE_INIT = 5;

export default function ServiciosPage() {
    const [servicios, setServicios] = useState<Servicio[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAll, setShowAll] = useState(false);
    const [editing, setEditing] = useState<Servicio | null>(null);
    const [sheetOpen, setSheetOpen] = useState(false);
    const [toast, setToast] = useState<string | null>(null);
    const [confirmServicio, setConfirmServicio] = useState<Servicio | null>(null);

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
    const handleDeactivateClick = (s: Servicio) => {
        if (s.activo) setConfirmServicio(s);
        else toggleActivo(s);
    };

    const displayed = showAll ? servicios : servicios.slice(0, PAGE_INIT);

    return (
        <>
            <Toast message={toast} />
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                {/* Header */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                    <div style={{ flex: 1 }}>
                        <h1 style={{ fontSize: 24, fontWeight: 900, textTransform: "uppercase", letterSpacing: "-0.05em", fontStyle: "italic", lineHeight: 1.1 }}>
                            Nuestros <span style={{ color: "#e63946" }}>Servicios</span>
                        </h1>
                        <p style={{ color: "#888", fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: 1, marginTop: 6 }}>
                            {servicios.length} servicios configurados
                        </p>
                    </div>
                    <button
                        onClick={openNew}
                        style={{
                            height: 42, padding: "0 14px", background: "#e63946", color: "#fff",
                            border: "none", borderRadius: 12, fontWeight: "900", fontSize: 13,
                            textTransform: "uppercase", display: "flex", alignItems: "center", gap: 6, cursor: "pointer",
                            boxShadow: "0 8px 15px -4px rgba(230, 57, 70, 0.4)", flexShrink: 0
                        }}
                    >
                        <IconPlusCircle size={16} /> Nuevo
                    </button>
                </div>

                {/* List */}
                {loading ? (
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 0" }}>
                        <IconLoader size={28} className="text-[#e63946]" />
                        <p style={{ color: "#888", fontSize: 11, fontWeight: 800, letterSpacing: 1, textTransform: "uppercase", marginTop: 12 }}>Cargando...</p>
                    </div>
                ) : servicios.length > 0 ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                        {displayed.map((s) => (
                            <div
                                key={s.id}
                                style={{
                                    background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: 18,
                                    padding: 16, display: "flex", alignItems: "center", gap: 16,
                                    opacity: s.activo ? 1 : 0.5, transition: "opacity 0.2s"
                                }}
                            >
                                {/* Info */}
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                        <p style={{ fontSize: 16, fontWeight: 900, textTransform: "uppercase", fontStyle: "italic", color: "#f5f5f5", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", margin: 0 }}>
                                            {s.nombre}
                                        </p>
                                        {!s.activo && (
                                            <span style={{ fontSize: 9, background: "#2a2a2a", color: "#888", padding: "2px 6px", borderRadius: 4, fontWeight: "bold", textTransform: "uppercase" }}>
                                                Inactivo
                                            </span>
                                        )}
                                    </div>
                                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 6 }}>
                                        <span style={{ fontSize: 12, color: "#888", display: "flex", alignItems: "center", gap: 4 }}>
                                            <IconClockSmall size={12} className="text-[#e63946]" /> {s.duracion} min
                                        </span>
                                        {s.precio ? (
                                            <span style={{ fontSize: 12, color: "#888", display: "flex", alignItems: "center", gap: 4 }}>
                                                <span style={{ color: "#e63946", fontWeight: "bold" }}>$</span> {s.precio.toLocaleString()}
                                            </span>
                                        ) : null}
                                    </div>
                                </div>

                                {/* Actions */}
                                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                    <button
                                        onClick={() => handleDeactivateClick(s)}
                                        style={{
                                            width: 40, height: 40, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center",
                                            background: s.activo ? "#2a2a2a" : "#22c55e15",
                                            border: s.activo ? "1px solid #2a2a2a" : "1px solid #22c55e30",
                                            color: s.activo ? "#888" : "#22c55e",
                                            cursor: "pointer"
                                        }}
                                    >
                                        {s.activo ? <IconXCircle size={18} /> : <IconCheck size={18} />}
                                    </button>
                                    <button
                                        onClick={() => openEdit(s)}
                                        style={{
                                            width: 40, height: 40, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center",
                                            background: "rgba(230, 57, 70, 0.1)", border: "1px solid rgba(230, 57, 70, 0.2)",
                                            color: "#e63946", cursor: "pointer"
                                        }}
                                    >
                                        <IconEdit size={18} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "64px 20px", textAlign: "center" }}>
                        <IconWrench size={48} className="text-[#2a2a2a]" />
                        <p style={{ fontSize: 16, fontWeight: 800, color: "#f5f5f5", marginTop: 12 }}>Sin servicios</p>
                        <p style={{ fontSize: 13, color: "#888", marginTop: 4 }}>Creá el primero con el botón +</p>
                    </div>
                )}

                {/* Ver más */}
                {!showAll && servicios.length > PAGE_INIT && (
                    <button
                        onClick={() => setShowAll(true)}
                        style={{
                            width: "100%", height: 48, background: "transparent", border: "1px dashed #2a2a2a",
                            borderRadius: 16, color: "#888", fontSize: 14, fontWeight: "bold",
                            display: "flex", alignItems: "center", justifyContent: "center", gap: 8, cursor: "pointer"
                        }}
                    >
                        Ver {servicios.length - PAGE_INIT} más
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

            {/* Confirm deactivate sheet */}
            <BottomSheet open={!!confirmServicio} onClose={() => setConfirmServicio(null)}>
                {confirmServicio && (
                    <>
                        <p style={{ fontSize: 10, fontWeight: 800, letterSpacing: 1, color: "#888", textTransform: "uppercase", marginBottom: 6 }}>
                            Confirmar acción
                        </p>
                        <p style={{ fontSize: 18, fontWeight: 800, textTransform: "uppercase", color: "#f5f5f5", marginBottom: 4 }}>
                            Desactivar <span style={{ color: "#e63946" }}>{confirmServicio.nombre}</span>
                        </p>
                        <p style={{ color: "#888", fontSize: 14, marginBottom: 24, marginTop: 0 }}>
                            El servicio no aparecerá en el formulario de reservas.
                        </p>
                        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                            <button
                                onClick={() => { toggleActivo(confirmServicio); setConfirmServicio(null); }}
                                style={{
                                    background: "#e63946", color: "#fff", border: "none", borderRadius: 12,
                                    padding: 15, fontWeight: 800, fontSize: 15, width: "100%", cursor: "pointer"
                                }}
                            >
                                Desactivar
                            </button>
                            <button
                                onClick={() => setConfirmServicio(null)}
                                style={{
                                    background: "#1a1a1a", color: "#888", border: "1px solid #2a2a2a", borderRadius: 12,
                                    padding: 14, fontWeight: 700, fontSize: 15, width: "100%", cursor: "pointer"
                                }}
                            >
                                Cancelar
                            </button>
                        </div>
                    </>
                )}
            </BottomSheet>
        </>
    );
}
