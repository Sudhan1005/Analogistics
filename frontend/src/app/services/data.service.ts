import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class DataService {

  private api = 'http://127.0.0.1:5000/api';

  constructor(private http: HttpClient) {}

  /* ===================== WAREHOUSES ===================== */

  getWarehouses() {
    return this.http.get<any[]>(`${this.api}/warehouses`);
  }

  createWarehouse(data: any) {
    return this.http.post(`${this.api}/warehouses`, data);
  }

  /* ===================== ZONES ===================== */

  createZone(zone: any) {
    return this.http.post(`${this.api}/zones`, zone);
  }

  getZones() {
    return this.http.get<any[]>(`${this.api}/zones`);
  }

  getZonesByWarehouse(warehouseId: number) {
    return this.http.get<any[]>(
      `${this.api}/zones/by-warehouse/${warehouseId}`
    );
  }

  /* ===================== PRODUCTS ===================== */

  createProduct(product: any) {
    return this.http.post(`${this.api}/products`, product);
  }

  getProducts() {
    return this.http.get<any[]>(`${this.api}/products`);
  }

  getProductById(id: number) {
    return this.http.get<any>(`${this.api}/products/${id}`);
  }

  updateProduct(id: number, product: any) {
    return this.http.put(
      `${this.api}/products/${id}`,
      product
    );
  }

  deleteProduct(id: number) {
    return this.http.delete(
      `${this.api}/products/${id}`
    );
  }

  /* ===================== DELIVERY ===================== */

  // Assign Delivery (Create)
  createDelivery(delivery: any) {
    return this.http.post(
      `${this.api}/delivery`,
      delivery
    );
  }

  // Delivery List
  getDeliveries() {
    return this.http.get<any[]>(
      `${this.api}/delivery`
    );
  }

  // Get Delivery by ID (Edit)
  getDeliveryById(id: number) {
    return this.http.get<any>(
      `${this.api}/delivery/${id}`
    );
  }

  // Update Delivery
  updateDelivery(id: number, delivery: any) {
    return this.http.put(
      `${this.api}/delivery/${id}`,
      delivery
    );
  }

  // Delete Delivery
  deleteDelivery(id: number) {
    return this.http.delete(
      `${this.api}/delivery/${id}`
    );
  }
getOutboundProductsForDelivery() {
  return this.http.get<any[]>(
    `${this.api}/delivery/products`
  );
}

}