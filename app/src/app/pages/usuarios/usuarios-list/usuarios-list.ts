import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { UsuarioService } from '../../../core/services/usuario.service';
import { Role, Usuario } from '../../../core/models/usuario.model';
import { UsuarioEstadoConfirmDialogComponent } from './usuario-estado-confirm-dialog.component';
import { SuccessDialogComponent } from '../../../shared/components/success-dialog.component';

@Component({
  selector: 'app-usuarios-list',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatMenuModule],
  templateUrl: './usuarios-list.html',
  styleUrl: './usuarios-list.css',
})
export class UsuariosList implements OnInit {

  private readonly usuarioService = inject(UsuarioService);
  private readonly dialog = inject(MatDialog);

  readonly usuarios = signal<Usuario[]>([]);
  readonly searchTerm = signal('');
  readonly selectedRole = signal<Role | 'TODOS'>('TODOS');

  readonly roleOptions: Array<{ label: string; value: Role | 'TODOS' }> = [
    { label: 'Todos', value: 'TODOS' },
    { label: 'Admin', value: 'ADMIN' },
    { label: 'Profesional', value: 'PROFESIONAL' },
    { label: 'Cliente', value: 'CLIENTE' },
  ];

  readonly roleFilterLabel = computed(
    () => this.roleOptions.find((option) => option.value === this.selectedRole())?.label ?? 'Todos',
  );

  readonly usuariosFiltrados = computed(() => {
    return this.usuarios().filter((usuario) => {
      const nombreCompleto = `${usuario.nombre} ${usuario.apellidos}`.toLowerCase();
      const termino = this.searchTerm();
      const rolSeleccionado = this.selectedRole();
      const coincideBusqueda =
        !termino ||
        nombreCompleto.includes(termino) ||
        usuario.email.toLowerCase().includes(termino);
      const coincideRol =
        rolSeleccionado === 'TODOS' || usuario.role === rolSeleccionado;

      return coincideBusqueda && coincideRol;
    });
  });

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cargarUsuarios() {
    this.usuarioService.listar().subscribe({
      next: (response) => {
        this.usuarios.set(response.data);
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  onSearch(term: string) {
    this.searchTerm.set(term.trim().toLowerCase());
  }

  setRoleFilter(role: Role | 'TODOS'): void {
    this.selectedRole.set(role);
  }

  confirmarCambioEstado(usuario: Usuario): void {
    const estadoAnterior = usuario.estado;
    const estadoNuevo = !usuario.estado;

    const dialogRef = this.dialog.open(UsuarioEstadoConfirmDialogComponent, {
      width: '420px',
      disableClose: true,
      data: {
        nombreCompleto: `${usuario.nombre} ${usuario.apellidos}`,
        nuevoEstado: estadoNuevo,
      },
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (!confirmed) {
        return;
      }

      this.usuarios.update((items) => items.map((item) =>
        item.id === usuario.id ? { ...item, estado: estadoNuevo } : item,
      ));

      this.usuarioService.toggleEstado(usuario.id).subscribe({
        next: (response) => {
          this.usuarios.update((items) =>
            items.map((item) => (item.id === response.data.id ? { ...item, ...response.data } : item)),
          );
          this.dialog.open(SuccessDialogComponent, {
            width: '380px',
            data: {
              titulo: '¡Estado actualizado!',
              mensaje: `${usuario.nombre} fue marcado como ${estadoNuevo ? 'activo' : 'inactivo'}.`
            }
          });
        },
        error: (err) => {
          this.usuarios.update((items) =>
            items.map((item) => (item.id === usuario.id ? { ...item, estado: estadoAnterior } : item)),
          );
          this.dialog.open(SuccessDialogComponent, {
            width: '380px',
            data: {
              titulo: 'Error',
              mensaje: 'No se pudo cambiar el estado. Intentá de nuevo.'
            }
          });
          console.error(err);
        },
      });
    });
  }
}