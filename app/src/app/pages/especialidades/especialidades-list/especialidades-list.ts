import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { EspecialidadService } from '../../../core/services/especialidad.service';
import { Especialidad } from '../../../core/models/especialidad.model';
import { EstadoConfirmDialogComponent } from '../../../shared/components/estado-confirm-dialog.component';
import { ApiResponse } from '../../../core/models/api-response.model';

@Component({
  selector: 'app-especialidades-list',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatMenuModule],
  templateUrl: './especialidades-list.html',
  styleUrl: './especialidades-list.css',
})
export class EspecialidadesList implements OnInit {

  private readonly especialidadService = inject(EspecialidadService);
  private readonly dialog = inject(MatDialog);

  readonly especialidades = signal<Especialidad[]>([]);
  readonly searchTerm = signal('');
  readonly selectedEstado = signal<boolean | 'TODOS'>('TODOS');

  readonly estadoOptions: Array<{ label: string; value: boolean | 'TODOS' }> = [
    { label: 'Todos', value: 'TODOS' },
    { label: 'Activo', value: true },
    { label: 'Inactivo', value: false },
  ];

  readonly estadoFilterLabel = computed(
    () => this.estadoOptions.find((o) => o.value === this.selectedEstado())?.label ?? 'Todos',
  );

  readonly especialidadesFiltradas = computed(() => {
    return this.especialidades().filter((especialidad) => {
      const termino = this.searchTerm();
      const estadoSeleccionado = this.selectedEstado();
      const coincideBusqueda = !termino || especialidad.nombre.toLowerCase().includes(termino);
      const coincideEstado = estadoSeleccionado === 'TODOS' || especialidad.estado === estadoSeleccionado;
      return coincideBusqueda && coincideEstado;
    });
  });

  ngOnInit(): void {
    this.cargarEspecialidades();
  }

  cargarEspecialidades() {
    this.especialidadService.listar().subscribe({
      next: (response) => this.especialidades.set(response.data),
      error: (err) => console.error('Error al cargar especialidades:', err),
    });
  }

  onSearch(term: string) {
    this.searchTerm.set(term.trim().toLowerCase());
  }

  setEstadoFilter(estado: boolean | 'TODOS'): void {
    this.selectedEstado.set(estado);
  }

  confirmarCambioEstado(especialidad: Especialidad): void {
    const estadoAnterior = especialidad.estado;
    const estadoNuevo = !especialidad.estado;
    const especialidadId = especialidad.id;

    const dialogRef = this.dialog.open(EstadoConfirmDialogComponent, {
      width: '420px',
      disableClose: true,
      data: { nombre: especialidad.nombre, nuevoEstado: estadoNuevo },
      autoFocus: false,
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (!confirmed) return;

      this.especialidades.update((items) =>
        items.map((item) => 
          item.id === especialidadId ? { ...item, estado: estadoNuevo } : item
        )
      );

      this.especialidadService.toggleEstado(especialidadId).subscribe({
        next: (response: ApiResponse<Especialidad>) => {
          this.especialidades.update((items) =>
            items.map((item) => 
              item.id === response.data.id ? { ...item, ...response.data } : item
            )
          );
        },
        error: (err) => {
          this.especialidades.update((items) =>
            items.map((item) => 
              item.id === especialidadId ? { ...item, estado: estadoAnterior } : item
            )
          );
          console.error('Error al cambiar el estado:', err);
        },
      });
    });
  }
}