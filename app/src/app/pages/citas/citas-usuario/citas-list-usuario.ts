import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CitaService } from '../../../core/services/cita.service';
import { AuthService } from '../../../core/services/auth.service';
import { Cita, EstadoCita } from '../../../core/models/cita.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-citas-list-usuario',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
  templateUrl: './citas-list-usuario.html',
  styleUrl: './citas-list-usuario.css',
})
export class CitasListUsuario implements OnInit {
  private readonly citaService = inject(CitaService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly citas = signal<Cita[]>([]);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly filtroEstado = signal<EstadoCita | 'TODOS'>('TODOS');
  readonly fechaDesde = signal<string>('');
  readonly fechaHasta = signal<string>('');

  readonly estadoOptions: Array<{ label: string; value: EstadoCita | 'TODOS' }> = [
    { label: 'Todas', value: 'TODOS' },
    { label: 'Pendiente', value: 'PENDIENTE' },
    { label: 'Aceptada', value: 'ACEPTADA' },
    { label: 'Completada', value: 'COMPLETADA' },
    { label: 'Cancelada', value: 'CANCELADA' },
    { label: 'Rechazada', value: 'RECHAZADA' },
  ];

  readonly citasFiltradas = computed(() => {
    const estado = this.filtroEstado();
    const desde = this.fechaDesde();
    const hasta = this.fechaHasta();

    return this.citas().filter(c => {
      const coincideEstado = estado === 'TODOS' || c.estado === estado;
      if (!coincideEstado) return false;
      if (!desde && !hasta) return true;
      const fechaCita = this.normalizarFecha(c.fechaCita);
      if (!fechaCita) return false;
      if (desde && fechaCita < desde) return false;
      if (hasta && fechaCita > hasta) return false;
      return true;
    }).slice().sort((a, b) => {
      const fechaA = this.normalizarFecha(a.fechaCita) ?? '';
      const fechaB = this.normalizarFecha(b.fechaCita) ?? '';
      if (fechaA !== fechaB) return fechaB.localeCompare(fechaA);
      return b.horaInicio.localeCompare(a.horaInicio);
    });
  });

  ngOnInit() {
    const user = this.authService.currentUser();
    if (user) this.cargarCitas(user.id);
  }

  cargarCitas(clienteId: number) {
    this.loading.set(true);
    this.error.set(null);
    this.citaService.listarPorCliente(clienteId).subscribe({
      next: (res) => { this.citas.set(res.data); this.loading.set(false); },
      error: () => { this.error.set('No se pudieron cargar tus citas.'); this.loading.set(false); },
    });
  }

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

  setFechaDesde(value: string) { this.fechaDesde.set(value); }
  setFechaHasta(value: string) { this.fechaHasta.set(value); }
  limpiarFiltrosFecha() { this.fechaDesde.set(''); this.fechaHasta.set(''); }
  irADetalle(id: number) { this.router.navigate(['/cliente/citas', id]); }

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
}