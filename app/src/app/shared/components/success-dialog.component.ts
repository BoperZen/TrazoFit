import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

export interface SuccessDialogData {
  titulo: string;
  mensaje: string;
}

@Component({
  selector: 'app-success-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  template: `
    <div class="success-shell">
      <div class="success-icon">
        <span class="material-icons">check_circle</span>
      </div>
      <h2 mat-dialog-title>{{ data.titulo }}</h2>
      <mat-dialog-content>
        <p>{{ data.mensaje }}</p>
      </mat-dialog-content>
      <mat-dialog-actions align="center">
        <button class="btn btn-primary" mat-flat-button type="button" (click)="cerrar()">Aceptar</button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .success-shell { text-align: center; padding: 1rem; }
    .success-icon { margin-bottom: 1rem; }
    .success-icon .material-icons { font-size: 3.5rem; color: var(--color-success); }
    h2 { margin: 0 0 .5rem; font-family: var(--font-heading); }
    p { color: var(--color-text-muted); margin: 0; }
    .btn { padding: 12px 30px; border: none; cursor: pointer; font-weight: 800; font-size: 0.9rem; letter-spacing: 1px; transition: all 0.3s ease; text-transform: uppercase; margin-top: 1rem; }
    .btn-primary { background: var(--color-primary); color: var(--color-primary-fg); border: 2px solid var(--color-primary); }
    .btn-primary:hover { background: transparent; color: var(--color-primary); }
  `]
})
export class SuccessDialogComponent {
  readonly data = inject<SuccessDialogData>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<SuccessDialogComponent>);
  cerrar(): void { this.dialogRef.close(); }
}