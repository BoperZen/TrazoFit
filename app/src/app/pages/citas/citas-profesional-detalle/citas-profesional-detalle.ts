import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CitaService } from '../../../core/services/cita.service';
import { AuthService } from '../../../core/services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { Cita, EstadoCita } from '../../../core/models/cita.model';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog.component';
import { ReactiveFormsModule, FormControl } from '@angular/forms';

@Component({
    selector: 'app-citas-profesional-detalle',
    standalone: true,
    imports: [CommonModule, MatIconModule, MatButtonModule, ReactiveFormsModule],
    templateUrl: './citas-profesional-detalle.html',
    styleUrl: './citas-profesional-detalle.css',
})
export class CitasProfesionalDetalle implements OnInit {
    private readonly citaService = inject(CitaService);
    private readonly authService = inject(AuthService);
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);
    private readonly dialog = inject(MatDialog);

    readonly cita = signal<Cita | null>(null);
    readonly loading = signal(true);
    readonly historialAbierto = signal(false);

    // 'aceptar' | 'rechazar' | 'cancelar' — abre el form con comentario
    readonly accionAbierta = signal<'aceptar' | 'rechazar' | 'cancelar' | null>(null);
    readonly comentario = new FormControl('');

    readonly puedeAceptar = computed(() => this.cita()?.estado === 'PENDIENTE');
    readonly puedeRechazar = computed(() => this.cita()?.estado === 'PENDIENTE');
    readonly puedeCompletar = computed(() => this.cita()?.estado === 'ACEPTADA');
    readonly puedeCancelar = computed(() => ['PENDIENTE', 'ACEPTADA'].includes(this.cita()?.estado ?? ''));

    readonly estrellas = [1, 2, 3, 4, 5];

    ngOnInit() {
        const id = Number(this.route.snapshot.paramMap.get('id'));
        if (!id) { this.router.navigate(['/profesional/agenda']); return; }
        this.cargarCita(id);
    }

    cargarCita(id: number) {
        this.loading.set(true);
        this.citaService.obtenerPorId(id).subscribe({
            next: (res) => { this.cita.set(res.data); this.loading.set(false); },
            error: () => this.loading.set(false),
        });
    }

    // Abre el form para aceptar, rechazar o cancelar desde ACEPTADA
    abrirAccion(accion: 'aceptar' | 'rechazar' | 'cancelar') {
        this.accionAbierta.set(accion);
        this.comentario.reset();
        this.comentario.setErrors(null);
    }

    cerrarAccion() { this.accionAbierta.set(null); }

    // Confirma la acción del form (aceptar / rechazar / cancelar con motivo)
    confirmarAccion() {
        const cita = this.cita();
        if (!cita) return;

        const accion = this.accionAbierta();
        let estado: 'ACEPTADA' | 'RECHAZADA' | 'CANCELADA';
        if (accion === 'aceptar') estado = 'ACEPTADA';
        else if (accion === 'rechazar') estado = 'RECHAZADA';
        else estado = 'CANCELADA';

        // Motivo obligatorio al rechazar o cancelar desde ACEPTADA
        if (estado !== 'ACEPTADA' && !this.comentario.value?.trim()) {
            this.comentario.setErrors({ required: true });
            return;
        }

        this.citaService.cambiarEstado(cita.id, {
            estado,
            comentario: this.comentario.value ?? undefined,
        }).subscribe({
            next: () => { this.cerrarAccion(); this.cargarCita(cita.id); },
        });
    }

    // Completar — solo confirmación simple
    completar() {
        const cita = this.cita();
        if (!cita) return;
        this.dialog.open(ConfirmDialogComponent, {
            width: '380px',
            data: { titulo: 'Completar cita', mensaje: '¿Confirmás que la cita fue completada?', confirmLabel: 'Completar' }
        }).afterClosed().subscribe(confirmado => {
            if (!confirmado) return;
            this.citaService.cambiarEstado(cita.id, { estado: 'COMPLETADA' }).subscribe({
                next: () => this.cargarCita(cita.id),
            });
        });
    }

    getBadgeClass(estado: EstadoCita): string {
        const map: Record<EstadoCita, string> = {
            PENDIENTE: 'badge-warning',
            ACEPTADA: 'badge-success',
            RECHAZADA: 'badge-danger',
            CANCELADA: 'badge-danger',
            COMPLETADA: 'badge-primary',
        };
        return map[estado];
    }

    volver() { this.router.navigate(['/profesional/agenda']); }
}