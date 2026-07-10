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

export const routes: Routes = [
    {
        path:'',
        component:MainLayout,
        children:[
            {
                path:'',
                component: Home,
                title:'Inicio'
            },
            {
                path:'videojuegos',
                component:VideojuegosList,
                title:'Catálogo de videojuegos'
            },
            {
                path:'videojuegos/:id',
                component:VideojuegoDetail,
                title:'Detalle de videojuego'
            },
            {
                path:'admin/videojuegos',
                component:VideojuegoAdminList,
                title:'Mantenimiento de videojuegos'
            },
            {
                path:'admin/ordenes',
                component:OrdenesList,
                title: 'Gestión de órdenes'
            },
            {
                path:'admin/usuarios',
                component:UsuariosList,
                title: 'Gestión de usuarios'
            },
            {
            path:'admin/categorias',
                component:CategoriasList,
                title:'Mantenimiento de categorías'
            },
            {
            path:'admin/especialidades',
                component:EspecialidadesList,
                title:'Mantenimiento de especialidades'
            }
        ]
    },

    {
        path:'**',
        redirectTo:''
    }
];
