import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { CitaService } from '../../../core/services/cita.service';
import { ProfesionalService } from '../../../core/services/profesional.service';
import { Cita, EstadoCita } from '../../../core/models/cita.model';
import { Profesional } from '../../../core/models/profesional.model';
import { CommonModule } from '@angular/common';

interface AgendaDay {
  key: string;
  dayName: string;
  fullDate: string;
  citas: Cita[];
}

@Component({
  selector: 'app-citas-list',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, CommonModule],
  templateUrl: './citas-list.html',
  styleUrl: './citas-list.css',
})
export class CitasList implements OnInit {

  private readonly citaService = inject(CitaService);
  private readonly profesionalService = inject(ProfesionalService);
  private readonly router = inject(Router);

  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly citas = signal<Cita[]>([]);
  readonly profesionales = signal<Profesional[]>([]);
  readonly selectedEstado = signal<EstadoCita | 'TODOS'>('TODOS');
  readonly selectedProfesional = signal<number | 'TODOS'>('TODOS');
  readonly weekOffset = signal(0);
  readonly fechaReferencia = signal(this.fechaKey(new Date()));

  readonly estadoOptions: Array<{ label: string; value: EstadoCita | 'TODOS' }> = [
    { label: 'Todos', value: 'TODOS' },
    { label: 'Pendiente', value: 'PENDIENTE' },
    { label: 'Aceptada', value: 'ACEPTADA' },
    { label: 'Rechazada', value: 'RECHAZADA' },
    { label: 'Cancelada', value: 'CANCELADA' },
    { label: 'Completada', value: 'COMPLETADA' },
  ];

  readonly estadoLabel = computed(
    () => this.estadoOptions.find(o => o.value === this.selectedEstado())?.label ?? 'Todos'
  );

  readonly profesionalLabel = computed(() => {
    if (this.selectedProfesional() === 'TODOS') return 'Todos';
    const p = this.profesionales().find(p => p.id === this.selectedProfesional());
    return p ? `${p.usuario?.nombre} ${p.usuario?.apellidos}` : 'Todos';
  });

  private readonly dayNameFormatter = new Intl.DateTimeFormat('es-CR', { weekday: 'long' });
  private readonly fullDateFormatter = new Intl.DateTimeFormat('es-CR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  private readonly weekRangeFormatter = new Intl.DateTimeFormat('es-CR', { day: '2-digit', month: 'short' });

  readonly weekStart = computed(() => {
    const base = this.fechaDesdeKey(this.fechaReferencia()) ?? new Date();
    base.setHours(0, 0, 0, 0);
    base.setDate(base.getDate() + this.weekOffset() * 7);
    return this.startOfWeek(base);
  });

  readonly weekEnd = computed(() => {
    const end = new Date(this.weekStart());
    end.setDate(end.getDate() + 6);
    return end;
  });

  readonly weekLabel = computed(() => {
    return `${this.weekRangeFormatter.format(this.weekStart())} - ${this.weekRangeFormatter.format(this.weekEnd())}`;
  });

  readonly citasFiltradas = computed<Cita[]>(() => {
    return this.citas()
      .filter(c => {
        const coincideEstado = this.selectedEstado() === 'TODOS' || c.estado === this.selectedEstado();
        const coincideProfesional = this.selectedProfesional() === 'TODOS' || c.profesionalId === this.selectedProfesional();
        if (!coincideEstado || !coincideProfesional) return false;

        const key = this.normalizarFecha(c.fechaCita);
        if (!key) return false;
        const fecha = new Date(`${key}T00:00:00`);
        return fecha >= this.weekStart() && fecha <= this.weekEnd();
      })
      .sort((a, b) => {
        const fechaComp = String(a.fechaCita).localeCompare(String(b.fechaCita));
        if (fechaComp !== 0) return fechaComp;
        return a.horaInicio.localeCompare(b.horaInicio);
      });
  });

  readonly conflictosIds = computed(() => {
    const conflictos = new Set<number>();
    const porProfesionalDia = new Map<string, Cita[]>();

    for (const cita of this.citasFiltradas()) {
      if (cita.estado === 'CANCELADA' || cita.estado === 'RECHAZADA') continue;
      const fecha = this.normalizarFecha(cita.fechaCita);
      if (!fecha) continue;
      const key = `${cita.profesionalId}-${fecha}`;
      if (!porProfesionalDia.has(key)) porProfesionalDia.set(key, []);
      porProfesionalDia.get(key)!.push(cita);
    }

    for (const citas of porProfesionalDia.values()) {
      const ordenadas = citas.slice().sort((a, b) => a.horaInicio.localeCompare(b.horaInicio));
      for (let i = 0; i < ordenadas.length; i++) {
        for (let j = i + 1; j < ordenadas.length; j++) {
          if (ordenadas[i].horaFin > ordenadas[j].horaInicio) {
            conflictos.add(ordenadas[i].id);
            conflictos.add(ordenadas[j].id);
          }
        }
      }
    }

    return conflictos;
  });

  readonly diasSemana = computed<AgendaDay[]>(() => {
    const porDia = new Map<string, Cita[]>();
    for (const cita of this.citasFiltradas()) {
      const key = this.normalizarFecha(cita.fechaCita);
      if (!key) continue;
      if (!porDia.has(key)) porDia.set(key, []);
      porDia.get(key)!.push(cita);
    }

    const dias: AgendaDay[] = [];
    for (let i = 0; i < 7; i++) {
      const fecha = new Date(this.weekStart());
      fecha.setDate(fecha.getDate() + i);
      const key = this.fechaKey(fecha);
      dias.push({
        key,
        dayName: this.capitalizar(this.dayNameFormatter.format(fecha)),
        fullDate: this.fullDateFormatter.format(fecha),
        citas: (porDia.get(key) ?? []).slice().sort((a, b) => a.horaInicio.localeCompare(b.horaInicio)),
      });
    }

    return dias;
  });

  ngOnInit(): void {
    this.cargarCitas();
    this.cargarProfesionales();
  }

  cargarCitas() {
    this.loading.set(true);
    this.error.set(null);

    this.citaService.listar().subscribe({
      next: (res) => {
        this.citas.set(res.data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('No se pudieron cargar las citas.');
        this.loading.set(false);
      },
    });
  }

  cargarProfesionales() {
    this.profesionalService.listar().subscribe({
      next: (res) => this.profesionales.set(res.data),
      error: (err) => console.error(err),
    });
  }

  setEstadoFilter(value: EstadoCita | 'TODOS') { this.selectedEstado.set(value); }
  setProfesionalFilter(value: number | 'TODOS') { this.selectedProfesional.set(value); }
  setFechaReferencia(value: string) {
    this.fechaReferencia.set(value || this.fechaKey(new Date()));
    this.weekOffset.set(0);
  }
  semanaAnterior() { this.weekOffset.update((w) => w - 1); }
  semanaSiguiente() { this.weekOffset.update((w) => w + 1); }
  irSemanaActual() {
    this.fechaReferencia.set(this.fechaKey(new Date()));
    this.weekOffset.set(0);
  }

  irACrear() { this.router.navigate(['/admin/citas/nuevo']); }
  irADetalle(id: number) { this.router.navigate(['/admin/citas', id]); }
  tieneConflicto(citaId: number) { return this.conflictosIds().has(citaId); }

  getEstadoClass(estado: EstadoCita): string {
    const map: Record<EstadoCita, string> = {
      PENDIENTE: 'estado--pendiente',
      ACEPTADA: 'estado--aceptada',
      RECHAZADA: 'estado--rechazada',
      CANCELADA: 'estado--cancelada',
      COMPLETADA: 'estado--completada',
    };
    return map[estado];
  }

  private startOfWeek(date: Date): Date {
    const d = new Date(date);
    const day = d.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    d.setDate(d.getDate() + diff);
    d.setHours(0, 0, 0, 0);
    return d;
  }

  private fechaKey(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private fechaDesdeKey(key: string): Date | null {
    if (!key) return null;
    const date = new Date(`${key}T00:00:00`);
    if (Number.isNaN(date.getTime())) return null;
    return date;
  }

  private normalizarFecha(value: string): string | null {
    const isoDate = value.match(/^(\d{4}-\d{2}-\d{2})/);
    if (isoDate) return isoDate[1];

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return null;

    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private capitalizar(value: string): string {
    return value.charAt(0).toUpperCase() + value.slice(1);
  }
}