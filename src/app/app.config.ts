import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
// 🔥 withInterceptors ko yahan import kiya
import { provideHttpClient, withInterceptors } from '@angular/common/http'; 
import { routes } from './app.routes';
// 🔥 Apna naya banaya hua interceptor import kiya
import { authInterceptor } from './interceptors/auth-interceptor'; 

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    // 👇 Yahan interceptor ko activate kar diya
    provideHttpClient(withInterceptors([authInterceptor])) 
  ]
};