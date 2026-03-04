import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario } from '../models/usuario';

@Injectable({
  providedIn: 'root',
})
export class UsersCrud {

  private apiUrl = `http://dev2.datarush.es/BackTrasteRush/api/user.php`;

  constructor(private http: HttpClient) {}

  // GET trae usuarios de la bd
  getUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.apiUrl);
  }

  // POST crea usuarios
  createUsuario(usuario: Omit<Usuario, 'id_usuario'>): Observable<any> {
    return this.http.post(this.apiUrl, usuario);
  }

  // PUT actualiza usuario
  updateUsuario(usuario: Usuario): Observable<any> {
    return this.http.put(this.apiUrl, usuario);
  }

  // DELETE borra usuario
  deleteUsuario(id_usuario: number): Observable<any> {
    return this.http.delete(this.apiUrl, { body: { id_usuario } });
  }
}
