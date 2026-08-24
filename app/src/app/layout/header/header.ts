import { Component, input, output, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';

type Role = 'CLIENTE' | 'ADMIN' | 'PROFESIONAL';
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
  selector: 'app-header',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatBadgeModule,
  ],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  private matIconRegistry = inject(MatIconRegistry);
  private domSanitizer = inject(DomSanitizer);

  constructor() {
    this.matIconRegistry.addSvgIcon(
      'arm-bicep',
      this.domSanitizer.bypassSecurityTrustResourceUrl('icons/arm-bicep.svg')
    );
  }

  profilePath(user: User): string | null {
    switch (user.role) {
      case 'CLIENTE':
        return '/perfil';

      case 'PROFESIONAL':
        return '/profesional/perfil';

      default:
        return null;
    }
  }

  publicMenu = input.required<MenuItem[]>();
  adminMaintenanceMenu = input.required<MenuItem[]>();
  adminManagementMenu = input.required<MenuItem[]>();
  currentUser = input<User | null>(null);
  isAdmin = input<boolean>(false);
  canShowItem = input.required<(item: MenuItem) => boolean>();
  loginClient = output<void>();
  loginAdmin = output<void>();
  logoutUser = output<void>();
}