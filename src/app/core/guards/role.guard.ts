import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const roleGuard: CanActivateFn = (route, state) => {

  const auth = inject(AuthService);
  const router = inject(Router);


  const userRole = auth.getUserRole();

  const allowedRoles = route.data?.['roles'] as string[];


  if (userRole === 'super-admin') {
    return true;
  }

  if (allowedRoles && allowedRoles.includes(userRole!)) {
    return true;
  }


  alert('Permission Denied');
  router.navigate(['/dashboard']);
  return false;
};
