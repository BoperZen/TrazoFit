import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

export interface UsuarioEstadoConfirmDialogData {
    nombreCompleto: string;
    nuevoEstado: boolean;
}

@Component({
    selector: 'app-usuario-estado-confirm-dialog',
    standalone: true,
    imports: [MatDialogModule, MatButtonModule],
    template: `
    <h2 mat-dialog-title>Confirmar cambio de estado</h2>
    <mat-dialog-content>
      <p>
        Vas a pasar a {{ data.nuevoEstado ? 'activo' : 'inactivo' }} a {{ data.nombreCompleto }}.
      </p>
      <p>¿Quieres continuar?</p>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button class="btn btn-cancelar" mat-button type="button" (click)="cancelar()">Cancelar</button>
      <button class="btn btn-primary" mat-flat-button type="button" (click)="confirmar()">Confirmar</button>
    </mat-dialog-actions>
  `,
    styles: [`
        .btn {
            padding: 12px 30px;
            border: none;
            cursor: pointer;
            font-family: var(--font-base);
            font-weight: 800;
            font-size: 0.9rem;
            letter-spacing: 1px;
            transition: all 0.3s ease;
            text-transform: uppercase;
        }

        .btn-primary {
            background: var(--color-primary);
            color: var(--color-primary-fg);
            border: 2px solid var(--color-primary);
        }

        .btn-primary:hover {
            background: transparent;
            color: var(--color-primary);
            transform: translateY(-2px);
        }

        .btn-cancelar {
            background: var(--color-primary-fg);
            color: var(--color-primary);
            border: 2px solid var(--color-primary);
        }

        .btn-cancelar:hover {
            background: var(--color-primary-fg);
            color: var(--color-primary);
            border: 2px solid var(--color-primary-fg);
            transform: translateY(-2px);
        }

        /* Para asegurar que los estilos de Material no sobrescriban */
        ::ng-deep .mat-mdc-flat-button.btn-primary {
            background: var(--color-primary) !important;
            color: var(--color-primary-fg) !important;
            border: 2px solid var(--color-primary) !important;
        }

        ::ng-deep .mat-mdc-button.btn-cancelar {
            background: var(--color-primary-fg) !important;
            color: var(--color-primary) !important;
            border: 2px solid var(--color-primary-fg) !important;
        }

        ::ng-deep .mat-mdc-button.btn-cancelar:hover {
            background: var(--color-primary-fg) !important;
            color: var(--color-primary) !important;
        }

        ::ng-deep .mat-mdc-dialog-surface {
        background-color: var(--color-primary-fg) !important;
    }
    `]
})
export class UsuarioEstadoConfirmDialogComponent {
    readonly data = inject<UsuarioEstadoConfirmDialogData>(MAT_DIALOG_DATA);
    private readonly dialogRef = inject(MatDialogRef<UsuarioEstadoConfirmDialogComponent>);

    cancelar(): void {
        this.dialogRef.close(false);
    }

    confirmar(): void {
        this.dialogRef.close(true);
    }
}