import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms'; 
import { RouterModule, Router } from '@angular/router'; 
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule], 
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class RegisterComponent {
  formData = { name: '', email: '', password: '' };
  isLoading = false;
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  onRegister() {
    this.isLoading = true;
    this.errorMessage = '';

    this.authService.register(this.formData).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Registration failed! Email might be taken.';
      }
    });
  }
}