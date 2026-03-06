import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { URL_API } from '../../environments/environment.prod';


@Injectable({
  providedIn: 'root',
})
export class RegisterService {

  constructor(private http: HttpClient) {}

  private getHeaders(authenticated: boolean = false) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    if (authenticated) {
      return headers.set('Authorization', `Bearer ${localStorage.getItem('token')}`);
    }
    return headers;
  }

  register(): Observable<any> {
    return this.http.post(`${URL_API}/register.php`, {}, { headers: this.getHeaders(false) });
  }

  create(data: {nombre: string; email: string; password: string; dni?: string; telefono?: string; direccion?: string}): Observable<any> {
    // Construir payload solo con campos que tienen valor
    const payload: any = {
      nombre: data.nombre,
      email: data.email,
      password: data.password
    };

    // Agregar campos opcionales solo si tienen valor
    if (data.dni && data.dni.trim()) {
      payload.dni = data.dni.trim();
    }
    if (data.telefono && data.telefono.trim()) {
      payload.telefono = data.telefono.trim();
    }
    if (data.direccion && data.direccion.trim()) {
      payload.direccion = data.direccion.trim();
    }

    console.log('Enviando registro:', payload);

    return this.http.post(`${URL_API}/register.php`, payload, {
      headers: this.getHeaders(false)
    });
  }
}
