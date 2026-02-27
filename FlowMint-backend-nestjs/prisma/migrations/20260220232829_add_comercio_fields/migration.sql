-- AlterTable
ALTER TABLE "Comercio" ADD COLUMN     "categoria" TEXT,
ADD COLUMN     "dueno_apellido" TEXT,
ADD COLUMN     "dueno_email" TEXT,
ADD COLUMN     "dueno_nombre" TEXT,
ADD COLUMN     "dueno_telefono" TEXT,
ADD COLUMN     "estado" TEXT NOT NULL DEFAULT 'pendiente',
ADD COLUMN     "fecha_activacion" TIMESTAMP(3),
ADD COLUMN     "fecha_solicitud" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "fecha_suspension" TIMESTAMP(3),
ADD COLUMN     "motivo_suspension" TEXT;
