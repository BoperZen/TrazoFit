import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Cita, EstadoCita } from '../../../core/models/cita.model';
import { AuthService } from '../../../core/services/auth.service';
import { CitaService } from '../../../core/services/cita.service';

interface AgendaDay {
  key: string;
  dayName: string;
  fullDate: string;
  citas: Cita[];
}

@Component({
  selector: 'app-profesionales-agenda',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
  templateUrl: './profesionales-agenda.html',
  styleUrl: './profesionales-agenda.css',
})
export class ProfesionalesAgenda implements OnInit {
  private readonly citaService = inject(CitaService);
  private readonly authService = inject(AuthService);

  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly citas = signal<Cita[]>([]);
  readonly weekOffset = signal(0);
  readonly selectedEstado = signal<EstadoCita | 'TODOS'>('TODOS');
  readonly gestionandoCita = signal<number | null>(null);

  readonly estadoOptions: Array<{ label: string; value: EstadoCita | 'TODOS' }> = [
    { label: 'Todos', value: 'TODOS' },
    { label: 'Pendiente', value: 'PENDIENTE' },
    { label: 'Aceptada', value: 'ACEPTADA' },
    { label: 'Completada', value: 'COMPLETADA' },
    { label: 'Cancelada', value: 'CANCELADA' },
    { label: 'Rechazada', value: 'RECHAZADA' },
  ];

  private readonly weekRangeFormatter = new Intl.DateTimeFormat('es-CR', {
    day: '2-digit',
    month: 'short',
  });

  private readonly dayNameFormatter = new Intl.DateTimeFormat('es-CR', {
    weekday: 'long',
  });

  private readonly fullDateFormatter = new Intl.DateTimeFormat('es-CR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  readonly weekStart = computed(() => {
    const base = new Date();
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
    const start = this.weekRangeFormatter.format(this.weekStart());
    const end = this.weekRangeFormatter.format(this.weekEnd());
    return `${start} - ${end}`;
  });

  readonly citasSemana = computed(() => {
    const inicio = this.weekStart();
    const fin = this.weekEnd();
    const estado = this.selectedEstado();

    return this.citas().filter((cita) => {
      const coincideEstado = estado === 'TODOS' || cita.estado === estado;
      if (!coincideEstado) return false;

      const key = this.normalizarFecha(cita.fechaCita);
      if (!key) return false;
      const fecha = new Date(`${key}T00:00:00`);
      return fecha >= inicio && fecha <= fin;
    });
  });

  readonly conflictosIds = computed(() => {
    const conflictos = new Set<number>();
    const porDia = new Map<string, Cita[]>();

    for (const cita of this.citasSemana()) {
      if (cita.estado === 'CANCELADA' || cita.estado === 'RECHAZADA') continue;
      const key = this.normalizarFecha(cita.fechaCita);
      if (!key) continue;
      if (!porDia.has(key)) porDia.set(key, []);
      porDia.get(key)!.push(cita);
    }

    for (const citas of porDia.values()) {
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
    const citasPorDia = new Map<string, Cita[]>();

    for (const cita of this.citasSemana()) {
      const key = this.normalizarFecha(cita.fechaCita);
      if (!key) continue;
      if (!citasPorDia.has(key)) {
        citasPorDia.set(key, []);
      }
      citasPorDia.get(key)!.push(cita);
    }

    const dias: AgendaDay[] = [];
    for (let i = 0; i < 7; i++) {
      const fecha = new Date(this.weekStart());
      fecha.setDate(fecha.getDate() + i);
      const key = this.fechaKey(fecha);
      const citas = (citasPorDia.get(key) ?? []).slice().sort((a, b) =>
        a.horaInicio.localeCompare(b.horaInicio)
      );

      dias.push({
        key,
        dayName: this.capitalizar(this.dayNameFormatter.format(fecha)),
        fullDate: this.fullDateFormatter.format(fecha),
        citas,
      });
    }

    return dias;
  });

  ngOnInit(): void {
    const profesionalId = this.authService.profesionalId();
    if (!profesionalId) {
      this.error.set('No se pudo cargar tu perfil profesional.');
      this.loading.set(false);
      return;
    }

    this.cargarCitas(profesionalId);
  }

  cargarCitas(profesionalId: number) {
    this.loading.set(true);
    this.error.set(null);

    this.citaService.listarPorProfesional(profesionalId).subscribe({
      next: (res) => {
        this.citas.set(res.data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('No se pudieron cargar las citas de la agenda.');
        this.loading.set(false);
      },
    });
  }

  semanaAnterior() {
    this.weekOffset.update((value) => value - 1);
  }

  semanaSiguiente() {
    this.weekOffset.update((value) => value + 1);
  }

  irSemanaActual() {
    this.weekOffset.set(0);
  }

  setEstado(value: EstadoCita | 'TODOS') {
    this.selectedEstado.set(value);
  }

  tieneConflicto(citaId: number) {
    return this.conflictosIds().has(citaId);
  }

  cambiarEstado(citaId: number, estado: 'ACEPTADA' | 'RECHAZADA' | 'COMPLETADA' | 'CANCELADA') {
    this.gestionandoCita.set(citaId);
    this.citaService.cambiarEstado(citaId, { estado }).subscribe({
      next: (res) => {
        this.citas.update((list) => list.map((c) => c.id === citaId ? res.data : c));
        this.gestionandoCita.set(null);
      },
      error: () => {
        this.gestionandoCita.set(null);
      },
    });
  }

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
