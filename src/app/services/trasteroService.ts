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
    const token = typeof localStorage !== 'undefined' ? localStorage.getItem('token') : '';

    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  // Traer todos los trasteros
  getTrasteros(): Observable<Trastero[]> {
    return this.http.get<Trastero[]>(this.apiUrl);
  }

  // Actualizar un trastero
  updateTrastero(trastero: Partial<Trastero> & { [key: string]: any }): Observable<any> {
    return this.http.post(`${this.apiUrl}?action=update`, trastero);
  }

  prorrogarAlquiler(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}?action=prorrogar`, data);
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
  return this.http.get<any>(
    `${URL_API}/user.php?id_usuario=${id_usuario}`,
    { headers: this.getHeaders() }
  );
}

  getMisTrasteros(id_usuario: number) {
    return this.http.get<any[]>(
      `${URL_API}/userPage.php?id_usuario=${id_usuario}`, { headers: this.getHeaders() }
    );

  }

  getTrasteroLibre(tamanio: string): Observable<Trastero | null> {
    return this.http.get<Trastero[]>(this.apiUrl).pipe(
      map(trasteros => {
        const tamanioBuscado = tamanio.trim().toLowerCase();

        const libres = trasteros.filter(t => {
          const estado = (t.estado ?? '').trim().toLowerCase();
          const estadoReal = (t.estado_real ?? t.estado ?? '').trim().toLowerCase();
          const tamanioTrastero = (t.tamanio ?? '').trim().toLowerCase();

          return estado === 'libre' && estadoReal === 'libre' && tamanioTrastero === tamanioBuscado;
        });

        return libres.length > 0 ? libres[0] : null;
      })
    );
  }


}
