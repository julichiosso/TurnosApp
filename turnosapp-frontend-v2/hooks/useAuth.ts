"use client";

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { getToken, removeToken, isAuthenticated } from '../lib/auth';

export function useAuth() {
    const [token, setTokenState] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const storedToken = getToken();
        if (storedToken) {
            setTokenState(storedToken);
        }
        setLoading(false);
    }, []);

    const logout = () => {
        removeToken();
        setTokenState(null);
        router.push('/login');
    };

    // Efecto de protección de rutas
    useEffect(() => {
        if (!loading) {
            const isAuth = isAuthenticated();
            const isAdminPath = pathname.startsWith('/admin');
            const isLoginPath = pathname === '/login';

            if (isAdminPath && !isAuth) {
                router.push('/login');
            } else if (isLoginPath && isAuth) {
                router.push('/admin');
            }
        }
    }, [loading, pathname, router]);

    return { token, loading, logout, isAuthenticated: !!token };
}
