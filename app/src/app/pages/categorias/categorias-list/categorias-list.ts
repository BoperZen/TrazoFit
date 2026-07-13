import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { CategoriaService } from '../../../core/services/categoria.service';
import { Categoria } from '../../../core/models/categoria.model';
import { EstadoConfirmDialogComponent } from '../../../shared/components/estado-confirm-dialog.component';
import { ApiResponse } from '../../../core/models/api-response.model';
import { SuccessDialogComponent } from '../../../shared/components/success-dialog.component';

@Component({
  selector: 'app-categorias-list',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatMenuModule],
  templateUrl: './categorias-list.html',
  styleUrl: './categorias-list.css',
})
export class CategoriasList implements OnInit {

  private readonly categoriaService = inject(CategoriaService);
  private readonly dialog = inject(MatDialog);

  readonly categorias = signal<Categoria[]>([]);
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

  readonly categoriasFiltradas = computed(() => {
    return this.categorias().filter((categoria) => {
      const termino = this.searchTerm();
      const estadoSeleccionado = this.selectedEstado();
      const coincideBusqueda = !termino || categoria.nombre.toLowerCase().includes(termino);
      const coincideEstado = estadoSeleccionado === 'TODOS' || categoria.estado === estadoSeleccionado;
      return coincideBusqueda && coincideEstado;
    });
  });

  ngOnInit(): void {
    this.cargarCategorias();
  }

  cargarCategorias() {
    this.categoriaService.listar().subscribe({
      next: (response) => this.categorias.set(response.data),
      error: (err) => console.error('Error al cargar categorías:', err),
    });
  }

  onSearch(term: string) {
    this.searchTerm.set(term.trim().toLowerCase());
  }

  setEstadoFilter(estado: boolean | 'TODOS'): void {
    this.selectedEstado.set(estado);
  }

  confirmarCambioEstado(categoria: Categoria): void {
    const estadoAnterior = categoria.estado;
    const estadoNuevo = !categoria.estado;
    const categoriaId = categoria.id;

    const dialogRef = this.dialog.open(EstadoConfirmDialogComponent, {
      width: '420px',
      disableClose: true,
      data: { nombre: categoria.nombre, nuevoEstado: estadoNuevo },
      autoFocus: false,
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (!confirmed) return;

      this.categorias.update((items) =>
        items.map((item) =>
          item.id === categoriaId ? { ...item, estado: estadoNuevo } : item
        )
      );

      this.categoriaService.toggleEstado(categoriaId).subscribe({
        next: (response: ApiResponse<Categoria>) => {
          this.categorias.update((items) =>
            items.map((item) =>
              item.id === response.data.id ? { ...item, ...response.data } : item
            )
          );
          this.dialog.open(SuccessDialogComponent, {
            width: '380px',
            data: {
              titulo: '¡Estado actualizado!',
              mensaje: `${categoria.nombre} fue marcado como ${estadoNuevo ? 'activo' : 'inactivo'}.`
            }
          });
        },
        error: (err) => {
          this.categorias.update((items) =>
            items.map((item) =>
              item.id === categoriaId ? { ...item, estado: estadoAnterior } : item
            )
          );
          this.dialog.open(SuccessDialogComponent, {
            width: '380px',
            data: {
              titulo: 'Error',
              mensaje: 'No se pudo cambiar el estado. Intentá de nuevo.'
            }
          });
          console.error('Error al cambiar el estado:', err);
        },
      });
    });
  }
}