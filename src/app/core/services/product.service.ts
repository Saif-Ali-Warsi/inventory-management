import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product } from '../models/product.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private baseUrl = `${environment.apiUrl}/products`;

  constructor(private http: HttpClient) { }

  getProducts() {
    return this.http.get<Product[]>(this.baseUrl);
  }

  getById(id: string) {
    return this.http.get<Product>(`${this.baseUrl}/${id}`);
  }

  create(product: Product) {
    return this.http.post<Product>(this.baseUrl, product)
  }

  update(id: string, product: Product) {
    return this.http.put<Product>(`${this.baseUrl}/${id}`, product)
  }

  delete(id: string) {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
