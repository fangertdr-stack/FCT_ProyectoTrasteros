import { Injectable } from '@angular/core';
import { firstValueFrom,Observable,of } from 'rxjs';
import { URL_API } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID,inject } from '@angular/core';


@Injectable({
  providedIn: 'root',
})
export class PermissionService {

<<<<<<< HEAD

  private platformId = inject(PLATFORM_ID);

=======
>>>>>>> 5ed046ca9e184f1e192f711b7927d3ffd21b6e65
  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    if (!isPlatformBrowser(this.platformId)) {
      return new HttpHeaders({ 'Content-Type': 'application/json' });
    }

    const token = localStorage.getItem('token') ?? '';
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    if (token) headers = headers.set('Authorization', `Bearer ${token}`);
    return headers;
  }

  isAdmin(): Observable<boolean> {
  return this.http
    .get<any>(`${URL_API}/permission.php`, { headers: this.getHeaders() })
    .pipe(
      map(res => {
        console.log('📩 permission.php response:', res);
        return res?.ok === true && res?.data?.is_admin === true;
      })
    );
}

}
