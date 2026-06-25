import { useMemo } from "react";

interface Props {
    fechaSeleccionada: string;
    onSelect: (fecha: string) => void;
}

export default function CalendarioFecha({ fechaSeleccionada, onSelect }: Props) {
    const dias = useMemo(() => {
        const arr = [];
        const hoy = new Date();

        for (let i = 0; i < 21; i++) {
            const d = new Date();
            d.setDate(hoy.getDate() + i);
            if (d.getDay() !== 0) {
                const iso = d.toISOString().split("T")[0];
                const nombreDia = d.toLocaleDateString("es-AR", { weekday: "short" }).replace(".", "");
                const nroDia = d.getDate();
                arr.push({ iso, nombreDia, nroDia });
                if (arr.length === 14) break;
            }
        }
        return arr;
    }, []);

    return (
        <div className="relative">
            {/* Fade right edge — indicates more content */}
            <div className="absolute right-0 top-0 bottom-4 w-10 bg-gradient-to-l from-[#0A0A0A] to-transparent z-10 pointer-events-none" />

            <div className="flex gap-2.5 overflow-x-auto pb-4 no-scrollbar px-1">
                {dias.map((d) => (
                    <button
                        key={d.iso}
                        onClick={() => onSelect(d.iso)}
                        className={`
                            flex-shrink-0 rounded-2xl flex flex-col items-center justify-center transition-all border
                            ${fechaSeleccionada === d.iso
                                ? "bg-[#CC0000] border-[#CC0000] text-white shadow-lg shadow-red-900/30 scale-105"
                                : "bg-[#111] border-[#1e1e1e] text-gray-500 hover:border-[#333]"}
                        `}
                        style={{ width: "56px", height: "72px" }}
                    >
                        <span className="uppercase font-bold tracking-wider opacity-80" style={{ fontSize: "10px" }}>
                            {d.nombreDia}
                        </span>
                        <span className="font-black mt-1 leading-none" style={{ fontSize: "22px" }}>
                            {d.nroDia}
                        </span>
                    </button>
                ))}
            </div>
        </div>
    );
}
