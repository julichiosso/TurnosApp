import { LucideIcon } from "lucide-react";

interface Props {
    label: string;
    value: string | number;
    icon: LucideIcon;
    color?: string;
    trend?: string;
}

export default function StatCard({ label, value, icon: Icon, color = "text-rojo", trend }: Props) {
    return (
        <div className="bg-surface border border-borde p-6 rounded-2xl flex items-start justify-between shadow-lg">
            <div>
                <p className="text-[10px] uppercase font-bold text-texto-muted tracking-widest mb-1">{label}</p>
                <h3 className="text-2xl font-black text-white">{value}</h3>
                {trend && (
                    <p className="text-[10px] font-bold text-green-500 mt-1 uppercase italic">{trend}</p>
                )}
            </div>
            <div className={`p-3 bg-surface-2 rounded-xl ${color}`}>
                <Icon size={20} />
            </div>
        </div>
    );
}
