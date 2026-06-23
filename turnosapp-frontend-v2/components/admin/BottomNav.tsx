"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, CalendarRange, Wrench, Clock, Ban } from "lucide-react";

const NAV = [
    { label: "Hoy", href: "/admin", icon: LayoutDashboard },
    { label: "Turnos", href: "/admin/turnos", icon: CalendarRange },
    { label: "Servicios", href: "/admin/servicios", icon: Wrench },
    { label: "Horarios", href: "/admin/horarios", icon: Clock },
    { label: "Bloqueos", href: "/admin/bloqueos", icon: Ban },
];

export default function BottomNav() {
    const pathname = usePathname();

    return (
        <nav
            className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around border-t border-borde"
            style={{ height: 64, background: "#141414" }}
        >
            {NAV.map(({ label, href, icon: Icon }) => {
                const active = pathname === href;
                return (
                    <Link
                        key={href}
                        href={href}
                        className="flex flex-col items-center justify-center flex-1 h-full gap-1 transition-colors"
                    >
                        <Icon
                            size={22}
                            className={active ? "text-rojo" : "text-texto-muted"}
                        />
                        <span
                            className={`text-[10px] font-bold uppercase tracking-wider ${active ? "text-rojo" : "text-texto-muted"
                                }`}
                        >
                            {label}
                        </span>
                    </Link>
                );
            })}
        </nav>
    );
}
