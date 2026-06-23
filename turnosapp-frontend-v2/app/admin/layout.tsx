"use client";

import Sidebar from "@/components/admin/Sidebar";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { loading } = useAuth(); // Hook de protección centralizado

    if (loading) {
        return (
            <div className="min-h-screen bg-bg flex items-center justify-center">
                <Loader2 className="animate-spin text-rojo" size={32} />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-bg">
            <Sidebar />
            <main className="lg:pl-64 min-h-screen flex flex-col">
                <div className="flex-1 p-4 lg:p-8">
                    <div className="max-w-6xl mx-auto">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
}
