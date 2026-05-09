import { isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { PermissionService } from '../services/permission-service';

@Injectable({ providedIn: 'root' })
export class adminGuard implements CanActivate {
  private platformId = inject(PLATFORM_ID);

  constructor(
    private router: Router,
    private permissionService: PermissionService
  ) {}

  async canActivate(): Promise<boolean> {
    if (!isPlatformBrowser(this.platformId)) {
      return true;
    }

    const token = localStorage.getItem('token');

    if (!token) {
      this.router.navigate(['/login']);
      return false;
    }

    try {
      const isAdmin = await firstValueFrom(this.permissionService.isAdmin());

      if (!isAdmin) {
        this.router.navigate(['/login']);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Admin Guard: error verificando permisos', error);
      this.router.navigate(['/login']);
      return false;
    }
  }
}
