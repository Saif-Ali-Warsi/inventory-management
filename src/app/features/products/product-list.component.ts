import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../core/services/product.service';
import { Product } from '../../core/models/product.model';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, map } from 'rxjs/operators';
import { RouterLink } from "@angular/router";
import { combineLatest } from 'rxjs';
import { CategoryService } from '../../core/services/category.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss'
})
export class ProductListComponent implements OnInit {

  products: any[] = [];
  allProducts: any[] = [];
  search$ = new Subject<string>();


  constructor(private productService: ProductService, private categoryService: CategoryService) { }




  ngOnInit(): void {

    this.loadProductsWithCategories();

    this.search$
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(term => {

        if (!term) {
          this.products = this.allProducts;
          return;
        }

        this.products = this.allProducts.filter(p =>
          p.name.toLowerCase().includes(term.toLowerCase())
        );
      });
  }

  loadProductsWithCategories() {
    combineLatest([
      this.productService.getProducts(),
      this.categoryService.getCategories()
    ]).subscribe(([products, categories]) => {

      const mapped = products.map(product => {
        const category = categories.find(
          c => c.id === product.categoryId
        );

        return {
          ...product,
          categoryName: category ? category.name : 'Unknown'
        };
      });

      this.allProducts = mapped;
      this.products = mapped;
    });
  }


  toggleStatus(product: Product) {
    const updated = { ...product, isActive: !product.isActive };

    this.productService.update(product.id, updated)
      .subscribe(() => this.loadProductsWithCategories());
  }

  deleteProduct(id: string) {
    const confirmDelete = confirm('Are you sure?');

    if (confirmDelete) {
      this.productService.delete(id).subscribe(() => {
        this.loadProductsWithCategories();
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
