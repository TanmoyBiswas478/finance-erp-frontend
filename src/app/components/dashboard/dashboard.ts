import { Component, OnInit, ChangeDetectorRef } from '@angular/core'; 
import { CommonModule, formatDate } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { ApiService } from '../../services/api';
import Chart from 'chart.js/auto';

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule], 
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent implements OnInit {
  dashboardData: any = null;
  isLoading: boolean = true;
  expenseChart: any = null; 
  overviewChart: any = null; 
  isDarkMode: boolean = false; 

  activeModal: 'account' | 'card' | 'transaction' | 'add_transaction' | null = null;
  formData: any = {};

  constructor(private apiService: ApiService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData() {
    this.isLoading = true;
    this.apiService.getDashboardData().subscribe({
      next: (response) => {
        this.dashboardData = response.data;
        this.isLoading = false;
        this.cdr.detectChanges(); 
        this.renderCharts(); 
      },
      error: (error) => {
        console.error('Error fetching data:', error);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  renderCharts() {
    if (this.expenseChart) this.expenseChart.destroy();
    if (this.overviewChart) this.overviewChart.destroy();

    const income = this.dashboardData.current_month_income || 0;
    const expense = this.dashboardData.current_month_expense || 0;

    this.overviewChart = new Chart('overviewChart', {
      type: 'doughnut',
      data: {
        labels: ['Income (Credit)', 'Expense (Debit)'],
        datasets: [{
          data: [income, expense],
          backgroundColor: ['#4BC0C0', '#FF6384'], 
          hoverOffset: 4
        }]
      },
      options: { responsive: true, plugins: { legend: { position: 'bottom' } } }
    });

    const categoryData = this.dashboardData.category_expenses;
    if (!categoryData || categoryData.length === 0) return;

    const labels = categoryData.map((item: any) => item.category);
    const data = categoryData.map((item: any) => item.total);

    this.expenseChart = new Chart('expenseChart', {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [{
          label: 'Total Spend (₹)',
          data: data,
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#9966FF', '#FF9F40'],
          hoverOffset: 4
        }]
      },
      options: { responsive: true, plugins: { legend: { position: 'bottom' } } }
    });
  }

  generateBill(cardId: number) {
    if(confirm("Are you sure you want to generate the statement for this card?")) {
      this.apiService.generateStatement(cardId).subscribe({
        next: () => {
          alert("🧾 Statement Generated Successfully!");
          this.fetchData(); 
        },
        error: (err) => console.error(err)
      });
    }
  }

  payEmi(emiId: number) {
    if(confirm("Process this month's EMI payment?")) {
      this.apiService.payEmi(emiId).subscribe({
        next: () => {
          alert("✅ EMI Installment Paid Successfully!");
          this.fetchData(); 
        },
        error: (err) => console.error(err)
      });
    }
  }

  openEditModal(type: 'account' | 'card' | 'transaction' | 'add_transaction', data: any) {
    this.activeModal = type;
    if (type === 'add_transaction') {
      this.formData = {
        amount: null,
        type: 'EXPENSE',
        source_type: 'ACCOUNT',
        source_name: '',
        category: 'Manual Entry',
        date: formatDate(new Date(), 'yyyy-MM-dd', 'en')
      };
    } else {
      this.formData = { ...data }; 
    }
  }

  closeModal() {
    this.activeModal = null;
    this.formData = {};
  }

  saveData() {
    if (this.activeModal === 'add_transaction') {
      this.apiService.addTransaction(this.formData).subscribe(() => this.onSaveSuccess());
    } else if (this.activeModal === 'account') {
      this.apiService.updateAccount(this.formData.id, this.formData).subscribe(() => this.onSaveSuccess());
    } else if (this.activeModal === 'card') {
      this.apiService.updateCreditCard(this.formData.id, this.formData).subscribe(() => this.onSaveSuccess());
    } else if (this.activeModal === 'transaction') {
      this.apiService.updateTransaction(this.formData.id, this.formData).subscribe(() => this.onSaveSuccess());
    }
  }

  onSaveSuccess() {
    alert("✅ Data updated successfully!");
    this.closeModal();
    this.fetchData();
  }

  deleteItem(type: 'account' | 'card' | 'transaction', id: number) {
    if(confirm(`Are you sure you want to delete this ${type}? This action cannot be undone.`)) {
      if (type === 'account') {
        this.apiService.deleteAccount(id).subscribe(() => this.fetchData());
      } else if (type === 'card') {
        this.apiService.deleteCreditCard(id).subscribe(() => this.fetchData());
      } else if (type === 'transaction') {
        this.apiService.deleteTransaction(id).subscribe(() => this.fetchData());
      }
    }
  }

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    if (this.isDarkMode) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  }

  exportToPDF() {
    if (!this.dashboardData || !this.dashboardData.recent_transactions) {
      alert("No data available to export!");
      return;
    }
    const doc = new jsPDF();
    doc.text('Financial ERP Ledger Report', 14, 15);
    const tableData = this.dashboardData.recent_transactions.map((t: any) => [
      t.date ? t.date.replace('T', ' ').substring(0, 19) : '--',
      t.category || 'Uncategorized',
      t.note || '--',
      t.type || '--',
      `INR ${t.amount}`
    ]);
    autoTable(doc, { head: [['Date & Time', 'Category', 'Note', 'Type', 'Amount']], body: tableData, startY: 25 });
    doc.save('Finance_Report.pdf');
  }

  exportToExcel() {
    if (!this.dashboardData || !this.dashboardData.recent_transactions) {
      alert("No data available to export!");
      return;
    }
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.dashboardData.recent_transactions);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Transactions');
    XLSX.writeFile(wb, 'Finance_Report.xlsx');
  }
}