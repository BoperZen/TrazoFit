import { Router } from 'express';
import { VideojuegoRoutes } from './old-routes/videojuego.routes';
import { CategoriaRoutes } from './categoria.routes';
import { PlataformaRoutes } from './old-routes/plataforma.routes';
import { EspecialidadRoutes } from './especialidad.routes';
import { OrdenRoutes } from './old-routes/orden.routes';
import { RoleRoutes } from './old-routes/role.routes';
import { EstadoOrdenRoutes } from './old-routes/estado-orden.routes';
import { ImageRoutes } from './image.routes copy';
import { UsuarioRoutes } from './usuario.routes';
import { especialidadService } from '../services/especialidad.service';
import { ProfesionalRoutes } from './profesionales.routes';
import { ServicioRoutes } from './servicio.routes';
import { CitaRoutes } from './cita.routes';
import { ReporteRoutes } from './reporte.routes';

export class AppRoutes {
    static get routes(): Router {
        const router = Router();
        // ----Agregar las rutas----
        // router.use('/role', RoleRoutes.routes)   
        // router.use('/estadoOrden', EstadoOrdenRoutes.routes) 
        router.use('/categoria', CategoriaRoutes.routes)   
        router.use('/especialidad', EspecialidadRoutes.routes)   
        // router.use('/plataforma', PlataformaRoutes.routes)   
        // router.use('/videojuego', VideojuegoRoutes.routes) 
        // router.use('/orden', OrdenRoutes.routes)             
        // router.use('/images', ImageRoutes.routes)    
        router.use('/usuario', UsuarioRoutes.routes) 
        router.use('/profesional', ProfesionalRoutes.routes) 
        router.use('/servicio', ServicioRoutes.routes)
        router.use('/cita', CitaRoutes.routes)
        router.use('/images', ImageRoutes.routes)
        router.use('/reportes', ReporteRoutes.routes);
        return router;
    }
}
