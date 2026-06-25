"use client";

import { useState } from "react";
import { User, Phone, Mail, FileText, Loader2 } from "lucide-react";

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
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-[#CC0000]" size={17} />
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
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-[#CC0000]" size={17} />
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
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#CC0000]" size={17} />
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
                    <FileText className="absolute left-4 top-4 text-[#CC0000]" size={17} />
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
                {loading ? <Loader2 className="animate-spin" size={20} /> : "Confirmar Reserva"}
            </button>
        </form>
    );
}
