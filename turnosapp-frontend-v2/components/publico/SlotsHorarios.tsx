import { SlotHorario } from "../../types";

interface Props {
    slots: SlotHorario[];
    horaSeleccionada: string;
    onSelect: (hora: string) => void;
    loading: boolean;
}

export default function SlotsHorarios({ slots, horaSeleccionada, onSelect, loading }: Props) {
    if (loading) {
        return (
            <div className="grid grid-cols-3 gap-3">
                {[...Array(9)].map((_, i) => (
                    <div key={i} className="h-12 bg-surface rounded-xl animate-pulse"></div>
                ))}
            </div>
        );
    }

    if (slots.length === 0) {
        return (
            <div className="bg-surface border border-dashed border-borde rounded-xl p-8 text-center">
                <p className="text-texto-muted text-sm">
                    No hay turnos disponibles para este día.<br />Probá con otra fecha.
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-3 gap-3">
            {slots.map((slot) => (
                <button
                    key={slot.hora}
                    disabled={!slot.disponible}
                    onClick={() => onSelect(slot.hora)}
                    className={`
            h-12 rounded-xl flex items-center justify-center font-bold text-sm transition-all border
            ${!slot.disponible
                            ? "bg-black/20 border-borde text-gray-700 cursor-not-allowed line-through"
                            : horaSeleccionada === slot.hora
                                ? "bg-rojo border-rojo text-white shadow-lg shadow-rojo/30"
                                : "bg-surface border-borde text-white hover:border-rojo"}
          `}
                >
                    {slot.hora}
                </button>
            ))}
        </div>
    );
}
