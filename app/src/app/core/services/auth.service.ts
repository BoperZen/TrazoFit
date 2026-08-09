import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { Usuario } from '../models/usuario.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _currentUser = signal<Usuario | null>(null);

  currentUser = this._currentUser.asReadonly();
  isLoggedIn = computed(() => this._currentUser() !== null);
  role = computed(() => this._currentUser()?.role ?? null);
  isAdmin = computed(() => this._currentUser()?.role === 'ADMIN');
  isProfesional = computed(() => this._currentUser()?.role === 'PROFESIONAL');
  isCliente = computed(() => this._currentUser()?.role === 'CLIENTE');

  constructor(private http: HttpClient) {}

  cargarUsuarioActivo(): Promise<void> {
    return new Promise((resolve) => {
      this.http.get<{ success: boolean; data: Usuario }>(`${environment.apiUrl}/auth/us`)
        .subscribe({
          next: (res) => {
            this._currentUser.set(res.data);
            resolve();
          },
          error: () => {
            this._currentUser.set(null);
            resolve();
          }
        });
    });
  }
}