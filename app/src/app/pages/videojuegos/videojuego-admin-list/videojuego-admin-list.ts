import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Videojuego } from '../../../core/models/old-models/videojuego.model';
import { VideojuegoService } from '../../../core/services/videojuego-service';
@Component({
  selector: 'app-videojuego-admin-list',
  imports: [
    RouterLink,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './videojuego-admin-list.html',
  styleUrl: './videojuego-admin-list.css',
})
export class VideojuegoAdminList {
  private readonly videojuegoService = inject(VideojuegoService);
  videojuegos = signal<Videojuego[]>([]);
  search = signal('');
  loading = signal(false);
  error = signal<string | null>(null);
  displayedColumns = [
    'imagen',
    'nombre',
    'categoria',
    'precio',
    'acciones',
  ];
  videojuegosFiltrados = computed(() => {
    const texto = this.search().trim().toLowerCase();
    if (!texto) {
      return this.videojuegos();
    }
    return this.videojuegos().filter((game) => {
      const nombre = game.nombre?.toLowerCase() ?? '';
      const descripcion = game.descripcion?.toLowerCase() ?? '';
      const categoria = game.categoria?.nombre?.toLowerCase() ?? '';

      return (
        nombre.includes(texto) ||
        descripcion.includes(texto) ||
        categoria.includes(texto)
      );
    });
  });
  totalVideojuegos = computed(() => this.videojuegosFiltrados().length);
  ngOnInit(): void {
    this.loadVideojuegos();
  }
  loadVideojuegos(): void {
    this.loading.set(true);
    this.error.set(null);
    this.videojuegoService.listar().subscribe({
      next: (response) => {
        this.videojuegos.set(response.data);
        this.loading.set(false);
        console.log('Videojuegos cargados:', response.data);
      },
      error: () => {
        this.error.set('No se pudo cargar el mantenimiento de videojuegos.');
        this.loading.set(false);
      },
    });
  }
  clearSearch(): void {
    this.search.set('');
  }
  getImageUrl(imageName: string): string {
    return this.videojuegoService.getImageUrl(imageName);
  }
}
