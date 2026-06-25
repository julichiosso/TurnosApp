"use client";

import { useState } from "react";
import { IconPhone, IconLoader } from "@/components/icons";

interface Props {
    onSubmit: (data: any) => void;
    loading: boolean;
}

const inputBase = "w-full bg-[#0A0A0A] border border-[#1e1e1e] text-white outline-none transition-colors focus:border-[#CC0000] placeholder:text-gray-700";

export default function FormularioCliente({ onSubmit, loading }: Props) {
    const [form, setForm] = useState({
        nombreCliente: "",
        telefonoCliente: "",
        emailCliente: "",
        descripcionTrabajo: ""
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(form);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* Grupo 1 — Datos de contacto */}
            <div className="rounded-2xl border border-[#1e1e1e] overflow-hidden">
                <p className="text-[11px] font-bold uppercase tracking-widest text-gray-600 px-4 pt-3 pb-2 border-b border-[#1a1a1a]">
                    Tus datos de contacto
                </p>

                {/* Nombre */}
                <div className="relative border-b border-[#1a1a1a]">
                    <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-[#CC0000]" width={17} height={17} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                        <circle cx={12} cy={7} r={4} />
                    </svg>
                    <input
                        required
                        name="nombreCliente"
                        value={form.nombreCliente}
                        onChange={handleChange}
                        placeholder="Nombre completo *"
                        style={{ fontSize: "16px" }}
                        className={`${inputBase} h-14 pl-11 pr-4 rounded-none border-0 border-b border-[#1a1a1a]`}
                    />
                </div>

                {/* Teléfono */}
                <div className="relative">
                    <IconPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-[#CC0000]" size={17} />
                    <input
                        required
                        type="tel"
                        name="telefonoCliente"
                        value={form.telefonoCliente}
                        onChange={handleChange}
                        placeholder="Teléfono *"
                        style={{ fontSize: "16px" }}
                        className={`${inputBase} h-14 pl-11 pr-4 rounded-none border-0`}
                    />
                </div>
            </div>

            {/* Grupo 2 — Info adicional */}
            <div className="rounded-2xl border border-[#1e1e1e] overflow-hidden">
                <p className="text-[11px] font-bold uppercase tracking-widest text-gray-600 px-4 pt-3 pb-2 border-b border-[#1a1a1a]">
                    Info adicional (opcional)
                </p>

                {/* Email */}
                <div className="relative border-b border-[#1a1a1a]">
                    <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-[#CC0000]" width={17} height={17} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                        <polyline points="22,6 12,13 2,6" />
                    </svg>
                    <input
                        type="email"
                        name="emailCliente"
                        value={form.emailCliente}
                        onChange={handleChange}
                        placeholder="Email"
                        style={{ fontSize: "16px" }}
                        className={`${inputBase} h-14 pl-11 pr-4 rounded-none border-0 border-b border-[#1a1a1a]`}
                    />
                </div>

                {/* Nota */}
                <div className="relative">
                    <svg className="absolute left-4 top-4 text-[#CC0000]" width={17} height={17} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                        <line x1={16} y1={13} x2={8} y2={13} />
                        <line x1={16} y1={17} x2={8} y2={17} />
                        <polyline points="10 9 9 9 8 9" />
                    </svg>
                    <textarea
                        name="descripcionTrabajo"
                        value={form.descripcionTrabajo}
                        onChange={handleChange}
                        rows={3}
                        placeholder="Descripción del trabajo"
                        style={{ fontSize: "16px" }}
                        className={`${inputBase} pl-11 pr-4 py-4 rounded-none border-0 resize-none`}
                    />
                </div>
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full h-14 bg-[#CC0000] text-white rounded-xl font-bold text-base active:scale-95 transition-all flex items-center justify-center gap-3 shadow-lg shadow-red-900/30 disabled:opacity-70"
            >
                {loading ? <IconLoader size={20} /> : "Confirmar Reserva"}
            </button>
        </form>
    );
}
