import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Usuario } from '../../../models/usuario';
import { UsersCrud } from '../../../services/users-crud';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { NavigationService } from '../../../services/navigation';
import { FormsModule } from '@angular/forms';
import { MatSnackBar, } from '@angular/material/snack-bar';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NgZone } from '@angular/core';

@Component({
  selector: 'app-list-user',
  standalone: true,
  imports: [CommonModule, FormsModule, MatSnackBarModule],
  templateUrl: './list-user.html',
  styleUrls: ['./list-user.css'],
  providers: [UsersCrud]
})
export class ListUser implements OnInit {

  usuario: Usuario[] = [];

  constructor(private usersCrud: UsersCrud,
              private router: Router,
              private navigate: NavigationService,
              private snackBar: MatSnackBar,
              private zone: NgZone
  ) {} // solo el servicio

  usuario$: Observable<Usuario[]> | undefined;
  usuarioEditando!: Usuario | null; // Usuario actualmente en edición
  editVisible = false;

  ngOnInit(): void {
    this.usuario$ = this.usersCrud.getUsuarios();
  }

private showMessage(message: string, success: boolean = true): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: success ? ['snackbar-success'] : ['snackbar-error']
    });
  }

  volver() {
    this.navigate.goTo('/admin');
  }

 editarUsuario(user: Usuario) {
    this.usuarioEditando = { ...user }; // Copia para no modificar directamente la lista
    this.editVisible = true;            // Mostrar formulario
  }

  guardarCambios() {
  if (!this.usuarioEditando) return;

  const usuarioParaActualizar = { ...this.usuarioEditando };

  // Cerrar modal inmediatamente
  this.editVisible = false;
  this.usuarioEditando = null;

  // Actualizar backend
  this.usersCrud.updateUsuario(usuarioParaActualizar).subscribe({
    next: () => {
      alert('Usuario actualizado correctamente');
      // Refrescar lista de usuarios
      this.usuario$ = this.usersCrud.getUsuarios();
    },
    error: () => {
      alert('Error al actualizar el usuario');
    }
  });
}

  cancelarEdicion() {
    this.usuarioEditando = null;
    this.editVisible = false;
  }

}
