import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Apna Railway wala backend URL yahan daal dena
  private apiUrl = 'https://finance-erp-backend-production-fc85.up.railway.app/api'; 
  
  private loggedIn = new BehaviorSubject<boolean>(this.hasToken());
  isLoggedIn$ = this.loggedIn.asObservable();

  constructor(private http: HttpClient, private router: Router) { }

  private hasToken(): boolean {
    return !!localStorage.getItem('erp_token');
  }

  getToken(): string | null {
    return localStorage.getItem('erp_token');
  }

  login(data: any) {
    return this.http.post(`${this.apiUrl}/login`, data).pipe(
      tap((res: any) => {
        if (res.status === 'success') {
          localStorage.setItem('erp_token', res.token);
          this.loggedIn.next(true);
        }
      })
    );
  }

  register(data: any) {
    return this.http.post(`${this.apiUrl}/register`, data).pipe(
      tap((res: any) => {
        if (res.status === 'success') {
          localStorage.setItem('erp_token', res.token);
          this.loggedIn.next(true);
        }
      })
    );
  }

  logout() {
    // Backend se logout call (optional but good practice)
    this.http.post(`${this.apiUrl}/logout`, {}, {
      headers: { Authorization: `Bearer ${this.getToken()}` }
    }).subscribe();

    localStorage.removeItem('erp_token');
    this.loggedIn.next(false);
    this.router.navigate(['/login']);
  }
}