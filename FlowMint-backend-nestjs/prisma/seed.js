"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcrypt"));
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('🌱 Iniciando seed SaaS Multi-tenant...');
    try {
        await prisma.registroIP.deleteMany();
        await prisma.turno.deleteMany();
        await prisma.servicio.deleteMany();
        await prisma.empleado.deleteMany();
        await prisma.cliente.deleteMany();
        await prisma.usuario.deleteMany();
        await prisma.rol.deleteMany();
        await prisma.comercio.deleteMany();
    }
    catch (e) {
        console.log('⚠️  No se pudieron limpiar las tablas (posiblemente no existan aún).');
    }
    const rolSuperAdmin = await prisma.rol.create({ data: { rol_id: 1, nombre: 'SUPERADMIN' } });
    const rolDueno = await prisma.rol.create({ data: { rol_id: 2, nombre: 'DUENO' } });
    const rolEmpleado = await prisma.rol.create({ data: { rol_id: 3, nombre: 'EMPLEADO' } });
    const hashedPass = await bcrypt.hash('admin123', 10);
    await prisma.usuario.create({
        data: {
            nombre: 'Juan',
            apellido: 'Admin',
            user: 'admin',
            pass: hashedPass,
            correo: 'admin@flowmint.com',
            rol_id: rolSuperAdmin.rol_id,
            estado: 'A',
            comercio_id: null,
        },
    });
    const comercio1 = await prisma.comercio.create({
        data: {
            nombre: 'Barbería Posadas',
            direccion: 'Calle Falsa 123',
            telefono: '3764000001',
            email: 'contacto@barberiaposadas.com',
            categoria: 'barberia',
            activo: true,
            estado: 'activo',
            dueno_nombre: 'Carlos',
            dueno_apellido: 'Barbero',
            dueno_email: 'carlos@barberia.com',
            dueno_telefono: '3764000001',
        },
    });
    await prisma.usuario.create({
        data: {
            nombre: 'Carlos',
            apellido: 'Barbero',
            user: 'carlos',
            pass: hashedPass,
            correo: 'carlos@barberia.com',
            rol_id: rolDueno.rol_id,
            comercio_id: comercio1.comercio_id,
            estado: 'A',
        },
    });
    const emp1 = await prisma.empleado.create({
        data: {
            nombre: 'Lucas',
            apellido: 'Cortes',
            puesto: 'Barbero Senior',
            comercio_id: comercio1.comercio_id,
        },
    });
    const cli1 = await prisma.cliente.create({
        data: {
            nombre: 'Roberto',
            apellido: 'Gomez',
            email: 'roberto@gmail.com',
            comercio_id: comercio1.comercio_id,
        },
    });
    const serv1 = await prisma.servicio.create({
        data: {
            nombre: 'Corte + Barba',
            precio: 5000,
            duracion: 45,
            comercio_id: comercio1.comercio_id,
        },
    });
    await prisma.turno.create({
        data: {
            fecha_hora: new Date(),
            cliente_id: cli1.cliente_id,
            empleado_id: emp1.empleado_id,
            servicio_id: serv1.servicio_id,
            comercio_id: comercio1.comercio_id,
        },
    });
    const comercio2 = await prisma.comercio.create({
        data: {
            nombre: 'Estética Glow',
            direccion: 'Av. Corrientes 456',
            categoria: 'peluqueria',
            activo: false,
            estado: 'pendiente',
            dueno_nombre: 'Lucía',
            dueno_apellido: 'Estética',
            dueno_email: 'lucia@esteticaglow.com',
        },
    });
    await prisma.usuario.create({
        data: {
            nombre: 'Lucía',
            apellido: 'Estética',
            user: 'lucia',
            pass: hashedPass,
            rol_id: rolDueno.rol_id,
            comercio_id: comercio2.comercio_id,
            estado: 'A',
        },
    });
    console.log('✅ Sistema SaaS inicializado.');
    console.log('👤 SuperAdmin: admin / admin123');
    console.log('🏠 Comercio Activo: carlos / admin123');
    console.log('⏳ Comercio Pendiente: lucia / admin123');
}
main()
    .catch((e) => { console.error(e); process.exit(1); })
    .finally(async () => { await prisma.$disconnect(); });
//# sourceMappingURL=seed.js.map