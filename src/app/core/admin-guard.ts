import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { PermissionService } from '../services/permission-service';
import { catchError, map } from 'rxjs/operators';
import { of } from 'rxjs';

export const adminGuard: CanActivateFn = () => {
  const perm = inject(PermissionService);
  const router = inject(Router);

  return perm.isAdmin().pipe(
    map(isAdmin => {


      if (isAdmin) return true;

      router.navigate(['/']);
      return false;
    }),
    catchError(err => {
      console.error('adminGuard error', err);
      router.navigate(['/']);
      return of(false);
    })
  );
};
