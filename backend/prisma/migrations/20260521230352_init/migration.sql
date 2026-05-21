-- CreateEnum
CREATE TYPE "Categoria" AS ENUM ('ACCESIBILIDAD_VISUAL', 'ACCESIBILIDAD_MOTRIZ', 'MATERIAL_DIDACTICO', 'COMUNICACION_AUMENTATIVA', 'FIGURAS_DIDACTICAS', 'ACCESORIOS_ACCESIBILIDAD');

-- CreateEnum
CREATE TYPE "Estado" AS ENUM ('RECIBIDA', 'EN_PRODUCCION', 'REVISION_CALIDAD', 'EMPAQUE_TRANSPORTE', 'ENTREGADA');

-- CreateTable
CREATE TABLE "Modelo" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "categoria" "Categoria" NOT NULL,
    "descripcion" TEXT NOT NULL,
    "archivoGlb" TEXT NOT NULL,
    "imagen" TEXT NOT NULL,

    CONSTRAINT "Modelo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Solicitud" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "cedula" TEXT NOT NULL,
    "ciudad" TEXT NOT NULL,
    "correo" TEXT NOT NULL,
    "telefono" TEXT NOT NULL,
    "tipoMaterial" "Categoria" NOT NULL,
    "modeloId" TEXT NOT NULL,
    "estado" "Estado" NOT NULL DEFAULT 'RECIBIDA',
    "fechaRegistro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Solicitud_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Solicitud_cedula_key" ON "Solicitud"("cedula");

-- AddForeignKey
ALTER TABLE "Solicitud" ADD CONSTRAINT "Solicitud_modeloId_fkey" FOREIGN KEY ("modeloId") REFERENCES "Modelo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
