"use client";

import { useState } from "react";
import { login } from "@/lib/api";
import { setToken } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { KeyRound, Mail, Loader2, AlertCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function LoginPage() {
    useAuth(); // Protege y redirecciona si ya está logueado

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const data = await login({ email, password });
            setToken(data.token);
            router.push("/admin");
        } catch (err: any) {
            setError(err.message || "Credenciales inválidas");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-bg flex flex-col items-center justify-center px-4">
            <div className="w-full max-w-sm">
                <div className="flex flex-col items-center mb-8">
                    <div className="w-20 h-20 bg-rojo rounded-full flex items-center justify-center mb-4 shadow-xl shadow-rojo/20">
                        <span className="text-white font-black text-2xl italic uppercase">TM</span>
                    </div>
                    <h1 className="text-white text-2xl font-black italic uppercase tracking-tight">
                        Panel de <span className="text-rojo">Control</span>
                    </h1>
                    <p className="text-texto-muted text-xs mt-1 font-medium">Taller Manias SRL</p>
                </div>

                <div className="bg-surface border border-borde rounded-2xl p-6 shadow-2xl">
                    {error && (
                        <div className="mb-6 p-4 bg-rojo/10 border border-rojo/20 rounded-xl flex items-center gap-3 text-rojo text-sm">
                            <AlertCircle size={18} />
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="text-[10px] font-bold uppercase text-texto-muted mb-2 block tracking-widest pl-1">
                                Email Profesional
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-rojo" size={18} />
                                <input
                                    required
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="admin@turnosapp.com"
                                    className="w-full h-12 bg-bg border border-borde rounded-xl pl-12 pr-4 focus:border-rojo outline-none transition-all text-sm"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-[10px] font-bold uppercase text-texto-muted mb-2 block tracking-widest pl-1">
                                Contraseña
                            </label>
                            <div className="relative">
                                <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-rojo" size={18} />
                                <input
                                    required
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full h-12 bg-bg border border-borde rounded-xl pl-12 pr-4 focus:border-rojo outline-none transition-all text-sm"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full h-12 bg-rojo text-white rounded-xl font-bold active:scale-95 transition-all flex items-center justify-center gap-2 shadow-lg shadow-rojo/30 disabled:opacity-70 mt-6"
                        >
                            {loading ? <Loader2 className="animate-spin" size={20} /> : "Iniciar Sesión"}
                        </button>
                    </form>
                </div>

                <p className="text-center text-texto-muted text-[10px] mt-8 uppercase tracking-widest">
                    TurnosApp Management v1.0
                </p>
            </div>
        </div>
    );
}
