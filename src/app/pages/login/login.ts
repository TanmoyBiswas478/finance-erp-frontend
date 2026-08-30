import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // *ngIf ke liye
import { FormsModule } from '@angular/forms'; // ngModel ke liye
import { RouterModule, Router } from '@angular/router'; // routerLink ke liye
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true, // Yeh zaroori hai
  imports: [CommonModule, FormsModule, RouterModule], // Modules yahan add kiye
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  formData = { email: '', password: '' };
  isLoading = false;
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  onLogin() {
    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login(this.formData).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Login failed! Please check credentials.';
      }
    });
  }
}