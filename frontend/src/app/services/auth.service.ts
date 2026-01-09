import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://127.0.0.1:5000/api';

  constructor(private http: HttpClient) {}

  // ✅ REGISTER
  register(data: any) {
    return this.http.post(`${this.apiUrl}/register`, data);
  }

  // ✅ LOGIN (THIS WAS MISSING)
  login(data: any) {
    return this.http.post(`${this.apiUrl}/login`, data);
  }

  // ✅ FORGOT PASSWORD (optional)
  forgotPassword(data: any) {
    return this.http.post(`${this.apiUrl}/forgot-password`, data);
  }
}
