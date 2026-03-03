import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PermissionService } from '../../services/permission-service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatOption, MatPseudoCheckbox } from "@angular/material/core";
import { MatLabel, MatFormField } from "@angular/material/form-field";
import { MatSelectModule } from "@angular/material/select";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { FormsModule } from '@angular/forms';






@Component({
  selector: 'app-rent-page',
  imports: [
    MatOption,
    MatLabel,
    MatFormField,
    MatSelectModule,
    MatCheckboxModule,
    FormsModule
],
  templateUrl: './rent-page.html',
  styleUrl: './rent-page.css',
})
export class RentPage {
[x: string]: any;

  duracionSeleccionada: number = 1;
  tamanioSeleccionado: string = 'pequeño';
  aceptaNormas: boolean = false;

  constructor(
    private router: Router,
    private permissionService: PermissionService,
    private snackBar: MatSnackBar
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

  volver() {
    this.router.navigate(['']);
  }

  pagar() {
    if (!this.aceptaNormas) {
    this.snackBar.open('Debes aceptar las normas antes de pagar', 'Cerrar', { duration: 3000 });
    return;
    }

   // this.router.navigate(['/payment']);


  }



}
