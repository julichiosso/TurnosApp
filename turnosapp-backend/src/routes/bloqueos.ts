import { Router, Request, Response } from 'express';
import prisma from '../utils/prisma';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.use(authMiddleware);

// GET /api/bloqueos - fechas bloqueadas
router.get('/', async (req: Request, res: Response) => {
    try {
        const bloqueos = await prisma.bloqueoFecha.findMany({
            orderBy: { fecha: 'asc' },
        });
        return res.json(bloqueos);
    } catch (error) {
        console.error('[BLOQUEOS] Fetch error:', error);
        return res.status(500).json({ error: 'Error al obtener bloqueos de fecha' });
    }
});

// POST /api/bloqueos - bloquear fecha { fecha, motivo? }
router.post('/', async (req: Request, res: Response) => {
    try {
        const { fecha, motivo } = req.body;

        if (!fecha) {
            return res.status(400).json({ error: 'La fecha es requerida (YYYY-MM-DD)' });
        }

        const nuevoBloqueo = await prisma.bloqueoFecha.create({
            data: {
                fecha,
                motivo,
            },
        });

        return res.status(201).json(nuevoBloqueo);
    } catch (error) {
        console.error('[BLOQUEOS] Create error:', error);
        return res.status(500).json({ error: 'Error al bloquear fecha' });
    }
});

// DELETE /api/bloqueos/:id - desbloquear
router.delete('/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        await prisma.bloqueoFecha.delete({
            where: { id: Number(id) },
        });

        return res.json({ message: 'Fecha desbloqueada correctamente' });
    } catch (error) {
        console.error('[BLOQUEOS] Delete error:', error);
        return res.status(500).json({ error: 'Error al desbloquear fecha' });
    }
});

export default router;
