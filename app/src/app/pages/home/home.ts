import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

interface ContentCard {
  title: string;
  description: string;
  icon: string;
  route: string;
  label: string;
}

interface StatItem {
  value: string;
  label: string;
  icon: string;
}

interface StepItem {
  title: string;
  description: string;
  icon: string;
}

@Component({
  selector: 'app-home',
  imports: [RouterLink, MatCardModule, MatIconModule, MatButtonModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  stats = signal<StatItem[]>([
    {
      value: '24/7',
      label: 'seguimiento continuo de entrenamiento y progreso',
      icon: 'monitor_heart',
    },
    {
      value: '3',
      label: 'zonas clave para rutinas, miembros y control',
      icon: 'fitness_center',
    },
    {
      value: '2',
      label: 'roles pensados para clientes y equipo entrenador',
      icon: 'groups',
    },
  ]);

  cards = signal<ContentCard[]>([
    {
      title: 'Rutinas',
      description: 'Consulta y administra planes de entrenamiento, ejercicios y progresiones.',
      icon: 'fitness_center',
      route: '/videojuegos',
      label: 'Abrir rutinas',
    },
    {
      title: 'Sesiones',
      description: 'Registra el control diario, asistencia y seguimiento operativo.',
      icon: 'event_repeat',
      route: '/ordenes',
      label: 'Ver sesiones',
    },
    {
      title: 'Miembros',
      description: 'Gestiona perfiles, roles y acceso del equipo desde un solo lugar.',
      icon: 'groups',
      route: '/admin/usuarios',
      label: 'Administrar miembros',
    },
  ]);

  steps = signal<StepItem[]>([
    {
      title: 'Arranca con la rutina',
      description: 'Abre tu plan del día y revisa el bloque de trabajo antes de empezar.',
      icon: 'play_circle',
    },
    {
      title: 'Controla el progreso',
      description: 'Sigue asistencia, avance y constancia sin perder el contexto semanal.',
      icon: 'insights',
    },
    {
      title: 'Mantén la comunidad activa',
      description: 'Gestiona miembros y permisos para sostener una operación ordenada.',
      icon: 'groups_2',
    },
  ]);
}
