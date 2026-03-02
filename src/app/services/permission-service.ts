import { Injectable } from '@angular/core';
import { firstValueFrom,Observable,of } from 'rxjs';
import { URL_API } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID,inject } from '@angular/core';


@Injectable({
  providedIn: 'root',
})
export class PermissionService {


  private platformId = inject(PLATFORM_ID);

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    if (!isPlatformBrowser(this.platformId)) {
      return new HttpHeaders({ 'Content-Type': 'application/json' });
    }

    const token = localStorage.getItem('token') ?? '';
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    if (token) headers = headers.set('Authorization', `Bearer ${token}`);
    return headers;
  }

  isAdmin() {
    // SSR: Retornar false en servidor
    if (!isPlatformBrowser(this.platformId)) {
      return of(false);
    }

    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    // Devuelve un Observable<boolean>
    return this.http.get<any>(`${URL_API}/permission.php`, { headers }).pipe(
      map(res => {
        console.log('Permission response:', res);

        // Si la respuesta es directamente un booleano
        if (typeof res === 'boolean') return res;

        // Si es un número (0 o 1)
        if (typeof res === 'number') return res === 1 || res > 0;

        // Buscar en res.data (estructura ApiUtils - como devuelve tu permission.php)
        if (res?.data && typeof res.data === 'object') {
          if ('is_admin' in res.data) return res.data.is_admin === true || res.data.is_admin === 1;
          if ('isAdmin' in res.data) return res.data.isAdmin === true || res.data.isAdmin === 1;
          if ('admin' in res.data) return res.data.admin === true || res.data.admin === 1;
          if ('role' in res.data) return res.data.role === 'admin' || res.data.role === 1;
          if ('es_admin' in res.data) return res.data.es_admin === true || res.data.es_admin === 1;
        }

        // Buscar en res directamente (respuestas simples / estructura plana)
        if (res && typeof res === 'object') {
          if ('is_admin' in res) return res.is_admin === true || res.is_admin === 1;
          if ('isAdmin' in res) return res.isAdmin === true || res.isAdmin === 1;
          if ('admin' in res) return res.admin === true || res.admin === 1;
          if ('role' in res) return res.role === 'admin' || res.role === 1;
          if ('es_admin' in res) return res.es_admin === true || res.es_admin === 1;
        }

        // Por defecto, retorna false si no encontró lo esperado
        console.warn('Unexpected permission response format:', res);
        return false;
      })
    );
  }

}
