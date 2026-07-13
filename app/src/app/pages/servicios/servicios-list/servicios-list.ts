import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { Router } from '@angular/router';
import { ServicioService } from '../../../core/services/servicio.service';
import { CategoriaService } from '../../../core/services/categoria.service';
import { Servicio } from '../../../core/models/servicio.model';
import { Categoria } from '../../../core/models/categoria.model';
import { EstadoConfirmDialogComponent } from '../../../shared/components/estado-confirm-dialog.component';
import { SuccessDialogComponent } from '../../../shared/components/success-dialog.component';

@Component({
  selector: 'app-servicios-list',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatMenuModule],
  templateUrl: './servicios-list.html',
  styleUrl: './servicios-list.css',
})
export class ServiciosList implements OnInit {

  private readonly servicioService = inject(ServicioService);
  private readonly categoriaService = inject(CategoriaService);
  private readonly dialog = inject(MatDialog);
  private readonly router = inject(Router);

  readonly servicios = signal<Servicio[]>([]);
  readonly categorias = signal<Categoria[]>([]);
  readonly searchTerm = signal('');
  readonly selectedCategoria = signal<number | 'TODOS'>('TODOS');
  readonly selectedModalidad = signal<'VIRTUAL' | 'PRESENCIAL' | 'MIXTA' | 'TODOS'>('TODOS');
  readonly precioMin = signal<number | null>(null);
  readonly precioMax = signal<number | null>(null);

  readonly modalidadOptions = [
    { label: 'Todos', value: 'TODOS' as const },
    { label: 'Virtual', value: 'VIRTUAL' as const },
    { label: 'Presencial', value: 'PRESENCIAL' as const },
    { label: 'Mixta', value: 'MIXTA' as const },
  ];

  readonly categoriaLabel = computed(() => {
    if (this.selectedCategoria() === 'TODOS') return 'Todos';
    return this.categorias().find(c => c.id === this.selectedCategoria())?.nombre ?? 'Todos';
  });

  readonly modalidadLabel = computed(
    () => this.modalidadOptions.find(o => o.value === this.selectedModalidad())?.label ?? 'Todos'
  );

  readonly serviciosFiltrados = computed(() => {
    return this.servicios()
      .filter(s => {
        const termino = this.searchTerm();
        const coincideBusqueda = !termino || s.nombre.toLowerCase().includes(termino);
        const coincideCategoria = this.selectedCategoria() === 'TODOS' || s.categoriaId === this.selectedCategoria();
        const coincideModalidad = this.selectedModalidad() === 'TODOS' || s.modalidad === this.selectedModalidad();
        const precio = Number(s.precio);
        const coincidePrecioMin = this.precioMin() === null || precio >= this.precioMin()!;
        const coincidePrecioMax = this.precioMax() === null || precio <= this.precioMax()!;
        return coincideBusqueda && coincideCategoria && coincideModalidad && coincidePrecioMin && coincidePrecioMax;
      })
      .sort((a, b) => a.id - b.id);
  });

  ngOnInit(): void {
    this.cargarServicios();
    this.cargarCategorias();
    console.log('ServicioForm');
  }

  cargarServicios() {
    this.servicioService.listar().subscribe({
      next: (res) => this.servicios.set(res.data),
      error: (err) => console.error(err),
    });
  }

  cargarCategorias() {
    this.categoriaService.listar().subscribe({
      next: (res) => this.categorias.set(res.data),
      error: (err) => console.error(err),
    });
  }

  onSearch(term: string) { this.searchTerm.set(term.trim().toLowerCase()); }
  setCategoriaFilter(value: number | 'TODOS') { this.selectedCategoria.set(value); }
  setModalidadFilter(value: any) { this.selectedModalidad.set(value); }
  onPrecioMin(value: string) { this.precioMin.set(value ? Number(value) : null); }
  onPrecioMax(value: string) { this.precioMax.set(value ? Number(value) : null); }

  irACrear() { this.router.navigate(['/admin/servicios/nuevo']); }
  irADetalle(id: number) { this.router.navigate(['/admin/servicios', id]); }
  irAEditar(id: number) { this.router.navigate(['/admin/servicios', id, 'editar']); }

  confirmarCambioEstado(servicio: Servicio): void {
    const anterior = servicio.estado;
    const nuevo = !servicio.estado;

    const dialogRef = this.dialog.open(EstadoConfirmDialogComponent, {
      width: '420px',
      disableClose: true,
      data: { nombre: servicio.nombre, nuevoEstado: nuevo },
      autoFocus: false,
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (!confirmed) return;
      this.servicios.update(items =>
        items.map(item => item.id === servicio.id ? { ...item, estado: nuevo } : item)
      );
      this.servicioService.toggleEstado(servicio.id).subscribe({
        next: (res) => {
          this.servicios.update(items =>
            items.map(item => item.id === res.data.id ? { ...item, ...res.data } : item)
          );
          this.dialog.open(SuccessDialogComponent, {
            width: '380px',
            data: {
              titulo: '¡Estado actualizado!',
              mensaje: `${servicio.nombre} fue marcado como ${nuevo ? 'activo' : 'inactivo'}.`
            }
          });
        },
        error: (err) => {
          this.servicios.update(items =>
            items.map(item => item.id === servicio.id ? { ...item, estado: anterior } : item)
          );
          this.dialog.open(SuccessDialogComponent, {
            width: '380px',
            data: {
              titulo: 'Error',
              mensaje: 'No se pudo cambiar el estado. Intentá de nuevo.'
            }
          });
          console.error(err);
        },
      });
    });
  }
}