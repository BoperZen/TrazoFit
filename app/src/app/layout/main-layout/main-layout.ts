import { Component, computed, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from '../header/header';
import { Footer } from '../footer/footer';
import { AuthService } from '../../core/services/auth.service';

type Role = 'CLIENTE' | 'ADMIN' | 'PROFESIONAL';
interface MenuItem {
  label: string;
  path: string;
  icon: string;
  roles?: Role[];
}

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, Header, Footer],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css',
})
export class MainLayout {
  private authService = inject(AuthService);

  currentUser = this.authService.currentUser;
  isAdmin = this.authService.isAdmin;
  isProfesional = this.authService.isProfesional;
  isCliente = this.authService.isCliente;

  publicMenu = computed(() => {
    const role = this.authService.role();
    if (role === 'PROFESIONAL') {
      return [
        { label: 'Inicio', path: '/', icon: 'home' },
        { label: 'Mis Citas', path: '/profesional/citas', icon: 'event' },
        { label: 'Mis Servicios', path: '/profesional/servicios', icon: 'fitness_center' },
        { label: 'Mi Agenda', path: '/profesional/agenda', icon: 'calendar_month' },
      ];
    }
    if (role === 'CLIENTE') {
      return [
        { label: 'Inicio', path: '/', icon: 'home' },
        { label: 'Profesionales', path: '/profesionales', icon: 'work' },
        { label: 'Mis Citas', path: '/cliente/citas', icon: 'event' },
      ];
    }
    return [
      { label: 'Inicio', path: '/', icon: 'home' },
    ];
  });

  adminMaintenanceMenu = computed(() => [
    { label: 'Profesionales', path: '/admin/profesionales', icon: 'fitness_center' },
    { label: 'Servicios', path: '/admin/servicios', icon: 'event_repeat' },
    { label: 'Usuarios', path: '/admin/usuarios', icon: 'groups' },
    { label: 'Categorías', path: '/admin/categorias', icon: 'category' },
    { label: 'Especialidades', path: '/admin/especialidades', icon: 'medical_services' },
    { label: 'Citas', path: '/admin/citas', icon: 'event' },
  ]);

  adminManagementMenu = computed(() => [
    { label: 'Reportes', path: '/admin/reportes', icon: 'assessment' },
  ]);

  canShowItem = computed(() => (item: MenuItem) => {
    if (!item.roles) return true;
    const role = this.authService.role();
    return !!role && item.roles.includes(role);
  });

  logout(): void {
    // por ahora no hace nada
  }
}