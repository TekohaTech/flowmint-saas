-- CreateTable
CREATE TABLE "RegistroIP" (
    "id" SERIAL NOT NULL,
    "ip" TEXT NOT NULL,
    "correo" TEXT NOT NULL,
    "intento" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RegistroIP_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "RegistroIP_ip_intento_idx" ON "RegistroIP"("ip", "intento");
