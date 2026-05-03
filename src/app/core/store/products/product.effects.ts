import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as ProductActions from './product.actions';
import { ProductService } from '../../services/product.service';
import { switchMap, map, catchError, of } from 'rxjs';
import { CategoryService } from '../../services/category.service';
import { combineLatest } from 'rxjs';

@Injectable()
export class ProductEffects {

    actions$ = inject(Actions);
    productService = inject(ProductService);
    categoryService = inject(CategoryService);

    loadProducts$ = createEffect(() =>
        this.actions$.pipe(
            ofType(ProductActions.loadProducts),
            switchMap(() =>
                combineLatest([
                    this.productService.getProducts(),
                    this.categoryService.getCategories()
                ]).pipe(
                    map(([products, categories]) => {
                        const mapped = products.map(product => {
                            const category = categories.find(
                                c => c.id === product.categoryId
                            );

                            return {
                                ...product,
                                categoryName: category ? category.name : 'Unknown'
                            };
                        });

                        return ProductActions.loadProductsSuccess({ products: mapped });
                    }),
                    catchError(error =>
                        of(ProductActions.loadProductsFailure({ error }))
                    )
                )
            )
        )
    );
}