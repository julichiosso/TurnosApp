import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../utils/prisma';

const router = Router();

router.post('/login', async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email y contraseña son requeridos' });
        }

        const usuario = await prisma.usuario.findUnique({
            where: { email },
        });

        if (!usuario) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        const passwordValid = await bcrypt.compare(password, usuario.password);

        if (!passwordValid) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        const token = jwt.sign(
            { usuarioId: usuario.id },
            process.env.JWT_SECRET || 'fallback-secret',
            { expiresIn: '8h' }
        );

        const { password: _, ...usuarioSinPassword } = usuario;

        return res.json({
            token,
            usuario: usuarioSinPassword,
        });
    } catch (error) {
        console.error('[AUTH] Login error:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
});

export default router;
