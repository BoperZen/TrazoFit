import { prisma } from "../config/prisma";

export class ReporteService {

  // ── 1. COMPARAR — Top profesionales por cantidad de citas ─────────────────
  async topProfesionales() {
    const resultados = await prisma.cita.groupBy({
      by: ['profesionalId'],
      where: { estado: 'COMPLETADA' },
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
      take: 10,
    });

    const ids = resultados.map(r => r.profesionalId);

    const profesionales = await prisma.profesional.findMany({
      where: { id: { in: ids } },
      include: { usuario: { select: { nombre: true, apellidos: true } } },
    });

    const mapaProf = new Map(profesionales.map(p => [p.id, p]));

    return resultados.map(r => {
      const prof = mapaProf.get(r.profesionalId)!;
      return {
        name: `${prof.usuario.nombre} ${prof.usuario.apellidos}`,
        value: r._count.id,
      };
    });
  }

  // ── 2. TIEMPO — Evolución de demanda mensual por servicio ─────────────────
  async demandaMensual() {
    const citas = await prisma.cita.findMany({
      where: {
        estado: 'COMPLETADA',
        fechaCita: {
          gte: new Date(new Date().getFullYear(), 0, 1), // desde enero del año actual
        },
      },
      select: {
        fechaCita: true,
        servicio: { select: { nombre: true } },
      },
    });

    const meses = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];

    // Agrupar por servicio → mes
    const mapa = new Map<string, number[]>();

    for (const cita of citas) {
      const servicio = cita.servicio.nombre;
      const mes = cita.fechaCita.getMonth(); // 0–11

      if (!mapa.has(servicio)) {
        mapa.set(servicio, new Array(12).fill(0));
      }
      mapa.get(servicio)![mes]++;
    }

    return Array.from(mapa.entries()).map(([nombre, conteos]) => ({
      name: nombre,
      series: meses.map((mes, i) => ({ name: mes, value: conteos[i] })),
    }));
  }

  // ── 3. RELACIÓN — Calificación promedio vs volumen de citas ──────────────
  async calificacionVsVolumen() {
    const profesionales = await prisma.profesional.findMany({
      where: { disponible: true },
      include: {
        usuario: { select: { nombre: true, apellidos: true } },
        citas: {
          where: { estado: 'COMPLETADA' },
          include: { resena: { select: { puntuacion: true } } },
        },
      },
    });

    return [
      {
        name: 'Profesionales',
        series: profesionales
          .filter(p => p.citas.length > 0)
          .map(p => {
            const totalCitas = p.citas.length;
            const reseñas = p.citas
              .map(c => c.resena?.puntuacion)
              .filter((r): r is number => r !== undefined);

            const promedio = reseñas.length > 0
              ? reseñas.reduce((a, b) => a + b, 0) / reseñas.length
              : 0;

            // Radio proporcional al volumen, acotado entre 5 y 20
            const r = Math.min(20, Math.max(5, Math.round(totalCitas / 10)));

            return {
              name: `${p.usuario.nombre} ${p.usuario.apellidos}`,
              x: parseFloat(promedio.toFixed(2)),
              y: totalCitas,
              r,
            };
          }),
      },
    ];
  }

  // ── 4. DISTRIBUCIÓN — Histograma de duración de citas ────────────────────
  async histogramaDuracion() {
    const citas = await prisma.cita.findMany({
      where: { estado: 'COMPLETADA' },
      select: { servicio: { select: { duracion: true } } },
    });

    const bins = [
      { label: '0–15 min',    min: 0,   max: 15  },
      { label: '15–30 min',   min: 15,  max: 30  },
      { label: '30–45 min',   min: 30,  max: 45  },
      { label: '45–60 min',   min: 45,  max: 60  },
      { label: '60–75 min',   min: 60,  max: 75  },
      { label: '75–90 min',   min: 75,  max: 90  },
      { label: '90–105 min',  min: 90,  max: 105 },
      { label: '105–120 min', min: 105, max: 120 },
      { label: '120+ min',    min: 120, max: Infinity },
    ];

    const conteos = new Map(bins.map(b => [b.label, 0]));

    for (const cita of citas) {
      const dur = cita.servicio.duracion;
      const bin = bins.find(b => dur >= b.min && dur < b.max);
      if (bin) conteos.set(bin.label, conteos.get(bin.label)! + 1);
    }

    return bins.map(b => ({
      name: b.label,
      value: conteos.get(b.label)!,
    }));
  }
}