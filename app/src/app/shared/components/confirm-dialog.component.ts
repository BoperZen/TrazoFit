import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';

export interface ConfirmDialogData {
  titulo: string;
  mensaje: string;
  confirmLabel?: string;
  detalles?: { label: string; valor: string }[];
}

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, CommonModule],
  template: `
    <h2 mat-dialog-title>{{ data.titulo }}</h2>
    <mat-dialog-content>
      <p>{{ data.mensaje }}</p>
      @if (data.detalles?.length) {
        <div class="detalles">
          @for (d of data.detalles; track d.label) {
            <div class="detalle-row">
              <span class="detalle-label">{{ d.label }}</span>
              <span class="detalle-valor">{{ d.valor }}</span>
            </div>
          }
        </div>
      }
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
    .detalles { margin-top: 1rem; border: 1px solid var(--color-border); border-radius: 10px; overflow: hidden; }
    .detalle-row { display: flex; justify-content: space-between; padding: .6rem 1rem; border-bottom: 1px solid var(--color-border); font-size: .9rem; }
    .detalle-row:last-child { border-bottom: none; }
    .detalle-label { color: var(--color-text-muted); }
    .detalle-valor { font-weight: 600; color: var(--color-text); }
  `]
})
export class ConfirmDialogComponent {
  readonly data = inject<ConfirmDialogData>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<ConfirmDialogComponent>);
  cancelar(): void { this.dialogRef.close(false); }
  confirmar(): void { this.dialogRef.close(true); }
}