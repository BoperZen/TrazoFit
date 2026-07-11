import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { ServicioService } from '../../../core/services/servicio.service';
import { ProfesionalService } from '../../../core/services/profesional.service';
import { CategoriaService } from '../../../core/services/categoria.service';

import { Profesional } from '../../../core/models/profesional.model';
import { Categoria } from '../../../core/models/categoria.model';

@Component({
  selector: 'app-servicios-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './servicios-form.html',
  styleUrl: './servicios-form.css',
})
export class ServicioForm implements OnInit {

  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  private readonly servicioService = inject(ServicioService);
  private readonly profesionalService = inject(ProfesionalService);
  private readonly categoriaService = inject(CategoriaService);

  readonly modo = signal<'crear' | 'editar' | 'detalle'>('crear');

  readonly profesionales = signal<Profesional[]>([]);
  readonly categorias = signal<Categoria[]>([]);

  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  servicioId: number | null = null;

  readonly form = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(3)]],
    descripcion: ['', [Validators.required, Validators.minLength(10)]],
    precio: [0, [Validators.required, Validators.min(1)]],
    duracion: [60, [Validators.required, Validators.min(1)]],
    modalidad: ['PRESENCIAL', Validators.required],
    profesionalId: [null as number | null, Validators.required],
    categoriaId: [null as number | null, Validators.required],
    estado: [true],
  });

  ngOnInit(): void {

    this.cargarProfesionales();
    this.cargarCategorias();

    const id = this.route.snapshot.paramMap.get('id');
    const url = this.router.url;

    if (id && url.includes('editar')) {
      this.modo.set('editar');
      this.servicioId = +id;
      this.cargarServicio(+id);
    }
    else if (id) {
      this.modo.set('detalle');
      this.servicioId = +id;
      this.cargarServicio(+id);
      this.form.disable();
    }
    else {
      this.modo.set('crear');
    }
  }

  cargarProfesionales() {
    this.profesionalService.listar().subscribe({
      next: res => this.profesionales.set(
        res.data.filter(p => p.disponible)
      ),
      error: console.error
    });
  }

  cargarCategorias() {
    this.categoriaService.listar().subscribe({
      next: res => this.categorias.set(
        res.data.filter(c => c.estado)
      ),
      error: console.error
    });
  }

  cargarServicio(id: number) {
    this.servicioService.obtenerPorId(id).subscribe({
      next: res => {

        const s = res.data;

        this.form.patchValue({
          nombre: s.nombre,
          descripcion: s.descripcion,
          precio: Number(s.precio),
          duracion: s.duracion,
          modalidad: s.modalidad,
          profesionalId: s.profesionalId,
          categoriaId: s.categoriaId,
          estado: s.estado
        });

      },
      error: console.error
    });
  }

  guardar() {

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);

    const data: any = {
      ...this.form.value,
      precio: Number(this.form.value.precio),
      duracion: Number(this.form.value.duracion),
    };

    const request$ =
      this.modo() === 'editar'
        ? this.servicioService.actualizar(this.servicioId!, data)
        : this.servicioService.crear(data);

    request$.subscribe({
      next: () => this.router.navigate(['/admin/servicios']),
      error: err => {
        console.error(err);
        this.loading.set(false);
        this.error.set('Ocurrió un error al guardar.');
      }
    });

  }

  volver() {
    this.router.navigate(['/admin/servicios']);
  }

  irAEditar(id: number) {
    this.router.navigate(['/admin/servicios', id, 'editar']);
  }

}