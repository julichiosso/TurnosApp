"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    CalendarRange,
    Wrench,
    Clock,
    Ban,
    LogOut,
    Menu,
    X
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";

export default function Sidebar() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const { logout } = useAuth();

    const links = [
        { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
        { name: "Turnos", href: "/admin/turnos", icon: CalendarRange },
        { name: "Servicios", href: "/admin/servicios", icon: Wrench },
        { name: "Horarios", href: "/admin/horarios", icon: Clock },
        { name: "Bloqueos", href: "/admin/bloqueos", icon: Ban },
    ];

    return (
        <>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-rojo rounded-lg text-white"
            >
                {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-surface border-r border-borde p-6 transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}>
                <div className="flex items-center gap-3 mb-10 px-2">
                    <div className="w-10 h-10 bg-rojo rounded-lg flex items-center justify-center italic font-black text-white">TM</div>
                    <div>
                        <h1 className="text-white font-bold leading-tight uppercase italic">Taller <span className="text-rojo">Manias</span></h1>
                        <p className="text-[10px] text-texto-muted uppercase tracking-widest font-bold">Admin Panel</p>
                    </div>
                </div>

                <nav className="space-y-1">
                    {links.map((link) => {
                        const Icon = link.icon;
                        const active = pathname === link.href;
                        return (
                            <Link
                                key={link.name}
                                href={link.href}
                                onClick={() => setIsOpen(false)}
                                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all
                  ${active
                                        ? "bg-rojo/10 text-rojo border border-rojo/20"
                                        : "text-texto-muted hover:bg-surface-2 hover:text-white"}
                `}
                            >
                                <Icon size={20} />
                                {link.name}
                            </Link>
                        );
                    })}
                </nav>

                <div className="absolute bottom-6 left-6 right-6">
                    <button
                        onClick={logout}
                        className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-500/10 transition-all border border-transparent hover:border-red-500/20"
                    >
                        <LogOut size={20} />
                        Cerrar Sesión
                    </button>
                </div>
            </aside>
        </>
    );
}
