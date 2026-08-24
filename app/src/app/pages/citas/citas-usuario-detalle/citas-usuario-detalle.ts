import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CitaService } from '../../../core/services/cita.service';
import { ResenaService } from '../../../core/services/resena.service';
import { AuthService } from '../../../core/services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { Cita, EstadoCita, ResenaCreateDto } from '../../../core/models/cita.model';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog.component';
import { SuccessDialogComponent } from '../../../shared/components/success-dialog.component';

@Component({
    selector: 'app-citas-usuario-detalle',
    standalone: true,
    imports: [CommonModule, MatIconModule, MatButtonModule],
    templateUrl: './citas-usuario-detalle.html',
    styleUrl: './citas-usuario-detalle.css',
})
export class CitasUsuarioDetalle implements OnInit {
    private readonly citaService = inject(CitaService);
    private readonly resenaService = inject(ResenaService);
    private readonly authService = inject(AuthService);
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);
    private readonly dialog = inject(MatDialog);

    readonly cita = signal<Cita | null>(null);
    readonly loading = signal(true);
    readonly historialAbierto = signal(false);
    readonly resenando = signal(false);
    readonly puntuacion = signal(5);
    readonly comentarioResena = signal('');
    readonly enviandoResena = signal(false);

    readonly esCliente = this.authService.isCliente;
    readonly esProfesional = this.authService.isProfesional;

    readonly puedeCancel = computed(() => {
        const estado = this.cita()?.estado;
        return estado === 'PENDIENTE' || estado === 'ACEPTADA';
    });

    readonly puedeResenar = computed(() => {
        const c = this.cita();
        return c?.estado === 'COMPLETADA' && !c.resena && this.esCliente();
    });

    readonly estrellas = [1, 2, 3, 4, 5];

    ngOnInit() {
        const id = Number(this.route.snapshot.paramMap.get('id'));
        if (!id) { this.router.navigate(['/cliente/citas']); return; }
        this.cargarCita(id);
    }

    cargarCita(id: number) {
        this.loading.set(true);
        this.citaService.obtenerPorId(id).subscribe({
            next: (res) => { this.cita.set(res.data); this.loading.set(false); },
            error: () => this.loading.set(false),
        });
    }

    cancelar() {
    const cita = this.cita();
    if (!cita) return;
    this.dialog.open(ConfirmDialogComponent, {
        width: '380px',
        data: { titulo: 'Cancelar cita', mensaje: '¿Seguro que querés cancelar esta cita?', confirmLabel: 'Sí, cancelar' }
    }).afterClosed().subscribe(confirmado => {
        if (!confirmado) return;
        this.citaService.cambiarEstado(cita.id, { estado: 'CANCELADA' }).subscribe({
            next: () => this.cargarCita(cita.id),
        });
    });
}

    abrirResena() { this.resenando.set(true); this.puntuacion.set(5); this.comentarioResena.set(''); }
    cerrarResena() { this.resenando.set(false); }

    enviarResena() {
        const user = this.authService.currentUser();
        const cita = this.cita();
        if (!user || !cita) return;

        this.dialog.open(ConfirmDialogComponent, {
            width: '380px',
            data: { titulo: 'Enviar reseña', mensaje: `¿Confirmás tu calificación de ${this.puntuacion()} estrella(s)?`, confirmLabel: 'Enviar' }
        }).afterClosed().subscribe(confirmado => {
            if (!confirmado) return;
            this.enviandoResena.set(true);
            const data: ResenaCreateDto = {
                citaId: cita.id,
                clienteId: user.id,
                puntuacion: this.puntuacion(),
                comentario: this.comentarioResena() || undefined,
            };
            this.resenaService.crear(data).subscribe({
                next: () => {
                    this.dialog.open(SuccessDialogComponent, {
                        width: '380px',
                        data: { titulo: '¡Reseña enviada!', mensaje: 'Gracias por tu calificación.' }
                    }).afterClosed().subscribe(() => this.cargarCita(cita.id));
                    this.cerrarResena();
                    this.enviandoResena.set(false);
                },
                error: () => this.enviandoResena.set(false),
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

    volver() {
        if (this.esCliente()) this.router.navigate(['/cliente/citas']);
        else this.router.navigate(['/profesional/citas']);
    }
}