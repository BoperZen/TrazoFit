import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ProfesionalService } from '../../../core/services/profesional.service';
import { EspecialidadService } from '../../../core/services/especialidad.service';
import { UsuarioService } from '../../../core/services/usuario.service';
import { Especialidad } from '../../../core/models/especialidad.model';
import { Usuario } from '../../../core/models/usuario.model';
import { MatDialog } from '@angular/material/dialog';
import { SuccessDialogComponent } from '../../../shared/components/success-dialog.component';

@Component({
  selector: 'app-profesional-form',
  standalone: true,
  imports: [ReactiveFormsModule, MatButtonModule, MatIconModule],
  templateUrl: './profesional-form.html',
  styleUrl: './profesional-form.css',
})
export class ProfesionalForm implements OnInit {

  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly profesionalService = inject(ProfesionalService);
  private readonly especialidadService = inject(EspecialidadService);
  private readonly usuarioService = inject(UsuarioService);
  private readonly dialog = inject(MatDialog);

  readonly modo = signal<'crear' | 'editar' | 'detalle'>('crear');
  readonly especialidades = signal<Especialidad[]>([]);
  readonly usuarios = signal<Usuario[]>([]);
  readonly usuarioSeleccionado = signal<Usuario | null>(null);
  readonly dropdownOpen = signal(false);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly imagenPreview = signal<string | null>(null);
  profesionalId: number | null = null;
  private imagenFile: File | null = null;

  readonly form = this.fb.group({
    usuarioId: [null as number | null, Validators.required],
    titulo: ['', [Validators.required, Validators.minLength(3)]],
    descripcion: ['', [Validators.required, Validators.minLength(10)]],
    experiencia: [0, [Validators.required, Validators.min(0)]],
    modalidad: ['PRESENCIAL', Validators.required],
    provincia: ['', Validators.required],
    canton: ['', Validators.required],
    distrito: ['', Validators.required],
    tarifaBase: [0, [Validators.required, Validators.min(1)]],
    disponible: [true],
    especialidadIds: [[] as number[]],
  });

  ngOnInit(): void {
    this.cargarEspecialidades();
    this.cargarUsuarios();
    const id = this.route.snapshot.paramMap.get('id');
    const url = this.router.url;

    if (id && url.includes('editar')) {
      this.modo.set('editar');
      this.profesionalId = +id;
      this.cargarProfesional(+id);
    } else if (id) {
      this.modo.set('detalle');
      this.profesionalId = +id;
      this.cargarProfesional(+id);
      this.form.disable();
    } else {
      this.modo.set('crear');
    }
  }

  cargarUsuarios() {
    Promise.all([
      this.usuarioService.listar().toPromise(),
      this.profesionalService.listar().toPromise(),
    ]).then(([usuariosRes, profesionalesRes]) => {
      const idsYaAsignados = new Set(
        profesionalesRes!.data.map((p: any) => p.usuarioId)
      );
      const disponibles = usuariosRes!.data.filter(
        (u: Usuario) => u.role === 'PROFESIONAL' && !idsYaAsignados.has(u.id)
      );
      this.usuarios.set(disponibles);
    });
  }

  cargarEspecialidades() {
    this.especialidadService.listar().subscribe({
      next: (res) => this.especialidades.set(res.data.filter((e: any) => e.estado)),
      error: (err) => console.error(err),
    });
  }

  cargarProfesional(id: number) {
    this.profesionalService.obtenerPorId(id).subscribe({
      next: (res) => {
        const p = res.data;
        this.form.patchValue({
          usuarioId: p.usuarioId,
          titulo: p.titulo,
          descripcion: p.descripcion,
          experiencia: p.experiencia,
          modalidad: p.modalidad,
          provincia: p.provincia,
          canton: p.canton,
          distrito: p.distrito,
          tarifaBase: Number(p.tarifaBase),
          disponible: p.disponible,
          especialidadIds: p.especialidades?.map((e) => e.especialidad.id) ?? [],
        });

        if (p.usuario) {
          this.usuarioSeleccionado.set(p.usuario as Usuario);
        } else if (p.usuarioId) {
          const usuarioEncontrado = this.usuarios().find(u => u.id === p.usuarioId);
          if (usuarioEncontrado) {
            this.usuarioSeleccionado.set(usuarioEncontrado);
          }
        }

        if (p.imagen) {
          const url = this.profesionalService.getImageUrl(p.imagen);

          console.log('IMAGEN BD:', p.imagen);
          console.log('URL IMAGEN:', url);

          this.imagenPreview.set(url);
        }
      },
      error: (err) => console.error(err),
    });
  }


  seleccionarUsuario(usuario: Usuario) {
    this.usuarioSeleccionado.set(usuario);
    this.form.patchValue({ usuarioId: usuario.id });
    this.dropdownOpen.set(false);
  }

  onImagenChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;
    this.imagenFile = input.files[0];
    const reader = new FileReader();
    reader.onload = (e) => this.imagenPreview.set(e.target?.result as string);
    reader.readAsDataURL(this.imagenFile);
  }

  toggleEspecialidad(id: number) {
    if (this.modo() === 'detalle') return;
    const current = this.form.value.especialidadIds ?? [];
    const updated = current.includes(id)
      ? current.filter((e) => e !== id)
      : [...current, id];
    this.form.patchValue({ especialidadIds: updated });
  }

  isEspecialidadSelected(id: number): boolean {
    return (this.form.value.especialidadIds ?? []).includes(id);
  }

  guardar() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading.set(true);
    this.error.set(null);

    if (this.imagenFile) {
      const formData = new FormData();
      formData.append('image', this.imagenFile);
      this.profesionalService.subirImagen(formData).subscribe({
        next: (res) => this.enviarProfesional(res.fileName),
        error: (err) => {
          this.error.set('Error al subir la imagen.');
          this.loading.set(false);
          console.error(err);
        },
      });
    } else {
      this.enviarProfesional(null);
    }
  }

  private enviarProfesional(imagen: string | null) {
    const values = this.form.value;
    const data: any = {
      usuarioId: values.usuarioId,
      titulo: values.titulo,
      descripcion: values.descripcion,
      experiencia: Number(values.experiencia),
      modalidad: values.modalidad,
      provincia: values.provincia,
      canton: values.canton,
      distrito: values.distrito,
      tarifaBase: Number(values.tarifaBase),
      disponible: values.disponible ?? true,
      especialidadIds: values.especialidadIds ?? [],
    };
    if (imagen) data.imagen = imagen;

    const esEditar = this.modo() === 'editar';

    const request$ = esEditar
      ? this.profesionalService.actualizar(this.profesionalId!, data)
      : this.profesionalService.crear(data);

    request$.subscribe({
      next: () => {
        this.dialog.open(SuccessDialogComponent, {
          width: '380px',
          data: {
            titulo: esEditar ? '¡Actualizado!' : '¡Creado!',
            mensaje: esEditar
              ? 'El profesional fue actualizado correctamente.'
              : 'El profesional fue registrado correctamente.',
          }
        }).afterClosed().subscribe(() => {
          this.router.navigate(['/admin/profesionales']);
        });
      },
      error: (err) => {
        this.dialog.open(SuccessDialogComponent, {
          width: '380px',
          data: {
            titulo: 'Error',
            mensaje: 'Ocurrió un error al guardar. Revisá los datos.',
          }
        });
        this.loading.set(false);
        console.error(err);
      },
    });
  }

  irAEditar(id: number) {
    this.router.navigate(['/admin/profesionales', id, 'editar']);
  }

  volver() {
    this.router.navigate(['/admin/profesionales']);
  }
}