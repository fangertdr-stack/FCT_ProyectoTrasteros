import { PermissionService } from './../services/permission-service';
import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class Auth implements CanActivate {

  constructor(
    private router: Router,
    private permissionService: PermissionService,
  ) {}

  private isBrowser(): boolean {
    return typeof window !== 'undefined';
  }



  async canActivate(): Promise<boolean | UrlTree> {

  // SSR → no bloquear
  if (!this.isBrowser()) {
    return true;
  }

  const token = localStorage.getItem('token');
  if (!token) {
    return this.router.createUrlTree(['/login']);
  }

  try {
    const isAdmin = await firstValueFrom(this.permissionService.isAdmin());

    if (!isAdmin) {
      return this.router.createUrlTree(['/login']);
    }

    return true;

  } catch {
    return this.router.createUrlTree(['/login']);
  }
}
}
