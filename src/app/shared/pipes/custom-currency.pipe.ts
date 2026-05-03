import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'customCurrency',
  standalone: true
})
export class CustomCurrencyPipe implements PipeTransform {

  transform(value: number, currencySymbol: string = '₹'): string {


    if (value == null) return '';


    const formatted = value.toLocaleString('en-IN');

    return `${currencySymbol}${formatted}`;
  }
}