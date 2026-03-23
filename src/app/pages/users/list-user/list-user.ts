import { Component, OnInit, NgZone, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { Usuario } from '../../../models/usuario';
import { UsersCrud } from '../../../services/users-crud';
import { NavigationService } from '../../../services/navigation';
import { TrasteroService } from '../../../services/trasteroService';
import { Observable } from 'rxjs';
import { EditUser } from '../edit-user/edit-user';
import { DeleteUser } from '../delete-user/delete-user';
import { AddUser } from '../add-user/add-user';

@Component({
  selector: 'app-list-user',
  standalone: true,
  imports: [CommonModule, FormsModule, MatSnackBarModule, EditUser,  DeleteUser, AddUser],
  templateUrl: './list-user.html',
  styleUrls: ['./list-user.css'],
})
export class ListUser implements OnInit {

  usuario$: Observable<Usuario[]> | undefined;
  usuarioEditando!: Usuario | null;
  editVisible = false;
  usuarioEliminando!: Usuario | null;
eliminarVisible = false;
agregarVisible = false;

  constructor(
    private usersCrud: UsersCrud,
    private router: Router,
    private navigate: NavigationService,
    private snackBar: MatSnackBar,
    private zone: NgZone,
    private trasteroService: TrasteroService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cargarUsuarios() {
    this.usuario$ = this.usersCrud.getUsuarios();
  }

  showMessage(message: string, success: boolean = true) {
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

  abrirAgregarUsuario() {
  this.agregarVisible = true;
}

onUsuarioAgregado() {
  this.agregarVisible = false;
  this.cargarUsuarios();
}

cancelarAgregar() {
  this.agregarVisible = false;
}

  editarUsuario(user: Usuario) {
    this.usuarioEditando = { ...user };
    this.editVisible = true;
  }

  onUsuarioGuardado() {
    this.editVisible = false;
    this.usuarioEditando = null;
    this.cargarUsuarios();
  }

  cancelarEdicion() {
    this.editVisible = false;
    this.usuarioEditando = null;
  }

 // Abrir modal de eliminación
abrirEliminarUsuario(user: Usuario) {
  this.usuarioEliminando = { ...user };
  this.eliminarVisible = true;
}

// Evento emitido desde DeleteUser
onUsuarioEliminado() {
  this.eliminarVisible = false;
  this.usuarioEliminando = null;
  this.cargarUsuarios(); // Refrescar la lista
}

cancelarEliminar() {
  this.eliminarVisible = false;
  this.usuarioEliminando = null;
}
}
