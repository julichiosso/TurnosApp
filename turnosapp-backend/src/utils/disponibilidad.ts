import prisma from './prisma';

/**
 * Genera slots de tiempo disponibles para un servicio en una fecha específica.
 */
export async function getSlotsDisponibles(servicioId: number, fecha: string): Promise<string[]> {
    // 1. Obtener el servicio
    const servicio = await prisma.servicio.findUnique({
        where: { id: servicioId },
    });

    if (!servicio || !servicio.activo) {
        return [];
    }

    // 2. Obtener el día de la semana (0=domingo, 1=lunes... 6=sábado)
    // Nota: La fecha viene como "YYYY-MM-DD" en hora local (según enunciado)
    const d = new Date(fecha + 'T12:00:00'); // T12 para evitar problemas de timezone al obtener el día
    const diaSemana = d.getDay();

    // 3. Buscar el HorarioLaboral para ese día
    const horario = await prisma.horarioLaboral.findFirst({
        where: { diaSemana, activo: true },
    });

    if (!horario) {
        return [];
    }

    // 4. Verificar que la fecha no esté bloqueada
    const bloqueada = await prisma.bloqueoFecha.findFirst({
        where: { fecha },
    });

    if (bloqueada) {
        return [];
    }

    // 5. Generar todos los slots posibles
    const slots: string[] = [];
    const [hInicio, mInicio] = horario.horaInicio.split(':').map(Number);
    const [hFin, mFin] = horario.horaFin.split(':').map(Number);

    let cursor = new Date(2000, 0, 1, hInicio, mInicio);
    const fin = new Date(2000, 0, 1, hFin, mFin);

    // 6. Obtener turnos existentes para esa fecha
    const turnosExistentes = await prisma.turno.findMany({
        where: {
            fecha,
            estado: { in: ['pendiente', 'confirmado'] },
        },
        include: { servicio: true },
    });

    while (cursor < fin) {
        const horaActualStr = `${cursor.getHours().toString().padStart(2, '0')}:${cursor.getMinutes().toString().padStart(2, '0')}`;

        // Calcular fin del slot para este servicio
        const slotFin = new Date(cursor.getTime() + servicio.duracion * 60000);
        const slotFinStr = `${slotFin.getHours().toString().padStart(2, '0')}:${slotFin.getMinutes().toString().padStart(2, '0')}`;

        // Verificar que el slot no exceda el horario laboral
        if (slotFin > fin) break;

        // Verificar colisiones con turnos existentes
        const isOccupied = turnosExistentes.some((turno: any) => {
            // Turno ocupado desde turno.hora hasta turno.hora + turno.servicio.duracion
            const [tH, tM] = turno.hora.split(':').map(Number);
            const tInicio = new Date(2000, 0, 1, tH, tM);
            const tFin = new Date(tInicio.getTime() + turno.servicio.duracion * 60000);

            // El slot [cursor, slotFin] colisiona con el turno [tInicio, tFin] si:
            // cursor < tFin AND slotFin > tInicio
            const sInicio = cursor;
            return sInicio < tFin && slotFin > tInicio;
        });

        if (!isOccupied) {
            slots.push(horaActualStr);
        }

        // Avanzar al siguiente slot según el intervalo configurado
        cursor = new Date(cursor.getTime() + horario.intervalo * 60000);
    }

    return slots;
}
