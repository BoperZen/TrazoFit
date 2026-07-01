import { Router } from 'express';
import { VideojuegoRoutes } from './videojuego.routes';
import { CategoriaRoutes } from './categoria.routes';
import { PlataformaRoutes } from './plataforma.routes';
import { EtiquetaRoutes } from './etiqueta.routes';
import { OrdenRoutes } from './orden.routes';
import { RoleRoutes } from './role.routes';
import { EstadoOrdenRoutes } from './estado-orden.routes';
import { ImageRoutes } from './image.routes copy';

export class AppRoutes {
    static get routes(): Router {
        const router = Router();
        // ----Agregar las rutas----
        router.use('/role', RoleRoutes.routes)   
        router.use('/estadoOrden', EstadoOrdenRoutes.routes) 
        router.use('/categoria', CategoriaRoutes.routes)   
        router.use('/etiqueta', EtiquetaRoutes.routes)   
        router.use('/plataforma', PlataformaRoutes.routes)   
        router.use('/videojuego', VideojuegoRoutes.routes) 
        router.use('/orden', OrdenRoutes.routes)             
        router.use('/images', ImageRoutes.routes)     
        return router;
    }
}
