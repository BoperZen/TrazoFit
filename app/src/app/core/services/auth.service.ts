import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { Usuario } from '../models/usuario.model';
import { Profesional } from '../models/profesional.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _currentUser = signal<Usuario | null>(null);
  private _currentProfesional = signal<Profesional | null>(null);

  currentUser = this._currentUser.asReadonly();
  currentProfesional = this._currentProfesional.asReadonly();

  isLoggedIn = computed(() => this._currentUser() !== null);
  role = computed(() => this._currentUser()?.role ?? null);
  isAdmin = computed(() => this._currentUser()?.role === 'ADMIN');
  isProfesional = computed(() => this._currentUser()?.role === 'PROFESIONAL');
  isCliente = computed(() => this._currentUser()?.role === 'CLIENTE');
  profesionalId = computed(() => this._currentProfesional()?.id ?? null);

  constructor(private http: HttpClient) { }

  guardarToken(token: string): void {
    localStorage.setItem('token', token);
  }

  obtenerToken(): string | null {
    return localStorage.getItem('token');
  }

  cerrarSesion(): void {
    localStorage.removeItem('token');
    this._currentUser.set(null);
    this._currentProfesional.set(null);
  }

  login(email: string, password: string) {
    return this.http.post<{
      success: boolean;
      data: {
        token: string;
        usuario: Usuario;
      };
    }>(
      `${environment.apiUrl}/auth/login`,
      { email, password }
    );
  }

  registrar(data: {
    nombre: string;
    apellidos: string;
    email: string;
    password: string;
    telefono?: string;
  }) {
    return this.http.post<{
      success: boolean;
      data: Usuario;
    }>(
      `${environment.apiUrl}/auth/registrar`,
      data
    );
  }

  cargarUsuarioActivo(): Promise<void> {

    const token = this.obtenerToken();

    // No hay sesión guardada
    if (!token) {
      this._currentUser.set(null);
      this._currentProfesional.set(null);
      return Promise.resolve();
    }

    return new Promise((resolve) => {

      this.http
        .get<{ success: boolean; data: Usuario }>(
          `${environment.apiUrl}/auth/us`
        )
        .subscribe({

          next: (res) => {
            this._currentUser.set(res.data);

            if (res.data.role === 'PROFESIONAL') {
              this.cargarPerfilProfesional(res.data.id).then(resolve);
            } else {
              resolve();
            }
          },

          error: () => {
            this.cerrarSesion();
            resolve();
          }
        });
    });
  }


  private cargarPerfilProfesional(usuarioId: number): Promise<void> {
    return new Promise((resolve) => {

      this.http
        .get<{ success: boolean; data: Profesional }>(
          `${environment.apiUrl}/profesional/usuario/${usuarioId}`
        )
        .subscribe({
          next: (res) => {
            this._currentProfesional.set(res.data);
            resolve();
          },

          error: () => {
            this._currentProfesional.set(null);
            resolve();
          }
        });
    });
  }
}