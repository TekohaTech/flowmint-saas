import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed SaaS Multi-tenant...');

  // Limpiar datos
  await prisma.turno.deleteMany();
  await prisma.servicio.deleteMany();
  await prisma.empleado.deleteMany();
  await prisma.cliente.deleteMany();
  await prisma.usuario.deleteMany();
  await prisma.rol.deleteMany();
  await prisma.comercio.deleteMany();

  // 1. Crear Roles
  const rolSuperAdmin = await prisma.rol.create({ data: { rol_id: 1, nombre: 'SUPERADMIN' } });
  const rolDueno = await prisma.rol.create({ data: { rol_id: 2, nombre: 'DUENO' } });
  const rolEmpleado = await prisma.rol.create({ data: { rol_id: 3, nombre: 'EMPLEADO' } });

  const hashedPass = await bcrypt.hash('admin123', 10);

  // 2. Crearte a TI (SuperAdmin)
  await prisma.usuario.create({
    data: {
      nombre: 'Juan',
      apellido: 'Admin',
      user: 'admin',
      pass: hashedPass,
      correo: 'admin@flowmint.com',
      rol_id: rolSuperAdmin.rol_id,
      estado: 'A',
      comercio_id: null, // Los SuperAdmin no pertenecen a un comercio
    },
  });

  // 3. Crear Comercio de Prueba 1
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

  // Dueño del Comercio 1
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

  // Empleado del Comercio 1
  const emp1 = await prisma.empleado.create({
    data: {
      nombre: 'Lucas',
      apellido: 'Cortes',
      puesto: 'Barbero Senior',
      comercio_id: comercio1.comercio_id,
    },
  });

  // Cliente del Comercio 1
  const cli1 = await prisma.cliente.create({
    data: {
      nombre: 'Roberto',
      apellido: 'Gomez',
      email: 'roberto@gmail.com',
      comercio_id: comercio1.comercio_id,
    },
  });

  // Servicio del Comercio 1
  const serv1 = await prisma.servicio.create({
    data: {
      nombre: 'Corte + Barba',
      precio: 5000,
      duracion: 45,
      comercio_id: comercio1.comercio_id,
    },
  });

  // Turno del Comercio 1
  await prisma.turno.create({
    data: {
      fecha_hora: new Date(),
      cliente_id: cli1.cliente_id,
      empleado_id: emp1.empleado_id,
      servicio_id: serv1.servicio_id,
      comercio_id: comercio1.comercio_id,
    },
  });

  // 4. Crear Comercio de Prueba 2 (INACTIVO - Pendiente de tu OK)
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
