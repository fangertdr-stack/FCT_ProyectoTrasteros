import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Usuario } from '../models/usuario';
import { URL_API } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UsersCrud {

  private apiUrl = `${URL_API}/user.php`;
  private platformId = inject(PLATFORM_ID);

  constructor(private http: HttpClient) { }

  private getHeaders() {
    const token = isPlatformBrowser(this.platformId) ? localStorage.getItem('token') : '';
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return headers;
  }

  // GET trae usuarios de la bd
  getUsuarios(): Observable<Usuario[]> {
    if (!isPlatformBrowser(this.platformId)) {
      return of([]);
    }

    return this.http.get<Usuario[]>(this.apiUrl, { headers: this.getHeaders() }).pipe(
      map(usuarios => usuarios.map(usuario => this.normalizarUsuario(usuario)))
    );
  }

  // GET trae usuario por id
  getUsuarioById(id_usuario: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.apiUrl}?id_usuario=${id_usuario}`, { headers: this.getHeaders() }).pipe(
      map(usuario => this.normalizarUsuario(usuario))
    );
  }

  // POST crea usuarios
  createUsuario(usuario: Omit<Usuario, 'id_usuario'>): Observable<any> {
    return this.http.post(this.apiUrl, usuario, { headers: this.getHeaders() });
  }

  // PUT actualiza usuario
  updateUsuario(usuario: Usuario): Observable<any> {
    return this.http.put(`${this.apiUrl}?id_usuario=${usuario.id_usuario}`, usuario, { headers: this.getHeaders() });
  }

  // DELETE borra usuario
  deleteUsuario(id_usuario: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}?id_usuario=${id_usuario}`, { headers: this.getHeaders() });
  }

  // Normaliza el usuario para asegurar que campos opcionales siempre tengan un valor definido
  private normalizarUsuario(usuario: Usuario): Usuario {
    return {
      ...usuario,
      razon_social: usuario.razon_social ?? '',
    };
  }
}
