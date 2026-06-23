"use client";

import { useEffect, useState } from "react";
import { getBloqueos, crearBloqueo, eliminarBloqueo } from "@/lib/api";
import { getToken } from "@/lib/auth";
import { Bloqueo } from "@/types";
import {
    Ban,
    Calendar,
    Trash2,
    Plus,
    Loader2,
    AlertTriangle,
    X
} from "lucide-react";

export default function BloqueosPage() {
    const [bloqueos, setBloqueos] = useState<Bloqueo[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({
        fecha: new Date().toISOString().split('T')[0],
        motivo: ""
    });

    const load = async () => {
        setLoading(true);
        try {
            const data = await getBloqueos();
            setBloqueos(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = getToken();
        if (!token) return;

        try {
            await crearBloqueo(token, form);
            setShowModal(false);
            setForm({ fecha: new Date().toISOString().split('T')[0], motivo: "" });
            load();
        } catch (error) {
            alert("Error al crear bloqueo");
        }
    };

    const handleEliminar = async (id: number) => {
        const token = getToken();
        if (!token) return;
        if (!confirm("¿Eliminar este bloqueo?")) return;
        try {
            await eliminarBloqueo(token, id);
            load();
        } catch (error) {
            alert("Error al eliminar");
        }
    };

    return (
        <div className="space-y-8 animate-in slide-in-from-bottom-2 duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black italic uppercase tracking-tighter">
                        Fechas <span className="text-rojo">Bloqueadas</span>
                    </h1>
                    <p className="text-texto-muted text-sm font-medium">Bloqueá días específicos (feriados, vacaciones, mantenimiento).</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="h-12 px-6 bg-rojo text-white rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-rojo/30 active:scale-95 transition-all"
                >
                    <Plus size={20} /> Bloquear Fecha
                </button>
            </div>

            <div className="grid gap-4">
                {loading ? (
                    <div className="py-20 flex justify-center"><Loader2 className="animate-spin text-rojo" /></div>
                ) : bloqueos.length > 0 ? (
                    bloqueos.map(b => (
                        <div key={b.id} className="bg-surface border border-borde p-5 rounded-2xl flex items-center justify-between group hover:border-rojo/40 transition-all">
                            <div className="flex items-center gap-5">
                                <div className="w-12 h-12 bg-surface-2 rounded-xl flex flex-col items-center justify-center border border-borde">
                                    <Ban size={20} className="text-rojo" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-black uppercase italic italic">{new Date(b.fecha + "T12:00:00").toLocaleDateString("es-AR", { day: 'numeric', month: 'long', year: 'numeric' })}</h3>
                                    <p className="text-texto-muted text-sm italic">{b.motivo || "Sin motivo especificado"}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => handleEliminar(b.id)}
                                className="p-3 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    ))
                ) : (
                    <div className="bg-surface border border-dashed border-borde rounded-2xl p-20 text-center">
                        <Ban size={48} className="mx-auto text-texto-muted opacity-20 mb-4" />
                        <p className="text-texto-muted text-sm italic">No hay fechas bloqueadas actualmente.</p>
                    </div>
                )}
            </div>

            {showModal && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-surface border border-borde w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl">
                        <div className="p-6 border-b border-borde flex justify-between items-center bg-surface-2/50">
                            <h2 className="text-xl font-black uppercase italic italic"><span className="text-rojo">Bloquear</span> Fecha</h2>
                            <button onClick={() => setShowModal(false)} className="text-texto-muted hover:text-white"><X size={24} /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="text-[10px] font-bold uppercase text-texto-muted mb-2 block tracking-widest pl-1">Fecha</label>
                                <input required type="date" value={form.fecha} onChange={e => setForm({ ...form, fecha: e.target.value })} className="w-full h-12 bg-bg border border-borde rounded-xl px-4 outline-none focus:border-rojo text-white font-bold" />
                            </div>
                            <div>
                                <label className="text-[10px] font-bold uppercase text-texto-muted mb-2 block tracking-widest pl-1">Motivo (Opcional)</label>
                                <textarea value={form.motivo} onChange={e => setForm({ ...form, motivo: e.target.value })} rows={2} placeholder="Ej: Feriado puente..." className="w-full bg-bg border border-borde rounded-xl p-4 outline-none focus:border-rojo resize-none text-sm" />
                            </div>
                            <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl flex gap-3 text-yellow-500 text-[11px] font-medium italic">
                                <AlertTriangle size={16} className="shrink-0" />
                                <span>Esta fecha no aparecerá disponible para que los clientes reserven.</span>
                            </div>
                            <button
                                type="submit"
                                className="w-full h-14 bg-rojo text-white rounded-xl font-bold text-lg mt-4 shadow-lg shadow-rojo/30 active:scale-95 transition-all flex items-center justify-center gap-2"
                            >
                                Bloquear Ahora
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
