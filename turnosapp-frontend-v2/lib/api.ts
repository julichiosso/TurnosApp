import { Servicio, SlotHorario, Turno, DashboardStats, HorarioConfig, Bloqueo } from '../types';

const API_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3002';


// --- PÚBLICAS ---

export const getServicios = async (): Promise<Servicio[]> => {
    const res = await fetch(`${API_URL}/api/publico/servicios`);
    if (!res.ok) throw new Error('Error al cargar servicios');
    return res.json();
};

export const getDisponibilidad = async (servicioId: number, fecha: string): Promise<SlotHorario[]> => {
    const res = await fetch(`${API_URL}/api/publico/disponibilidad?servicioId=${servicioId}&fecha=${fecha}`);
    if (!res.ok) throw new Error('Error al cargar disponibilidad');
    const data: string[] = await res.json();
    return data.map(h => ({
        hora: h,
        disponible: true // Si el backend lo devuelve, es porque está disponible
    }));
};

export const crearTurnoPublico = async (data: any): Promise<Turno> => {
    const res = await fetch(`${API_URL}/api/publico/turnos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Error al crear turno');
    return result;
};

// --- AUTENTICACIÓN ---

export const login = async (credentials: any) => {
    const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.message || 'Error en login');
    return result;
};

// --- ADMINISTRACIÓN ---

export const getDashboard = async (token: string): Promise<DashboardStats> => {
    const res = await fetch(`${API_URL}/api/dashboard`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Error al cargar dashboard');
    return res.json();
};

export const getTurnos = async (token: string, fecha?: string): Promise<Turno[]> => {
    const url = fecha ? `${API_URL}/api/turnos?fecha=${fecha}` : `${API_URL}/api/turnos`;
    const res = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Error al cargar turnos');
    return res.json();
};

export const updateEstadoTurno = async (token: string, id: number, estado: string): Promise<Turno> => {
    const res = await fetch(`${API_URL}/api/turnos/${id}/estado`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ estado }),
    });
    if (!res.ok) throw new Error('Error al actualizar estado');
    return res.json();
};

// Servicios CRUD
export const crearServicio = async (token: string, data: any) => {
    const res = await fetch(`${API_URL}/api/servicios`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Error al crear servicio');
    return res.json();
};

export const actualizarServicio = async (token: string, id: number, data: any) => {
    const res = await fetch(`${API_URL}/api/servicios/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Error al actualizar servicio');
    return res.json();
};

export const eliminarServicio = async (token: string, id: number) => {
    const res = await fetch(`${API_URL}/api/servicios/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Error al eliminar servicio');
    return res.json();
};

// Horarios Config
export const getConfig = async (): Promise<HorarioConfig[]> => {
    try {
        const res = await fetch(`${API_URL}/api/config`);
        if (!res.ok) return [];
        return res.json();
    } catch {
        return [];
    }
};

export const actualizarConfig = async (token: string, configs: HorarioConfig[]) => {
    const res = await fetch(`${API_URL}/api/config`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ configs }),
    });
    if (!res.ok) throw new Error('Error al actualizar config');
    return res.json();
};

// Bloqueos
export const getBloqueos = async (): Promise<Bloqueo[]> => {
    try {
        const res = await fetch(`${API_URL}/api/bloqueos`);
        if (!res.ok) return [];
        return res.json();
    } catch {
        return [];
    }
};

export const crearBloqueo = async (token: string, data: any) => {
    const res = await fetch(`${API_URL}/api/bloqueos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Error al crear bloqueo');
    return res.json();
};

export const eliminarBloqueo = async (token: string, id: number) => {
    const res = await fetch(`${API_URL}/api/bloqueos/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Error al eliminar bloqueo');
    return res.json();
};
