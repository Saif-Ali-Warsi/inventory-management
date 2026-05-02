import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../core/services/product.service';
import { Product } from '../../core/models/product.model';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, map } from 'rxjs/operators';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss'
})
export class ProductListComponent implements OnInit {

  products: Product[] = [];
  search$ = new Subject<string>();


  constructor(private productService: ProductService) { }




  ngOnInit(): void {
    this.search$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((term) => {
        return this.productService.getProducts().pipe(
          map(products => {
            if (!term) return products;

            return products.filter(p =>
              p.name.toLowerCase().includes(term.toLowerCase())
            )
          })
        )
      })
    )
  }


  loadProducts() {
    this.productService.getProducts().subscribe(data => {
      this.products = data;
    });
  }

  toggleStatus(product: Product) {
    const updated = { ...product, isActive: !product.isActive };

    this.productService.update(product.id, updated)
      .subscribe(() => this.loadProducts());
  }

  deleteProduct(id: string) {
    const confirmDelete = confirm('Are you sure?');

    if (confirmDelete) {
      this.productService.delete(id).subscribe(() => {
        this.loadProducts();
      })
    }
  }

  onSearch(event: any) {
    this.search$.next(event.target.value);
  }

  trackById(index: number, item: Product) {
    return item.id;
  }
}
