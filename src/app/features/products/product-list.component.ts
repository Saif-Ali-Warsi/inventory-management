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
import { CurrencyPipe } from '@angular/common';
import { ProductListUiComponent } from './product-list-ui/product-list-ui.component';
import { Store } from '@ngrx/store';
import * as ProductActions from '../../core/store/products/product.actions';
import * as ProductSelectors from '../../core/store/products/product.selectors';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, ProductListUiComponent],
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

  constructor(private productService: ProductService, private categoryService: CategoryService, private store: Store) { }



  products$ = this.store.select(ProductSelectors.selectProducts);
  loading$ = this.store.select(ProductSelectors.selectLoading);

  ngOnInit(): void {
    this.store.dispatch(ProductActions.loadProducts());

    this.categoryService.getCategories()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => this.categories = data);

    this.products$
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.allProducts = data;
        this.products = data;
      });


    this.categoryService.getCategories().pipe(takeUntil(this.destroy$))
      .subscribe(data => this.categories = data);




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




  toggleStatus(product: Product) {
    const updated = { ...product, isActive: !product.isActive };

    this.productService.update(product.id, updated)
      .subscribe(() => {
        this.store.dispatch(ProductActions.loadProducts());
      });
  }

  deleteProduct(id: string) {
    if (confirm('Are you sure?')) {
      this.productService.delete(id).subscribe(() => {
        this.store.dispatch(ProductActions.loadProducts());
      });
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
