import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './routes/auth';
import serviciosRoutes from './routes/servicios';
import horariosRoutes from './routes/horarios';
import bloqueosRoutes from './routes/bloqueos';
import publicoRoutes from './routes/publico';
import turnosRoutes from './routes/turnos';
import dashboardRoutes from './routes/dashboard';
import configRoutes from './routes/config';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;

app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/servicios', serviciosRoutes);
app.use('/api/horarios', horariosRoutes);
app.use('/api/bloqueos', bloqueosRoutes);
app.use('/api/publico', publicoRoutes);
app.use('/api/turnos', turnosRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/config', configRoutes);

app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'TurnosApp Backend is running' });
});

app.listen(PORT, () => {
    console.log(`[DEV] Server is running on http://localhost:${PORT}`);
});
