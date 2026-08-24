import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CitaService } from '../../../core/services/cita.service';
import { ProfesionalService } from '../../../core/services/profesional.service';
import { AuthService } from '../../../core/services/auth.service';
import { Profesional } from '../../../core/models/profesional.model';
import { Servicio } from '../../../core/models/servicio.model';
import { CitaCreateDto } from '../../../core/models/cita.model';
import { MatDialog } from '@angular/material/dialog';
import { SuccessDialogComponent } from '../../../shared/components/success-dialog.component';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog.component';

@Component({
    selector: 'app-citas-usuario-form',
    standalone: true,
    imports: [ReactiveFormsModule, MatButtonModule, MatIconModule],
    templateUrl: './citas-usuario-form.html',
    styleUrl: './citas-usuario-form.css',
})
export class CitasUsuarioForm implements OnInit {
    private readonly fb = inject(FormBuilder);
    private readonly router = inject(Router);
    private readonly route = inject(ActivatedRoute);
    private readonly citaService = inject(CitaService);
    private readonly profesionalService = inject(ProfesionalService);
    private readonly authService = inject(AuthService);
    private readonly dialog = inject(MatDialog);

    readonly profesional = signal<Profesional | null>(null);
    readonly servicio = signal<Servicio | null>(null);
    readonly loading = signal(false);
    readonly error = signal<string | null>(null);

    readonly esMixta = computed(() => this.servicio()?.modalidad === 'MIXTA');

    readonly form = this.fb.group({
        fechaCita: ['', Validators.required],
        horaInicio: ['', Validators.required],
        horaFin: ['', Validators.required],
        modalidadElegida: ['PRESENCIAL'],
        comentarioCliente: [''],
    });

    ngOnInit() {
        const profesionalId = Number(this.route.snapshot.queryParamMap.get('profesionalId'));
        const servicioId = Number(this.route.snapshot.queryParamMap.get('servicioId'));

        if (!profesionalId || !servicioId) {
            this.router.navigate(['/profesionales']);
            return;
        }

        this.profesionalService.obtenerPorId(profesionalId).subscribe({
            next: (res) => {
                this.profesional.set(res.data);
                const s = res.data.servicios?.find(s => s.id === servicioId) ?? null;
                this.servicio.set(s);
            },
            error: () => this.router.navigate(['/profesionales']),
        });
    }

    onHoraInicioChange(valor: string) {
        const servicio = this.servicio();
        if (!valor || !servicio) return;
        const [horas, minutos] = valor.split(':').map(Number);
        const totalMinutos = horas * 60 + minutos + servicio.duracion;
        const horaFin = `${String(Math.floor(totalMinutos / 60) % 24).padStart(2, '0')}:${String(totalMinutos % 60).padStart(2, '0')}`;
        this.form.patchValue({ horaFin });
    }

    guardar() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const user = this.authService.currentUser();
    if (!user || !this.profesional() || !this.servicio()) return;

    const values = this.form.value;
    const modalidad = this.esMixta()
        ? values.modalidadElegida as 'VIRTUAL' | 'PRESENCIAL'
        : this.servicio()!.modalidad as 'VIRTUAL' | 'PRESENCIAL';

    this.dialog.open(ConfirmDialogComponent, {
        width: '420px',
        data: {
            titulo: 'Confirmar cita',
            mensaje: '¿Confirmás los datos de tu cita?',
            confirmLabel: 'Solicitar',
            detalles: [
                { label: 'Servicio', valor: this.servicio()!.nombre },
                { label: 'Precio', valor: `₡${this.servicio()!.precio}` },
                { label: 'Fecha', valor: values.fechaCita! },
                { label: 'Hora inicio', valor: values.horaInicio! },
                { label: 'Hora fin', valor: values.horaFin! },
                { label: 'Modalidad', valor: modalidad },
            ]
        }
    }).afterClosed().subscribe(confirmado => {
        if (!confirmado) return;
        this.loading.set(true);
        this.error.set(null);

        const data: CitaCreateDto = {
            clienteId: user.id,
            profesionalId: this.profesional()!.id,
            servicioId: this.servicio()!.id,
            fechaCita: values.fechaCita!,
            horaInicio: values.horaInicio!,
            horaFin: values.horaFin!,
            modalidad,
            comentarioCliente: values.comentarioCliente ?? undefined,
        };

        this.citaService.crear(data).subscribe({
            next: () => {
                this.loading.set(false);
                this.dialog.open(SuccessDialogComponent, {
                    width: '380px',
                    data: { titulo: '¡Cita solicitada!', mensaje: 'Tu cita fue enviada y está pendiente de confirmación.' }
                }).afterClosed().subscribe(() => {
                    this.router.navigate(['/cliente/citas']);
                });
            },
            error: (err) => {
                this.error.set('Ocurrió un error al registrar la cita. Revisá los datos.');
                this.loading.set(false);
                console.error(err);
            },
        });
    });
}

    volver() { this.router.navigate(['/profesionales']); }
}