import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { Router } from '@angular/router';
import { ProfesionalService } from '../../../core/services/profesional.service';
import { Profesional } from '../../../core/models/profesional.model';
import { EstadoConfirmDialogComponent } from '../../../shared/components/estado-confirm-dialog.component';
import { SuccessDialogComponent } from '../../../shared/components/success-dialog.component';

@Component({
  selector: 'app-profesionales-list',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatMenuModule],
  templateUrl: './profesionales-list.html',
  styleUrl: './profesionales-list.css',
})
export class ProfesionalesList implements OnInit {

  private readonly profesionalService = inject(ProfesionalService);
  private readonly dialog = inject(MatDialog);
  private readonly router = inject(Router);

  readonly profesionales = signal<Profesional[]>([]);
  readonly searchTerm = signal('');
  readonly selectedModalidad = signal<'VIRTUAL' | 'PRESENCIAL' | 'MIXTA' | 'TODOS'>('TODOS');
  readonly selectedDisponible = signal<boolean | 'TODOS'>('TODOS');

  readonly modalidadOptions = [
    { label: 'Todos', value: 'TODOS' as const },
    { label: 'Virtual', value: 'VIRTUAL' as const },
    { label: 'Presencial', value: 'PRESENCIAL' as const },
    { label: 'Mixta', value: 'MIXTA' as const },
  ];

  readonly disponibleOptions = [
    { label: 'Todos', value: 'TODOS' as const },
    { label: 'Disponible', value: true },
    { label: 'No disponible', value: false },
  ];

  readonly modalidadLabel = computed(
    () => this.modalidadOptions.find((o) => o.value === this.selectedModalidad())?.label ?? 'Todos'
  );

  readonly disponibleLabel = computed(
    () => this.disponibleOptions.find((o) => o.value === this.selectedDisponible())?.label ?? 'Todos'
  );

  readonly profesionalesFiltrados = computed(() => {
    return this.profesionales().filter((p) => {
      const termino = this.searchTerm();
      const nombre = `${p.usuario?.nombre} ${p.usuario?.apellidos}`.toLowerCase();
      const coincideBusqueda = !termino || nombre.includes(termino) || p.titulo.toLowerCase().includes(termino);
      const coincideModalidad = this.selectedModalidad() === 'TODOS' || p.modalidad === this.selectedModalidad();
      const coincideDisponible = this.selectedDisponible() === 'TODOS' || p.disponible === this.selectedDisponible();
      return coincideBusqueda && coincideModalidad && coincideDisponible;
    }).sort((a, b) => a.id - b.id);
  });

  ngOnInit(): void {
    this.cargarProfesionales();
  }

  cargarProfesionales() {
    this.profesionalService.listar().subscribe({
      next: (response) => this.profesionales.set(response.data),
      error: (err) => console.error(err),
    });
  }

  onSearch(term: string) {
    this.searchTerm.set(term.trim().toLowerCase());
  }

  setModalidadFilter(value: any) { this.selectedModalidad.set(value); }
  setDisponibleFilter(value: any) { this.selectedDisponible.set(value); }

  irACrear() { this.router.navigate(['/admin/profesionales/nuevo']); }
  irADetalle(id: number) { this.router.navigate(['/admin/profesionales', id]); }
  irAEditar(id: number) { this.router.navigate(['/admin/profesionales', id, 'editar']); }

  confirmarCambioDisponible(profesional: Profesional): void {
    const anterior = profesional.disponible;
    const nuevo = !profesional.disponible;

    const dialogRef = this.dialog.open(EstadoConfirmDialogComponent, {
      width: '420px',
      disableClose: true,
      data: { nombre: `${profesional.usuario?.nombre} ${profesional.usuario?.apellidos}`, nuevoEstado: nuevo },
      autoFocus: false,
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (!confirmed) return;

      this.profesionales.update((items) =>
        items.map((item) => item.id === profesional.id ? { ...item, disponible: nuevo } : item)
      );

      this.profesionalService.toggleDisponible(profesional.id).subscribe({
        next: (response) => {
          this.profesionales.update((items) =>
            items.map((item) => item.id === response.data.id ? { ...item, ...response.data } : item)
          );
          this.dialog.open(SuccessDialogComponent, {
      width: '380px',
      data: {
        titulo: '¡Estado actualizado!',
        mensaje: `${profesional.usuario?.nombre} fue marcado como ${nuevo ? 'disponible' : 'no disponible'}.`
      }
    });
        },
        error: (err) => {
          this.profesionales.update((items) =>
            items.map((item) => item.id === profesional.id ? { ...item, disponible: anterior } : item)
          );
          console.error(err);
        },
      });
    });
  }
}