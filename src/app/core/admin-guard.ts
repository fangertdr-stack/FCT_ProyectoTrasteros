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


  //funcion para proteger ruta y verificar si el usuario es admin, si no lo es redirige a login
  async canActivate(): Promise<boolean> {
    if (!isPlatformBrowser(this.platformId)) {
      return true;
    }

    // Verificar si el token existe en localStorage
    const token = localStorage.getItem('token');

    // Si no hay token, redirigir a login
    if (!token) {
      this.router.navigate(['/login']);
      return false;
    }

    try {
      // Verificar si el usuario es admin
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
