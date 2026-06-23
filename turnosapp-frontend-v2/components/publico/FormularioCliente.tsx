import { useState } from "react";
import { User, Phone, Mail, FileText, Loader2 } from "lucide-react";

interface Props {
    onSubmit: (data: any) => void;
    loading: boolean;
}

export default function FormularioCliente({ onSubmit, loading }: Props) {
    const [form, setForm] = useState({
        nombreCliente: "",
        telefonoCliente: "",
        emailCliente: "",
        descripcionTrabajo: ""
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(form);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-4">
                <div>
                    <label className="text-xs font-bold uppercase text-texto-muted mb-2 block tracking-widest pl-1">
                        Nombre Completo *
                    </label>
                    <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-rojo" size={18} />
                        <input
                            required
                            name="nombreCliente"
                            value={form.nombreCliente}
                            onChange={handleChange}
                            placeholder="Ej: Juan Pérez"
                            className="w-full h-14 bg-surface border border-borde rounded-xl pl-12 pr-4 focus:border-rojo outline-none transition-all"
                        />
                    </div>
                </div>

                <div>
                    <label className="text-xs font-bold uppercase text-texto-muted mb-2 block tracking-widest pl-1">
                        Teléfono de contacto *
                    </label>
                    <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-rojo" size={18} />
                        <input
                            required
                            type="tel"
                            name="telefonoCliente"
                            value={form.telefonoCliente}
                            onChange={handleChange}
                            placeholder="Ej: 3404111222"
                            className="w-full h-14 bg-surface border border-borde rounded-xl pl-12 pr-4 focus:border-rojo outline-none transition-all"
                        />
                    </div>
                </div>

                <div>
                    <label className="text-xs font-bold uppercase text-texto-muted mb-2 block tracking-widest pl-1">
                        Email (Opcional)
                    </label>
                    <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-rojo" size={18} />
                        <input
                            type="email"
                            name="emailCliente"
                            value={form.emailCliente}
                            onChange={handleChange}
                            placeholder="Ej: juan@v8.com"
                            className="w-full h-14 bg-surface border border-borde rounded-xl pl-12 pr-4 focus:border-rojo outline-none transition-all"
                        />
                    </div>
                </div>

                <div>
                    <label className="text-xs font-bold uppercase text-texto-muted mb-2 block tracking-widest pl-1">
                        Notas del trabajo
                    </label>
                    <div className="relative">
                        <FileText className="absolute left-4 top-4 text-rojo" size={18} />
                        <textarea
                            name="descripcionTrabajo"
                            value={form.descripcionTrabajo}
                            onChange={handleChange}
                            rows={3}
                            placeholder="Contanos brevemente qué necesita tu auto..."
                            className="w-full bg-surface border border-borde rounded-xl pl-12 pr-4 py-4 focus:border-rojo outline-none transition-all resize-none"
                        ></textarea>
                    </div>
                </div>
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full h-14 bg-rojo text-white rounded-xl font-bold text-lg active:scale-95 transition-all flex items-center justify-center gap-3 shadow-lg shadow-rojo/30 disabled:opacity-70"
            >
                {loading ? (
                    <Loader2 className="animate-spin" />
                ) : (
                    <>Confirmar Reserva</>
                )}
            </button>
        </form>
    );
}
