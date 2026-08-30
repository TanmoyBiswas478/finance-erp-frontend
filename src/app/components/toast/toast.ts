import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, ToastMessage } from '../../services/toast';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container" *ngIf="toasts.length > 0">
      <div *ngFor="let toast of toasts; let i = index" 
           class="toast-message" 
           [ngClass]="toast.type">
        {{ toast.message }}
        <button (click)="remove(i)" class="close-btn">&times;</button>
      </div>
    </div>
  `,
  styles: [`
    .toast-container {
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .toast-message {
      padding: 15px 20px;
      border-radius: 4px;
      color: white;
      font-weight: 500;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      display: flex;
      justify-content: space-between;
      align-items: center;
      min-width: 250px;
      animation: slideIn 0.3s ease-out forwards;
    }
    .success { background-color: #2e7d32; border-left: 5px solid #1b5e20; }
    .error { background-color: #d32f2f; border-left: 5px solid #b71c1c; }
    .close-btn {
      background: none;
      border: none;
      color: white;
      font-size: 20px;
      cursor: pointer;
      margin-left: 15px;
    }
    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
  `]
})
export class ToastComponent implements OnInit, OnDestroy {
  toasts: ToastMessage[] = [];
  private subscription!: Subscription;

  constructor(private toastService: ToastService) {}

  ngOnInit() {
    this.subscription = this.toastService.toastState.subscribe((toast) => {
      this.toasts.push(toast);
      // Auto-remove after 3 seconds
      setTimeout(() => this.remove(0), 3000);
    });
  }

  remove(index: number) {
    if (this.toasts.length > 0) {
      this.toasts.splice(index, 1);
    }
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}