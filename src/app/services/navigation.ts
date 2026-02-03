import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class NavigationService {

  constructor(private router: Router) {}

  goBack() {
    window.history.back();
  }

  goTo(path: string) {
    this.router.navigate([path]);
  }
}
