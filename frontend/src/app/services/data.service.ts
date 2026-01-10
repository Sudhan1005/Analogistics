import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class DataService {

  private api = 'http://127.0.0.1:5000/api';

  constructor(private http: HttpClient) {}

  /* Warehouses */
  getWarehouses() {
    return this.http.get<any[]>(`${this.api}/warehouses`);
  }

  createWarehouse(data: any) {
    return this.http.post(`${this.api}/warehouses`, data);
  }

 createZone(zone: any) {
  return this.http.post(
    'http://localhost:5000/api/zones',
    zone
  );
}

getZones() {
  return this.http.get<any[]>(
    'http://localhost:5000/api/zones'
  );
}
createProduct(product: any) {
  return this.http.post(
    'http://localhost:5000/api/products',
    product
  );
}
}
