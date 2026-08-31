import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'https://finance-erp-backend-production-fc85.up.railway.app/api';

  constructor(private http: HttpClient) { }

  private getAuthHeaders() {
    const token = localStorage.getItem('erp_token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  getDashboardData(): Observable<any> {
    return this.http.get(`${this.baseUrl}/dashboard`, { headers: this.getAuthHeaders() });
  }

  // ==========================================
  // TRANSACTIONS APIs
  // ==========================================
  addTransaction(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/transactions`, data, { headers: this.getAuthHeaders() });
  }

  updateTransaction(id: number, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/transactions/${id}`, data, { headers: this.getAuthHeaders() });
  }

  deleteTransaction(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/transactions/${id}`, { headers: this.getAuthHeaders() });
  }

  // ==========================================
  // ACCOUNTS APIs
  // ==========================================
  updateAccount(id: number, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/accounts/${id}`, data, { headers: this.getAuthHeaders() });
  }

  deleteAccount(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/accounts/${id}`, { headers: this.getAuthHeaders() });
  }

  // ==========================================
  // CREDIT CARDS APIs
  // ==========================================
  updateCreditCard(id: number, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/credit-cards/${id}`, data, { headers: this.getAuthHeaders() });
  }

  deleteCreditCard(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/credit-cards/${id}`, { headers: this.getAuthHeaders() });
  }

  // ==========================================
  // EMI & STATEMENTS APIs
  // ==========================================
  generateStatement(cardId: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/credit-cards/${cardId}/generate-statement`, {}, { headers: this.getAuthHeaders() });
  }

  payEmi(emiId: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/emis/${emiId}/pay`, {}, { headers: this.getAuthHeaders() });
  }
}