"use client";

import { useEffect, useState } from "react";
import { getHorarios, actualizarHorario } from "@/lib/api";
import { getToken } from "@/lib/auth";
import { HorarioConfig } from "@/types";
import Toast from "@/components/admin/Toast";
import BottomSheet from "@/components/BottomSheet";
import Toggle from "@/components/Toggle";
import { IconClock, IconWarning, IconCheck, IconX, IconLoader } from "@/components/icons";

const DIAS = [
    { id: 1, abrev: "LUN", name: "Lunes" },
    { id: 2, abrev: "MAR", name: "Martes" },
    { id: 3, abrev: "MIÉ", name: "Miércoles" },
    { id: 4, abrev: "JUE", name: "Jueves" },
    { id: 5, abrev: "VIE", name: "Viernes" },
    { id: 6, abrev: "SÁB", name: "Sábado" },
    { id: 0, abrev: "DOM", name: "Domingo" },
];

const INTERVALOS = [15, 20, 30, 45, 60];

function mensajeError(err: any): string {
    const status = err?.status;
    if (!status || err.message === "Failed to fetch") return "Sin conexión. Verificá tu red.";
    if (status === 401 || status === 403) return "Sesión expirada. Volvé a iniciar sesión.";
    if (status === 400) return "Datos inválidos. Revisá los horarios ingresados.";
    return `Error del servidor (${status}). Reintentá en un momento.`;
}

interface DayBottomSheetProps {
    dia: typeof DIAS[0] | null;
    config: HorarioConfig | null;
    onClose: () => void;
    onSave: (diaId: number, data: Partial<HorarioConfig>) => Promise<void>;
}

function DayBottomSheet({ dia, config, onClose, onSave }: DayBottomSheetProps) {
    const [horaInicio, setHoraInicio] = useState("09:00");
    const [horaFin, setHoraFin] = useState("18:00");
    const [intervalo, setIntervalo] = useState(30);
    const [error, setError] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (config) {
            setHoraInicio(config.horaInicio || "09:00");
            setHoraFin(config.horaFin || "18:00");
            setIntervalo((config as any).intervalo || 30);
        }
        setError(null);
    }, [config, dia]);

    if (!dia) return null;

    const handleSave = async () => {
        if (horaFin <= horaInicio) {
            setError("La hora de fin debe ser mayor a la hora de inicio.");
            return;
        }
        setSaving(true);
        setError(null);
        try {
            await onSave(dia.id, { horaInicio, horaFin, abierto: true, intervalo });
            onClose();
        } catch (err: any) {
            console.error("[Horarios] Error al guardar:", err);
            setError(mensajeError(err));
        } finally {
            setSaving(false);
        }
    };

    return (
        <BottomSheet open={!!dia} onClose={onClose}>
            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                <h2 style={{ fontSize: 18, fontWeight: 900, textTransform: "uppercase", color: "#f5f5f5" }}>
                    Configurar <span style={{ color: "#e63946" }}>{dia.name}</span>
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

            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {/* Time inputs */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <div>
                        <label style={{ fontSize: 10, color: "#888", fontWeight: 800, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 6 }}>
                            Hora inicio
                        </label>
                        <div style={{
                            display: "flex", alignItems: "center", gap: 8, background: "#1a1a1a",
                            border: "1px solid #2a2a2a", borderRadius: 10, padding: "8px 12px"
                        }}>
                            <IconClock size={16} className="text-[#e63946]" />
                            <input
                                type="time"
                                value={horaInicio}
                                onChange={e => { setHoraInicio(e.target.value); setError(null); }}
                                style={{
                                    background: "transparent", border: "none", color: "#fff",
                                    fontWeight: "bold", fontSize: 15, outline: "none", width: "100%"
                                }}
                            />
                        </div>
                    </div>
                    <div>
                        <label style={{ fontSize: 10, color: "#888", fontWeight: 800, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 6 }}>
                            Hora fin
                        </label>
                        <div style={{
                            display: "flex", alignItems: "center", gap: 8, background: "#1a1a1a",
                            border: error && error.includes("fin") ? "1px solid #e63946" : "1px solid #2a2a2a",
                            borderRadius: 10, padding: "8px 12px"
                        }}>
                            <IconClock size={16} className="text-[#e63946]" />
                            <input
                                type="time"
                                value={horaFin}
                                onChange={e => { setHoraFin(e.target.value); setError(null); }}
                                style={{
                                    background: "transparent", border: "none", color: "#fff",
                                    fontWeight: "bold", fontSize: 15, outline: "none", width: "100%"
                                }}
                            />
                        </div>
                    </div>
                </div>

                {/* Error inline */}
                {error && (
                    <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#e63946", fontSize: 13, fontWeight: "bold" }}>
                        <IconWarning size={14} />
                        <span>{error}</span>
                    </div>
                )}

                {/* Intervalo chips */}
                <div>
                    <label style={{ fontSize: 10, color: "#888", fontWeight: 800, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 8 }}>
                        Intervalo entre turnos
                    </label>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                        {INTERVALOS.map(min => {
                            const active = intervalo === min;
                            return (
                                <button
                                    key={min}
                                    type="button"
                                    onClick={() => setIntervalo(min)}
                                    style={{
                                        padding: "8px 14px", height: 38, borderRadius: 10, fontSize: 13,
                                        fontWeight: "bold", border: active ? "1px solid #e63946" : "1px solid #2a2a2a",
                                        background: active ? "#2a000a" : "#1a1a1a",
                                        color: active ? "#e63946" : "#888", cursor: "pointer",
                                        transition: "all 0.15s"
                                    }}
                                >
                                    {min} min
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Save button */}
                <button
                    onClick={handleSave}
                    disabled={saving}
                    style={{
                        background: "#e63946", color: "#fff", border: "none", borderRadius: 12,
                        padding: 15, fontWeight: 800, fontSize: 15, width: "100%", cursor: "pointer",
                        display: "flex", alignItems: "center", justifyItems: "center", justifyContent: "center", gap: 8,
                        opacity: saving ? 0.7 : 1, marginTop: 8
                    }}
                >
                    {saving ? <IconLoader size={18} /> : "Guardar"}
                </button>
            </div>
        </BottomSheet>
    );
}

export default function HorariosPage() {
    const [configs, setConfigs] = useState<HorarioConfig[]>([]);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState<string | null>(null);
    const [sheetDia, setSheetDia] = useState<typeof DIAS[0] | null>(null);
    const [savedDays, setSavedDays] = useState<number[]>([]);

    const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 2500); };

    useEffect(() => {
        const token = getToken();
        if (!token) return;
        getHorarios(token)
            .then(setConfigs)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const getConfigForDia = (id: number): HorarioConfig =>
        configs.find(c => c.diaSemana === id) || { diaSemana: id, abierto: false, activo: false, horaInicio: "09:00", horaFin: "18:00" };

    const handleToggle = async (diaItem: typeof DIAS[0]) => {
        const cfg = getConfigForDia(diaItem.id);
        const nuevoActivo = !cfg.abierto;
        // Actualizar estado local optimistamente
        const newConfigs = configs.some(c => c.diaSemana === diaItem.id)
            ? configs.map(c => c.diaSemana === diaItem.id ? { ...c, abierto: nuevoActivo, activo: nuevoActivo } : c)
            : [...configs, { ...cfg, abierto: nuevoActivo, activo: nuevoActivo }];
        setConfigs(newConfigs);

        if (nuevoActivo) {
            // Si se activa, abrir sheet para configurar horario
            setSheetDia(diaItem);
        } else {
            // Si se desactiva, guardar silenciosamente
            const token = getToken();
            if (!token) return;
            try {
                await actualizarHorario(token, diaItem.id, { ...cfg, abierto: false });
            } catch (err) {
                console.error("[Horarios] Error al desactivar día:", err);
                // Revertir en caso de error
                setConfigs(configs);
                showToast("No se pudo desactivar. Reintentá.");
            }
        }
    };

    const handleSaveDay = async (diaId: number, data: Partial<HorarioConfig>) => {
        const token = getToken();
        if (!token) throw Object.assign(new Error("Sin token"), { status: 401 });

        const cfg = getConfigForDia(diaId);
        const updated = { ...cfg, ...data, abierto: true, activo: true };

        // Actualizar estado local optimistamente
        const newConfigs = configs.some(c => c.diaSemana === diaId)
            ? configs.map(c => c.diaSemana === diaId ? updated : c)
            : [...configs, updated];
        setConfigs(newConfigs);

        // Llamar al endpoint correcto: PUT /api/horarios/:dia
        await actualizarHorario(token, diaId, updated);

        showToast("Horario guardado");
        setSavedDays(prev => [...prev, diaId]);
        setTimeout(() => setSavedDays(prev => prev.filter(d => d !== diaId)), 2000);
    };

    const openEdit = (diaItem: typeof DIAS[0]) => {
        const cfg = getConfigForDia(diaItem.id);
        if (cfg.abierto) setSheetDia(diaItem);
    };

    return (
        <>
            <Toast message={toast} />
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                {/* Header */}
                <div>
                    <h1 style={{ fontSize: 24, fontWeight: 900, textTransform: "uppercase", letterSpacing: "-0.05em", fontStyle: "italic" }}>
                        Horarios <span style={{ color: "#e63946" }}>Laborales</span>
                    </h1>
                    <p style={{ color: "#888", fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: 1, marginTop: 4 }}>
                        Tocá un día activo para editar sus horarios.
                    </p>
                </div>

                {loading ? (
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 0" }}>
                        <IconLoader size={28} className="text-[#e63946]" />
                        <p style={{ color: "#888", fontSize: 11, fontWeight: 800, letterSpacing: 1, textTransform: "uppercase", marginTop: 12 }}>Cargando...</p>
                    </div>
                ) : (
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                        {DIAS.map((diaItem, i) => {
                            const cfg = getConfigForDia(diaItem.id);
                            const isOpen = cfg.abierto;
                            const wasSaved = savedDays.includes(diaItem.id);
                            const isLast = i === DIAS.length - 1;

                            return (
                                <div
                                    key={diaItem.id}
                                    style={{
                                        gridColumn: isLast ? "span 2" : "auto",
                                        justifySelf: isLast ? "center" : "stretch",
                                        width: isLast ? "calc(50% - 6px)" : "auto",
                                    }}
                                >
                                    <div
                                        onClick={() => isOpen ? openEdit(diaItem) : undefined}
                                        style={{
                                            background: isOpen ? "#1a1a1a" : "#0d0d0d",
                                            border: isOpen ? "1px solid #e6394650" : "1px solid #2a2a2a",
                                            borderRadius: 18, transition: "all 0.2s", overflow: "hidden",
                                            cursor: isOpen ? "pointer" : "default", opacity: isOpen ? 1 : 0.6
                                        }}
                                    >
                                        {/* Header row */}
                                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 14px 8px" }}>
                                            <span style={{ fontSize: 13, fontWeight: "bold", textTransform: "uppercase", color: isOpen ? "#fff" : "#555" }}>
                                                {diaItem.abrev}
                                            </span>
                                            <div onClick={(e) => { e.stopPropagation(); handleToggle(diaItem); }}>
                                                <Toggle active={isOpen} onChange={() => { }} />
                                            </div>
                                        </div>

                                        {/* Time / status */}
                                        <div style={{ padding: "0 14px 12px", minHeight: 24, display: "flex", alignItems: "center" }}>
                                            {isOpen ? (
                                                wasSaved ? (
                                                    <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#22c55e", fontSize: 12, fontWeight: "bold" }}>
                                                        <IconCheck size={14} />
                                                        <span>Guardado</span>
                                                    </div>
                                                ) : (
                                                    <p style={{ fontSize: 12, color: "#888", fontWeight: "medium", display: "flex", alignItems: "center", gap: 4, margin: 0 }}>
                                                        <IconClock size={11} className="text-[#e63946]" />
                                                        {cfg.horaInicio} - {cfg.horaFin}
                                                    </p>
                                                )
                                            ) : (
                                                <p style={{ fontSize: 12, color: "#444", fontWeight: "medium", margin: 0 }}>No disponible</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Info note */}
                <div style={{
                    background: "#1a1000", border: "1px solid #f59e0b30", borderRadius: 12,
                    padding: 16, display: "flex", gap: 12, alignItems: "flex-start"
                }}>
                    <IconWarning className="text-[#f59e0b] mt-0.5" size={16} />
                    <p style={{ fontSize: 12, color: "#f59e0b", lineHeight: 1.6, margin: 0 }}>
                        Los cambios afectan la disponibilidad en tiempo real. Los turnos ya agendados no se cancelan automáticamente.
                    </p>
                </div>
            </div>

            {sheetDia && (
                <DayBottomSheet
                    dia={sheetDia}
                    config={getConfigForDia(sheetDia.id)}
                    onClose={() => setSheetDia(null)}
                    onSave={handleSaveDay}
                />
            )}
        </>
    );
}
