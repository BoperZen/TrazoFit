import { Component, inject, OnInit, signal } from '@angular/core';
import {
    FormBuilder,
    ReactiveFormsModule,
    Validators
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';

import { UsuarioService } from '../../../core/services/usuario.service';
import { AuthService } from '../../../core/services/auth.service';
import { Usuario } from '../../../core/models/usuario.model';

import { SuccessDialogComponent } from '../../../shared/components/success-dialog.component';

@Component({
    selector: 'app-perfil-cliente',
    standalone: true,
    imports: [
        ReactiveFormsModule,
        MatButtonModule,
        MatIconModule
    ],
    templateUrl: './perfil-cliente.html',
    styleUrl: './perfil-cliente.css',
})
export class PerfilCliente implements OnInit {

    private readonly fb = inject(FormBuilder);
    private readonly usuarioService = inject(UsuarioService);
    private readonly authService = inject(AuthService);
    private readonly dialog = inject(MatDialog);

    readonly usuario = signal<Usuario | null>(null);

    readonly loading = signal(false);
    readonly loadingPerfil = signal(true);
    readonly error = signal<string | null>(null);

    // Controla si el perfil está en modo edición
    readonly editando = signal(false);

    readonly form = this.fb.group({
        nombre: [
            '',
            [Validators.required, Validators.minLength(2)]
        ],

        apellidos: [
            '',
            [Validators.required, Validators.minLength(2)]
        ],

        email: [
            '',
            [Validators.required, Validators.email]
        ],

        telefono: [''],
    });

    async ngOnInit(): Promise<void> {
        await this.cargarPerfil();
    }

    async cargarPerfil(): Promise<void> {
        this.loadingPerfil.set(true);
        this.error.set(null);

        try {

            if (!this.authService.currentUser()) {
                await this.authService.cargarUsuarioActivo();
            }

            const usuario = this.authService.currentUser();

            if (!usuario) {
                this.error.set('No se pudo cargar el perfil.');
                return;
            }

            this.usuario.set(usuario);

            this.form.patchValue({
                nombre: usuario.nombre,
                apellidos: usuario.apellidos,
                email: usuario.email,
                telefono: usuario.telefono ?? '',
            });

            // El perfil comienza bloqueado
            this.form.disable();

            this.editando.set(false);

        } catch (err) {

            console.error(err);

            this.error.set(
                'Ocurrió un error al cargar el perfil.'
            );

        } finally {

            this.loadingPerfil.set(false);
        }
    }

    activarEdicion(): void {
        this.editando.set(true);

        this.form.enable();
    }

    cancelarEdicion(): void {

        const usuario = this.usuario();

        if (!usuario) return;

        // Restaurar los valores originales
        this.form.patchValue({
            nombre: usuario.nombre,
            apellidos: usuario.apellidos,
            email: usuario.email,
            telefono: usuario.telefono ?? '',
        });

        this.form.disable();

        this.editando.set(false);
    }

    guardar(): void {

        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        const usuario = this.usuario();

        if (!usuario) {
            this.error.set('No se encontró el usuario.');
            return;
        }

        this.loading.set(true);
        this.error.set(null);

        const values = this.form.getRawValue();

        const data = {
            nombre: values.nombre ?? '',
            apellidos: values.apellidos ?? '',
            email: values.email ?? '',
            telefono: values.telefono ?? '',
        };

        this.usuarioService.actualizar(usuario.id, data).subscribe({

            next: (res) => {

                // Actualizamos inmediatamente el usuario mostrado
                this.usuario.set(res.data);

                // Actualizamos los valores del formulario
                this.form.patchValue({
                    nombre: res.data.nombre,
                    apellidos: res.data.apellidos,
                    email: res.data.email,
                    telefono: res.data.telefono ?? '',
                });

                // Volvemos al modo consulta
                this.form.disable();
                this.editando.set(false);

                this.loading.set(false);

                this.dialog.open(SuccessDialogComponent, {
                    width: '380px',
                    data: {
                        titulo: '¡Perfil actualizado!',
                        mensaje:
                            'Los cambios de tu perfil fueron guardados correctamente.',
                    }
                });

            },

            error: (err) => {

                console.error(err);

                this.loading.set(false);

                this.dialog.open(SuccessDialogComponent, {
                    width: '380px',
                    data: {
                        titulo: 'Error',
                        mensaje:
                            'No se pudo actualizar el perfil. Revisá los datos e intentá nuevamente.',
                    }
                });

            }

        });
    }

    get nombreCompleto(): string {

        const usuario = this.usuario();

        if (!usuario) {
            return 'Cliente';
        }

        return `${usuario.nombre} ${usuario.apellidos}`;
    }

    get iniciales(): string {

        const usuario = this.usuario();

        if (!usuario) {
            return 'CL';
        }

        return `${usuario.nombre.charAt(0)}${usuario.apellidos.charAt(0)}`
            .toUpperCase();
    }

    get correo(): string {

        return this.usuario()?.email ?? '';
    }

    get telefono(): string {

        return this.usuario()?.telefono ?? 'No registrado';
    }
}