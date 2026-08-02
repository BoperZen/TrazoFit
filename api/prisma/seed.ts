import { Role, Modalidad, ModalidadCita, EstadoCita } from "../generated/prisma";
import { prisma } from "../src/config/prisma";

async function main() {
    console.log("Iniciando seed...");

    // 1. Limpieza de datos
    const models = [
        prisma.resena,
        prisma.cita,
        prisma.especialidadServicio,
        prisma.especialidadProfesional,
        prisma.servicio,
        prisma.profesional,
        prisma.especialidad,
        prisma.categoria,
        prisma.usuario,
    ];

    for (const model of models) {
        await (model as any).deleteMany();
    }

    // 2. Creación de datos maestros
    await prisma.categoria.createMany({
        data: [
            { nombre: "Fuerza", descripcion: "Entrenamiento con pesas y resistencia." },
            { nombre: "Cardio", descripcion: "Ejercicios cardiovasculares y resistencia aeróbica." },
            { nombre: "Nutrición", descripcion: "Planes alimenticios y asesoría nutricional." },
            { nombre: "Rehabilitación", descripcion: "Recuperación de lesiones y fisioterapia." },
            { nombre: "Bienestar", descripcion: "Yoga, meditación y salud mental." },
        ],
    });

    await prisma.especialidad.createMany({
        data: [
            { nombre: "Hipertrofia", descripcion: "Aumento de masa muscular." },
            { nombre: "Crossfit", descripcion: "Entrenamiento funcional de alta intensidad." },
            { nombre: "Pérdida de peso", descripcion: "Programas de reducción de grasa corporal." },
            { nombre: "Dieta cetogénica", descripcion: "Alimentación baja en carbohidratos." },
            { nombre: "Yoga", descripcion: "Disciplina de flexibilidad y meditación." },
            { nombre: "Pilates", descripcion: "Fortalecimiento del core y postura." },
            { nombre: "Running", descripcion: "Entrenamiento para corredores." },
            { nombre: "Movilidad", descripcion: "Mejora del rango de movimiento articular." },
        ],
    });

    await prisma.usuario.createMany({
        data: [
            { nombre: "Admin", apellidos: "TrazoFit", email: "admin@trazofit.com", password: "hash_password", role: Role.ADMIN },
            { nombre: "Carlos", apellidos: "Méndez", email: "carlos@trazofit.com", password: "hash_password", role: Role.PROFESIONAL },
            { nombre: "Sofía", apellidos: "Vargas", email: "sofia@trazofit.com", password: "hash_password", role: Role.PROFESIONAL },
            { nombre: "Diego", apellidos: "Rojas", email: "diego@trazofit.com", password: "hash_password", role: Role.PROFESIONAL },
            { nombre: "Laura", apellidos: "Jiménez", email: "laura@trazofit.com", password: "hash_password", role: Role.PROFESIONAL },
            { nombre: "Andrés", apellidos: "Solís", email: "andres@trazofit.com", password: "hash_password", role: Role.PROFESIONAL },
            { nombre: "María", apellidos: "Castro", email: "maria@trazofit.com", password: "hash_password", role: Role.CLIENTE },
            { nombre: "Pedro", apellidos: "Mora", email: "pedro@trazofit.com", password: "hash_password", role: Role.CLIENTE },
            { nombre: "Valeria", apellidos: "Núñez", email: "valeria@trazofit.com", password: "hash_password", role: Role.CLIENTE },
            { nombre: "Juan", apellidos: "Pérez", email: "juan@trazofit.com", password: "hash_password", role: Role.PROFESIONAL, telefono: "8888-1111" },
            { nombre: "Ana", apellidos: "López", email: "ana@trazofit.com", password: "hash_password", role: Role.PROFESIONAL, telefono: "8888-2222" },
            { nombre: "Mario", apellidos: "Vega", email: "mario@trazofit.com", password: "hash_password", role: Role.PROFESIONAL, telefono: "8888-3333" },
        ],
    });

    // 3. Recuperar datos para mapeo
    const [cats, specs, users] = await Promise.all([
        prisma.categoria.findMany(),
        prisma.especialidad.findMany(),
        prisma.usuario.findMany(),
    ]);

    const catMap = Object.fromEntries(cats.map((c) => [c.nombre, c.id]));
    const specMap = Object.fromEntries(specs.map((s) => [s.nombre, s.id]));
    const userMap = Object.fromEntries(users.map((u) => [u.email, u.id]));

    // 4. Creación de Profesionales
    const profCarlos = await prisma.profesional.create({
        data: {
            usuarioId: userMap["carlos@trazofit.com"],
            titulo: "Entrenador Personal Certificado",
            descripcion: "Especialista en hipertrofia y crossfit con 8 años de experiencia.",
            experiencia: 8,
            modalidad: Modalidad.PRESENCIAL,
            provincia: "San José",
            canton: "San José",
            distrito: "Carmen",
            tarifaBase: 15000,
            disponible: true,
            imagen: "carlos.jpg",
        },
    });

    const profSofia = await prisma.profesional.create({
        data: {
            usuarioId: userMap["sofia@trazofit.com"],
            titulo: "Nutricionista Deportiva",
            descripcion: "Especialista en nutrición para rendimiento deportivo y pérdida de peso.",
            experiencia: 5,
            modalidad: Modalidad.VIRTUAL,
            provincia: "Heredia",
            canton: "Heredia",
            distrito: "Mercedes",
            tarifaBase: 20000,
            disponible: true,
            imagen: "sofia.jpg",
        },
    });

    const profDiego = await prisma.profesional.create({
        data: {
            usuarioId: userMap["diego@trazofit.com"],
            titulo: "Instructor de Yoga y Meditación",
            descripcion: "Facilitador de bienestar integral con enfoque en movilidad y mindfulness.",
            experiencia: 6,
            modalidad: Modalidad.MIXTA,
            provincia: "Alajuela",
            canton: "Alajuela",
            distrito: "Central",
            tarifaBase: 12000,
            disponible: true,
            imagen: "diego.jpg",
        },
    });

    const profLaura = await prisma.profesional.create({
        data: {
            usuarioId: userMap["laura@trazofit.com"],
            titulo: "Fisioterapeuta y Entrenadora",
            descripcion: "Experta en rehabilitación deportiva y entrenamiento correctivo.",
            experiencia: 10,
            modalidad: Modalidad.PRESENCIAL,
            provincia: "Cartago",
            canton: "Cartago",
            distrito: "Oriental",
            tarifaBase: 25000,
            disponible: false,
            imagen: "laura.jpg",
        },
    });

    const profAndres = await prisma.profesional.create({
        data: {
            usuarioId: userMap["andres@trazofit.com"],
            titulo: "Coach de Running",
            descripcion: "Entrenador especializado en preparación para carreras y maratones.",
            experiencia: 4,
            modalidad: Modalidad.PRESENCIAL,
            provincia: "San José",
            canton: "Desamparados",
            distrito: "Central",
            tarifaBase: 10000,
            disponible: true,
            imagen: "andres.jpg",
        },
    });

    // 5. Creación de Servicios
    const servFuerza = await prisma.servicio.create({
        data: {
            nombre: "Sesión de Hipertrofia",
            descripcion: "Entrenamiento enfocado en aumento de masa muscular con pesas.",
            precio: 15000,
            duracion: 60,
            modalidad: Modalidad.PRESENCIAL,
            estado: true,
            profesionalId: profCarlos.id,
            categoriaId: catMap["Fuerza"],
            especialidades: {
                create: [
                    { especialidad: { connect: { id: specMap["Hipertrofia"] } } },
                    { especialidad: { connect: { id: specMap["Crossfit"] } } },
                ],
            },
        },
    });

    const servNutricion = await prisma.servicio.create({
        data: {
            nombre: "Plan Nutricional Personalizado",
            descripcion: "Diseño de dieta adaptada a tus objetivos deportivos.",
            precio: 20000,
            duracion: 45,
            modalidad: Modalidad.VIRTUAL,
            estado: true,
            profesionalId: profSofia.id,
            categoriaId: catMap["Nutrición"],
            especialidades: {
                create: [
                    { especialidad: { connect: { id: specMap["Dieta cetogénica"] } } },
                    { especialidad: { connect: { id: specMap["Pérdida de peso"] } } },
                ],
            },
        },
    });

    const servYoga = await prisma.servicio.create({
        data: {
            nombre: "Clase de Yoga Funcional",
            descripcion: "Sesión de yoga orientada a movilidad y reducción del estrés.",
            precio: 12000,
            duracion: 60,
            modalidad: Modalidad.MIXTA,
            estado: true,
            profesionalId: profDiego.id,
            categoriaId: catMap["Bienestar"],
            especialidades: {
                create: [
                    { especialidad: { connect: { id: specMap["Yoga"] } } },
                    { especialidad: { connect: { id: specMap["Movilidad"] } } },
                ],
            },
        },
    });

    const servRehabilitacion = await prisma.servicio.create({
        data: {
            nombre: "Sesión de Rehabilitación",
            descripcion: "Recuperación de lesiones musculares y articulares.",
            precio: 25000,
            duracion: 50,
            modalidad: Modalidad.PRESENCIAL,
            estado: false,
            profesionalId: profLaura.id,
            categoriaId: catMap["Rehabilitación"],
            especialidades: {
                create: [
                    { especialidad: { connect: { id: specMap["Movilidad"] } } },
                    { especialidad: { connect: { id: specMap["Pilates"] } } },
                ],
            },
        },
    });

    const servRunning = await prisma.servicio.create({
        data: {
            nombre: "Plan de Entrenamiento para Carrera",
            descripcion: "Preparación progresiva para carreras de 5k, 10k o maratón.",
            precio: 10000,
            duracion: 45,
            modalidad: Modalidad.PRESENCIAL,
            estado: true,
            profesionalId: profAndres.id,
            categoriaId: catMap["Cardio"],
            especialidades: {
                create: [
                    { especialidad: { connect: { id: specMap["Running"] } } },
                ],
            },
        },
    });

    const servPerdidaPeso = await prisma.servicio.create({
        data: {
            nombre: "Programa de Pérdida de Peso",
            descripcion: "Combinación de cardio y fuerza para quema de grasa efectiva.",
            precio: 18000,
            duracion: 60,
            modalidad: Modalidad.VIRTUAL,
            estado: true,
            profesionalId: profCarlos.id,
            categoriaId: catMap["Cardio"],
            especialidades: {
                create: [
                    { especialidad: { connect: { id: specMap["Pérdida de peso"] } } },
                    { especialidad: { connect: { id: specMap["Crossfit"] } } },
                ],
            },
        },
    });

    await prisma.servicio.create({
        data: {
            nombre: "Entrenamiento Funcional",
            descripcion: "Sesión de movimientos funcionales para mejorar rendimiento atlético.",
            precio: 14000,
            duracion: 50,
            modalidad: Modalidad.PRESENCIAL,
            estado: true,
            profesionalId: profCarlos.id,
            categoriaId: catMap["Fuerza"],
            especialidades: {
                create: [
                    { especialidad: { connect: { id: specMap["Crossfit"] } } },
                ],
            },
        },
    });

    await prisma.servicio.create({
        data: {
            nombre: "Asesoría Nutricional Deportiva",
            descripcion: "Consulta nutricional orientada al rendimiento y recuperación.",
            precio: 18000,
            duracion: 40,
            modalidad: Modalidad.VIRTUAL,
            estado: true,
            profesionalId: profSofia.id,
            categoriaId: catMap["Nutrición"],
            especialidades: {
                create: [
                    { especialidad: { connect: { id: specMap["Pérdida de peso"] } } },
                ],
            },
        },
    });

    await prisma.servicio.create({
        data: {
            nombre: "Clase de Pilates",
            descripcion: "Fortalecimiento del core y mejora postural con técnica Pilates.",
            precio: 11000,
            duracion: 55,
            modalidad: Modalidad.PRESENCIAL,
            estado: false,
            profesionalId: profDiego.id,
            categoriaId: catMap["Bienestar"],
            especialidades: {
                create: [
                    { especialidad: { connect: { id: specMap["Pilates"] } } },
                ],
            },
        },
    });

    await prisma.servicio.create({
        data: {
            nombre: "Preparación Maratón",
            descripcion: "Plan intensivo de 12 semanas para corredores de maratón.",
            precio: 22000,
            duracion: 60,
            modalidad: Modalidad.PRESENCIAL,
            estado: true,
            profesionalId: profAndres.id,
            categoriaId: catMap["Cardio"],
            especialidades: {
                create: [
                    { especialidad: { connect: { id: specMap["Running"] } } },
                ],
            },
        },
    });

    // 6. Asociar especialidades a profesionales
    await prisma.especialidadProfesional.createMany({
        data: [
            { profesionalId: profCarlos.id, especialidadId: specMap["Hipertrofia"] },
            { profesionalId: profCarlos.id, especialidadId: specMap["Crossfit"] },
            { profesionalId: profSofia.id, especialidadId: specMap["Dieta cetogénica"] },
            { profesionalId: profSofia.id, especialidadId: specMap["Pérdida de peso"] },
            { profesionalId: profDiego.id, especialidadId: specMap["Yoga"] },
            { profesionalId: profDiego.id, especialidadId: specMap["Movilidad"] },
            { profesionalId: profLaura.id, especialidadId: specMap["Pilates"] },
            { profesionalId: profLaura.id, especialidadId: specMap["Movilidad"] },
            { profesionalId: profAndres.id, especialidadId: specMap["Running"] },
        ],
    });

    // 7. Creación de Citas
    await prisma.cita.createMany({
        data: [
            {
                clienteId: userMap["maria@trazofit.com"],
                profesionalId: profCarlos.id,
                servicioId: servFuerza.id,
                fechaCita: new Date("2025-08-01"),
                horaInicio: "08:00",
                horaFin: "09:00",
                modalidad: ModalidadCita.PRESENCIAL,
                estado: EstadoCita.PENDIENTE,
                comentarioCliente: "Quiero empezar rutina de hipertrofia.",
                montoEstimado: 15000,
            },
            {
                clienteId: userMap["pedro@trazofit.com"],
                profesionalId: profSofia.id,
                servicioId: servNutricion.id,
                fechaCita: new Date("2025-08-02"),
                horaInicio: "10:00",
                horaFin: "10:45",
                modalidad: ModalidadCita.VIRTUAL,
                estado: EstadoCita.PENDIENTE,
                comentarioCliente: "Necesito un plan para bajar de peso.",
                montoEstimado: 20000,
            },
            {
                clienteId: userMap["valeria@trazofit.com"],
                profesionalId: profDiego.id,
                servicioId: servYoga.id,
                fechaCita: new Date("2025-08-03"),
                horaInicio: "07:00",
                horaFin: "08:00",
                modalidad: ModalidadCita.PRESENCIAL,
                estado: EstadoCita.ACEPTADA,
                comentarioCliente: "Primera clase de yoga.",
                montoEstimado: 12000,
            },
            {
                clienteId: userMap["maria@trazofit.com"],
                profesionalId: profAndres.id,
                servicioId: servRunning.id,
                fechaCita: new Date("2025-08-05"),
                horaInicio: "06:00",
                horaFin: "06:45",
                modalidad: ModalidadCita.PRESENCIAL,
                estado: EstadoCita.ACEPTADA,
                comentarioCliente: "Me preparo para un 10k.",
                montoEstimado: 10000,
            },
            {
                clienteId: userMap["pedro@trazofit.com"],
                profesionalId: profCarlos.id,
                servicioId: servPerdidaPeso.id,
                fechaCita: new Date("2025-08-06"),
                horaInicio: "09:00",
                horaFin: "10:00",
                modalidad: ModalidadCita.VIRTUAL,
                estado: EstadoCita.RECHAZADA,
                comentarioCliente: "Quiero quemar grasa rápido.",
                comentarioProfesional: "No tengo disponibilidad en esa fecha.",
                montoEstimado: 18000,
            },
            {
                clienteId: userMap["valeria@trazofit.com"],
                profesionalId: profCarlos.id,
                servicioId: servFuerza.id,
                fechaCita: new Date("2025-08-07"),
                horaInicio: "11:00",
                horaFin: "12:00",
                modalidad: ModalidadCita.PRESENCIAL,
                estado: EstadoCita.CANCELADA,
                comentarioCliente: "Cancelo por viaje.",
                montoEstimado: 15000,
            },
            {
                clienteId: userMap["maria@trazofit.com"],
                profesionalId: profSofia.id,
                servicioId: servNutricion.id,
                fechaCita: new Date("2025-07-20"),
                horaInicio: "14:00",
                horaFin: "14:45",
                modalidad: ModalidadCita.VIRTUAL,
                estado: EstadoCita.COMPLETADA,
                comentarioCliente: "Seguimiento de mi plan nutricional.",
                comentarioProfesional: "Excelente progreso.",
                montoEstimado: 20000,
            },
            {
                clienteId: userMap["pedro@trazofit.com"],
                profesionalId: profDiego.id,
                servicioId: servYoga.id,
                fechaCita: new Date("2025-07-22"),
                horaInicio: "08:00",
                horaFin: "09:00",
                modalidad: ModalidadCita.PRESENCIAL,
                estado: EstadoCita.COMPLETADA,
                comentarioCliente: "Muy buena sesión.",
                comentarioProfesional: "Gran avance en movilidad.",
                montoEstimado: 12000,
            },
            {
                clienteId: userMap["valeria@trazofit.com"],
                profesionalId: profAndres.id,
                servicioId: servRunning.id,
                fechaCita: new Date("2025-08-10"),
                horaInicio: "06:00",
                horaFin: "06:45",
                modalidad: ModalidadCita.PRESENCIAL,
                estado: EstadoCita.PENDIENTE,
                comentarioCliente: "Quiero mejorar mi tiempo en 5k.",
                montoEstimado: 10000,
            },
            {
                clienteId: userMap["maria@trazofit.com"],
                profesionalId: profCarlos.id,
                servicioId: servFuerza.id,
                fechaCita: new Date("2025-08-12"),
                horaInicio: "08:00",
                horaFin: "09:00",
                modalidad: ModalidadCita.PRESENCIAL,
                estado: EstadoCita.PENDIENTE,
                comentarioCliente: "Segunda sesión de hipertrofia.",
                montoEstimado: 15000,
            },
            {
                clienteId: userMap["pedro@trazofit.com"],
                profesionalId: profSofia.id,
                servicioId: servNutricion.id,
                fechaCita: new Date("2025-08-15"),
                horaInicio: "10:00",
                horaFin: "10:45",
                modalidad: ModalidadCita.VIRTUAL,
                estado: EstadoCita.PENDIENTE,
                comentarioCliente: "Revisión de mi dieta cetogénica.",
                montoEstimado: 20000,
            },
            {
                clienteId: userMap["valeria@trazofit.com"],
                profesionalId: profDiego.id,
                servicioId: servYoga.id,
                fechaCita: new Date("2025-08-18"),
                horaInicio: "07:00",
                horaFin: "08:00",
                modalidad: ModalidadCita.PRESENCIAL,
                estado: EstadoCita.PENDIENTE,
                comentarioCliente: "Continuar con clases de yoga.",
                montoEstimado: 12000,
            },
        ],
    });

    // 8. Creación de Reseñas (solo citas COMPLETADA)
    const citasCompletadas = await prisma.cita.findMany({
        where: { estado: EstadoCita.COMPLETADA },
        include: { cliente: true },
    });

    for (const cita of citasCompletadas) {
        await prisma.resena.create({
            data: {
                citaId: cita.id,
                clienteId: cita.clienteId,
                puntuacion: cita.profesionalId === profSofia.id ? 5 : 4,
                comentario: cita.profesionalId === profSofia.id
                    ? "Excelente nutricionista, muy profesional y detallada."
                    : "Buena clase de yoga, me ayudó mucho con la movilidad.",
            },
        });
    }

    console.log("Seed completado con éxito.");
}

main()
    .catch((e) => {
        console.error("Error en seed:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });