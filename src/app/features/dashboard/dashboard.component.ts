import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { combineLatest } from 'rxjs';
import { ProductService } from '../../core/services/product.service';
import { CategoryService } from '../../core/services/category.service';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {

  totalProducts = 0;
  totalCategories = 0;

  constructor(private productService: ProductService, private categoryService: CategoryService) { }

  ngOnInit() {
    this.loadDashboard();
  }

  loadDashboard() {
    combineLatest([
      this.productService.getProducts(),
      this.categoryService.getCategories()
    ]).subscribe(([products, categories]) => {
      this.totalProducts = products.length;
      this.totalCategories = categories.length;
    });
  }
}
