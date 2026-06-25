"use client";

import { Servicio } from "../../types";

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
                relative flex items-center justify-between px-4 rounded-xl border transition-all duration-200 cursor-pointer active:opacity-80
                ${seleccionado
                    ? "bg-[#1A1A1A] border-l-[3px] border-[#CC0000]"
                    : "bg-[#111] border-[#1e1e1e] hover:border-[#333]"}
            `}
            style={{ height: "64px" }}
        >
            {/* Left: name + description */}
            <div className="flex-1 min-w-0 pr-4">
                <p className={`font-semibold leading-tight truncate ${seleccionado ? "text-white" : "text-gray-200"}`}
                    style={{ fontSize: "16px" }}>
                    {servicio.nombre}
                </p>
                {servicio.descripcion && (
                    <p className="text-gray-600 truncate mt-0.5" style={{ fontSize: "12px" }}>
                        {servicio.descripcion}
                    </p>
                )}
            </div>

            {/* Right: duration + price */}
            <div className="flex-shrink-0 text-right">
                <p className="text-gray-500 font-medium" style={{ fontSize: "13px" }}>
                    {servicio.duracion} min
                </p>
                {servicio.precio ? (
                    <p className="text-gray-400 font-semibold" style={{ fontSize: "13px" }}>
                        ${servicio.precio.toLocaleString()}
                    </p>
                ) : null}
            </div>
        </div>
    );
}
