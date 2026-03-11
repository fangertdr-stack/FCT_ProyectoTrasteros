import { UsersCrud } from './../../services/users-crud';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PermissionService } from '../../services/permission-service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatOption, MatPseudoCheckbox } from "@angular/material/core";
import { MatLabel, MatFormField } from "@angular/material/form-field";
import { MatSelectModule } from "@angular/material/select";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TrasteroService } from '../../services/trasteroService';
import { Trastero } from '../../models/trastero';
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
[x: string]: any;

  duracionSeleccionada: number = 1;
  tamanioSeleccionado: string = 'pequeño';
  aceptaNormas: boolean = false;
  contratoAbierto: boolean = false;

  constructor(
    private router: Router,
    private permissionService: PermissionService,
    private snackBar: MatSnackBar,
    private trasteroService: TrasteroService,
    private login:LoginService,
    private permission: PermissionService

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
  // Metodo para volver a la pagina anterior
  volver() {
    this.router.navigate(['']);
  }



  codigoPago!: number;
  codigoGeneradoVisible = false;

generarCodigo(){

  // genero codigo aleatorio de 6 cifras
 this.codigoPago = Math.floor(100000 + Math.random() * 900000);

  //muestra el codigo generado
 this.codigoGeneradoVisible = true;
}

trasteroAsignado!: Trastero | null;

asignarTrasteroRandom(id_usuario: number, fecha_inicio: string, fecha_fin: string) {
  this.trasteroService.getTrasteros().subscribe({
    next: (trasteros: Trastero[]) => {
      const libres = trasteros.filter(t => t.estado === 'libre');
      if (libres.length === 0) {
        console.log('No hay trasteros libres');
        this.trasteroAsignado = null;
        return;
      }

      // Elegir uno aleatorio
      const indiceRandom = Math.floor(Math.random() * libres.length);
      this.trasteroAsignado = libres[indiceRandom];

      // Crear el alquiler en el backend
      const data = {
        id_usuario,
        id_trastero: this.trasteroAsignado.id_trastero,
        fecha_inicio,
        fecha_fin
      };

      this.trasteroService.asignarTrastero(data).subscribe({
        next: () => {
          console.log('Trastero asignado y actualizado:', this.trasteroAsignado);
        },
        error: (err) => console.error('Error al asignar trastero:', err)
      });
    },
    error: (err) => console.error('Error al traer trasteros:', err)
  });
}

pagar() {
  // Validaciones
  if (!this.contratoAbierto) {
    this.snackBar.open('Debes leer el contrato antes de pagar', 'Cerrar', { duration: 3000 });
    return;
  }

  if (!this.aceptaNormas) {
    this.snackBar.open('Debes marcar la casilla de aceptación', 'Cerrar', { duration: 3000 });
    return;
  }

  //this.asignarTrasteroRandom()

  this.generarCodigo()


}

// Cerrar modal
cerrarCodigo() {
  this.codigoGeneradoVisible = false;
  // redirigir después de cerrar modal
  this.router.navigate(['/']);
}



}
