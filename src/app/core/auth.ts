import { PermissionService } from './../services/permission-service';
import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({ providedIn: 'root' })
export class Auth implements CanActivate {

  constructor(
    private router: Router,
    private permissionService: PermissionService,
    private snackBar: MatSnackBar
  ) {}

  private isBrowser(): boolean {
    return typeof window !== 'undefined';
  }

  private showMessage(message: string, success: boolean = true): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: success ? ['snackbar-success'] : ['snackbar-error']
    });
  }

  async canActivate(): Promise<boolean | UrlTree> {

  // ✅ EN SSR: permitir navegación (NO bloquear)
  if (typeof window === 'undefined') {
    return true;
  }

  const token = localStorage.getItem('token');
  if (!token) {
    return this.router.createUrlTree(['/login']);
  }

  try {
    const response = await this.permissionService.isAdmin();
    const isAdmin = !!response?.data?.is_admin;

    if (!isAdmin) {
      return this.router.createUrlTree(['/login']);
    }

    return true;

  } catch {
    return this.router.createUrlTree(['/login']);
  }
}
}
