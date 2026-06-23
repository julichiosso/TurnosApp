import { CheckCircle2, MessageSquare } from "lucide-react";
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
            `📅 Fecha: ${formatearFecha(turno.fecha)}\n` +
            `🕒 Hora: ${turno.hora} hs\n` +
            `👤 Nombre: ${turno.nombreCliente}\n\n` +
            `Por favor, confirmen mi recepción. Gracias!`
        );
        window.open(`https://wa.me/${wa}?text=${msg}`, "_blank");
    };

    return (
        <div className="text-center py-8 space-y-8">
            <div className="flex flex-col items-center">
                <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle2 className="text-green-500" size={48} />
                </div>
                <h2 className="text-2xl font-black italic uppercase italic">¡Turno Reservado!</h2>
                <p className="text-texto-muted text-sm mt-2">Ya agendamos tu cita en el taller.</p>
            </div>

            <div className="bg-surface border border-borde rounded-2xl p-6 text-left space-y-4">
                <div>
                    <p className="text-[10px] uppercase font-bold text-texto-muted tracking-widest">Servicio</p>
                    <p className="text-lg font-bold">{servicio.nombre}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-[10px] uppercase font-bold text-texto-muted tracking-widest">Fecha</p>
                        <p className="font-bold">{formatearFecha(turno.fecha)}</p>
                    </div>
                    <div>
                        <p className="text-[10px] uppercase font-bold text-texto-muted tracking-widest">Hora</p>
                        <p className="font-bold">{turno.hora} hs</p>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <button
                    onClick={handleWhatsApp}
                    className="w-full h-14 bg-[#25D366] text-white rounded-xl font-bold flex items-center justify-center gap-3 active:scale-95 transition-all shadow-lg shadow-green-500/20"
                >
                    <MessageSquare size={20} /> Agendar recordatorio
                </button>

                <p className="text-texto-muted text-xs px-4">
                    Recibirás un mensaje de confirmación por WhatsApp en breve con los detalles finales.
                </p>

                <button
                    onClick={() => window.location.reload()}
                    className="text-rojo text-sm font-bold uppercase tracking-widest mt-8"
                >
                    Volver al inicio
                </button>
            </div>
        </div>
    );
}
