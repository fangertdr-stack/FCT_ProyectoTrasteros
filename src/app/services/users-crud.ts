import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario } from '../models/usuario';
import { URL_API } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UsersCrud {

  private apiUrl = `${URL_API}/user.php`;

  constructor(private http: HttpClient) { }

  private getHeaders() {
    const token = typeof localStorage !== 'undefined' ? localStorage.getItem('token') : '';

    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  // GET trae usuarios de la bd
  getUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  // GET trae usuario por id
  getUsuarioById(id_usuario: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.apiUrl}?id_usuario=${id_usuario}`, { headers: this.getHeaders() });
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
}
