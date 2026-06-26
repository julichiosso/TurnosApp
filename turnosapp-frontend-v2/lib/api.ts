import { Servicio, SlotHorario, Turno, DashboardStats, HorarioConfig, Bloqueo } from '../types';


const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3002';



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

// Horarios Laborales — endpoints correctos (/api/horarios)
export const getHorarios = async (token: string): Promise<HorarioConfig[]> => {
    try {
        const res = await fetch(`${API_URL}/api/horarios`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) return [];
        const data = await res.json();
        // El backend devuelve { activo } pero el componente usa { abierto }
        return data.map((h: any) => ({ ...h, abierto: h.activo }));
    } catch {
        return [];
    }
};

export const actualizarHorario = async (
    token: string,
    dia: number,
    data: Partial<HorarioConfig>
) => {
    const payload = {
        horaInicio: data.horaInicio,
        horaFin: data.horaFin,
        intervalo: data.intervalo,
        activo: data.abierto ?? data.activo,
    };
    const res = await fetch(`${API_URL}/api/horarios/${dia}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload),
    });
    if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw Object.assign(new Error(body.error || 'Error al actualizar horario'), { status: res.status });
    }
    return res.json();
};

// GET público de horarios activos (para filtrar el calendario de booking)
export const getHorariosPublicos = async (): Promise<HorarioConfig[]> => {
    try {
        const res = await fetch(`${API_URL}/api/publico/horarios`);
        if (!res.ok) return [];
        const data = await res.json();
        return data.map((h: any) => ({ ...h, abierto: h.activo }));
    } catch {
        return [];
    }
};

// Config del Negocio (nombre, teléfono, etc.) — endpoint correcto
export const getConfigNegocio = async (token: string) => {
    try {
        const res = await fetch(`${API_URL}/api/config`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) return null;
        return res.json();
    } catch {
        return null;
    }
};

export const actualizarConfigNegocio = async (token: string, data: any) => {
    const res = await fetch(`${API_URL}/api/config`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Error al actualizar config');
    return res.json();
};

// Bloqueos (requiere auth)
export const getBloqueos = async (token?: string): Promise<Bloqueo[]> => {
    try {
        const headers: Record<string, string> = {};
        if (token) headers['Authorization'] = `Bearer ${token}`;
        const res = await fetch(`${API_URL}/api/bloqueos`, { headers });
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
