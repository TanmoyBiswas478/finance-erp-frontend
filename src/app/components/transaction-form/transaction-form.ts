import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Naya import (ngModel ke liye zaroori)
import { ApiService } from '../../services/api';

@Component({
  selector: 'app-transaction-form',
  standalone: true,
  imports: [CommonModule, FormsModule], // FormsModule add kiya
  templateUrl: './transaction-form.html',
  styleUrls: ['./transaction-form.css']
})
export class TransactionFormComponent {
  
  transaction = {
    // NAYA: Aaj ki date automatically set ho jayegi (YYYY-MM-DD format mein)
    transaction_date: new Date().toISOString().split('T')[0], 
    
    amount: null,
    transaction_type: 'DEBIT',
    category: 'Food',
    source_type: 'ACCOUNT',
    source_id: 1,
    description: '',
    transfer_target_type: '', 
    transfer_target_id: null  
  };

  isSubmitting: boolean = false;

  constructor(private apiService: ApiService) {}

  onSubmit() {
    if (!this.transaction.amount || this.transaction.amount <= 0) {
      alert("Please enter a valid amount!");
      return;
    }

    // Smart Auto-Fill Logic: Agar Transfer ya Bill hai, toh target type aur category auto-set kardo
    if (this.transaction.transaction_type === 'TRANSFER') {
      this.transaction.transfer_target_type = 'ACCOUNT';
      if(this.transaction.category === 'Food') this.transaction.category = 'Bank Transfer';
    } else if (this.transaction.transaction_type === 'CC_BILL') {
      this.transaction.transfer_target_type = 'CREDIT_CARD';
      if(this.transaction.category === 'Food') this.transaction.category = 'CC Bill Payment';
    }

    this.isSubmitting = true;

    this.apiService.addTransaction(this.transaction).subscribe({
      next: (response) => {
        alert("Transaction Successful! 🚀");
        this.isSubmitting = false;
        window.location.reload(); 
      },
      error: (error) => {
        console.error("Error saving transaction:", error);
        alert("Transaction Failed! Check console.");
        this.isSubmitting = false;
      }
    });
  }
}