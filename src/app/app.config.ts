import { ApplicationConfig } from '@angular/core';
import { provideRouter, withHashLocation } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { errorInterceptor } from './core/interceptors/error.interceptor';
import { loadingInterceptor } from './core/interceptors/loading.interceptor';
import { provideStore } from '@ngrx/store';
import { provideState } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';

import { routes } from './app.routes';
import { productReducer } from './core/store/products/product.reducer';
import { ProductEffects } from './core/store/products/product.effects';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes, withHashLocation()), provideHttpClient(withInterceptors(

    [
      authInterceptor,
      loadingInterceptor,
      errorInterceptor,
    ]
  )), provideStore({}), provideState('products', productReducer),
  provideEffects([ProductEffects])
  ]
};
