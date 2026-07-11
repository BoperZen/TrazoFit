import { Routes } from '@angular/router';
import { MainLayout } from './layout/main-layout/main-layout';
import { Home } from './pages/home/home';
import { VideojuegosList } from './pages/videojuegos/videojuegos-list/videojuegos-list';
import { OrdenesList } from './pages/ordenes/ordenes-list/ordenes-list';
import { UsuariosList } from './pages/usuarios/usuarios-list/usuarios-list';
import { VideojuegoAdminList } from './pages/videojuegos/videojuego-admin-list/videojuego-admin-list';
import { VideojuegoDetail } from './pages/videojuegos/videojuego-detail/videojuego-detail';
import { CategoriasList } from './pages/categorias/categorias-list/categorias-list';
import { EspecialidadesList } from './pages/especialidades/especialidades-list/especialidades-list';
import { ProfesionalesList } from './pages/profesionales/profesionales-list/profesionales-list';
import { ProfesionalForm } from './pages/profesionales/profesional-form/profesional-form';
import { ServiciosList } from './pages/servicios/servicios-list/servicios-list';
import { ServicioForm } from './pages/servicios/servicios-form/servicios-form';
import { CitasList } from './pages/citas/citas-list/citas-list';
import { CitaForm } from './pages/citas/citas-form/cita-form';

export const routes: Routes = [
    {
        path: '',
        component: MainLayout,
        children: [
            {
                path: '',
                component: Home,
                title: 'Inicio'
            },
            {
                path: 'videojuegos',
                component: VideojuegosList,
                title: 'Catálogo de videojuegos'
            },
            {
                path: 'videojuegos/:id',
                component: VideojuegoDetail,
                title: 'Detalle de videojuego'
            },
            {
                path: 'admin/videojuegos',
                component: VideojuegoAdminList,
                title: 'Mantenimiento de videojuegos'
            },
            {
                path: 'admin/ordenes',
                component: OrdenesList,
                title: 'Gestión de órdenes'
            },
            {
                path: 'admin/usuarios',
                component: UsuariosList,
                title: 'Gestión de usuarios'
            },
            {
                path: 'admin/categorias',
                component: CategoriasList,
                title: 'Mantenimiento de categorías'
            },
            {
                path: 'admin/especialidades',
                component: EspecialidadesList,
                title: 'Mantenimiento de especialidades'
            },
            {
                path: 'admin/profesionales',
                component: ProfesionalesList,
                title: 'Mantenimiento de profesionales'
            },
            {
                path: 'admin/profesionales',
                component: ProfesionalesList,
                title: 'Mantenimiento de profesionales'
            },
            {
                path: 'admin/profesionales/nuevo',
                component: ProfesionalForm,
                title: 'Nuevo profesional'
            },
            {
                path: 'admin/profesionales/:id/editar',
                component: ProfesionalForm,
                title: 'Editar profesional'
            },
            {
                path: 'admin/profesionales/:id',
                component: ProfesionalForm,
                title: 'Detalle profesional'
            },
            {
                path: 'admin/servicios',
                component: ServiciosList,
                title: 'Mantenimiento de servicios'
            },
            {
                path: 'admin/servicios/nuevo',
                component: ServicioForm,
                title: 'Nuevo servicio'
            },
            {
                path: 'admin/servicios/:id/editar',
                component: ServicioForm,
                title: 'Editar servicio'
            },
            {
                path: 'admin/servicios/:id',
                component: ServicioForm,
                title: 'Detalle servicio'
            },
            {
                path: 'admin/citas',
                component: CitasList,
                title: 'Mantenimiento de citas'
            }, {
                path: 'admin/citas',
                component: CitasList,
                title: 'Gestión de citas'
            },
            {
                path: 'admin/citas/nuevo',
                component: CitaForm,
                title: 'Nueva cita'
            },
            {
                path: 'admin/citas/:id',
                component: CitaForm,
                title: 'Detalle de cita'
            },
        ]
    },

    {
        path: '**',
        redirectTo: ''
    }
];
