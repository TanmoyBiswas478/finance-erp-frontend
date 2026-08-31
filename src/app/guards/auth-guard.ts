import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate { // ✅ Added 'export' here

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (this.authService.getToken()) {
      return true; // Token hai, toh andar aane do
    } else {
      this.router.navigate(['/login']); // Token nahi hai, login pe bhejo
      return false;
    }
  }
}