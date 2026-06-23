import { Router, Request, Response } from 'express';
import prisma from '../utils/prisma';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// Aplicar middleware de auth a todas las rutas de servicios
router.use(authMiddleware);

// GET /api/servicios - todos (incluye inactivos)
router.get('/', async (req: Request, res: Response) => {
    try {
        const servicios = await prisma.servicio.findMany({
            orderBy: { creadoEn: 'desc' },
        });
        return res.json(servicios);
    } catch (error) {
        console.error('[SERVICIOS] Fetch error:', error);
        return res.status(500).json({ error: 'Error al obtener servicios' });
    }
});

// POST /api/servicios - crear
router.post('/', async (req: Request, res: Response) => {
    try {
        const { nombre, duracion, precio, descripcion } = req.body;

        if (!nombre || !duracion) {
            return res.status(400).json({ error: 'Nombre y duración son requeridos' });
        }

        const nuevoServicio = await prisma.servicio.create({
            data: {
                nombre,
                duracion: Number(duracion),
                precio: precio ? Number(precio) : null,
                descripcion,
            },
        });

        return res.status(201).json(nuevoServicio);
    } catch (error) {
        console.error('[SERVICIOS] Create error:', error);
        return res.status(500).json({ error: 'Error al crear servicio' });
    }
});

// PUT /api/servicios/:id - editar
router.put('/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { nombre, duracion, precio, descripcion, activo } = req.body;

        const servicio = await prisma.servicio.update({
            where: { id: Number(id) },
            data: {
                nombre,
                duracion: duracion ? Number(duracion) : undefined,
                precio: precio !== undefined ? Number(precio) : undefined,
                descripcion,
                activo,
            },
        });

        return res.json(servicio);
    } catch (error) {
        console.error('[SERVICIOS] Update error:', error);
        return res.status(500).json({ error: 'Error al actualizar servicio' });
    }
});

// DELETE /api/servicios/:id - soft delete
router.delete('/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const servicio = await prisma.servicio.update({
            where: { id: Number(id) },
            data: { activo: false },
        });

        return res.json({ message: 'Servicio desactivado correctamente', servicio });
    } catch (error) {
        console.error('[SERVICIOS] Delete error:', error);
        return res.status(500).json({ error: 'Error al eliminar servicio' });
    }
});

export default router;
