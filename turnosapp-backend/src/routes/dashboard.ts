import { Router, Request, Response } from 'express';
import prisma from '../utils/prisma';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.use(authMiddleware);

router.get('/', async (req: Request, res: Response) => {
    try {
        const hoy = new Date().toISOString().split('T')[0];

        // Turnos hoy
        const turnosHoy = await prisma.turno.findMany({
            where: { fecha: hoy },
            include: { servicio: true },
            orderBy: { hora: 'asc' },
        });

        // Filtro mes
        const primerDiaMes = new Date();
        primerDiaMes.setDate(1);
        const primerDiaMesStr = primerDiaMes.toISOString().split('T')[0];

        const totalMes = await prisma.turno.count({
            where: { fecha: { gte: primerDiaMesStr } },
        });

        // Por estado
        const estados = ['pendiente', 'confirmado', 'cancelado', 'completado'];
        const porEstado: any = {};
        for (const est of estados) {
            porEstado[est] = await prisma.turno.count({ where: { estado: est } });
        }

        return res.json({
            turnosHoy: {
                cantidad: turnosHoy.length,
                proximos: turnosHoy.slice(0, 5),
            },
            turnosMes: {
                cantidad: totalMes,
            },
            porEstado,
        });
    } catch (error) {
        console.error('[DASHBOARD] error:', error);
        return res.status(500).json({ error: 'Error al obtener reporte' });
    }
});

export default router;
