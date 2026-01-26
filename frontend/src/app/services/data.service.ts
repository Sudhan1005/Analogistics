import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DataService {

  private api = 'http://127.0.0.1:5000/api';

  constructor(private http: HttpClient) {}

  /* ===================== WAREHOUSES ===================== */

  getWarehouses(): Observable<any[]> {
    return this.http.get<any[]>(`${this.api}/warehouses`);
  }

  createWarehouse(data: any): Observable<any> {
    return this.http.post<any>(`${this.api}/warehouses`, data);
  }

  /* ===================== ZONES ===================== */

  getZones(): Observable<any[]> {
    return this.http.get<any[]>(`${this.api}/zones`);
  }

  createZone(zone: any): Observable<any> {
    return this.http.post<any>(`${this.api}/zones`, zone);
  }

  getZonesByWarehouse(warehouseId: number): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.api}/zones/by-warehouse/${warehouseId}`
    );
  }

  /* ===================== PRODUCTS ===================== */

  createProduct(product: any): Observable<any> {
    return this.http.post<any>(`${this.api}/products`, product);
  }

  getProducts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.api}/products`);
  }

  getProductById(id: number): Observable<any> {
    return this.http.get<any>(`${this.api}/products/${id}`);
  }

  updateProduct(id: number, product: any): Observable<any> {
    return this.http.put<any>(`${this.api}/products/${id}`, product);
  }

  deleteProduct(id: number): Observable<any> {
    return this.http.delete<any>(`${this.api}/products/${id}`);
  }

  /* ===================== DELIVERY ===================== */

  // ✅ Delivery List (Outbound / Driver Assigned / Yet to Assign)
  getDeliveryList(): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.api}/delivery/products`
    );
  }

  // ✅ Assign driver + slot
  assignDelivery(
    productId: number,
    data: { driver_id: number; delivery_slot_id: number }
  ): Observable<any> {
    return this.http.put<any>(
      `${this.api}/delivery/assign/${productId}`,
      data
    );
  }

  /* ===================== DELIVERY SLOTS ===================== */

  getDeliverySlots(): Observable<any[]> {
    return this.http.get<any[]>(`${this.api}/delivery-slots`);
  }

  getDeliverySlotById(id: number): Observable<any> {
    return this.http.get<any>(`${this.api}/delivery-slots/${id}`);
  }

  createDeliverySlot(data: any): Observable<any> {
    return this.http.post<any>(`${this.api}/delivery-slots`, data);
  }

  updateDeliverySlot(id: number, data: any): Observable<any> {
    return this.http.put<any>(`${this.api}/delivery-slots/${id}`, data);
  }

  deleteDeliverySlot(id: number): Observable<any> {
    return this.http.delete<any>(`${this.api}/delivery-slots/${id}`);
  }

  /* ===================== DRIVERS ===================== */

  getDrivers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.api}/drivers`);
  }

  getDriverById(id: number): Observable<any> {
    return this.http.get<any>(`${this.api}/drivers/${id}`);
  }

  createDriver(data: any): Observable<any> {
    return this.http.post<any>(`${this.api}/drivers`, data);
  }

  updateDriver(id: number, data: any): Observable<any> {
    return this.http.put<any>(`${this.api}/drivers/${id}`, data);
  }

  deleteDriver(id: number): Observable<any> {
    return this.http.delete<any>(`${this.api}/drivers/${id}`);
  }

  /* ===================== LOGISTICS ===================== */

  // ✅ Logistics List
  // shows products whose status = "Out for Delivery"
  getLogisticsList(): Observable<any[]> {
  return this.http.get<any[]>(`${this.api}/logistics`);
}
// ALWAYS NUMBER — NOT string
getLogisticsById(id: number): Observable<any> {
  return this.http.get<any>(`${this.api}/logistics/${id}`);
}

updateLogistics(
  productId: number,
  payload: any
): Observable<any> {
  return this.http.put<any>(
    `${this.api}/logistics/${productId}`,
    payload
  );
}

deleteLogistics(productId: number): Observable<any> {
  return this.http.delete<any>(
    `${this.api}/logistics/${productId}`
  );
}
}
