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
  cartCount = signal(2);
  currentUser = signal<User | null>(null);
  publicMenu = signal<MenuItem[]>([
    { label: 'Inicio', path: '/', icon: 'home' },
    { label: 'Rutinas', path: '/videojuegos', icon: 'fitness_center' },
    { label: 'Sesiones', path: '/ordenes', icon: 'event_repeat' },
    { label: 'Miembros', path: '/admin/usuarios', icon: 'groups', roles: ['CLIENTE', 'ADMIN'] },
  ]);
  adminMaintenanceMenu = signal<MenuItem[]>([
    { label: 'Rutinas', path: '/admin/videojuegos', icon: 'fitness_center' },
    { label: 'Sesiones', path: '/admin/ordenes', icon: 'event_repeat' },
    { label: 'Miembros', path: '/admin/usuarios', icon: 'groups' },
  ]);
  adminManagementMenu = signal<MenuItem[]>([
    { label: 'Progreso', path: '/ordenes', icon: 'bar_chart' },
    { label: 'Entrenamiento', path: '/videojuegos', icon: 'insights' },
    { label: 'Equipo', path: '/admin/usuarios', icon: 'group' },
  ]);
  isAdmin = computed(() => this.currentUser()?.role === 'ADMIN');
  canShowItem(item: MenuItem): boolean {
    if (!item.roles) return true;
    const user = this.currentUser();
    return !!user && item.roles.includes(user.role);
  }
  loginAsClient(): void {
    this.currentUser.set({ nombre: 'Cliente Demo', role: 'CLIENTE' });
  }
  loginAsAdmin(): void {
    this.currentUser.set({ nombre: 'Admin Demo', role: 'ADMIN' });
  }
  logout(): void {
    this.currentUser.set(null);
  }
}
