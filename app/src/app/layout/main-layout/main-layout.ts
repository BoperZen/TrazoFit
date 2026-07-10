import { Component, computed, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from '../header/header';
import { Footer } from '../footer/footer';

type Role = 'CLIENTE' | 'ADMIN';
interface MenuItem {
  label: string;
  path: string;
  icon: string;
  roles?: Role[];
}
interface User {
  nombre: string;
  role: Role;
}

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, Header, Footer],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css',
})
export class MainLayout {
  currentUser = signal<User | null>(null);

  publicMenu = signal<MenuItem[]>([
    { label: 'Inicio', path: '/', icon: 'home' },
    { label: 'Especialidades', path: '/especialidades', icon: 'medical_services' },
    { label: 'Profesionales', path: '/profesionales', icon: 'work' },
    { label: 'Citas', path: '/citas', icon: 'event' },
  ]);

  adminMaintenanceMenu = signal<MenuItem[]>([
    { label: 'Profesionales', path: '/admin/profesionales', icon: 'fitness_center' },
    { label: 'Reservas', path: '/admin/ordenes', icon: 'event_repeat' },
    { label: 'Usuarios', path: '/admin/usuarios', icon: 'groups' },
    { label: 'Categorías', path: '/admin/categorias', icon: 'category' },
    { label: 'Especialidades', path: '/admin/especialidades', icon: 'medical_services' },
    { label: 'Citas', path: '/admin/citas', icon: 'event' },
  ]);

  adminManagementMenu = signal<MenuItem[]>([
    { label: 'Reportes', path: '/admin/reportes', icon: 'assessment' },
    { label: 'Configuración', path: '/admin/configuracion', icon: 'settings' },
  ]);

  isAdmin = computed(() => this.currentUser()?.role === 'ADMIN');

  canShowItem(item: MenuItem): boolean {
    if (!item.roles) return true;
    const user = this.currentUser();
    return !!user && item.roles.includes(user.role);
  }

  loginAsAdmin(): void {
    this.currentUser.set({ nombre: 'Admin Demo', role: 'ADMIN' });
  }

  logout(): void {
    this.currentUser.set(null);
  }
}