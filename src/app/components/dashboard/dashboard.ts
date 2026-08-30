import { Component, OnInit, ChangeDetectorRef } from '@angular/core'; 
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api';
import Chart from 'chart.js/auto';

// NAYE IMPORTS PDF aur Excel ke liye
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent implements OnInit {
  dashboardData: any = null;
  isLoading: boolean = true;
  chart: any = null; 
  isDarkMode: boolean = false; // NAYA: Dark mode state track karne ke liye

  constructor(private apiService: ApiService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData() {
    console.log("API Call Start ho rahi hai...");
    this.apiService.getDashboardData().subscribe({
      next: (response) => {
        console.log("Data aa gaya: ", response);
        this.dashboardData = response.data;
        this.isLoading = false;
        
        this.cdr.detectChanges(); 
        this.renderChart();
      },
      error: (error) => {
        console.error('Error fetching data:', error);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  renderChart() {
    if (this.chart) {
      this.chart.destroy();
    }
    const categoryData = this.dashboardData.category_expenses;
    if (!categoryData || categoryData.length === 0) return;

    const labels = categoryData.map((item: any) => item.category);
    const data = categoryData.map((item: any) => item.total);

    this.chart = new Chart('expenseChart', {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [{
          label: 'Total Spend (₹)',
          data: data,
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'],
          hoverOffset: 4
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'right' }
        }
      }
    });
  }

  generateBill(cardId: number) {
    if(confirm("Are you sure you want to generate the statement for this card?")) {
      this.apiService.generateStatement(cardId).subscribe({
        next: (res) => {
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
        next: (res) => {
          alert("✅ EMI Installment Paid Successfully!");
          this.fetchData(); 
        },
        error: (err) => console.error(err)
      });
    }
  }

  // ==========================================
  // NAYE FUNCTIONS: Dark Mode, PDF & Excel
  // ==========================================

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
      t.created_at ? t.created_at.split('T')[0] : '--',
      t.category,
      t.description || '--',
      t.transaction_type,
      `INR ${t.amount}`
    ]);

    autoTable(doc, {
      head: [['Date', 'Category', 'Note', 'Type', 'Amount']],
      body: tableData,
      startY: 25,
    });

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