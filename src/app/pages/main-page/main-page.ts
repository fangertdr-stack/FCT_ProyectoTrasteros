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
import { URL_BASE } from '../../../environments/environment';



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




  trasteros: Trastero[] = [
    {
      id_trastero: 1,
      codigo: 'T01',
      estado: 'OCUPADO',
      precio: 30,
      tamanio: 'PEQUEÑO',
      usuario: 'usuario1'
    },
    {
      id_trastero: 2,
      codigo: 'T02',
      estado: 'LIBRE',
      precio: 40,
      tamanio: 'MEDIANO',
    },
    {
      id_trastero: 3,
      codigo: 'T03',
      estado: 'OCUPADO',
      precio: 50,
      tamanio: 'GRANDE',
      usuario: 'usuario2'
    }
  ];

  trasteroSeleccionado: Trastero | null = null;

  constructor(
              private snackBar: MatSnackBar,
              private router: Router,
              private auth: Auth,

  ) {}
  ngOnInit(): void {
    if (!this.isBrowser()) return;
    this.token = localStorage.getItem('token') ?? '';
    this.nombrePublico = localStorage.getItem('nombre_publico') ?? '';
  }

  startDate: Date | null = null;
  endDate: Date | null = null;



  login(){

    this.router.navigate(['/login']);
  }

  admin(){
    this.router.navigate(['/admin']);
  }

  rent() {
    this.router.navigate(['/rent']);
  }


  get isLoggedIn(): boolean {
    if (!this.isBrowser()) return false;
    return !!(localStorage.getItem('token'));
  }

  // funcion para mostrar fechas seleccionadas
  showDates() {
    if (this.startDate && this.endDate) {
      this.snackBar.open(`Inicio: ${this.startDate.toLocaleDateString()}\nFin: ${this.endDate.toLocaleDateString()}`);
    } else {
      this.snackBar.open('Selecciona ambas fechas');
    }
  }

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

}
