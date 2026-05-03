import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../../core/models/product.model';
import { RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-product-list-ui',
  standalone: true,
  imports: [CommonModule, RouterLink, CurrencyPipe],
  templateUrl: './product-list-ui.component.html',
  styleUrl: './product-list-ui.component.scss'
})
export class ProductListUiComponent {

  @Input() products: Product[] = [];


  @Output() toggle = new EventEmitter<Product>();
  @Output() delete = new EventEmitter<string>();

  trackByProduct(index: number, item: Product) {
    return item.id;
  }
}
