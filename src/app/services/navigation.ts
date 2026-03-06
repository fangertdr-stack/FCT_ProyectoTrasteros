import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class NavigationService {

  constructor(private router: Router) {}

  // Metodo para volver a la pagina anterior
  goBack() {
    window.history.back();
  }

  // Metodo para navegar a una ruta especifica
  goTo(path: string) {
    this.router.navigate([path]);
  }
}
