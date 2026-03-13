import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PermissionService } from '../../services/permission-service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatOption } from "@angular/material/core";
import { MatLabel, MatFormField } from "@angular/material/form-field";
import { MatSelectModule } from "@angular/material/select";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
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
  styleUrl: './rent-page.css',
})

export class RentPage {

  duracionSeleccionada: number = 1;
  tamanioSeleccionado: string = 'pequeño';
  aceptaNormas: boolean = false;
  contratoAbierto: boolean = false;

  codigoPago!: number;
  codigoGeneradoVisible = false;
  trasteroAsignado: number | null = null;

  constructor(
    private router: Router,
    private permissionService: PermissionService,
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
    return !!(localStorage.getItem('token'));
  }

  ngOnInit() {

    if (!this.isLoggedIn) {
      this.showMessage("Debes iniciar sesión para alquilar un trastero", "cerrar");
      this.router.navigate(['/login']);
    }

  }

  // Volver atrás
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

    const usuario = this.login.getUser();

    if (!usuario) {
      this.showMessage("Sesión no válida");
      this.router.navigate(['/login']);
      return;
    }

    // fecha inicio
    const fechaInicio = new Date();

    // fecha fin según duración
    const fechaFin = new Date();
    fechaFin.setMonth(fechaInicio.getMonth() + this.duracionSeleccionada);

    const data = {
      id_usuario: usuario.id_usuario,
      fecha_inicio: fechaInicio.toISOString().slice(0,10),
      fecha_fin: fechaFin.toISOString().slice(0,10)
    };

    this.trasteroService.asignarTrastero(data).subscribe({

      next: (resp:any) => {

        if(resp.success){

          this.codigoPago = resp.codigo;
          this.trasteroAsignado = resp.id_trastero;
          this.codigoGeneradoVisible = true;

        }else{

          this.showMessage(resp.message ?? "No hay trasteros disponibles");

        }

      },

      error: (err) => {

        console.error(err);
        this.showMessage('Error al asignar trastero');

      }

    });

  }

  cerrarCodigo() {

    this.codigoGeneradoVisible = false;

    this.router.navigate(['/']);

  }

}
