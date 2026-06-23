import { Router, Request, Response } from 'express';
import prisma from '../utils/prisma';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.use(authMiddleware);

// GET /api/turnos?fecha=&semana=&estado=&page=&limit=
router.get('/', async (req: Request, res: Response) => {
    try {
        const { fecha, semana, estado } = req.query;

        let where: any = {};

        if (estado) {
            where.estado = String(estado);
        }

        if (fecha) {
            if (semana === 'true') {
                const d = new Date(String(fecha) + 'T12:00:00');
                const day = d.getDay();
                const diff = d.getDate() - day + (day === 0 ? -6 : 1);
                const lune = new Date(d.setDate(diff));
                const domi = new Date(d.setDate(diff + 6));

                const pad = (n: number) => n.toString().padStart(2, '0');
                const format = (dt: Date) => `${dt.getFullYear()}-${pad(dt.getMonth() + 1)}-${pad(dt.getDate())}`;

                where.fecha = {
                    gte: format(lune),
                    lte: format(domi),
                };
            } else {
                where.fecha = String(fecha);
            }
        }

        const turnos = await prisma.turno.findMany({
            where,
            include: { servicio: true },
            orderBy: [{ fecha: 'asc' }, { hora: 'asc' }],
        });

        return res.json(turnos);
    } catch (error) {
        console.error('[TURNOS] Fetch error:', error);
        return res.status(500).json({ error: 'Error al obtener turnos' });
    }
});

// GET /api/turnos/:id
router.get('/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const turno = await prisma.turno.findUnique({
            where: { id: Number(id) },
            include: { servicio: true },
        });
        if (!turno) return res.status(404).json({ error: 'Turno no encontrado' });
        return res.json(turno);
    } catch (error) {
        console.error('[TURNOS] Fetch ID error:', error);
        return res.status(500).json({ error: 'Error al obtener turno' });
    }
});

// POST /api/turnos - Carga manual
router.post('/', async (req: Request, res: Response) => {
    try {
        const { servicioId, fecha, hora, nombreCliente, telefonoCliente, emailCliente, nota } = req.body;

        const nuevoTurno = await prisma.turno.create({
            data: {
                servicioId: Number(servicioId),
                fecha,
                hora,
                nombreCliente,
                telefonoCliente,
                emailCliente,
                nota,
                estado: 'confirmado', // Manual carga suele ser confirmado por defecto en este contexto
            },
        });

        return res.status(201).json(nuevoTurno);
    } catch (error) {
        console.error('[TURNOS] Manual create error:', error);
        return res.status(500).json({ error: 'Error al crear turno manualmente' });
    }
});

// PUT /api/turnos/:id/estado
router.put('/:id/estado', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { estado } = req.body;

        const turno = await prisma.turno.update({
            where: { id: Number(id) },
            data: { estado },
        });

        return res.json(turno);
    } catch (error) {
        console.error('[TURNOS] Update status error:', error);
        return res.status(500).json({ error: 'Error al actualizar estado' });
    }
});

// DELETE /api/turnos/:id - eliminación definitiva
router.delete('/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await prisma.turno.delete({ where: { id: Number(id) } });
        return res.json({ message: 'Turno eliminado' });
    } catch (error) {
        console.error('[TURNOS] Delete error:', error);
        return res.status(500).json({ error: 'Error al eliminar turno' });
    }
});

export default router;
