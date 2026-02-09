import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSnackBar,MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Auth, signOut } from '@angular/fire/auth';
import { Trastero } from '../../models/trastero';


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
export class MainPage {

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

  startDate: Date | null = null;
  endDate: Date | null = null;

  login(){
    this.router.navigate(['/login']);
  }

  get isLoggedIn(): boolean {
    return !!this.auth.currentUser;
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
  // Aqui se comprueba  si hay un usuario logueado
  if (this.auth.currentUser) {
    // si hay usuario, se cierra la sesión
    signOut(this.auth)
      .then(() => {
        this.snackBar.open('Cierre de sesión exitoso', 'Cerrar', { duration: 3000 });
        //this.router.navigate(['/login']); // Redirige al login
      })
      .catch(err => {
        console.error('Error al cerrar sesión:', err);
        this.snackBar.open('Error al cerrar sesión', 'Cerrar', { duration: 3000 });
      });
  } else {
    // Si no hay usuario, avisar y redirigir
    this.snackBar.open('No hay sesión iniciada', 'Cerrar', { duration: 3000 });
    this.router.navigate(['/login']);
  }
}

}
