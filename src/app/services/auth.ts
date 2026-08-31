import { Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://finance-erp-backend-production-fc85.up.railway.app/api'; 
  
  private loggedIn = new BehaviorSubject<boolean>(this.hasToken());
  isLoggedIn$ = this.loggedIn.asObservable();

  private timeoutId: any;
  private readonly TIMEOUT_DURATION = 15 * 60 * 1000; // 15 Minutes Inactivity

  constructor(private http: HttpClient, private router: Router, private ngZone: NgZone) {
    if (this.hasToken()) {
      this.initInactivityTimer();
    }
  }

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
          this.initInactivityTimer(); // Start timer on login
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
          this.initInactivityTimer();
        }
      })
    );
  }

  logout() {
    this.http.post(`${this.apiUrl}/logout`, {}, {
      headers: { Authorization: `Bearer ${this.getToken()}` }
    }).subscribe();

    localStorage.removeItem('erp_token');
    this.loggedIn.next(false);
    clearTimeout(this.timeoutId); // Stop timer on logout
    this.router.navigate(['/login']);
  }

  // --- Session Timeout Logic ---
  private initInactivityTimer() {
    const resetTimer = () => {
      clearTimeout(this.timeoutId);
      if (this.hasToken()) {
        this.ngZone.runOutsideAngular(() => {
          this.timeoutId = setTimeout(() => {
            this.ngZone.run(() => {
              alert('Session expired due to inactivity. Please login again.');
              this.logout();
            });
          }, this.TIMEOUT_DURATION);
        });
      }
    };

    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('keypress', resetTimer);
    window.addEventListener('click', resetTimer);
    resetTimer();
  }
}