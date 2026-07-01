import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Videojuego } from '../../../core/models/videojuego.model';
import { VideojuegoService } from '../../../core/services/videojuego-service';

@Component({
  selector: 'app-videojuego-detail',
    imports: [
    RouterLink,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './videojuego-detail.html',
  styleUrl: './videojuego-detail.css',
})
export class VideojuegoDetail {
  private readonly route = inject(ActivatedRoute);
  private readonly videojuegoService = inject(VideojuegoService);

  videojuego = signal<Videojuego | null>(null);
  loading = signal(false);
  error = signal<string | null>(null);

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (!id) {
      this.error.set('El identificador del videojuego no es válido.');
      return;
    }
    this.loadVideojuego(id);
  }

  loadVideojuego(id: number): void {
    this.loading.set(true);
    this.error.set(null);

    this.videojuegoService.obtenerPorId(id).subscribe({
      next: (response) => {
        this.videojuego.set(response.data);
        this.loading.set(false);
        console.log(response.data)
      },
      error: () => {
        this.error.set('No se pudo cargar el detalle del videojuego.');
        this.loading.set(false);
      },
    });
  }

  getImageUrl(imageName: string): string {
    return this.videojuegoService.getImageUrl(imageName);
  }
}
