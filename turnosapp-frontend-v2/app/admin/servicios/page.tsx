"use client";

import { useEffect, useState } from "react";
import { getServicios, crearServicio, actualizarServicio, eliminarServicio } from "@/lib/api";
import { getToken } from "@/lib/auth";
import { Servicio } from "@/types";
import {
    Plus,
    Wrench,
    Clock,
    DollarSign,
    Trash2,
    Edit3,
    Loader2,
    CheckCircle2,
    XCircle,
    Save,
    X
} from "lucide-react";

export default function ServiciosPage() {
    const [servicios, setServicios] = useState<Servicio[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState<Servicio | null>(null);
    const [form, setForm] = useState({
        nombre: "",
        descripcion: "",
        duracion: 30,
        precio: 0,
        activo: true
    });

    const load = async () => {
        setLoading(true);
        try {
            const data = await getServicios();
            setServicios(data);
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
            if (editing) {
                await actualizarServicio(token, editing.id, form);
            } else {
                await crearServicio(token, form);
            }
            setShowModal(false);
            setEditing(null);
            setForm({ nombre: "", descripcion: "", duracion: 30, precio: 0, activo: true });
            load();
        } catch (error) {
            alert("Error al guardar servicio");
        }
    };

    const handleEdit = (s: Servicio) => {
        setEditing(s);
        setForm({
            nombre: s.nombre,
            descripcion: s.descripcion || "",
            duracion: s.duracion,
            precio: s.precio || 0,
            activo: s.activo
        });
        setShowModal(true);
    };

    const handleToggleActivo = async (s: Servicio) => {
        const token = getToken();
        if (!token) return;
        try {
            await actualizarServicio(token, s.id, { ...s, activo: !s.activo });
            load();
        } catch (error) {
            alert("Error al cambiar estado");
        }
    };

    return (
        <div className="space-y-8 animate-in slide-in-from-bottom-2 duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black italic uppercase tracking-tighter">
                        Nuestros <span className="text-rojo">Servicios</span>
                    </h1>
                    <p className="text-texto-muted text-sm font-medium">Configurá las prestaciones del taller.</p>
                </div>
                <button
                    onClick={() => { setEditing(null); setForm({ nombre: "", descripcion: "", duracion: 30, precio: 0, activo: true }); setShowModal(true); }}
                    className="h-12 px-6 bg-rojo text-white rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-rojo/30 active:scale-95 transition-all"
                >
                    <Plus size={20} /> Nuevo Servicio
                </button>
            </div>

            <div className="grid gap-4">
                {loading ? (
                    <div className="py-20 flex justify-center"><Loader2 className="animate-spin text-rojo" /></div>
                ) : (
                    servicios.map(s => (
                        <div key={s.id} className={`
              bg-surface border p-5 rounded-2xl flex flex-col md:flex-row md:items-center gap-6 transition-all
              ${s.activo ? 'border-borde' : 'border-dashed border-gray-800 opacity-60'}
            `}>
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <h3 className="text-xl font-black uppercase italic tracking-tight">{s.nombre}</h3>
                                    {!s.activo && <span className="text-[10px] bg-gray-800 text-gray-400 px-2 py-0.5 rounded uppercase font-bold">Inactivo</span>}
                                </div>
                                <p className="text-texto-muted text-sm line-clamp-1">{s.descripcion}</p>
                                <div className="flex items-center gap-4 mt-3">
                                    <div className="flex items-center gap-1.5 text-xs font-bold text-texto-muted">
                                        <Clock size={14} className="text-rojo" /> {s.duracion} min
                                    </div>
                                    <div className="flex items-center gap-1.5 text-xs font-bold text-texto-muted">
                                        <DollarSign size={14} className="text-rojo" /> {s.precio?.toLocaleString()}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 border-t md:border-t-0 border-borde pt-4 md:pt-0">
                                <button
                                    onClick={() => handleToggleActivo(s)}
                                    className={`p-2 rounded-xl border transition-all ${s.activo ? 'bg-gray-800/20 border-gray-700 text-gray-400 hover:text-white' : 'bg-green-500/10 border-green-500/20 text-green-500 hover:bg-green-500 hover:text-white'}`}
                                    title={s.activo ? "Desactivar" : "Activar"}
                                >
                                    {s.activo ? <XCircle size={18} /> : <CheckCircle2 size={18} />}
                                </button>
                                <button
                                    onClick={() => handleEdit(s)}
                                    className="p-2 bg-rojo/10 border border-rojo/20 text-rojo rounded-xl hover:bg-rojo hover:text-white transition-all"
                                    title="Editar"
                                >
                                    <Edit3 size={18} />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-surface border border-borde w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl">
                        <div className="p-6 border-b border-borde flex justify-between items-center bg-surface-2/50">
                            <h2 className="text-xl font-black uppercase italic italic">{editing ? 'Editar' : 'Nuevo'} <span className="text-rojo">Servicio</span></h2>
                            <button onClick={() => setShowModal(false)} className="text-texto-muted hover:text-white"><X size={24} /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="text-[10px] font-bold uppercase text-texto-muted mb-2 block tracking-widest pl-1">Nombre</label>
                                <input required value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} className="w-full h-12 bg-bg border border-borde rounded-xl px-4 outline-none focus:border-rojo" />
                            </div>
                            <div>
                                <label className="text-[10px] font-bold uppercase text-texto-muted mb-2 block tracking-widest pl-1">Descripción</label>
                                <textarea value={form.descripcion} onChange={e => setForm({ ...form, descripcion: e.target.value })} rows={2} className="w-full bg-bg border border-borde rounded-xl p-4 outline-none focus:border-rojo resize-none" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[10px] font-bold uppercase text-texto-muted mb-2 block tracking-widest pl-1">Duración (min)</label>
                                    <input type="number" required value={form.duracion} onChange={e => setForm({ ...form, duracion: parseInt(e.target.value) })} className="w-full h-12 bg-bg border border-borde rounded-xl px-4 outline-none focus:border-rojo" />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold uppercase text-texto-muted mb-2 block tracking-widest pl-1">Precio ($)</label>
                                    <input type="number" value={form.precio} onChange={e => setForm({ ...form, precio: parseInt(e.target.value) })} className="w-full h-12 bg-bg border border-borde rounded-xl px-4 outline-none focus:border-rojo" />
                                </div>
                            </div>
                            <button
                                type="submit"
                                className="w-full h-14 bg-rojo text-white rounded-xl font-bold text-lg mt-4 shadow-lg shadow-rojo/30 active:scale-95 transition-all flex items-center justify-center gap-2"
                            >
                                <Save size={20} /> Guardar Cambios
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
