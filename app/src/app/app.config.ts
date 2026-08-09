import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideAppInitializer, inject } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { httpErrorInterceptor } from './core/interceptors/http-error.interceptor';
import { provideAnimations } from '@angular/platform-browser/animations';
import { AuthService } from './core/services/auth.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([httpErrorInterceptor])
    ),
    provideAnimations(),
    
    provideAppInitializer(() => {
      const authService = inject(AuthService);
      return authService.cargarUsuarioActivo();
    })
  ]
};
