import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSnackBar,MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Auth, signOut } from '@angular/fire/auth';
import { Trastero } from '../../models/trastero';
import { NavigationService } from '../../services/navigation';

@Component({
  selector: 'app-main-page',

  imports: [ FormsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule],
  templateUrl: './main-page.html',
  styleUrl: './main-page.css',
})
export class MainPage implements OnInit {

  nombrePublico: string = '';
  private token: string = '';

  // Ejemplo de trasteros

  // trasteros: Trastero[] = [
  //   {
  //     id_trastero: 1,
  //     codigo: 'T01',
  //     estado: 'OCUPADO',
  //     precio: 30,
  //     tamanio: 'PEQUEÑO',
  //     usuario: 'usuario1'
  //   },
  //   {
  //     id_trastero: 2,
  //     codigo: 'T02',
  //     estado: 'LIBRE',
  //     precio: 40,
  //     tamanio: 'MEDIANO',
  //   },
  //   {
  //     id_trastero: 3,
  //     codigo: 'T03',
  //     estado: 'OCUPADO',
  //     precio: 50,
  //     tamanio: 'GRANDE',
  //     usuario: 'usuario2'
  //   }
  // ];

  trasteroSeleccionado: Trastero | null = null;

  constructor(
              private snackBar: MatSnackBar,
              private router: Router,
              private auth: Auth,
              private nav: NavigationService,

  ) {}
  ngOnInit(): void {
    if (!this.isBrowser()) return;
    this.token = localStorage.getItem('token') ?? '';
    this.nombrePublico = localStorage.getItem('nombre_publico') ?? '';
  }

  startDate: Date | null = null;
  endDate: Date | null = null;

  // Metodo para navegar a la pagina de login
  login(){
    this.router.navigate(['/login']);
  }

  // Metodo para navegar a la pagina de admin
  admin(){
    this.router.navigate(['/admin']);
  }

  // Metodo para navegar a la pagina de alquiler
  rent() {
    this.router.navigate(['/rent']);
  }

  get isLoggedIn(): boolean {
    if (!this.isBrowser()) return false;
    return !!(localStorage.getItem('token'));
  }

  // Funcion para mostrar fechas seleccionadas
  showDates() {
    if (this.startDate && this.endDate) {
      this.snackBar.open(`Inicio: ${this.startDate.toLocaleDateString()}\nFin: ${this.endDate.toLocaleDateString()}`);
    } else {
      this.snackBar.open('Selecciona ambas fechas');
    }
  }

  // Metodo para cerrar sesion
  logout() {
    if (!this.isBrowser()) return;
  localStorage.removeItem('token');
  localStorage.removeItem('usuario');
  localStorage.removeItem('nombre_publico');
  localStorage.removeItem('rol');

  this.snackBar.open('Cierre de sesión exitoso', 'Cerrar', { duration: 3000 });
  // this.router.navigate(['/login']);
  }

  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }

  isAdmin(): boolean {
    if (!this.isBrowser()) return false;
    const rol = localStorage.getItem('rol');
    return rol === 'admin';
  }

  contratar() {
      this.nav.goTo('rent');
  }

}
