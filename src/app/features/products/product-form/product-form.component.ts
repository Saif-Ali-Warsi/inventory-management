import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { ProductService } from '../../../core/services/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from '../../../core/models/product.model';

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


  form = new FormGroup({
    name: new FormControl('', Validators.required),
    price: new FormControl(0, [Validators.required]),
    category: new FormControl('', Validators.required),
    isActive: new FormControl(true)
  });


  constructor(private service: ProductService, private route: ActivatedRoute, private router: Router) { }


  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.isEdit = true;
      this.productId = id;

      this.service.getById(id).subscribe(product => {
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
      category: value.category || '',
      isActive: value.isActive ?? true

    };


    const api$ = this.isEdit
      ? this.service.update(this.productId, payload)
      : this.service.create(payload);

    api$.subscribe(() => {
      this.router.navigate(['/products']);
    });

  }

}
