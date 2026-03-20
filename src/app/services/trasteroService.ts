import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Trastero } from '../models/trastero';
import { URL_API } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TrasteroService {
  private apiUrl = `${URL_API}/trasteros.php`;

  constructor(private http: HttpClient) {}

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
    return this.http.get<any[]>(`${URL_API}/user.php`);
  }

  // Asignar un trastero a un usuarioS


  asignarTrastero(data:any): Observable<any>{
  return this.http.post(this.apiUrl, data);
  }

  liberarTrastero(id_trastero: number) {
  return this.http.delete(`${this.apiUrl}`, {
    body: { id_trastero }
  });

  }

  getMisTrasteros(id_usuario: number) {
  return this.http.get<any[]>(
    `${URL_API}/userPage.php?id_usuario=${id_usuario}`
  );
  
  }
}
