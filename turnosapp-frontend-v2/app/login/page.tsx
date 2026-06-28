"use client";

import { useState } from "react";
import { login } from "@/lib/api";
import { setToken } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { IconWarning, IconLoader } from "@/components/icons";
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
        <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center px-4">
            <div className="w-full max-w-sm">
                <div className="flex flex-col items-center mb-8">
                    <div className="w-10 h-20 bg-[#e63946] rounded-full flex items-center justify-center mb-4 shadow-xl shadow-[#e63946]/20">
                        <span className="text-white font-black text-2xl italic uppercase">TM</span>
                    </div>
                    <h1 className="text-white text-2xl font-black italic uppercase tracking-tight">
                        Panel de <span className="text-[#e63946]">Control</span>
                    </h1>
                    <p className="text-[#888888] text-xs mt-1 font-medium">Taller Manias SRL</p>
                </div>

                <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-6 shadow-2xl">
                    {error && (
                        <div className="mb-6 p-4 bg-rojo/10 border border-rojo/20 rounded-xl flex items-center gap-3 text-rojo text-sm">
                            <IconWarning size={18} />
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="text-[10px] font-bold uppercase text-[#888888] mb-2 block tracking-widest pl-1">
                                Email Profesional
                            </label>
                            <div className="relative">
                                <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-[#e63946]" width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                    <polyline points="22,6 12,13 2,6" />
                                </svg>
                                <input
                                    required
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="admin@turnosapp.com"
                                    className="w-full h-12 bg-[#0a0a0a] border border-[#2a2a2a] rounded-xl pl-12 pr-4 focus:border-[#e63946] outline-none transition-all text-sm text-white"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-[10px] font-bold uppercase text-[#888888] mb-2 block tracking-widest pl-1">
                                Contraseña
                            </label>
                            <div className="relative">
                                <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-[#e63946]" width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                    <path d="M7 11V7a5 5 0 0110 0v4" />
                                </svg>
                                <input
                                    required
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full h-12 bg-[#0a0a0a] border border-[#2a2a2a] rounded-xl pl-12 pr-4 focus:border-[#e63946] outline-none transition-all text-sm text-white"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full h-12 bg-[#e63946] text-white rounded-xl font-bold active:scale-95 transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#e63946]/30 disabled:opacity-70 mt-6 cursor-pointer"
                        >
                            {loading ? <IconLoader size={20} /> : "Iniciar Sesión"}
                        </button>
                    </form>
                </div>

                <p className="text-center text-[#888888] text-[10px] mt-8 uppercase tracking-widest">
                    TurnosApp Management v1.0
                </p>
            </div>
        </div>
    );
}
