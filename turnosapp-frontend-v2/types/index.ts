export interface Servicio {
    id: number;
    nombre: string;
    duracion: number;
    precio?: number;
    descripcion?: string;
    activo: boolean;
}

export interface Turno {
    id: number;
    servicioId: number;
    fecha: string; // ISO yyyy-mm-dd
    hora: string; // hh:mm
    nombreCliente: string;
    telefonoCliente: string;
    emailCliente?: string;
    descripcionTrabajo?: string;
    estado: 'pendiente' | 'confirmado' | 'cancelado' | 'completado';
    servicio?: Servicio;
}

export interface SlotHorario {
    hora: string;
    disponible: boolean;
}

// Matches backend /api/config response
export interface HorarioConfig {
    id?: number;
    diaSemana: number;
    abierto: boolean;
    horaInicio: string;
    horaFin: string;
}

// Matches backend /api/bloqueos response
export interface Bloqueo {
    id: number;
    fecha: string;
    motivo?: string;
}

// Matches backend /api/dashboard response exactly
export interface DashboardStats {
    turnosHoy: {
        cantidad: number;
        proximos: Turno[];
    };
    turnosMes: {
        cantidad: number;
    };
    pendientes?: number;
    porEstado: {
        pendiente: number;
        confirmado: number;
        cancelado: number;
        completado: number;
    };
}
