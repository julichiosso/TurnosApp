import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('[SEED] Starting seed...');

    // 1. Usuario Admin
    const adminPassword = await bcrypt.hash('admin123', 10);
    const admin = await prisma.usuario.upsert({
        where: { email: 'admin@turnosapp.com' },
        update: {},
        create: {
            nombre: 'Administrador',
            email: 'admin@turnosapp.com',
            password: adminPassword,
        },
    });
    console.log('[SEED] Admin created:', admin.email);

    // 2. Servicios
    const servicios = [
        { nombre: 'Consulta', duracion: 30, precio: 3000, descripcion: 'Consulta general' },
        { nombre: 'Sesión', duracion: 60, precio: 5000, descripcion: 'Sesión completa de tratamiento' },
        { nombre: 'Control', duracion: 20, precio: 2000, descripcion: 'Control rápido' },
    ];

    for (const s of servicios) {
        await prisma.servicio.upsert({
            where: { id: servicios.indexOf(s) + 1 }, // Note: Simple logic for seed
            update: s,
            create: s,
        });
    }
    console.log('[SEED] Services created');

    // 3. Horarios Laborales (Lunes a Viernes 09:00 - 18:00)
    for (let i = 1; i <= 5; i++) {
        await prisma.horarioLaboral.upsert({
            where: { id: i },
            update: {
                diaSemana: i,
                horaInicio: '09:00',
                horaFin: '18:00',
                intervalo: 30,
                activo: true,
            },
            create: {
                diaSemana: i,
                horaInicio: '09:00',
                horaFin: '18:00',
                intervalo: 30,
                activo: true,
            },
        });
    }
    console.log('[SEED] Work hours created (Mon-Fri)');

    // 4. Configuración inicial del negocio
    await prisma.configNegocio.upsert({
        where: { id: 1 },
        update: {},
        create: {
            nombreProfesional: 'Profesional de Ejemplo',
            especialidad: 'Especialista',
            telefono: '123456789',
            direccion: 'Calle Falsa 123',
            mensajeBienvenida: 'Bienvenido a TurnosApp',
        },
    });
    console.log('[SEED] Initial configuration created');

    console.log('[SEED] Seed finished successfully');
}

main()
    .catch((e) => {
        console.error('[SEED] Error during seed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
