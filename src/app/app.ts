import { Component } from '@angular/core';
import { DashboardComponent } from './components/dashboard/dashboard';
import { ToastComponent } from './components/toast/toast'; // Path check kar lena

import { TransactionFormComponent } from './components/transaction-form/transaction-form';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [DashboardComponent,TransactionFormComponent,ToastComponent],
  templateUrl: './app.html', 
  styleUrl: './app.css'
})
export class App {
  title = 'finance-erp';
}