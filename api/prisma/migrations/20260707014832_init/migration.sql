-- CreateTable
CREATE TABLE `usuario` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(120) NOT NULL,
    `apellidos` VARCHAR(120) NOT NULL,
    `email` VARCHAR(150) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `telefono` VARCHAR(20) NULL,
    `role` ENUM('ADMIN', 'PROFESIONAL', 'CLIENTE') NOT NULL DEFAULT 'CLIENTE',
    `estado` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `usuario_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `profesional` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `usuarioId` INTEGER NOT NULL,
    `titulo` VARCHAR(150) NOT NULL,
    `descripcion` VARCHAR(500) NOT NULL,
    `experiencia` INTEGER NOT NULL DEFAULT 0,
    `modalidad` ENUM('VIRTUAL', 'PRESENCIAL', 'MIXTA') NOT NULL DEFAULT 'PRESENCIAL',
    `provincia` VARCHAR(100) NOT NULL,
    `canton` VARCHAR(100) NOT NULL,
    `distrito` VARCHAR(100) NOT NULL,
    `tarifaBase` DECIMAL(10, 2) NOT NULL,
    `disponible` BOOLEAN NOT NULL DEFAULT true,
    `imagen` VARCHAR(255) NOT NULL DEFAULT 'profile-not-found.jpg',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `profesional_usuarioId_key`(`usuarioId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `categoria` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(100) NOT NULL,
    `descripcion` VARCHAR(255) NULL,
    `estado` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `categoria_nombre_key`(`nombre`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `especialidad` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(100) NOT NULL,
    `descripcion` VARCHAR(255) NULL,
    `estado` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `especialidad_nombre_key`(`nombre`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `servicio` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(150) NOT NULL,
    `descripcion` VARCHAR(500) NOT NULL,
    `precio` DECIMAL(10, 2) NOT NULL,
    `duracion` INTEGER NOT NULL,
    `modalidad` ENUM('VIRTUAL', 'PRESENCIAL', 'MIXTA') NOT NULL DEFAULT 'PRESENCIAL',
    `estado` BOOLEAN NOT NULL DEFAULT true,
    `profesionalId` INTEGER NOT NULL,
    `categoriaId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `especialidad_servicio` (
    `servicioId` INTEGER NOT NULL,
    `especialidadId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`servicioId`, `especialidadId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `especialidad_profesional` (
    `profesionalId` INTEGER NOT NULL,
    `especialidadId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`profesionalId`, `especialidadId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `cita` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `fechaCita` DATETIME(3) NOT NULL,
    `horaInicio` VARCHAR(10) NOT NULL,
    `horaFin` VARCHAR(10) NOT NULL,
    `modalidad` ENUM('VIRTUAL', 'PRESENCIAL') NOT NULL DEFAULT 'PRESENCIAL',
    `estado` ENUM('PENDIENTE', 'ACEPTADA', 'RECHAZADA', 'CANCELADA', 'COMPLETADA') NOT NULL DEFAULT 'PENDIENTE',
    `comentarioCliente` VARCHAR(500) NULL,
    `comentarioProfesional` VARCHAR(500) NULL,
    `montoEstimado` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    `clienteId` INTEGER NOT NULL,
    `profesionalId` INTEGER NOT NULL,
    `servicioId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `resena` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `puntuacion` INTEGER NOT NULL,
    `comentario` VARCHAR(500) NULL,
    `citaId` INTEGER NOT NULL,
    `clienteId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `resena_citaId_key`(`citaId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `profesional` ADD CONSTRAINT `profesional_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `usuario`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `servicio` ADD CONSTRAINT `servicio_profesionalId_fkey` FOREIGN KEY (`profesionalId`) REFERENCES `profesional`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `servicio` ADD CONSTRAINT `servicio_categoriaId_fkey` FOREIGN KEY (`categoriaId`) REFERENCES `categoria`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `especialidad_servicio` ADD CONSTRAINT `especialidad_servicio_servicioId_fkey` FOREIGN KEY (`servicioId`) REFERENCES `servicio`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `especialidad_servicio` ADD CONSTRAINT `especialidad_servicio_especialidadId_fkey` FOREIGN KEY (`especialidadId`) REFERENCES `especialidad`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `especialidad_profesional` ADD CONSTRAINT `especialidad_profesional_profesionalId_fkey` FOREIGN KEY (`profesionalId`) REFERENCES `profesional`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `especialidad_profesional` ADD CONSTRAINT `especialidad_profesional_especialidadId_fkey` FOREIGN KEY (`especialidadId`) REFERENCES `especialidad`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `cita` ADD CONSTRAINT `cita_clienteId_fkey` FOREIGN KEY (`clienteId`) REFERENCES `usuario`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `cita` ADD CONSTRAINT `cita_profesionalId_fkey` FOREIGN KEY (`profesionalId`) REFERENCES `profesional`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `cita` ADD CONSTRAINT `cita_servicioId_fkey` FOREIGN KEY (`servicioId`) REFERENCES `servicio`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `resena` ADD CONSTRAINT `resena_citaId_fkey` FOREIGN KEY (`citaId`) REFERENCES `cita`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `resena` ADD CONSTRAINT `resena_clienteId_fkey` FOREIGN KEY (`clienteId`) REFERENCES `usuario`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
