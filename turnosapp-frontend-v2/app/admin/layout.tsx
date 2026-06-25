"use client";

import BottomNav from "@/components/admin/BottomNav";
import { useAuth } from "@/hooks/useAuth";
import { IconLoader } from "@/components/icons";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen bg-bg flex items-center justify-center">
                <IconLoader className="text-rojo" size={32} />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-bg text-white">
            {/* Main content with bottom padding so it's not hidden by the nav */}
            <main className="pb-[80px]">
                <div className="max-w-lg mx-auto px-4 pt-6">
                    {children}
                </div>
            </main>
            <BottomNav />
        </div>
    );
}
