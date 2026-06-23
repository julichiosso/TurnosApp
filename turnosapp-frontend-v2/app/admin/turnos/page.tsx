"use client";

import { useEffect, useState } from "react";
import { getTurnos, updateEstadoTurno } from "@/lib/api";
import { getToken } from "@/lib/auth";
import { Turno } from "@/types";
import {
    Calendar,
    CheckCircle,
    XCircle,
    Loader2,
    Phone,
    Wrench,
    ChevronLeft,
    ChevronRight
} from "lucide-react";

export default function TurnosPage() {
    const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);
    const [turnos, setTurnos] = useState<Turno[]>([]);
    const [loading, setLoading] = useState(true);

    const load = async () => {
        const token = getToken();
        if (!token) return;
        setLoading(true);
        try {
            const data = await getTurnos(token, fecha);
            setTurnos(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, [fecha]);

    const handleEstado = async (id: number, nuevoEstado: string) => {
        const token = getToken();
        if (!token) return;
        try {
            await updateEstadoTurno(token, id, nuevoEstado);
            load();
        } catch (error) {
            alert("Error al actualizar estado");
        }
    };

    const cambiarDia = (offset: number) => {
        const d = new Date(fecha + "T12:00:00");
        d.setDate(d.getDate() + offset);
        setFecha(d.toISOString().split('T')[0]);
    };

    return (
        <div className="space-y-8 animate-in slide-in-from-bottom-2 duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black italic uppercase tracking-tighter">
                        Gestión de <span className="text-rojo">Turnos</span>
                    </h1>
                    <p className="text-texto-muted text-sm font-medium">Control total sobre la agenda del taller.</p>
                </div>

                <div className="flex items-center gap-2 bg-surface p-1 rounded-xl border border-borde shadow-lg">
                    <button onClick={() => cambiarDia(-1)} className="p-2 hover:bg-surface-2 rounded-lg text-texto-muted transition-colors"><ChevronLeft size={20} /></button>
                    <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-rojo" size={16} />
                        <input
                            type="date"
                            value={fecha}
                            onChange={(e) => setFecha(e.target.value)}
                            className="bg-transparent text-white font-bold text-sm h-10 pl-10 pr-4 outline-none uppercase"
                        />
                    </div>
                    <button onClick={() => cambiarDia(1)} className="p-2 hover:bg-surface-2 rounded-lg text-texto-muted transition-colors"><ChevronRight size={20} /></button>
                </div>
            </div>

            <div className="space-y-4">
                {loading ? (
                    <div className="py-20 flex flex-col items-center">
                        <Loader2 className="animate-spin text-rojo" size={32} />
                    </div>
                ) : turnos.length > 0 ? (
                    <div className="grid gap-4">
                        {turnos.sort((a, b) => a.hora.localeCompare(b.hora)).map(turno => (
                            <div key={turno.id} className="bg-surface border border-borde rounded-2xl overflow-hidden group hover:border-rojo/40 transition-all shadow-md">
                                <div className="p-5 flex flex-col lg:flex-row lg:items-center gap-6">
                                    <div className="flex items-center gap-4 min-w-[220px]">
                                        <div className="w-14 h-14 bg-surface-2 rounded-2xl flex flex-col items-center justify-center border border-borde shadow-inner">
                                            <span className="text-[10px] font-black text-rojo uppercase tracking-tighter">HORA</span>
                                            <span className="text-lg font-black text-white leading-none">{turno.hora}</span>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-rojo uppercase tracking-[0.2em]">{turno.servicio?.nombre}</p>
                                            <p className="text-xl font-black italic uppercase italic tracking-tight">{turno.nombreCliente}</p>
                                        </div>
                                    </div>

                                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="flex items-center gap-3 text-texto-muted">
                                            <div className="w-8 h-8 bg-surface-2 rounded-lg flex items-center justify-center text-rojo border border-borde">
                                                <Phone size={14} />
                                            </div>
                                            <p className="text-sm font-bold tracking-tight">{turno.telefonoCliente}</p>
                                        </div>
                                        <div className="flex items-center gap-3 text-texto-muted">
                                            <div className="w-8 h-8 bg-surface-2 rounded-lg flex items-center justify-center text-rojo border border-borde">
                                                <Wrench size={14} />
                                            </div>
                                            <p className="text-sm font-medium">Carga: {turno.servicio?.duracion} min</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 border-t lg:border-t-0 border-borde pt-4 lg:pt-0">
                                        <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border
                      ${turno.estado === 'pendiente' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' :
                                                turno.estado === 'confirmado' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                                                    turno.estado === 'cancelado' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                                                        'bg-gray-500/10 text-gray-400 border-gray-500/20'}
                    `}>
                                            {turno.estado}
                                        </div>

                                        <div className="flex items-center gap-2 ml-auto lg:ml-0">
                                            {turno.estado === 'pendiente' && (
                                                <button
                                                    onClick={() => handleEstado(turno.id, 'confirmado')}
                                                    className="p-2 bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white rounded-xl transition-all border border-green-500/20 shadow-sm"
                                                    title="Confirmar"
                                                >
                                                    <CheckCircle size={18} />
                                                </button>
                                            )}
                                            {(turno.estado === 'pendiente' || turno.estado === 'confirmado') && (
                                                <button
                                                    onClick={() => handleEstado(turno.id, 'cancelado')}
                                                    className="p-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all border border-red-500/20 shadow-sm"
                                                    title="Cancelar"
                                                >
                                                    <XCircle size={18} />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                {turno.descripcionTrabajo && (
                                    <div className="bg-black/20 px-5 py-3 text-xs text-texto-muted italic border-t border-borde">
                                        "{turno.descripcionTrabajo}"
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-surface border border-dashed border-borde rounded-3xl p-20 text-center shadow-xl">
                        <Calendar size={48} className="mx-auto text-rojo/20 mb-4" />
                        <p className="text-texto-muted font-bold uppercase tracking-widest text-xs">Agenda vacía para hoy</p>
                    </div>
                )}
            </div>
        </div>
    );
}
