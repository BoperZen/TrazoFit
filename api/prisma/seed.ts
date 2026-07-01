import { Role, EstadoOrden } from "../generated/prisma";
import { prisma } from "../src/config/prisma";

async function main() {
    console.log("Iniciando seed...");
    
    // 1. Limpieza de datos
    const models = [
        prisma.ordenVideojuego,
        prisma.orden,
        prisma.plataformaVideojuego,
        prisma.videojuego,
        prisma.etiqueta,
        prisma.plataforma,
        prisma.categoria,
        prisma.usuario,
    ];

    for (const model of models) {
        await (model as any).deleteMany();
    }

    // 2. Creación de datos maestros
    await prisma.categoria.createMany({
        data: [
            { nombre: "Acción", descripcion: "Videojuegos con combate y ritmo rápido." },
            { nombre: "RPG", descripcion: "Juegos de rol con progresión." },
            { nombre: "Deportes", descripcion: "Basados en disciplinas deportivas." },
            { nombre: "Estrategia", descripcion: "Planificación y táctica." },
            { nombre: "Aventura", descripcion: "Exploración e historia." },
            { nombre: "Simulación", descripcion: "Experiencias simuladas" },
        ],
    });

    await prisma.plataforma.createMany({
        data: [
            { nombre: "PC" },
            { nombre: "PlayStation 5" },
            { nombre: "PlayStation 4" },
            { nombre: "Xbox Series X|S" },
            { nombre: "Xbox One" },
            { nombre: "Nintendo Switch" },
            { nombre: "Steam Deck" },
        ],
    });

    await prisma.etiqueta.createMany({
        data: [
            { nombre: "Multijugador" },
            { nombre: "Un jugador" },
            { nombre: "Mundo abierto" },
            { nombre: "Alta dificultad" },
            { nombre: "Competitivo" },
            { nombre: "Historia profunda" },
            { nombre: "Cooperativo" },
            { nombre: "Indie" },
        ],
    });

    await prisma.usuario.createMany({
        data: [
            { email: "admin@videojuegos.com", nombre: "Admin", password: "hash_password", role: Role.ADMIN },
            { email: "ana@correo.com", nombre: "Ana Rodríguez", password: "hash_password", role: Role.USER },
            { email: "carlos@correo.com", nombre: "Carlos Mora", password: "hash_password", role: Role.USER },
        ],
    });

    // 3. Recuperar datos para mapeo indexado por propiedades únicas
    const [cats, etiqs, plats, users] = await Promise.all([
        prisma.categoria.findMany(),
        prisma.etiqueta.findMany(),
        prisma.plataforma.findMany(),
        prisma.usuario.findMany(),
    ]);

    const catMap = Object.fromEntries(cats.map((c) => [c.nombre, c.id]));
    const etiqMap = Object.fromEntries(etiqs.map((e) => [e.nombre, e.id]));
    const platMap = Object.fromEntries(plats.map((p) => [p.nombre, p.id]));
    const userMap = Object.fromEntries(users.map((u) => [u.email, u.id]));

    // 4. Creación de Videojuegos con Relaciones
    const eldenRing = await prisma.videojuego.create({
        data: {
            nombre: "Elden Ring",
            descripcion: "RPG de acción en mundo abierto con exploración, combates exigentes y progresión profunda.",
            precio: 39900,
            stock: 15,
            imagen: "elden-ring.webp",
            categoriaId: catMap["RPG"],
            etiquetas: {
                connect: [{ id: etiqMap["Un jugador"] }, { id: etiqMap["Mundo abierto"] }, { id: etiqMap["Alta dificultad"] }]
            },
            plataformas: {
                create: [
                    { annoLanzamiento: 2022, plataforma: { connect: { id: platMap["PC"] } } },
                    { annoLanzamiento: 2022, plataforma: { connect: { id: platMap["PlayStation 5"] } } }
                ]
            }
        },
    });
    const zelda = await prisma.videojuego.create({
        data: {
            nombre: "Zelda: Tears of the Kingdom",
            descripcion: "Aventura de exploración, construcción y resolución de desafíos en un mundo abierto",
            precio: 42900,
            stock: 8,
            imagen: "zelda.webp",
            categoriaId: catMap["Aventura"],
            etiquetas: {
                connect: [{ id: etiqMap["Un jugador"] }, { id: etiqMap["Mundo abierto"] }, { id: etiqMap["Historia profunda"] }]
            },
            plataformas: {
                create: [
                    { annoLanzamiento: 2023, plataforma: { connect: { id: platMap["Nintendo Switch"] } } }
                ]
            }
        },
    });
    const eaFc = await prisma.videojuego.create({
        data: {
            nombre: "EA Sports FC 26",
            descripcion: "Simulador deportivo de fútbol con modos competitivos, clubes y juego en línea.",
            precio: 45900,
            stock: 20,
            categoriaId: catMap["Deportes"],
            etiquetas: {
                connect: [{ id: etiqMap["Multijugador"] }, { id: etiqMap["Competitivo"] }]
            },
            plataformas: {
                create: [
                    { annoLanzamiento: 2025, plataforma: { connect: { id: platMap["PlayStation 5"] } } },
                    { annoLanzamiento: 2025, plataforma: { connect: { id: platMap["Xbox Series X|S"] } } }
                ]
            }
        },
    });
    const halo = await prisma.videojuego.create({
        data: {
            nombre: "Halo Infinite",
            descripcion: "Juego de acción y disparos con campaña, multijugador competitivo y combates futuristas.",
            precio: 29900,
            stock: 5,
            categoriaId: catMap["Acción"],
            etiquetas: {
                connect: [{ id: etiqMap["Multijugador"] }, { id: etiqMap["Competitivo"] }, { id: etiqMap["Cooperativo"] }]
            },
            plataformas: {
                create: [
                    { annoLanzamiento: 2025, plataforma: { connect: { id: platMap["Xbox Series X|S"] } } },
                    { annoLanzamiento: 2021, plataforma: { connect: { id: platMap["PC"] } } }
                ]
            }
        },
    });
    const civilization = await prisma.videojuego.create({
        data: {
            nombre: "Civilization VII",
            descripcion: "Juego de estrategia por turnos centrado en civilizaciones, tecnología, diplomacia y expansión.",
            precio: 49900,
            stock: 12,
            categoriaId: catMap["Estrategia"],
            etiquetas: {
                connect: [{ id: etiqMap["Un jugador"] }, { id: etiqMap["Competitivo"] }]
            },
            plataformas: {
                create: [
                    { annoLanzamiento: 2025, plataforma: { connect: { id: platMap["PC"] } } }
                ]
            }
        },
    });

    // 5. Creación de Órdenes    
    // Orden 1
    await prisma.orden.create({
        data: {
            usuarioId: userMap["ana@correo.com"],
            estado: EstadoOrden.PAGADA,
            total: 82800,
            videojuegos: {
                create: [
                    { videojuegoId: eldenRing.id, cantidad: 1, precioFixed: eldenRing.precio },
                    { videojuegoId: zelda.id, cantidad: 1, precioFixed: zelda.precio },
                ],
            },
        },
    });
    // Orden 2
    await prisma.orden.create({
        data: {
            usuarioId: userMap["ana@correo.com"],
            estado: EstadoOrden.ENVIADA,
            total: 42900,
            videojuegos: {
                create: [
                    { videojuegoId: zelda.id, cantidad: 1, precioFixed: zelda.precio },
                ],
            },
        },
    });
    // Orden 3
    await prisma.orden.create({
        data: {
            usuarioId: userMap["ana@correo.com"],
            estado: EstadoOrden.PENDIENTE,
            total: 45900,
            videojuegos: {
                create: [
                    { videojuegoId: eaFc.id, cantidad: 1, precioFixed: eaFc.precio },
                ],
            },
        },
    });
    // Orden 4
    await prisma.orden.create({
        data: {
            usuarioId: userMap["ana@correo.com"],
            estado: EstadoOrden.CANCELADA,
            total: 79800,
            videojuegos: {
                create: [
                    { videojuegoId: halo.id, cantidad: 1, precioFixed: halo.precio },
                    { videojuegoId: civilization.id, cantidad: 1, precioFixed: civilization.precio },
                ],
            },
        },
    });
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