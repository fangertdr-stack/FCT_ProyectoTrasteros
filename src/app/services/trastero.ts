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

  getTrasteros(): Observable<Trastero[]> {
    return this.http.get<Trastero[]>(this.apiUrl);
  }
}
