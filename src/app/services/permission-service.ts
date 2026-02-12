import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { URL_API } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class PermissionService {
  
  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json'
    });
  }

  async isAdmin(): Promise<any> {
    return await firstValueFrom(this.http.get(`${URL_API}/permission.php`, { headers: this.getHeaders() }));
  }

}
