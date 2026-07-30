-- CreateTable
CREATE TABLE "Notificacion" (
    "notificacion_id" SERIAL NOT NULL,
    "usuario_id" INTEGER NOT NULL,
    "comercio_id" INTEGER,
    "target_all" BOOLEAN NOT NULL DEFAULT false,
    "tipo" TEXT NOT NULL DEFAULT 'info',
    "titulo" VARCHAR(200) NOT NULL,
    "mensaje" TEXT NOT NULL,
    "leido" BOOLEAN NOT NULL DEFAULT false,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "creado_por" INTEGER NOT NULL,

    CONSTRAINT "Notificacion_pkey" PRIMARY KEY ("notificacion_id")
);

-- CreateIndex
CREATE INDEX "Notificacion_usuario_id_leido_idx" ON "Notificacion"("usuario_id", "leido");

-- CreateIndex
CREATE INDEX "Notificacion_comercio_id_idx" ON "Notificacion"("comercio_id");

-- CreateIndex
CREATE INDEX "Notificacion_creado_en_idx" ON "Notificacion"("creado_en" DESC);

-- AddForeignKey
ALTER TABLE "Notificacion" ADD CONSTRAINT "Notificacion_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "Usuario"("usuario_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notificacion" ADD CONSTRAINT "Notificacion_comercio_id_fkey" FOREIGN KEY ("comercio_id") REFERENCES "Comercio"("comercio_id") ON DELETE SET NULL ON UPDATE CASCADE;
