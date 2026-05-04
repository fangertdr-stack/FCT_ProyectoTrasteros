import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Trastero } from '../models/trastero';
import { URL_API } from '../../environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TrasteroService {
  private apiUrl = `${URL_API}/trasteros.php`;

  constructor(private http: HttpClient) { }

  private getHeaders() {
    return new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json'
    });
  }

  // Traer todos los trasteros
  getTrasteros(): Observable<Trastero[]> {
    return this.http.get<Trastero[]>(this.apiUrl);
  }

  // Actualizar un trastero
  updateTrastero(trastero: Trastero): Observable<any> {
    return this.http.post(`${this.apiUrl}?action=update`, trastero);
  }

  // Traer usuarios para asignar trasteros
  getUsuarios(): Observable<any[]> {
    return this.http.get<any[]>(`${URL_API}/user.php`, { headers: this.getHeaders() });
  }

  // Asignar un trastero a un usuarioS
  asignarTrastero(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  liberarTrastero(id_trastero: number) {
    return this.http.delete(`${this.apiUrl}`, {
      body: { id_trastero }
    });

  }

  // Traer un usuario por id
  getUsuario(id_usuario: number): Observable<any> {
    return this.http.get<any>(`${URL_API}/user.php?id_usuario=${id_usuario}`, { headers: this.getHeaders() });
  }

  getMisTrasteros(id_usuario: number) {
    return this.http.get<any[]>(
      `${URL_API}/userPage.php?id_usuario=${id_usuario}`, { headers: this.getHeaders() }
    );

  }

  getTrasteroLibre(tamanio: string): Observable<Trastero | null> {
    return this.http.get<Trastero[]>(this.apiUrl).pipe(
      map(trasteros => {
        const libres = trasteros.filter(t => {
          const estadoReal = t.estado_real ?? t.estado;
          return estadoReal === 'libre' && t.tamanio === tamanio;
        });

        return libres.length > 0 ? libres[0] : null;
      })
    );
  }


}
