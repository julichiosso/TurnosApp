import { Router, Request, Response } from 'express';
import prisma from '../utils/prisma';
import { getSlotsDisponibles } from '../utils/disponibilidad';

const router = Router();

// GET /api/publico/servicios
router.get('/servicios', async (req: Request, res: Response) => {
    try {
        const servicios = await prisma.servicio.findMany({
            where: { activo: true },
            select: {
                id: true,
                nombre: true,
                duracion: true,
                precio: true,
                descripcion: true,
            },
        });
        return res.json(servicios);
    } catch (error) {
        console.error('[PUBLICO] Fetch servicios error:', error);
        return res.status(500).json({ error: 'Error al obtener servicios' });
    }
});

// GET /api/publico/disponibilidad?servicioId=1&fecha=2024-06-15
router.get('/disponibilidad', async (req: Request, res: Response) => {
    try {
        const { servicioId, fecha } = req.query;

        if (!servicioId || !fecha) {
            return res.status(400).json({ error: 'servicioId y fecha son requeridos' });
        }

        const slots = await getSlotsDisponibles(Number(servicioId), String(fecha));
        return res.json(slots);
    } catch (error) {
        console.error('[PUBLICO] Fetch disponibilidad error:', error);
        return res.status(500).json({ error: 'Error al obtener disponibilidad' });
    }
});

// POST /api/publico/turnos
router.post('/turnos', async (req: Request, res: Response) => {
    try {
        const { servicioId, fecha, hora, nombreCliente, telefonoCliente, emailCliente, nota } = req.body;

        if (!servicioId || !fecha || !hora || !nombreCliente || !telefonoCliente) {
            return res.status(400).json({ error: 'Faltan campos requeridos' });
        }

        // 1. Validar que el slot esté disponible
        const slots = await getSlotsDisponibles(Number(servicioId), String(fecha));
        if (!slots.includes(String(hora))) {
            return res.status(400).json({ error: 'El horario seleccionado ya no está disponible' });
        }

        // 2. Crear el turno
        const nuevoTurno = await prisma.turno.create({
            data: {
                servicioId: Number(servicioId),
                fecha,
                hora,
                nombreCliente,
                telefonoCliente,
                emailCliente,
                nota,
                estado: 'pendiente',
            },
        });

        return res.status(201).json(nuevoTurno);
    } catch (error) {
        console.error('[PUBLICO] Create turno error:', error);
        return res.status(500).json({ error: 'Error al reservar el turno' });
    }
});

export default router;
