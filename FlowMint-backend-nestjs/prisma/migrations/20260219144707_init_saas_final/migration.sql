-- CreateTable
CREATE TABLE "Comercio" (
    "comercio_id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "direccion" TEXT,
    "telefono" TEXT,
    "email" TEXT,
    "activo" BOOLEAN NOT NULL DEFAULT false,
    "logo_url" TEXT,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Comercio_pkey" PRIMARY KEY ("comercio_id")
);

-- CreateTable
CREATE TABLE "Usuario" (
    "usuario_id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,
    "dni" TEXT,
    "user" TEXT NOT NULL,
    "pass" TEXT NOT NULL,
    "correo" TEXT,
    "rol_id" INTEGER NOT NULL DEFAULT 2,
    "estado" TEXT NOT NULL DEFAULT 'A',
    "comercio_id" INTEGER,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("usuario_id")
);

-- CreateTable
CREATE TABLE "Rol" (
    "rol_id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "Rol_pkey" PRIMARY KEY ("rol_id")
);

-- CreateTable
CREATE TABLE "Cliente" (
    "cliente_id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,
    "telefono" TEXT,
    "email" TEXT,
    "estado" TEXT NOT NULL DEFAULT 'A',
    "comercio_id" INTEGER NOT NULL,

    CONSTRAINT "Cliente_pkey" PRIMARY KEY ("cliente_id")
);

-- CreateTable
CREATE TABLE "Empleado" (
    "empleado_id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,
    "puesto" TEXT,
    "estado" TEXT NOT NULL DEFAULT 'A',
    "comercio_id" INTEGER NOT NULL,

    CONSTRAINT "Empleado_pkey" PRIMARY KEY ("empleado_id")
);

-- CreateTable
CREATE TABLE "Servicio" (
    "servicio_id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "precio" DOUBLE PRECISION NOT NULL,
    "duracion" INTEGER NOT NULL,
    "estado" TEXT NOT NULL DEFAULT 'A',
    "comercio_id" INTEGER NOT NULL,

    CONSTRAINT "Servicio_pkey" PRIMARY KEY ("servicio_id")
);

-- CreateTable
CREATE TABLE "Turno" (
    "turno_id" SERIAL NOT NULL,
    "fecha_hora" TIMESTAMP(3) NOT NULL,
    "estado" TEXT NOT NULL DEFAULT 'pendiente',
    "comercio_id" INTEGER NOT NULL,
    "cliente_id" INTEGER NOT NULL,
    "empleado_id" INTEGER NOT NULL,
    "servicio_id" INTEGER NOT NULL,

    CONSTRAINT "Turno_pkey" PRIMARY KEY ("turno_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Comercio_email_key" ON "Comercio"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_user_key" ON "Usuario"("user");

-- CreateIndex
CREATE UNIQUE INDEX "Rol_nombre_key" ON "Rol"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "Cliente_email_comercio_id_key" ON "Cliente"("email", "comercio_id");

-- AddForeignKey
ALTER TABLE "Usuario" ADD CONSTRAINT "Usuario_comercio_id_fkey" FOREIGN KEY ("comercio_id") REFERENCES "Comercio"("comercio_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Usuario" ADD CONSTRAINT "Usuario_rol_id_fkey" FOREIGN KEY ("rol_id") REFERENCES "Rol"("rol_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cliente" ADD CONSTRAINT "Cliente_comercio_id_fkey" FOREIGN KEY ("comercio_id") REFERENCES "Comercio"("comercio_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Empleado" ADD CONSTRAINT "Empleado_comercio_id_fkey" FOREIGN KEY ("comercio_id") REFERENCES "Comercio"("comercio_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Servicio" ADD CONSTRAINT "Servicio_comercio_id_fkey" FOREIGN KEY ("comercio_id") REFERENCES "Comercio"("comercio_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Turno" ADD CONSTRAINT "Turno_comercio_id_fkey" FOREIGN KEY ("comercio_id") REFERENCES "Comercio"("comercio_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Turno" ADD CONSTRAINT "Turno_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "Cliente"("cliente_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Turno" ADD CONSTRAINT "Turno_empleado_id_fkey" FOREIGN KEY ("empleado_id") REFERENCES "Empleado"("empleado_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Turno" ADD CONSTRAINT "Turno_servicio_id_fkey" FOREIGN KEY ("servicio_id") REFERENCES "Servicio"("servicio_id") ON DELETE RESTRICT ON UPDATE CASCADE;
