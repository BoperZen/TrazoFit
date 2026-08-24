import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CitaService } from '../../../core/services/cita.service';
import { ResenaService } from '../../../core/services/resena.service';
import { AuthService } from '../../../core/services/auth.service';
import { Cita, EstadoCita, ResenaCreateDto } from '../../../core/models/cita.model';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog.component';

@Component({
  selector: 'app-citas-list-usuario',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
  templateUrl: './citas-list-usuario.html',
  styleUrl: './citas-list-usuario.css',
})
export class CitasListUsuario implements OnInit {
  private readonly citaService = inject(CitaService);
  private readonly resenaService = inject(ResenaService);
  private readonly authService = inject(AuthService);
  private readonly dialog = inject(MatDialog);

  readonly citas = signal<Cita[]>([]);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly filtroEstado = signal<EstadoCita | 'TODOS'>('TODOS');
  readonly fechaDesde = signal<string>('');
  readonly fechaHasta = signal<string>('');
  readonly citaResenando = signal<number | null>(null);
  readonly puntuacion = signal<number>(5);
  readonly comentarioResena = signal<string>('');
  readonly enviandoResena = signal(false);

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
      error: () => {
        this.error.set('No se pudieron cargar tus citas.');
        this.loading.set(false);
      },
    });
  }

  cancelarCita(id: number) {
    this.dialog.open(ConfirmDialogComponent, {
      width: '380px',
      data: { titulo: 'Cancelar cita', mensaje: '¿Seguro que querés cancelar esta cita?', confirmLabel: 'Sí, cancelar' }
    }).afterClosed().subscribe(confirmado => {
      if (!confirmado) return;
      this.citaService.cambiarEstado(id, { estado: 'CANCELADA' }).subscribe({
        next: (res) => this.citas.update(list => list.map(c => c.id === id ? res.data : c)),
      });
    });
  }

  abrirResena(citaId: number) {
    this.citaResenando.set(citaId);
    this.puntuacion.set(5);
    this.comentarioResena.set('');
  }

  cerrarResena() { this.citaResenando.set(null); }

  enviarResena(citaId: number) {
    const user = this.authService.currentUser();
    if (!user) return;
    this.dialog.open(ConfirmDialogComponent, {
      width: '380px',
      data: { titulo: 'Enviar reseña', mensaje: `¿Confirmás tu calificación de ${this.puntuacion()} estrella(s)?`, confirmLabel: 'Enviar' }
    }).afterClosed().subscribe(confirmado => {
      if (!confirmado) return;
      this.enviandoResena.set(true);
      const data: ResenaCreateDto = {
        citaId, clienteId: user.id,
        puntuacion: this.puntuacion(),
        comentario: this.comentarioResena() || undefined,
      };
      this.resenaService.crear(data).subscribe({
        next: () => {
          this.citas.update(list => list.map(c =>
            c.id === citaId ? { ...c, resena: { id: 0, citaId, clienteId: user.id, puntuacion: data.puntuacion, createdAt: '', updatedAt: '' } } : c
          ));
          this.cerrarResena();
          this.enviandoResena.set(false);
        },
        error: () => this.enviandoResena.set(false),
      });
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

  setFechaDesde(value: string) {
    this.fechaDesde.set(value);
  }

  setFechaHasta(value: string) {
    this.fechaHasta.set(value);
  }

  limpiarFiltrosFecha() {
    this.fechaDesde.set('');
    this.fechaHasta.set('');
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

  estrellas = [1, 2, 3, 4, 5];
}