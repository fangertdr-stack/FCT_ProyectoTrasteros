import { Component, OnInit, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import { Trastero } from '../../models/trastero';
import { NavigationService } from '../../services/navigation';

@Component({
  selector: 'app-main-page',
  imports: [
    FormsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule
  ],
  templateUrl: './main-page.html',
  styleUrl: './main-page.css',
})
export class MainPage implements OnInit {

  nombrePublico: string = '';
  private token: string = '';

  trasteroSeleccionado: Trastero | null = null;

  // 🔥 PROGRESO DE ANIMACIÓN (0 cerrado - 1 abierto)
  openProgress = 0;

  constructor(
    private snackBar: MatSnackBar,
    private router: Router,
    private auth: Auth,
    private nav: NavigationService,
  ) {}

  ngOnInit(): void {
    if (!this.isBrowser()) return;

    this.token = localStorage.getItem('token') ?? '';
    this.nombrePublico = localStorage.getItem('nombre') ?? '';
  }

@HostListener('window:scroll', [])
onScroll(): void {

  const section = document.querySelector('.transition-section');
  if (!section) return;

  const rect = section.getBoundingClientRect();
  const windowHeight = window.innerHeight;

  const target = 1 - (rect.top / windowHeight);

  const clampedTarget = Math.max(0, Math.min(1, target));

  // suavizado tipo cámara
  this.openProgress += (clampedTarget - this.openProgress) * 0.12;
}

  // ---------------- NAV ----------------

  login() { this.router.navigate(['/login']); }
  admin() { this.router.navigate(['/admin']); }
  rent() { this.router.navigate(['/rent']); }
  contact() { this.router.navigate(['/contact']); }

  get isLoggedIn(): boolean {
    if (!this.isBrowser()) return false;
    return !!localStorage.getItem('token');
  }

  logout() {
    if (!this.isBrowser()) return;

    localStorage.clear();

    this.snackBar.open('Cierre de sesión exitoso', 'Cerrar', {
      duration: 3000
    });
  }

  isAdmin(): boolean {
    if (!this.isBrowser()) return false;
    return localStorage.getItem('rol') === 'admin';
  }

  contratar() { this.nav.goTo('rent'); }
  mediano() { this.nav.goTo('mediano'); }
  grande() { this.nav.goTo('grande'); }
  pequeno() { this.nav.goTo('pequeno'); }
  userPage() { this.nav.goTo('user-page'); }

  private isBrowser(): boolean {
    return typeof window !== 'undefined';
  }
}