import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private http = inject(HttpClient);
  private baseUrl = 'http://127.0.0.1:8000/api';

  // Tester la route products
  getProducts(page: number = 1): Observable<any> {
    return this.http.get(`${this.baseUrl}/products?page=${page}`);
  }

  // Méthode générique pour tester d'autres endpoints
  testEndpoint(endpoint: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/${endpoint}`);
  }
}
