"use client";

import { useEffect, useState } from "react";
import { getConfig, actualizarConfig } from "@/lib/api";
import { getToken } from "@/lib/auth";
import { HorarioConfig } from "@/types";
import {
    Clock,
    Save,
    Loader2,
    CheckCircle2,
    AlertCircle
} from "lucide-react";

const DIAS = [
    { id: 1, name: "Lunes" },
    { id: 2, name: "Martes" },
    { id: 3, name: "Miércoles" },
    { id: 4, name: "Jueves" },
    { id: 5, name: "Viernes" },
    { id: 6, name: "Sábado" },
    { id: 0, name: "Domingo" },
];

export default function HorariosPage() {
    const [configs, setConfigs] = useState<HorarioConfig[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        async function load() {
            try {
                const data = await getConfig();
                setConfigs(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    const handleChange = (dia: number, field: string, value: any) => {
        setConfigs(prev => prev.map(c => c.diaSemana === dia ? { ...c, [field]: value } : c));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = getToken();
        if (!token) return;

        setSaving(true);
        setSuccess(false);
        try {
            await actualizarConfig(token, configs);
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        } catch (error) {
            alert("Error al guardar configuración");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="space-y-8 animate-in slide-in-from-bottom-2 duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black italic uppercase tracking-tighter">
                        Horarios <span className="text-rojo">Laborales</span>
                    </h1>
                    <p className="text-texto-muted text-sm font-medium">Definí cuándo está abierto el taller para recibir turnos.</p>
                </div>

                {success && (
                    <div className="flex items-center gap-2 text-green-500 font-bold animate-bounce">
                        <CheckCircle2 size={20} /> ¡Configuración guardada!
                    </div>
                )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="bg-surface border border-borde rounded-3xl overflow-hidden shadow-xl">
                    <div className="grid grid-cols-1 divide-y divide-borde">
                        {DIAS.map((d) => {
                            const cfg = configs.find(c => c.diaSemana === d.id) || { diaSemana: d.id, abierto: false, horaInicio: "08:00", horaFin: "18:00" };
                            return (
                                <div key={d.id} className="p-4 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-surface-2/30 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-3 h-3 rounded-full ${cfg.abierto ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-gray-700'}`}></div>
                                        <span className="text-lg font-black uppercase italic italic w-24">{d.name}</span>
                                    </div>

                                    <div className="flex items-center gap-6">
                                        <label className="flex items-center gap-2 cursor-pointer group">
                                            <input
                                                type="checkbox"
                                                checked={cfg.abierto}
                                                onChange={e => handleChange(d.id, 'abierto', e.target.checked)}
                                                className="hidden"
                                            />
                                            <div className={`w-12 h-6 rounded-full relative transition-all ${cfg.abierto ? 'bg-rojo' : 'bg-gray-800'}`}>
                                                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${cfg.abierto ? 'right-1' : 'left-1'}`}></div>
                                            </div>
                                            <span className="text-xs font-bold uppercase tracking-widest text-texto-muted group-hover:text-white">
                                                {cfg.abierto ? 'Abierto' : 'Cerrado'}
                                            </span>
                                        </label>

                                        {cfg.abierto && (
                                            <div className="flex items-center gap-3 bg-bg border border-borde rounded-xl px-4 py-2">
                                                <Clock size={16} className="text-rojo" />
                                                <input
                                                    type="time"
                                                    value={cfg.horaInicio}
                                                    onChange={e => handleChange(d.id, 'horaInicio', e.target.value)}
                                                    className="bg-transparent text-white font-bold outline-none text-sm"
                                                />
                                                <span className="text-texto-muted font-bold">-</span>
                                                <input
                                                    type="time"
                                                    value={cfg.horaFin}
                                                    onChange={e => handleChange(d.id, 'horaFin', e.target.value)}
                                                    className="bg-transparent text-white font-bold outline-none text-sm"
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="pt-4 flex justify-end">
                    <button
                        type="submit"
                        disabled={saving || loading}
                        className="h-14 px-10 bg-rojo text-white rounded-xl font-bold text-lg flex items-center gap-3 shadow-lg shadow-rojo/30 active:scale-95 transition-all disabled:opacity-50"
                    >
                        {saving ? <Loader2 className="animate-spin" /> : <Save size={20} />}
                        Guardar Configuración
                    </button>
                </div>
            </form>

            <div className="bg-rojo/5 border border-rojo/20 rounded-2xl p-6 flex gap-4">
                <AlertCircle className="text-rojo shrink-0" />
                <div>
                    <p className="text-rojo font-bold uppercase text-xs tracking-widest mb-1">Nota importante</p>
                    <p className="text-texto-muted text-[13px] leading-relaxed">
                        Los cambios en los horarios laborales afectan la disponibilidad de turnos en tiempo real.<br />
                        Si cerrás un día que ya tiene turnos otorgados, estos seguirán existiendo en tu agenda.
                    </p>
                </div>
            </div>
        </div>
    );
}
