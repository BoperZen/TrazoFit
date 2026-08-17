import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

export interface ConfirmDialogData {
  titulo: string;
  mensaje: string;
  confirmLabel?: string;
  confirmClass?: string;
}

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title>{{ data.titulo }}</h2>
    <mat-dialog-content>
      <p>{{ data.mensaje }}</p>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button class="btn btn-cancelar" mat-button type="button" (click)="cancelar()">Cancelar</button>
      <button class="btn btn-primary" mat-flat-button type="button" (click)="confirmar()">
        {{ data.confirmLabel ?? 'Confirmar' }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .btn { padding: 12px 30px; border: none; cursor: pointer; font-weight: 800; font-size: 0.9rem; letter-spacing: 1px; transition: all 0.3s ease; text-transform: uppercase; }
    .btn-primary { background: var(--color-primary); color: var(--color-primary-fg); border: 2px solid var(--color-primary); }
    .btn-primary:hover { background: transparent; color: var(--color-primary); }
    .btn-cancelar { background: var(--color-primary-fg); color: var(--color-primary); border: 2px solid var(--color-primary); }
  `]
})
export class ConfirmDialogComponent {
  readonly data = inject<ConfirmDialogData>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<ConfirmDialogComponent>);
  cancelar(): void { this.dialogRef.close(false); }
  confirmar(): void { this.dialogRef.close(true); }
}