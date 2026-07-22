-- CreateIndex
CREATE INDEX "Comercio_estado_idx" ON "Comercio"("estado");

-- CreateIndex
CREATE INDEX "Comercio_activo_idx" ON "Comercio"("activo");

-- CreateIndex
CREATE INDEX "Usuario_comercio_id_idx" ON "Usuario"("comercio_id");

-- CreateIndex
CREATE INDEX "Usuario_correo_idx" ON "Usuario"("correo");

-- CreateIndex
CREATE INDEX "Usuario_user_idx" ON "Usuario"("user");

-- CreateIndex
CREATE INDEX "Cliente_comercio_id_idx" ON "Cliente"("comercio_id");

-- CreateIndex
CREATE INDEX "Cliente_estado_idx" ON "Cliente"("estado");

-- CreateIndex
CREATE INDEX "Empleado_comercio_id_idx" ON "Empleado"("comercio_id");

-- CreateIndex
CREATE INDEX "Empleado_estado_idx" ON "Empleado"("estado");

-- CreateIndex
CREATE INDEX "Servicio_comercio_id_idx" ON "Servicio"("comercio_id");

-- CreateIndex
CREATE INDEX "Servicio_estado_idx" ON "Servicio"("estado");

-- CreateIndex
CREATE INDEX "Turno_comercio_id_idx" ON "Turno"("comercio_id");

-- CreateIndex
CREATE INDEX "Turno_estado_idx" ON "Turno"("estado");

-- CreateIndex
CREATE INDEX "Turno_fecha_hora_idx" ON "Turno"("fecha_hora");

-- CreateIndex
CREATE INDEX "Turno_cliente_id_idx" ON "Turno"("cliente_id");

-- CreateIndex
CREATE INDEX "Turno_empleado_id_idx" ON "Turno"("empleado_id");
