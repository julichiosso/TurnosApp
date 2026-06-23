import { Router, Request, Response } from 'express';
import prisma from '../utils/prisma';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.use(authMiddleware);

router.get('/', async (req: Request, res: Response) => {
    try {
        const config = await prisma.configNegocio.findFirst({ where: { id: 1 } });
        return res.json(config);
    } catch (error) {
        return res.status(500).json({ error: 'Error al obtener config' });
    }
});

router.put('/', async (req: Request, res: Response) => {
    try {
        const { nombreProfesional, especialidad, telefono, direccion, mensajeBienvenida } = req.body;
        const config = await prisma.configNegocio.update({
            where: { id: 1 },
            data: {
                nombreProfesional,
                especialidad,
                telefono,
                direccion,
                mensajeBienvenida,
            },
        });
        return res.json(config);
    } catch (error) {
        return res.status(500).json({ error: 'Error al guardar config' });
    }
});

export default router;
