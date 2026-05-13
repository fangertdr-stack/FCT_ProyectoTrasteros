import { Injectable } from '@angular/core';
import {  of } from 'rxjs';
import { URL_API } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID, inject } from '@angular/core';


@Injectable({
  providedIn: 'root',
})
export class PermissionService {

  private platformId = inject(PLATFORM_ID);

  constructor(private http: HttpClient) { }


  //este metodocrea las cabeceras HTTP que se van a enviar al backend cuando haces una petición
  private getHeaders(): HttpHeaders {

    //comprueba que este desde navegador accediendo a localStorage, si no es así (ej: en SSR)
    //  devuelve solo el header de content-type sin token
    if (!isPlatformBrowser(this.platformId)) {
      return new HttpHeaders({ 'Content-Type': 'application/json' });
    }

    //saca el token y crea cabecera
    const token = localStorage.getItem('token') ?? '';
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    if (token) headers = headers.set('Authorization', `Bearer ${token}`);
    return headers;
  }

  //comprueba si es admin si esta en el navegador
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

        // Buscar en res.data la estructura ApiUtils  como devuelve el permission.php)
        //meti varias posibles respuestas porque me estaba volviendo un poco loco
        if (res?.data && typeof res.data === 'object') {
          if ('is_admin' in res.data) return res.data.is_admin === true || res.data.is_admin === 1;
          if ('isAdmin' in res.data) return res.data.isAdmin === true || res.data.isAdmin === 1;
          if ('admin' in res.data) return res.data.admin === true || res.data.admin === 1;
          if ('role' in res.data) return res.data.role === 'admin' || res.data.role === 1;
          if ('es_admin' in res.data) return res.data.es_admin === true || res.data.es_admin === 1;
        }

        // Buscar en res directamente
        //aqui hice lo mismo
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
