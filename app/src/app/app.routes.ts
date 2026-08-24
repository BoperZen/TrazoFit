import { Routes } from '@angular/router';
import { MainLayout } from './layout/main-layout/main-layout';
import { Home } from './pages/home/home';
import { UsuariosList } from './pages/usuarios/usuarios-list/usuarios-list';
import { CategoriasList } from './pages/categorias/categorias-list/categorias-list';
import { EspecialidadesList } from './pages/especialidades/especialidades-list/especialidades-list';
import { ProfesionalesList } from './pages/profesionales/profesionales-list/profesionales-list';
import { ProfesionalForm } from './pages/profesionales/profesional-form/profesional-form';
import { ServiciosList } from './pages/servicios/servicios-list/servicios-list';
import { ServicioForm } from './pages/servicios/servicios-form/servicios-form';
import { CitasList } from './pages/citas/citas-list/citas-list';
import { CitaForm } from './pages/citas/citas-form/cita-form';
import { ReportsComponent } from './pages/reports/reports.component';
import { adminGuard } from './core/guards/admin.guard';
import { profesionalGuard } from './core/guards/profesional.guard';
import { clienteGuard } from './core/guards/cliente.guard';
import { authGuard } from './core/guards/auth.guard';
import { CitasListUsuario } from './pages/citas/citas-usuario/citas-list-usuario';
import { ProfesionalesCliente } from './pages/profesionales/profesionales-cliente/profesionales-cliente';
import { CitasUsuarioForm } from './pages/citas/citas-usuario-form/citas-usuario-form';
import { ProfesionalesAgenda } from './pages/profesionales/profesionales-agenda/profesionales-agenda';
import { CitasUsuarioDetalle } from './pages/citas/citas-usuario-detalle/citas-usuario-detalle';
import { CitasProfesionalDetalle } from './pages/citas/citas-profesional-detalle/citas-profesional-detalle';
import { PerfilProfesional } from './pages/perfil/perfil-profesional/perfil-profesional';
import { PerfilCliente } from './pages/perfil/perfil-cliente/perfil-cliente';
import { Login } from './pages/auth/login/login';
import { Registro } from './pages/auth/registro/registro';

export const routes: Routes = [
  {
    path: '',
    component: MainLayout,
    children: [

      // ── Pública ──────────────────────────────────────────
      { path: '', component: Home, title: 'Inicio' },
      { path: 'login', component: Login, title: 'Iniciar sesión' },
      { path: 'registro', component: Registro, title: 'Crear cuenta' },

      // ── Perfil ─────────────────────────────────────────────
      { path: 'perfil/profesional', component: PerfilProfesional, title: 'Mi perfil', canActivate: [profesionalGuard] },
      { path: 'perfil', component: PerfilCliente, title: 'Mi perfil', canActivate: [clienteGuard] },

      // ── Admin ────────────────────────────────────────────
      { path: 'admin/usuarios', component: UsuariosList, title: 'Usuarios', canActivate: [adminGuard] },
      { path: 'admin/categorias', component: CategoriasList, title: 'Categorías', canActivate: [adminGuard] },
      { path: 'admin/especialidades', component: EspecialidadesList, title: 'Especialidades', canActivate: [adminGuard] },
      { path: 'admin/profesionales', component: ProfesionalesList, title: 'Profesionales', canActivate: [adminGuard] },
      { path: 'admin/profesionales/nuevo', component: ProfesionalForm, title: 'Nuevo profesional', canActivate: [adminGuard] },
      { path: 'admin/profesionales/:id/editar', component: ProfesionalForm, title: 'Editar profesional', canActivate: [adminGuard] },
      { path: 'admin/profesionales/:id', component: ProfesionalForm, title: 'Detalle profesional', canActivate: [adminGuard] },
      { path: 'admin/servicios', component: ServiciosList, title: 'Servicios', canActivate: [adminGuard] },
      { path: 'admin/servicios/nuevo', component: ServicioForm, title: 'Nuevo servicio', canActivate: [adminGuard] },
      { path: 'admin/servicios/:id/editar', component: ServicioForm, title: 'Editar servicio', canActivate: [adminGuard] },
      { path: 'admin/servicios/:id', component: ServicioForm, title: 'Detalle servicio', canActivate: [adminGuard] },
      { path: 'admin/citas', component: CitasList, title: 'Citas', canActivate: [adminGuard] },
      { path: 'admin/citas/nuevo', component: CitaForm, title: 'Nueva cita', canActivate: [adminGuard] },
      { path: 'admin/citas/:id', component: CitaForm, title: 'Detalle cita', canActivate: [adminGuard] },
      { path: 'admin/reportes', component: ReportsComponent, title: 'Reportes', canActivate: [adminGuard] },
      

      // ── Profesional ──────────────────────────────────────
      // TODO: agregar componentes cuando estén listos
      //{ path: 'profesional/citas',    component: CitasListUsuario, canActivate: [profesionalGuard] },
      // { path: 'profesional/servicios', component: ProfesionalServiciosList, canActivate: [profesionalGuard] },
      { path: 'profesional/agenda', component: ProfesionalesAgenda, title: 'Mi agenda', canActivate: [profesionalGuard] },
      { path: 'profesional/citas/:id', component: CitasProfesionalDetalle, canActivate: [profesionalGuard] },
      { path: 'profesional/servicios', component: ServiciosList, title: 'Mis servicios', canActivate: [profesionalGuard] },
      { path: 'profesional/servicios/nuevo', component: ServicioForm, title: 'Nuevo servicio', canActivate: [profesionalGuard] },
      { path: 'profesional/servicios/:id/editar', component: ServicioForm, title: 'Editar servicio', canActivate: [profesionalGuard] },
      { path: 'profesional/servicios/:id', component: ServicioForm, title: 'Detalle servicio', canActivate: [profesionalGuard] },

      // ── Cliente ──────────────────────────────────────────
      // TODO: agregar componentes cuando estén listos
      // { path: 'profesionales',        component: ProfesionalesPublicList, canActivate: [clienteGuard] },
      { path: 'cliente/citas/nueva', component: CitasUsuarioForm, canActivate: [clienteGuard] },
      { path: 'cliente/citas', component: CitasListUsuario, canActivate: [clienteGuard] },
      { path: 'profesionales', component: ProfesionalesCliente, canActivate: [clienteGuard] },
      { path: 'cliente/citas/:id', component: CitasUsuarioDetalle, canActivate: [clienteGuard] },


    ]
  },
  { path: '**', redirectTo: '' }
];