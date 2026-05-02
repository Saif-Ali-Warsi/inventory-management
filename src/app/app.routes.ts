import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
    },
    // auth
    {
        path: 'login',
        loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
    },
    {
        path: 'signup',
        loadComponent: () => import('./features/auth/signup/signup.component').then(m => m.SignupComponent)
    },
    // protected layer 
    {
        path: '',
        canActivate: [authGuard],
        loadComponent: () => import('./layout/main-layout.component').then(m => m.MainLayoutComponent),
        children: [
            {
                path: 'dashboard',
                loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
            },
            {
                path: 'products',
                canActivate: [roleGuard],
                data: { roles: ['product-manager'] },
                loadComponent: () => import('./features/products/product-list.component').then(m => m.ProductListComponent)
            },
            {
                path: 'products/add',
                canActivate: [roleGuard],
                data: { roles: ['product-manager'] },
                loadComponent: () => import('./features/products/product-form/product-form.component').then(m => m.ProductFormComponent)
            },
            {
                path: 'products/edit/:id',
                canActivate: [roleGuard],
                data: { roles: ['product-manager'] },
                loadComponent: () => import('./features/products/product-form/product-form.component').then(m => m.ProductFormComponent)
            },
            {
                path: 'categories',
                canActivate: [roleGuard],
                data: { roles: ['category-manager'] },
                loadComponent: () => import('./features/categories/category-list.component').then(m => m.CategoryListComponent)
            }
        ]
    },

    {
        path: '**',
        redirectTo: 'login'
    }
];
