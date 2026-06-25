"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { IconHome, IconCalendar, IconWrench, IconClock, IconBan } from "@/components/icons";

const NAV = [
    { label: "HOY", href: "/admin", icon: IconHome },
    { label: "TURNOS", href: "/admin/turnos", icon: IconCalendar },
    { label: "SERVICIOS", href: "/admin/servicios", icon: IconWrench },
    { label: "HORARIOS", href: "/admin/horarios", icon: IconClock },
    { label: "BLOQUEOS", href: "/admin/bloqueos", icon: IconBan },
];

export default function BottomNav() {
    const pathname = usePathname();

    return (
        <nav
            style={{
                position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 40,
                display: "flex", alignItems: "center", justifyContent: "space-around",
                height: 64, background: "#141414", borderTop: "1px solid #2a2a2a",
                paddingBottom: "env(safe-area-inset-bottom, 8px)",
            }}
        >
            {NAV.map(({ label, href, icon: Icon }) => {
                const active = pathname === href;
                return (
                    <Link
                        key={href}
                        href={href}
                        style={{
                            display: "flex", flexDirection: "column", alignItems: "center",
                            justifyContent: "center", flex: 1, height: "100%", gap: 4,
                            textDecoration: "none",
                            opacity: active ? 1 : 0.35,
                            transition: "opacity 0.15s",
                        }}
                    >
                        <Icon size={22} className={active ? "text-[#e63946]" : "text-[#f5f5f5]"} />
                        <span style={{
                            fontSize: 9, fontWeight: 800, letterSpacing: 1,
                            color: active ? "#e63946" : "#f5f5f5",
                        }}>
                            {label}
                        </span>
                        {active && (
                            <div style={{
                                width: 20, height: 2, borderRadius: 1,
                                background: "#e63946", marginTop: -2,
                            }} />
                        )}
                    </Link>
                );
            })}
        </nav>
    );
}
