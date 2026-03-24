import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormField, MatLabel } from "@angular/material/form-field";
import { MatSelectModule } from "@angular/material/select";
import { MatOption } from "@angular/material/core";
import { MatCheckboxModule } from "@angular/material/checkbox";

import { TrasteroService } from '../../services/trasteroService';
import { LoginService } from '../../services/loginService';

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
export class RentPage {



  duracionSeleccionada: number = 1;
  tamanioSeleccionado: string = 'pequeño';
  aceptaNormas: boolean = false;
  contratoAbierto: boolean = false;

  codigoPago!: number;
  codigoGeneradoVisible = false;
  trasteroAsignado: number | null = null;

  usuario: any = null; // <-- Guardaremos los datos del usuario logueado

  constructor(
    private router: Router,
    private snackBar: MatSnackBar,
    private trasteroService: TrasteroService,
    private login: LoginService
  ) {}

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

    // Obtener los datos completos del usuario desde el backend
    const idUsuario = this.login.getUser()?.id_usuario;
    if (!idUsuario) return;

    this.trasteroService.getUsuario(idUsuario).subscribe({
      next: (userData) => {
        this.usuario = userData;
      },
      error: (err) => {
        console.error(err);
        this.showMessage("No se pudieron cargar los datos del usuario");
      }
    });
  }

  volver() {
    this.router.navigate(['']);
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
          fecha_inicio: fechaInicio.toISOString().slice(0,10),
          fecha_fin: fechaFin.toISOString().slice(0,10),
          precio_mensual_aplicado: trastero.precio,
          estado: 'ocupado'
        };

        this.trasteroService.asignarTrastero(data).subscribe({
          next: (resp: any) => {
            if (resp.success) {
              this.codigoPago = resp.codigo;
              this.trasteroAsignado = resp.id_trastero;
              this.codigoGeneradoVisible = true;
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
    this.router.navigate(['/']);
  }

  goBack() {
    this.router.navigate(['']);
  }
}
