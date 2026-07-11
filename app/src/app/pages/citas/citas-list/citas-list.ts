import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { Router } from '@angular/router';
import { CitaService } from '../../../core/services/cita.service';
import { ProfesionalService } from '../../../core/services/profesional.service';
import { Cita, EstadoCita } from '../../../core/models/cita.model';
import { Profesional } from '../../../core/models/profesional.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-citas-list',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatMenuModule, CommonModule],
  templateUrl: './citas-list.html',
  styleUrl: './citas-list.css',
})
export class CitasList implements OnInit {

  private readonly citaService = inject(CitaService);
  private readonly profesionalService = inject(ProfesionalService);
  private readonly router = inject(Router);

  readonly citas = signal<Cita[]>([]);
  readonly profesionales = signal<Profesional[]>([]);
  readonly selectedEstado = signal<EstadoCita | 'TODOS'>('TODOS');
  readonly selectedProfesional = signal<number | 'TODOS'>('TODOS');
  readonly fechaInicio = signal<string | null>(null);
  readonly fechaFin = signal<string | null>(null);

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

  readonly citasFiltradas = computed(() => {
    return this.citas()
      .filter(c => {
        const coincideEstado = this.selectedEstado() === 'TODOS' || c.estado === this.selectedEstado();
        const coincideProfesional = this.selectedProfesional() === 'TODOS' || c.profesionalId === this.selectedProfesional();
        const fecha = new Date(c.fechaCita);
        const coincideFechaInicio = !this.fechaInicio() || fecha >= new Date(this.fechaInicio()!);
        const coincideFechaFin = !this.fechaFin() || fecha <= new Date(this.fechaFin()!);
        return coincideEstado && coincideProfesional && coincideFechaInicio && coincideFechaFin;
      })
      .sort((a, b) => a.id - b.id);
  });

  ngOnInit(): void {
    this.cargarCitas();
    this.cargarProfesionales();
  }

  cargarCitas() {
    this.citaService.listar().subscribe({
      next: (res) => this.citas.set(res.data),
      error: (err) => console.error(err),
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
  onFechaInicio(value: string) { this.fechaInicio.set(value || null); }
  onFechaFin(value: string) { this.fechaFin.set(value || null); }

  irACrear() { this.router.navigate(['/admin/citas/nuevo']); }
  irADetalle(id: number) { this.router.navigate(['/admin/citas', id]); }

  getBadgeClass(estado: EstadoCita): string {
    const map: Record<EstadoCita, string> = {
      PENDIENTE: 'badge-warning',
      ACEPTADA: 'badge-success',
      RECHAZADA: 'badge-danger',
      CANCELADA: 'badge-danger',
      COMPLETADA: 'badge-primary',
    };
    return map[estado];
  }
}