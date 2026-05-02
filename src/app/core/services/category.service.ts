import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Category } from '../models/category.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private baseUrl = `${environment.apiUrl}/categories`;


  constructor(private http: HttpClient) { }


  getCategories() {
    return this.http.get<Category[]>(this.baseUrl);
  }

  getById(id: string) {
    return this.http.get<Category>(`${this.baseUrl}/${id}`);
  }

  create(category: Category) {
    return this.http.post<Category>(this.baseUrl, category);
  }

  update(id: string, category: Category) {
    return this.http.put<Category>(`${this.baseUrl}/${id}`, category)
  }

  delete(id: string) {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }


}
