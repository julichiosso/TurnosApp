"use client";

import { IconCalendar, IconClock, IconWrench } from "@/components/icons";
import { Servicio } from "../../types";

interface Props {
    turno: any;
    servicio: Servicio;
}

export default function ConfirmacionTurno({ turno, servicio }: Props) {
    const formatearFecha = (f: string) => {
        return new Date(f + "T12:00:00").toLocaleDateString("es-AR", {
            day: "numeric", month: "long", year: "numeric"
        });
    };

    const handleWhatsApp = () => {
        const wa = process.env.NEXT_PUBLIC_WA_NUMBER;
        const msg = encodeURIComponent(
            `Hola! Acabo de reservar un turno para ${servicio.nombre}.\n\n` +
            `Fecha: ${formatearFecha(turno.fecha)}\n` +
            `Hora: ${turno.hora} hs\n` +
            `Nombre: ${turno.nombreCliente}\n\n` +
            `Por favor, confirmen mi recepción. Gracias!`
        );
        window.open(`https://wa.me/${wa}?text=${msg}`, "_blank");
    };

    return (
        <div className="text-center py-8 space-y-8">
            {/* Animated red check */}
            <div className="flex flex-col items-center">
                <div className="w-20 h-20 bg-[#CC0000]/10 rounded-full flex items-center justify-center mb-4">
                    <svg
                        width="48"
                        height="48"
                        viewBox="0 0 48 48"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <circle
                            cx="24"
                            cy="24"
                            r="20"
                            stroke="#CC0000"
                            strokeWidth="2.5"
                            fill="none"
                            strokeDasharray="126"
                            strokeDashoffset="0"
                            style={{
                                animation: "draw-circle 400ms ease-out forwards",
                            }}
                        />
                        <path
                            d="M14 24L21 31L34 17"
                            stroke="#CC0000"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeDasharray="30"
                            strokeDashoffset="30"
                            style={{
                                animation: "draw-check 600ms ease-out 300ms forwards",
                            }}
                        />
                        <style>{`
                            @keyframes draw-circle {
                                from { stroke-dashoffset: 126; }
                                to { stroke-dashoffset: 0; }
                            }
                            @keyframes draw-check {
                                from { stroke-dashoffset: 30; }
                                to { stroke-dashoffset: 0; }
                            }
                        `}</style>
                    </svg>
                </div>
                <h2 className="text-2xl font-extrabold uppercase tracking-tight">Turno Reservado</h2>
                <p className="text-gray-500 text-sm mt-1">Ya agendamos tu cita en el taller.</p>
            </div>

            {/* Summary card */}
            <div className="bg-[#111] border border-[#1e1e1e] rounded-2xl p-5 text-left space-y-4">
                <div className="flex items-start gap-3">
                    <IconWrench size={16} className="text-[#CC0000] mt-0.5 flex-shrink-0" />
                    <div>
                        <p className="text-[10px] uppercase font-bold text-gray-600 tracking-widest mb-0.5">Servicio</p>
                        <p className="font-semibold text-white">{servicio.nombre}</p>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-start gap-3">
                        <IconCalendar size={15} className="text-[#CC0000] mt-0.5 flex-shrink-0" />
                        <div>
                            <p className="text-[10px] uppercase font-bold text-gray-600 tracking-widest mb-0.5">Fecha</p>
                            <p className="font-semibold text-white text-sm">{formatearFecha(turno.fecha)}</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <IconClock size={15} className="text-[#CC0000] mt-0.5 flex-shrink-0" />
                        <div>
                            <p className="text-[10px] uppercase font-bold text-gray-600 tracking-widest mb-0.5">Hora</p>
                            <p className="font-semibold text-white">{turno.hora} hs</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Contact note */}
            <p className="text-gray-600 text-xs px-4">
                Te vamos a contactar para confirmar
            </p>

            <div className="space-y-4">
                <button
                    onClick={handleWhatsApp}
                    className="w-full h-14 bg-[#25D366] text-white rounded-xl font-bold flex items-center justify-center gap-3 active:scale-95 transition-all shadow-lg shadow-green-900/20"
                >
                    <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
                    </svg> Avisar por WhatsApp
                </button>

                <button
                    onClick={() => window.location.reload()}
                    className="text-[#CC0000] text-sm font-bold uppercase tracking-widest"
                >
                    Volver al inicio
                </button>
            </div>
        </div>
    );
}
