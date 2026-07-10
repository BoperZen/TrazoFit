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

interface FeatureItem {
  title: string;
  description: string;
  icon: string;
  sample: string;
}

interface MethodItem {
  title: string;
  description: string;
  code: string;
}

interface ProfileItem {
  title: string;
  code: string;
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
      value: '120+',
      label: 'profesionales listos para conectar con clientes',
      icon: 'monitor_heart',
    },
    {
      value: '4.9',
      label: 'valoración promedio para filtrar talento rápido',
      icon: 'fitness_center',
    },
    {
      value: '24h',
      label: 'respuesta pensada para reservar sin fricción',
      icon: 'groups',
    },
  ]);

  features = signal<FeatureItem[]>([
    {
      title: 'Perfiles claros',
      description: 'Cada profesional muestra enfoque, experiencia y disponibilidad sin saturar la vista.',
      icon: 'badge',
      sample: '/coaches/valeria-cruz',
    },
    {
      title: 'Reservas directas',
      description: 'El flujo de contacto y reserva entra en un par de clics desde el hero.',
      icon: 'event_available',
      sample: '/bookings/new',
    },
    {
      title: 'Seguimiento vivo',
      description: 'Sesiones, progreso y control operativo se leen en bloques simples.',
      icon: 'insights',
      sample: '/dashboard/progress',
    },
    {
      title: 'Equipos activos',
      description: 'Administra entrenadores, clientes y permisos desde un tablero único.',
      icon: 'groups',
      sample: '/admin/users',
    },
  ]);

  cards = signal<ContentCard[]>([
    {
      title: 'Profesionales',
      description: 'Descubre entrenadores, coaches y especialistas en un catálogo limpio.',
      icon: 'fitness_center',
      route: '/videojuegos',
      label: 'Abrir catálogo',
    },
    {
      title: 'Reservas',
      description: 'Agenda sesiones, controla estados y mantén el ritmo del día.',
      icon: 'event_repeat',
      route: '/ordenes',
      label: 'Ver reservas',
    },
    {
      title: 'Miembros',
      description: 'Gestiona perfiles, roles y acceso del equipo desde un mismo panel.',
      icon: 'groups',
      route: '/admin/usuarios',
      label: 'Administrar miembros',
    },
  ]);

  operations = signal<ContentCard[]>([
    {
      title: 'CREATE (POST)',
      description: 'Suma un nuevo profesional al marketplace con datos básicos y especialidad.',
      icon: 'person_add',
      route: '/admin/usuarios',
      label: 'Crear perfil',
    },
    {
      title: 'READ (GET)',
      description: 'Consulta el catálogo completo y ordena la grilla por especialidad o rating.',
      icon: 'search',
      route: '/videojuegos',
      label: 'Cargar catálogo',
    },
    {
      title: 'UPDATE (PUT)',
      description: 'Actualiza disponibilidad, paquete o estado de un perfil existente.',
      icon: 'edit_note',
      route: '/admin/usuarios',
      label: 'Actualizar perfil',
    },
    {
      title: 'DELETE (DELETE)',
      description: 'Retira perfiles desactivados o bloques de reserva caducos del sistema.',
      icon: 'delete_forever',
      route: '/admin/usuarios',
      label: 'Eliminar registro',
    },
  ]);

  methods = signal<MethodItem[]>([
    {
      title: 'XMLHttpRequest',
      description: 'Método clásico para cargar datos del marketplace sin recargar la vista.',
      code: `const xhr = new XMLHttpRequest();
xhr.open('GET', '/api/coaches');
xhr.send();`,
    },
    {
      title: 'Fetch API',
      description: 'La forma moderna y limpia de pedir listados de profesionales.',
      code: `fetch('/api/coaches')
  .then(response => response.json())
  .then(data => console.log(data));`,
    },
    {
      title: 'Async/Await',
      description: 'La opción más legible cuando conectas varias respuestas del backend.',
      code: `async function loadCoaches() {
  const response = await fetch('/api/coaches');
  return await response.json();
}`,
    },
  ]);

  profiles = signal<ProfileItem[]>([
    {
      title: 'Perfil simple',
      code: `{
  "id": 1,
  "name": "Valeria Cruz",
  "specialty": "Fuerza",
  "rating": 4.9
}`,
    },
    {
      title: 'Lista de coaches',
      code: `{
  "marketplace": "TrazoFit",
  "coaches": [
    { "id": 1, "name": "Diego Rojas" },
    { "id": 2, "name": "Mara León" }
  ]
}`,
    },
    {
      title: 'Respuesta de API',
      code: `{
  "status": "success",
  "data": {
    "user": {
      "id": 123,
      "name": "Cliente Demo",
      "plans": ["Fuerza", "HIIT"]
    }
  }
}`,
    },
  ]);
}
