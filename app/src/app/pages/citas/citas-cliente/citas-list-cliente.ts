import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CitaService } from '../../../core/services/cita.service';
import { ResenaService } from '../../../core/services/resena.service';
import { AuthService } from '../../../core/services/auth.service';
import { Cita, EstadoCita, ResenaCreateDto } from '../../../core/models/cita.model';

@Component({
  selector: 'app-citas-list-cliente',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
  templateUrl: './citas-list-cliente.html',
  styleUrl: './citas-list-cliente.css',
})
export class CitasListCliente implements OnInit {
  private readonly citaService = inject(CitaService);
  private readonly resenaService = inject(ResenaService);
  private readonly authService = inject(AuthService);

  readonly citas = signal<Cita[]>([]);
  readonly loading = signal(true);
  readonly filtroEstado = signal<EstadoCita | 'TODOS'>('TODOS');
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
    return this.citas().filter(c => estado === 'TODOS' || c.estado === estado);
  });

  ngOnInit() {
    const user = this.authService.currentUser();
    if (user) this.cargarCitas(user.id);
  }

  cargarCitas(clienteId: number) {
    this.loading.set(true);
    this.citaService.listarPorCliente(clienteId).subscribe({
      next: (res) => { this.citas.set(res.data); this.loading.set(false); },
      error: () => this.loading.set(false),
    });
  }

  cancelarCita(id: number) {
    this.citaService.cambiarEstado(id, { estado: 'CANCELADA' }).subscribe({
      next: (res) => {
        this.citas.update(list => list.map(c => c.id === id ? res.data : c));
      },
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
    this.enviandoResena.set(true);

    const data: ResenaCreateDto = {
      citaId,
      clienteId: user.id,
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

  estrellas = [1, 2, 3, 4, 5];
}