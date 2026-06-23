import { Servicio } from "../../types";
import { Clock, DollarSign } from "lucide-react";

interface Props {
    servicio: Servicio;
    seleccionado: boolean;
    onSelect: (id: number) => void;
}

export default function ServicioCard({ servicio, seleccionado, onSelect }: Props) {
    return (
        <div
            onClick={() => onSelect(servicio.id)}
            className={`
        relative overflow-hidden p-4 rounded-xl border transition-all duration-300 cursor-pointer
        ${seleccionado
                    ? "bg-surface-2 border-rojo ring-1 ring-rojo"
                    : "bg-surface border-borde hover:border-texto-muted"}
      `}
        >
            <div className="flex justify-between items-start">
                <div>
                    <h3 className={`font-bold text-lg ${seleccionado ? "text-white" : "text-gray-200"}`}>
                        {servicio.nombre}
                    </h3>
                    <p className="text-texto-muted text-sm line-clamp-2 mt-1">
                        {servicio.descripcion}
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-4 mt-4">
                <div className="flex items-center gap-1.5 text-xs text-texto-muted font-medium bg-black/30 px-2 py-1 rounded-full">
                    <Clock size={14} className="text-rojo" />
                    <span>{servicio.duracion} min</span>
                </div>
                {servicio.precio && (
                    <div className="flex items-center gap-1 text-xs text-texto-muted font-bold">
                        <DollarSign size={14} className="text-rojo" />
                        <span>{servicio.precio.toLocaleString()}</span>
                    </div>
                )}
            </div>

            {seleccionado && (
                <div className="absolute top-2 right-2 w-2 h-2 bg-rojo rounded-full animate-pulse shadow-sm shadow-rojo"></div>
            )}
        </div>
    );
}
