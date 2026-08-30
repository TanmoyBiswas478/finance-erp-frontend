import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router'; // 🔥 YEH ADD KIYA
import { ToastComponent } from './components/toast/toast'; // Path check kar lena

@Component({
  selector: 'app-root',
  standalone: true,
  // 🔥 Dashboard aur TransactionForm hata diya, RouterOutlet laga diya
  imports: [RouterOutlet, ToastComponent],
  templateUrl: './app.html', 
  styleUrl: './app.css'
})
export class App {
  title = 'finance-erp';
}