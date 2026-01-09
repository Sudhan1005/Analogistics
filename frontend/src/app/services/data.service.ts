import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class DataService {

  private api = 'http://127.0.0.1:5000/api';

  constructor(private http: HttpClient) {}

  getWarehouses() {
    return this.http.get<any[]>(`${this.api}/warehouses`);
  }

  createWarehouse(data: any) {
    return this.http.post(`${this.api}/warehouses`, data);
  }

  getHubs() {
    return this.http.get<any[]>(`${this.api}/hubs`);
  }

  createHub(data: any) {
    return this.http.post(`${this.api}/hubs`, data);
  }
}
