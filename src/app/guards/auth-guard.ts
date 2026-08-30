import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (this.authService.getToken()) {
      return true; // Token hai, toh aandar aane do
    } else {
      this.router.navigate(['/login']); // Token nahi hai, bahar feko
      return false;
    }
  }
}