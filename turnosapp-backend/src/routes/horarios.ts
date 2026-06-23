import { Router, Request, Response } from 'express';
import prisma from '../utils/prisma';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.use(authMiddleware);

// GET /api/horarios - los 7 días
router.get('/', async (req: Request, res: Response) => {
    try {
        const horarios = await prisma.horarioLaboral.findMany({
            orderBy: { diaSemana: 'asc' },
        });
        return res.json(horarios);
    } catch (error) {
        console.error('[HORARIOS] Fetch error:', error);
        return res.status(500).json({ error: 'Error al obtener horarios' });
    }
});

// PUT /api/horarios/:dia - editar horario de un día (0-6)
router.put('/:dia', async (req: Request, res: Response) => {
    try {
        const { dia } = req.params;
        const { horaInicio, horaFin, intervalo, activo } = req.body;

        const diaNum = Number(dia);
        if (diaNum < 0 || diaNum > 6) {
            return res.status(400).json({ error: 'Día inválido (0-6)' });
        }

        const horario = await prisma.horarioLaboral.upsert({
            where: { id: diaNum + 1 }, // Assuming IDs 1-7 for days 0-6
            update: {
                horaInicio,
                horaFin,
                intervalo: intervalo ? Number(intervalo) : undefined,
                activo,
            },
            create: {
                diaSemana: diaNum,
                horaInicio: horaInicio || '09:00',
                horaFin: horaFin || '18:00',
                intervalo: intervalo ? Number(intervalo) : 30,
                activo: activo ?? true,
            },
        });

        return res.json(horario);
    } catch (error) {
        console.error('[HORARIOS] Update error:', error);
        return res.status(500).json({ error: 'Error al actualizar horario' });
    }
});

export default router;
