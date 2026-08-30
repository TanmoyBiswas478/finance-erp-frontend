import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://127.0.0.1:8000/api';

  constructor(private http: HttpClient) { }

  // 1. Dashboard data fetch karne ke liye (Jo pehle banaya tha)
  getDashboardData(): Observable<any> {
    return this.http.get(`${this.baseUrl}/dashboard`);
  }

  // 2. Nayi transaction insert karne ke liye (NAYA FUNCTION)
  addTransaction(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/transactions`, data);
  }

  // CC Statement Generate API Call
  generateStatement(cardId: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/credit-cards/${cardId}/generate-statement`, {});
  }

  // EMI Pay API Call
  payEmi(emiId: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/emis/${emiId}/pay`, {});
  }
}