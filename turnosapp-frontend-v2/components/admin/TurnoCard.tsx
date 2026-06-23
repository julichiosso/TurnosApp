"use client";

import { motion } from "framer-motion";
import { Turno } from "../../types";
import { Phone, Wrench } from "lucide-react";

interface Props {
    turno: Turno;
    index: number;
    onStatusPress: (turno: Turno) => void;
}

const ESTADO_META: Record<string, { label: string; bg: string; text: string }> = {
    pendiente: { label: "Pendiente", bg: "bg-yellow-500/15", text: "text-yellow-400" },
    confirmado: { label: "Confirmado", bg: "bg-green-500/15", text: "text-green-400" },
    cancelado: { label: "Cancelado", bg: "bg-red-500/15", text: "text-red-400" },
    completado: { label: "Completado", bg: "bg-gray-500/15", text: "text-gray-400" },
};

export default function TurnoCard({ turno, index, onStatusPress }: Props) {
    const meta = ESTADO_META[turno.estado] ?? ESTADO_META.pendiente;

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08, duration: 0.25 }}
            className="bg-surface border border-borde rounded-2xl p-4 min-h-[80px] flex gap-4 items-center shadow-sm"
        >
            {/* Hora */}
            <div className="flex-shrink-0 w-16 h-16 bg-[#0A0A0A] border border-borde rounded-xl flex flex-col items-center justify-center">
                <span className="text-[9px] font-black text-rojo uppercase tracking-wider">HORA</span>
                <span className="text-xl font-black text-white leading-none mt-0.5">{turno.hora}</span>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
                <p className="text-base font-black uppercase italic truncate">{turno.nombreCliente}</p>
                <p className="text-[11px] text-texto-muted font-medium mt-0.5 flex items-center gap-1.5">
                    <Wrench size={11} className="text-rojo" />
                    {turno.servicio?.nombre} · {turno.servicio?.duracion} min
                </p>
                {turno.telefonoCliente && (
                    <p className="text-[11px] text-texto-muted flex items-center gap-1.5 mt-0.5">
                        <Phone size={11} className="text-rojo" />
                        {turno.telefonoCliente}
                    </p>
                )}
            </div>

            {/* Badge touchable */}
            <button
                onClick={() => onStatusPress(turno)}
                className={`
          flex-shrink-0 min-h-[44px] px-3 rounded-xl flex items-center justify-center font-black text-[11px] uppercase tracking-widest border border-transparent transition-all active:scale-95
          ${meta.bg} ${meta.text}
        `}
            >
                {meta.label}
            </button>
        </motion.div>
    );
}
