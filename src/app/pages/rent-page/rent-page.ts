import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormField, MatLabel } from "@angular/material/form-field";
import { MatSelectModule } from "@angular/material/select";
import { MatOption } from "@angular/material/core";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { ActivatedRoute } from '@angular/router';
import { TrasteroService } from '../../services/trasteroService';
import { LoginService } from '../../services/loginService';
import { NavigationService } from '../../services/navigation';

@Component({
  selector: 'app-rent-page',
  imports: [
    MatOption,
    MatLabel,
    MatFormField,
    MatSelectModule,
    MatCheckboxModule,
    FormsModule,
    CommonModule
  ],
  templateUrl: './rent-page.html',
  styleUrls: ['./rent-page.css']
})
export class RentPage implements OnInit {



  duracionSeleccionada: number = 1;
  tamanioSeleccionado: string = 'pequeño';
  aceptaNormas: boolean = false;
  contratoAbierto: boolean = false;

  codigoPago!: number;
  codigoGeneradoVisible = false;
  trasteroAsignado: number | null = null;

  usuario: any = null; // <-- Guardaremos los datos del usuario logueado

  // Propiedades para el formulario
  nombre: string = '';
  apellidos: string = ''; // Si no hay apellidos separados, usar parte del nombre
  dni: string = '';
  direccion: string = '';
  telefono: string = '';
  email: string = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private trasteroService: TrasteroService,
    private login: LoginService,
    private nav: NavigationService,
    private cdr: ChangeDetectorRef,

  ) { }

  showMessage(message: string, action: string = 'Cerrar'): void {
    this.snackBar.open(message, action, {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: ['snackbar-error']
    });
  }

  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }

  get isLoggedIn(): boolean {
    if (!this.isBrowser()) return false;
    return !!localStorage.getItem('token');
  }

  ngOnInit() {
    if (!this.isLoggedIn) {
      this.showMessage("Debes iniciar sesión para alquilar un trastero");
      this.router.navigate(['/login']);
      return;
    }

    this.route.queryParams.subscribe(params => {
    if (params['tamanio']) {
      this.tamanioSeleccionado = params['tamanio'];
    }
  });

    // Setear el nombre inmediatamente desde localStorage
    this.nombre = this.login.getNombrePublico();
    this.cdr.detectChanges();

    // Obtener los datos completos del usuario desde el backend
    const token = localStorage.getItem('token');

console.log('TOKEN RAW:', token);
console.log('DECODE:', this.login.getUserFromToken());

const user = this.login.getUserFromToken();
const idUsuario = user?.id_usuario;

console.log('ID desde JWT:', idUsuario);

   this.trasteroService.getUsuario(idUsuario).subscribe({
  next: (res) => {

    console.log('ID usuario:', idUsuario);
    console.log('Respuesta backend:', res);

    // ❌ CONTROL CORRECTO DEL BACKEND
    if (!res || res.success === false) {
      console.warn('Usuario no encontrado:', res);
      return;
    }

    const data = res.data;

    this.usuario = data;

    this.nombre = data.nombre || '';
    this.dni = data.dni || '';
    this.direccion = data.direccion || '';
    this.telefono = data.telefono || '';
    this.email = data.email || '';

    this.cdr.detectChanges();
  },

  error: (err) => {
    console.error(err);
    this.showMessage("No se pudieron cargar los datos del usuario");
  }
});
  }



  pagar() {
    if (!this.contratoAbierto) {
      this.showMessage('Debes leer el contrato antes de pagar');
      return;
    }

    if (!this.aceptaNormas) {
      this.showMessage('Debes aceptar las normas');
      return;
    }

    if (!this.usuario) {
      this.showMessage("Sesión no válida");
      this.router.navigate(['/login']);
      return;
    }

    // Pedir un trastero libre del tamaño seleccionado
    this.trasteroService.getTrasteroLibre(this.tamanioSeleccionado).subscribe({
      next: (trastero) => {
        if (!trastero || !trastero.id_trastero) {
          this.showMessage("No hay trasteros libres de este tamaño");
          return;
        }

        const fechaInicio = new Date();
        const fechaFin = new Date();
        fechaFin.setMonth(fechaInicio.getMonth() + this.duracionSeleccionada);

        const data = {
          id_trastero: trastero.id_trastero,
          id_usuario: this.usuario.id_usuario,
          nombre: this.usuario.nombre,
          telefono: this.usuario.telefono,
          email: this.usuario.email,
          fecha_inicio: fechaInicio.toISOString().slice(0, 10),
          fecha_fin: fechaFin.toISOString().slice(0, 10),
          precio_mensual_aplicado: trastero.precio,
          estado: 'ocupado'
        };

        this.trasteroService.asignarTrastero(data).subscribe({
          next: (resp: any) => {
            if (resp.success) {
              this.showMessage('Trastero alquilado con éxito');
              this.nav.goTo('/');
            } else {
              this.showMessage(resp.message ?? "Error al asignar trastero");
            }
          },
          error: (err) => {
            console.error(err);
            this.showMessage('Error al asignar trastero');
          }
        });
      },
      error: (err) => {
        console.error(err);
        this.showMessage('Error al consultar trasteros libres');
      }
    });
  }


  cerrarCodigo() {
    this.codigoGeneradoVisible = false;
    this.nav.goTo('/');
  }

  goBack() {
    this.nav.goTo('/');
  }
}
