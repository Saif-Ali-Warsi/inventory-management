import { Pipe, PipeTransform } from '@angular/core';
import { Product } from '../../core/models/product.model';

@Pipe({
  name: 'productDisplay',
  standalone: true
})
export class ProductDisplayPipe implements PipeTransform {

  transform(product: Product): string {

    if (!product) return '';

    const name = product.name;
    const price = product.price;

    const status = product.isActive ? '' : ' (Inactive)';

    return `${name} - ₹${price}${status}`;

  }

}
