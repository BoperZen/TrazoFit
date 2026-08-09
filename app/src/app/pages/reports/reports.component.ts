import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxChartsModule, Color, ScaleType, LegendPosition } from '@swimlane/ngx-charts';
import { CitaService } from '../../core/services/cita.service';
import { ProfesionalService } from '../../core/services/profesional.service';
import { Cita } from '../../core/models/cita.model';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, NgxChartsModule],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.css',
})
export class ReportsComponent implements OnInit {

  private readonly citaService = inject(CitaService);
  private readonly profesionalService = inject(ProfesionalService);
  readonly legendBelow = LegendPosition.Below;

  citasPorEstado = signal<{ name: string; value: number }[]>([]);
  topProfesionales = signal<{ name: string; value: number }[]>([]);
  topServiciosBubble = signal<{ name: string; series: { name: string; x: number; y: number; r: number }[] }[]>([]);
  promedioCalificaciones = signal<{ name: string; value: number }[]>([]);

  readonly viewPie: [number, number] = [500, 380];
  readonly viewBar: [number, number] = [500, 320];
  readonly viewBubble: [number, number] = [500, 360];

  readonly schemeNaranja: Color = {
    name: 'naranja', selectable: true, group: ScaleType.Ordinal,
    domain: ['#d87757', '#e8956d', '#f0b090', '#c4604a', '#a84a38'],
  };

  readonly schemeVerde: Color = {
    name: 'verde', selectable: true, group: ScaleType.Ordinal,
    domain: ['#70c18e', '#5aaa77', '#449360', '#2e7c49', '#186532'],
  };

  readonly schemeMorado: Color = {
    name: 'morado', selectable: true, group: ScaleType.Ordinal,
    domain: ['#9b7fd4', '#8468bd', '#6d51a6', '#563a8f', '#3f2378'],
  };

  readonly schemeMulti: Color = {
    name: 'multi', selectable: true, group: ScaleType.Ordinal,
    domain: ['#d87757', '#5b9bd5', '#70c18e', '#9b7fd4', '#e8956d', '#4a84be'],
  };

  readonly schemeAzul: Color = {
    name: 'azul', selectable: true, group: ScaleType.Ordinal,
    domain: ['#5b9bd5', '#4a84be', '#3a6da7', '#2a5690', '#1a3f79'],
  };

  formatInt = (value: number): string =>
    Number.isInteger(value) ? value.toString() : '';

  ngOnInit(): void {
    forkJoin({
      citas: this.citaService.listar(),
      profesionales: this.profesionalService.listar(),
    }).subscribe({
      next: ({ citas }) => {
        const listaCitas: Cita[] = citas.data;

        this.procesarCitasPorEstado(listaCitas);
        this.procesarTopProfesionales(listaCitas);
        this.procesarTopServiciosBubble(listaCitas);
        this.procesarPromedioCalificaciones(listaCitas);
      },
      error: (err) => console.error('Error cargando datos:', err),
    });
  }

  private procesarCitasPorEstado(citas: Cita[]): void {
    const conteo = new Map<string, number>();
    for (const c of citas) {
      conteo.set(c.estado, (conteo.get(c.estado) ?? 0) + 1);
    }
    this.citasPorEstado.set(
      Array.from(conteo.entries()).map(([name, value]) => ({ name, value }))
    );
  }

  private procesarTopProfesionales(citas: Cita[]): void {
    const conteo = new Map<string, number>();
    for (const c of citas) {
      const nombre = c.profesional?.usuario
        ? `${c.profesional.usuario.nombre} 
        ${c.profesional.usuario.apellidos}`.trim()
        : `Prof. #${c.profesionalId}`;
      conteo.set(nombre, (conteo.get(nombre) ?? 0) + 1);
    }
    this.topProfesionales.set(
      Array.from(conteo.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 6)
        .map(([name, value]) => ({ name, value }))
    );
  }

  private servicioLabels = new Map<number, string>();

  private procesarTopServiciosBubble(citas: Cita[]): void {
    const conteo = new Map<string, number>();
    for (const c of citas) {
      const nombre = c.servicio?.nombre ?? `Servicio #${c.servicioId}`;
      conteo.set(nombre, (conteo.get(nombre) ?? 0) + 1);
    }

    const ordenado = Array.from(conteo.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6);

    const maxVal = Math.max(...ordenado.map(([, v]) => v));

    this.topServiciosBubble.set(
      ordenado.map(([nombre, cantidad], i) => ({
        name: nombre,
        series: [{
          name: '',
          x: i + 1,
          y: cantidad,
          r: Math.max(5, Math.round((cantidad / maxVal) * 20)),
        }],
      }))
    );
  }
  formatVacio = (): string => '';

  private procesarPromedioCalificaciones(citas: Cita[]): void {
    const mapa = new Map<string, { suma: number; total: number }>();

    for (const c of citas) {
      if (!c.resena) continue;

      const nombre = c.profesional?.usuario
        ? `${c.profesional.usuario.nombre} ${c.profesional.usuario.apellidos}`.trim()
        : `Prof. #${c.profesionalId}`;

      const actual = mapa.get(nombre) ?? { suma: 0, total: 0 };
      mapa.set(nombre, {
        suma: actual.suma + c.resena.puntuacion,
        total: actual.total + 1,
      });
    }

    this.promedioCalificaciones.set(
      Array.from(mapa.entries()).map(([name, { suma, total }]) => ({
        name,
        value: parseFloat((suma / total).toFixed(2)),
      }))
    );
  }
}