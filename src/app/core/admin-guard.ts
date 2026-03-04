// src/app/core/admin-guard.ts
import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { PermissionService } from '../services/permission-service';
import { firstValueFrom } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class adminGuard implements CanActivate {
  private platformId = inject(PLATFORM_ID);

  constructor(private router: Router, private permissionService: PermissionService) {}

  async canActivate(): Promise<boolean> {
    // SSR: No bloquear en el servidor
    if (!isPlatformBrowser(this.platformId)) {
      return true;
    }

    const token = localStorage.getItem('token');
    const rol = localStorage.getItem('rol');

    console.log('Admin Guard: Token encontrado:', !!token, 'Rol:', rol);

    if (!token) {
      console.log('Admin Guard: No hay token, redirigiendo al login');
      this.router.navigate(['/login']);
      return false;
    }

    // Usar el rol guardado por el login en localStorage en vez de llamar al backend
    const isAdmin = rol === 'admin' || rol === '1';
    console.log('Admin Guard: ¿Es admin? (basado en rol guardado)', isAdmin);

    if (!isAdmin) {
      console.log('Admin Guard: No es admin, redirigiendo al login');
      this.router.navigate(['/login']);
      return false;
    }

    console.log('Admin Guard: ✓ Usuario admin permitido');
    return true;
  }
}
