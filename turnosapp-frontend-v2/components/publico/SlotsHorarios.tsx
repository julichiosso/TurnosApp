"use client";

import { useState } from "react";
import { SlotHorario } from "../../types";

interface Props {
    slots: SlotHorario[];
    horaSeleccionada: string;
    onSelect: (hora: string) => void;
    loading: boolean;
}

export default function SlotsHorarios({ slots, horaSeleccionada, onSelect, loading }: Props) {
    const [pulsing, setPulsing] = useState<string | null>(null);

    const handleSelect = (hora: string) => {
        onSelect(hora);
        setPulsing(hora);
        setTimeout(() => setPulsing(null), 100);
    };

    if (loading) {
        return (
            <div className="grid grid-cols-3 gap-3">
                {[...Array(9)].map((_, i) => (
                    <div key={i} className="h-12 bg-[#111] rounded-xl animate-pulse" />
                ))}
            </div>
        );
    }

    if (slots.length === 0) {
        return (
            <div className="bg-[#111] border border-dashed border-[#1e1e1e] rounded-xl p-8 text-center">
                <p className="text-gray-500 text-sm">
                    No hay turnos disponibles para este día.<br />Probá con otra fecha.
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-3 gap-3">
            {slots.map((slot) => {
                const isSelected = horaSeleccionada === slot.hora;
                const isPulsing = pulsing === slot.hora;

                return (
                    <button
                        key={slot.hora}
                        disabled={!slot.disponible}
                        onClick={() => handleSelect(slot.hora)}
                        style={{
                            transform: isPulsing ? "scale(0.95)" : "scale(1)",
                            transition: isPulsing ? "none" : "transform 100ms ease",
                        }}
                        className={`
                            h-12 rounded-xl flex items-center justify-center font-semibold text-sm border
                            ${!slot.disponible
                                ? "bg-black/20 border-[#1a1a1a] text-gray-700 cursor-not-allowed line-through"
                                : isSelected
                                ? "bg-[#CC0000] border-[#CC0000] text-white shadow-lg shadow-red-900/30"
                                : "bg-[#111] border-[#1e1e1e] text-white hover:border-[#CC0000]/40"}
                        `}
                    >
                        {slot.hora}
                    </button>
                );
            })}
        </div>
    );
}
