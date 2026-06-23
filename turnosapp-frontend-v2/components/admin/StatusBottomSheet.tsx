"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, Award, X } from "lucide-react";
import { Turno } from "../../types";

interface Props {
    turno: Turno | null;
    onClose: () => void;
    onChangeEstado: (id: number, estado: string) => void;
}

const ACCIONES = [
    { label: "Confirmar", estado: "confirmado", color: "bg-green-500 text-white", icon: CheckCircle2 },
    { label: "Completar", estado: "completado", color: "bg-blue-500 text-white", icon: Award },
    { label: "Cancelar", estado: "cancelado", color: "bg-red-600 text-white", icon: XCircle },
];

export default function StatusBottomSheet({ turno, onClose, onChangeEstado }: Props) {
    if (!turno) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex flex-col justify-end">
                {/* Overlay */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                    onClick={onClose}
                />

                {/* Sheet */}
                <motion.div
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "100%" }}
                    transition={{ type: "spring", damping: 28, stiffness: 300 }}
                    className="relative bg-[#141414] border-t border-borde rounded-t-3xl p-6 z-10 pb-10"
                >
                    <div className="w-10 h-1 bg-gray-700 rounded-full mx-auto mb-6" />

                    <p className="text-[10px] font-black tracking-[0.2em] uppercase text-texto-muted mb-2">
                        Cambiar Estado
                    </p>
                    <p className="text-lg font-black italic uppercase mb-6">
                        {turno.nombreCliente}
                    </p>

                    <div className="space-y-3">
                        {ACCIONES.map((a) => {
                            const Icon = a.icon;
                            return (
                                <button
                                    key={a.estado}
                                    disabled={turno.estado === a.estado}
                                    onClick={() => { onChangeEstado(turno.id, a.estado); onClose(); }}
                                    className={`
                    w-full h-[52px] rounded-2xl flex items-center justify-center gap-3 font-bold text-[16px] transition-all active:scale-[0.98]
                    ${turno.estado === a.estado
                                            ? "opacity-30 cursor-not-allowed bg-surface-2 text-texto-muted"
                                            : `${a.color} shadow-md`}
                  `}
                                >
                                    <Icon size={20} />
                                    {a.label}
                                </button>
                            );
                        })}

                        <button
                            onClick={onClose}
                            className="w-full h-[52px] rounded-2xl border border-borde text-texto-muted font-bold text-[16px] flex items-center justify-center gap-2 mt-2 active:scale-[0.98]"
                        >
                            <X size={18} /> Cerrar
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
