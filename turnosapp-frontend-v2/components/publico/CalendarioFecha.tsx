import { useMemo } from "react";

interface Props {
    fechaSeleccionada: string;
    onSelect: (fecha: string) => void;
}

export default function CalendarioFecha({ fechaSeleccionada, onSelect }: Props) {
    const dias = useMemo(() => {
        const arr = [];
        const hoy = new Date();

        for (let i = 0; i < 14; i++) {
            const d = new Date();
            d.setDate(hoy.getDate() + i);

            // Omitir Domingos (día 0)
            if (d.getDay() !== 0) {
                const iso = d.toISOString().split("T")[0];
                const nombreDia = d.toLocaleDateString("es-AR", { weekday: "short" }).replace(".", "");
                const nroDia = d.getDate();
                arr.push({ iso, nombreDia, nroDia });
            }
        }
        return arr;
    }, []);

    return (
        <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar px-1">
            {dias.map((d) => (
                <button
                    key={d.iso}
                    onClick={() => onSelect(d.iso)}
                    className={`
            flex-shrink-0 w-16 h-20 rounded-2xl flex flex-col items-center justify-center transition-all border
            ${fechaSeleccionada === d.iso
                            ? "bg-rojo border-rojo text-white shadow-lg shadow-rojo/30 scale-105"
                            : "bg-surface border-borde text-texto-muted hover:border-texto-muted"}
          `}
                >
                    <span className="text-[10px] uppercase font-bold tracking-wider opacity-80">
                        {d.nombreDia}
                    </span>
                    <span className="text-xl font-black mt-1">
                        {d.nroDia}
                    </span>
                </button>
            ))}
        </div>
    );
}
