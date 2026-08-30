import { Routes } from '@angular/router';

// Make sure yeh paths tumhare actual folder structure se match karein
import { DashboardComponent } from './components/dashboard/dashboard';
import { LoginComponent } from './pages/login/login';
import { RegisterComponent } from './pages/register/register';
import { AuthGuard } from './guards/auth-guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  
  // 🔒 Yahan AuthGuard lagaya hai
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] }, 
];