import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../core/services/product.service';
import { Product } from '../../core/models/product.model';
import { Subject, BehaviorSubject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, map, takeUntil } from 'rxjs/operators';
import { RouterLink } from "@angular/router";
import { combineLatest } from 'rxjs';
import { CategoryService } from '../../core/services/category.service';
import { Category } from '../../core/models/category.model';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss'
})
export class ProductListComponent implements OnInit, OnDestroy {

  products: any[] = [];
  categories: Category[] = [];
  allProducts: any[] = [];
  search$ = new BehaviorSubject<string>('');
  category$ = new BehaviorSubject<string>('');

  private destroy$ = new Subject<void>();


  constructor(private productService: ProductService, private categoryService: CategoryService) { }


  ngOnInit(): void {


    this.categoryService.getCategories().pipe(takeUntil(this.destroy$))
      .subscribe(data => this.categories = data);

    this.loadProductsWithCategories();


    combineLatest([
      this.search$.pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      ),
      this.category$
    ]).subscribe(([searchTerm, categoryId]) => {
      let filtered = this.allProducts;

      if (searchTerm) {
        const term = searchTerm.trim().toLowerCase();

        filtered = filtered.filter(p => p.name.toLowerCase().includes(term))
      }

      if (categoryId) {
        filtered = filtered.filter(p => p.categoryId === categoryId)
      }

      this.products = filtered;
    })

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

  onCategoryChange(event: any) {
    this.category$.next(event.target.value);
  }

  trackById(index: number, item: Product) {
    return item.id;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
