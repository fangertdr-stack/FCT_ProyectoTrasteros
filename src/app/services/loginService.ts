import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { URL_API } from '../../environments/environment.prod';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoginService {

  constructor(private http: HttpClient) { }

  private getHeaders() {
    return new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json'

    });

  }



  // Envío las credenciales y me responde si son correctas o no
  login(data: { email: string; password: string }): Observable<any> {

    return this.http.post(`${URL_API}/login.php`, data, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

  }

  // Metodo para obtener los datos del usuario a partir del token almacenado en localStorage
  // busca el token guardado en localStorage, lo decodifica y devuelve el payload con los datos del usuario
  // token split coge la parte del payload del token, lo decodifica de base64 y lo parsea a un objeto JSON
  //y lo convierte de JSON a objeto javascript
  getUserFromToken(): any {
  const token = localStorage.getItem('token');
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload;
  } catch (e) {
    console.error('Token inválido');
    return null;
  }
}

  // Metodo para captar el nombre publico y que se indique al iniciar sesion
  getNombrePublico(): string {
    return localStorage.getItem('nombre') || '';
  }

  // Metodo para verificar si el usuario es admin o no, se llama al backend para verificar el rol del usuario
  isAdmin() {
    return this.http.get(`${URL_API}/permission.php`, { headers: this.getHeaders() });
  }

  // Metodo para cerrar sesion
  logOut(): Observable<any> {
    const body = new FormData();
    const usuario = localStorage.getItem('usuario') || '';
    body.append('user', usuario);

    // Limpieza de localStorage y cookies
    localStorage.clear();

    return this.http.post(`${URL_API}/logout.php`, body)
  }

}
