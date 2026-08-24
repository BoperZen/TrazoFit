import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { ProfesionalService } from '../../../core/services/profesional.service';
import { EspecialidadService } from '../../../core/services/especialidad.service';
import { AuthService } from '../../../core/services/auth.service';

import { Profesional } from '../../../core/models/profesional.model';
import { Especialidad } from '../../../core/models/especialidad.model';

import { MatDialog } from '@angular/material/dialog';
import { SuccessDialogComponent } from '../../../shared/components/success-dialog.component';

@Component({
    selector: 'app-perfil-profesional',
    standalone: true,
    imports: [
        ReactiveFormsModule,
        MatButtonModule,
        MatIconModule
    ],
    templateUrl: './perfil-profesional.html',
    styleUrl: './perfil-profesional.css',
})
export class PerfilProfesional implements OnInit {

    private readonly fb = inject(FormBuilder);
    private readonly profesionalService = inject(ProfesionalService);
    private readonly especialidadService = inject(EspecialidadService);
    private readonly authService = inject(AuthService);
    private readonly dialog = inject(MatDialog);

    readonly profesional = signal<Profesional | null>(null);
    readonly especialidades = signal<Especialidad[]>([]);
    readonly loading = signal(false);
    readonly loadingPerfil = signal(true);
    readonly error = signal<string | null>(null);
    readonly imagenPreview = signal<string | null>(null);
    readonly editando = signal(false);

    private imagenFile: File | null = null;

    readonly form = this.fb.group({
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

    async ngOnInit(): Promise<void> {
        await this.cargarPerfil();
        this.cargarEspecialidades();
    }

    async cargarPerfil(): Promise<void> {
        this.loadingPerfil.set(true);

        try {
            if (!this.authService.currentProfesional()) {
                await this.authService.cargarUsuarioActivo();
            }

            const profesional = this.authService.currentProfesional();

            if (!profesional) {
                this.error.set('No se pudo cargar el perfil profesional.');
                return;
            }

            this.profesional.set(profesional);

            this.form.patchValue({
                titulo: profesional.titulo,
                descripcion: profesional.descripcion,
                experiencia: profesional.experiencia,
                modalidad: profesional.modalidad,
                provincia: profesional.provincia,
                canton: profesional.canton,
                distrito: profesional.distrito,
                tarifaBase: Number(profesional.tarifaBase),
                disponible: profesional.disponible,
                especialidadIds:
                    profesional.especialidades?.map(e => e.especialidad.id) ?? [],
            });

            this.form.disable();
            this.editando.set(false);

            if (profesional.imagen) {
                this.imagenPreview.set(
                    this.profesionalService.getImageUrl(profesional.imagen)
                );
            }

        } catch (err) {
            console.error(err);
            this.error.set('Ocurrió un error al cargar el perfil.');
        } finally {
            this.loadingPerfil.set(false);
        }
    }

    cargarEspecialidades(): void {
        this.especialidadService.listar().subscribe({
            next: res => {
                this.especialidades.set(
                    res.data.filter(e => e.estado)
                );
            },
            error: err => console.error(err),
        });
    }

    toggleEspecialidad(id: number): void {
        const current = this.form.value.especialidadIds ?? [];

        const updated = current.includes(id)
            ? current.filter(e => e !== id)
            : [...current, id];

        this.form.patchValue({
            especialidadIds: updated
        });
    }

    isEspecialidadSelected(id: number): boolean {
        return (this.form.value.especialidadIds ?? []).includes(id);
    }

    onImagenChange(event: Event): void {
        const input = event.target as HTMLInputElement;

        if (!input.files?.length) return;

        this.imagenFile = input.files[0];

        const reader = new FileReader();

        reader.onload = e => {
            this.imagenPreview.set(e.target?.result as string);
        };

        reader.readAsDataURL(this.imagenFile);
    }

    guardar(): void {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        const profesional = this.profesional();

        if (!profesional) {
            this.error.set('No se encontró el perfil profesional.');
            return;
        }

        this.loading.set(true);
        this.error.set(null);

        if (this.imagenFile) {
            const formData = new FormData();
            formData.append('image', this.imagenFile);

            this.profesionalService.subirImagen(formData).subscribe({
                next: res => {
                    this.enviarCambios(profesional.id, res.fileName);
                },
                error: err => {
                    console.error(err);
                    this.error.set('No se pudo subir la imagen.');
                    this.loading.set(false);
                }
            });

        } else {
            this.enviarCambios(profesional.id);
        }
    }

    editarPerfil(): void {
        this.editando.set(true);
        this.form.enable();
    }

    cancelarEdicion(): void {
        this.editando.set(false);
        this.form.disable();

        this.cargarPerfil();
    }

    private enviarCambios(
        profesionalId: number,
        imagen?: string
    ): void {

        const values = this.form.value;

        const data: any = {
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

        if (imagen) {
            data.imagen = imagen;
        }

        this.profesionalService.actualizar(profesionalId, data).subscribe({
            next: res => {
                const actualizado = res.data;

                this.profesional.set(actualizado);

                this.form.patchValue({
                    titulo: actualizado.titulo,
                    descripcion: actualizado.descripcion,
                    experiencia: actualizado.experiencia,
                    modalidad: actualizado.modalidad,
                    provincia: actualizado.provincia,
                    canton: actualizado.canton,
                    distrito: actualizado.distrito,
                    tarifaBase: Number(actualizado.tarifaBase),
                    disponible: actualizado.disponible,
                    especialidadIds:
                        actualizado.especialidades?.map(
                            e => e.especialidad.id
                        ) ?? [],
                });

                if (actualizado.imagen) {
                    this.imagenPreview.set(
                        this.profesionalService.getImageUrl(actualizado.imagen)
                    );
                }

                this.editando.set(false);
                this.form.disable();
                this.loading.set(false);
                this.imagenFile = null;

                this.dialog.open(SuccessDialogComponent, {
                    width: '380px',
                    data: {
                        titulo: '¡Perfil actualizado!',
                        mensaje: 'Los cambios de tu perfil fueron guardados correctamente.',
                    }
                });
            },

            error: err => {
                console.error(err);

                this.dialog.open(SuccessDialogComponent, {
                    width: '380px',
                    data: {
                        titulo: 'Error',
                        mensaje: 'No se pudo actualizar el perfil. Revisá los datos e intentá nuevamente.',
                    }
                });

                this.loading.set(false);
            }
        });
    }

    get nombreCompleto(): string {
        const usuario = this.authService.currentUser();

        if (!usuario) return 'Profesional';

        return `${usuario.nombre} ${usuario.apellidos}`;
    }

    get correo(): string {
        return this.authService.currentUser()?.email ?? '';
    }

    get iniciales(): string {
        const usuario = this.authService.currentUser();

        if (!usuario) return 'PR';

        return `${usuario.nombre.charAt(0)}${usuario.apellidos.charAt(0)}`.toUpperCase();
    }
}