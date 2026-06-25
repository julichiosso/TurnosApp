"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import { IconCheck } from "@/components/icons";

interface Props {
    message: string | null;
}

export default function Toast({ message }: Props) {
    return (
        <AnimatePresence>
            {message && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.25 }}
                    className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] bg-green-500 text-white text-sm font-bold px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2 whitespace-nowrap"
                >
                    <IconCheck size={16} />
                    {message}
                </motion.div>
            )}
        </AnimatePresence>
    );
}
