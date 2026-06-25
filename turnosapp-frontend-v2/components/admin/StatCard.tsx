"use client";

import { useEffect, useRef, useState } from "react";
import { LucideIcon } from "lucide-react";

interface Props {
    label: string;
    value: string | number;
    icon: LucideIcon;
    color?: string;
    trend?: string;
}

function useCountUp(target: number, duration = 800) {
    const [count, setCount] = useState(0);
    const raf = useRef<number | null>(null);

    useEffect(() => {
        if (typeof target !== "number") return;
        const start = performance.now();
        const step = (now: number) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            // ease-out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.round(eased * target));
            if (progress < 1) raf.current = requestAnimationFrame(step);
        };
        raf.current = requestAnimationFrame(step);
        return () => { if (raf.current) cancelAnimationFrame(raf.current); };
    }, [target, duration]);

    return count;
}

export default function StatCard({ label, value, icon: Icon, color = "text-[#CC0000]", trend }: Props) {
    const isNum = typeof value === "number";
    const animated = useCountUp(isNum ? (value as number) : 0);

    return (
        <div className="bg-[#111] border border-[#1e1e1e] p-5 rounded-2xl flex items-start justify-between shadow-lg">
            <div>
                <p className="text-[10px] uppercase font-bold text-gray-600 tracking-widest mb-1">{label}</p>
                <h3 className="text-2xl font-extrabold text-white">{isNum ? animated : value}</h3>
                {trend && (
                    <p className="text-[10px] font-bold text-green-500 mt-1 uppercase">{trend}</p>
                )}
            </div>
            <div className={`p-3 bg-[#1a1a1a] rounded-xl ${color}`}>
                <Icon size={20} />
            </div>
        </div>
    );
}
