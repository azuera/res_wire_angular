import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Product } from '../models/product';

// Interface pour la réponse de l'API Platform
interface ApiPlatformResponse {
  member: Product[];
  totalItems: number;
}

@Injectable({ providedIn: 'root' })
export class ProductApiService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8000/api/products';

  getProducts(): Observable<Product[]> {
    return this.http.get<ApiPlatformResponse>(this.apiUrl).pipe(
      map((response) => response.member), // ← Extrait le tableau 'member'
    );
  }
  getProduct(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }
}
