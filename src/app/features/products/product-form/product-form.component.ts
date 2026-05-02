import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { ProductService } from '../../../core/services/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from '../../../core/models/product.model';
import { Category } from '../../../core/models/category.model';
import { CategoryService } from '../../../core/services/category.service';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.scss'
})
export class ProductFormComponent implements OnInit {


  isEdit = false;
  productId = '';
  categories: Category[] = [];
  products: any[] = [];


  form = new FormGroup({
    name: new FormControl('', Validators.required),
    price: new FormControl(0, [Validators.required]),
    categoryId: new FormControl('', Validators.required),
    isActive: new FormControl(true)
  });


  constructor(private productService: ProductService, private route: ActivatedRoute, private router: Router, private categoryService: CategoryService) { }


  ngOnInit(): void {

    this.categoryService.getCategories()
      .subscribe(data => this.categories = data);


    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.isEdit = true;
      this.productId = id;

      this.productService.getById(id).subscribe(product => {
        this.form.patchValue(product);
      });
    }

  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }


    const value = this.form.value;

    const payload: Product = {
      id: this.isEdit ? this.productId : Date.now().toString(),
      name: value.name || '',
      price: value.price || 0,
      categoryId: value.categoryId || '',
      isActive: value.isActive ?? true

    };


    const api$ = this.isEdit
      ? this.productService.update(this.productId, payload)
      : this.productService.create(payload);

    api$.subscribe(() => {
      this.router.navigate(['/products']);
    });

  }

}
