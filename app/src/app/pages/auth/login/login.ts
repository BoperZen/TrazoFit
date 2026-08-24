import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../core/services/auth.service';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [
        ReactiveFormsModule,
        RouterLink,
        MatIconModule
    ],
    templateUrl: './login.html',
    styleUrl: './login.css'
})
export class Login {

    private readonly fb = inject(FormBuilder);
    private readonly auth = inject(AuthService);
    private readonly router = inject(Router);

    loading = false;
    error = '';

    form = this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', Validators.required]
    });

    iniciarSesion(): void {

        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        this.loading = true;
        this.error = '';

        const email = this.form.value.email!;
        const password = this.form.value.password!;

        this.auth.login(email, password).subscribe({
            next: (res) => {

                this.auth.guardarToken(res.data.token);

                this.auth.cargarUsuarioActivo().then(() => {
                    this.router.navigate(['/']);
                });

            },

            error: (err) => {
                console.error(err);

                this.error =
                    err.error?.message ??
                    'Correo o contraseña incorrectos.';

                this.loading = false;
            }
        });
    }
}