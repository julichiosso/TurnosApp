import { Turno } from "../../types";
import { User, Clock, Wrench } from "lucide-react";

interface Props {
    turno: Turno;
}

const ESTADOS = {
    pendiente:  { label: "Pendiente",  bg: "bg-[#D97706]/10", text: "text-[#D97706]" },
    confirmado: { label: "Confirmado", bg: "bg-[#059669]/10", text: "text-[#059669]" },
    cancelado:  { label: "Cancelado",  bg: "bg-[#DC2626]/10", text: "text-[#DC2626]" },
    completado: { label: "Completado", bg: "bg-[#6B7280]/10", text: "text-[#6B7280]" },
};

export default function TurnoRow({ turno }: Props) {
    const meta = ESTADOS[turno.estado];

    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-surface-2/50 border border-borde rounded-xl gap-4 hover:border-rojo/30 transition-all">
            <div className="flex items-center gap-4 flex-1">
                <div className="w-12 h-12 bg-surface rounded-full flex flex-col items-center justify-center border border-borde">
                    <span className="text-[10px] font-bold text-texto-muted uppercase leading-none">Min</span>
                    <span className="text-sm font-black text-white leading-none mt-1">{turno.hora}</span>
                </div>

                <div>
                    <h4 className="font-bold text-white flex items-center gap-2">
                        <User size={14} className="text-rojo" /> {turno.nombreCliente}
                    </h4>
                    <p className="text-xs text-texto-muted flex items-center gap-1.5 mt-1">
                        <Wrench size={12} /> {turno.servicio?.nombre} · <Clock size={12} /> {turno.servicio?.duracion} min
                    </p>
                </div>
            </div>

            <div className="flex items-center justify-between md:justify-end gap-4 border-t md:border-t-0 border-borde pt-3 md:pt-0">
                <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${meta.bg} ${meta.text}`}>
                    {meta.label}
                </div>

                <p className="text-xs font-medium text-texto-muted italic">
                    {turno.telefonoCliente}
                </p>
            </div>
        </div>
    );
}
