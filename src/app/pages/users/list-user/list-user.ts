import { Component, OnInit, NgZone, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Usuario } from '../../../models/usuario';
import { UsersCrud } from '../../../services/users-crud';
import { NavigationService } from '../../../services/navigation';
import { Observable } from 'rxjs';
import { EditUser } from '../edit-user/edit-user';
import { DeleteUser } from '../delete-user/delete-user';
import { AddUser } from '../add-user/add-user';

@Component({
  selector: 'app-list-user',
  standalone: true,
  imports: [CommonModule, FormsModule, MatSnackBarModule, EditUser, DeleteUser, AddUser],
  templateUrl: './list-user.html',
  styleUrls: ['./list-user.css'],
})
export class ListUser implements OnInit {

  // creo variables para almacenar los usuarios obtenidos del servicio
  // el usuario que se esta editando o eliminando
  // y el estado de visibilidad de los modales de edicion y eliminacion

  // usuario$ es un observable que emite la lista de usuarios obtenida del servicio de usersCrud
  usuario$: Observable<Usuario[]> | undefined;
  usuarioEditando!: Usuario | null;
  editVisible = false;
  usuarioEliminando!: Usuario | null;
  eliminarVisible = false;
  agregarVisible = false;

  constructor(
    private usersCrud: UsersCrud,
    private navigate: NavigationService,
    private snackBar: MatSnackBar,
  ) { }

  // metodo que se ejecuta al iniciar el componente
  //  y llama al metodo para cargar los usuarios
  ngOnInit(): void {
    this.cargarUsuarios();
  }

  // metodo para cargar los usuarios llamando al servicio de usersCrud
  // y asignando el resultado al observable usuario$
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

  // metodo para volver a la pagina de admin utilizando el servicio de navigation
  volver() {
    this.navigate.goTo('/admin');
  }

  // Abrir modal de agregar usuario
  abrirAgregarUsuario() {
    this.agregarVisible = true;
  }

  // se ejecuta cuando se ha aniadido un usuario nuevo
  //  y cierra el modal de agregar usuario y recarga la lista de usuarios
  onUsuarioAgregado() {
    this.agregarVisible = false;
    this.cargarUsuarios();
  }

  // metodo para cancelar la operacion de agregar usuario y cerrar el modal
  cancelarAgregar() {
    this.agregarVisible = false;
  }


  // Abrir modal de edición de usuario
  editarUsuario(user: Usuario) {
    this.usuarioEditando = { ...user };
    this.editVisible = true;
  }

  //este metodo se ejecuta cuando s etermina de guardar la edicion de un usuario
  onUsuarioGuardado() {
    this.editVisible = false;
    this.usuarioEditando = null;
    this.cargarUsuarios();
  }

  // metodo para cancelar la edicion y cerrar el modal de edicion
  cancelarEdicion() {
    this.editVisible = false;
    this.usuarioEditando = null;
  }

  // abre el modal de eliminacion d euser
  abrirEliminarUsuario(user: Usuario) {
    this.usuarioEliminando = { ...user };
    this.eliminarVisible = true;
  }

  // Evento emitido desde DeleteUser y refresca la lista
  onUsuarioEliminado() {
    this.eliminarVisible = false;
    this.usuarioEliminando = null;
    this.cargarUsuarios();
  }

  // metodo para cancelar la eliminacion y cerrar el modal de eliminacion
  cancelarEliminar() {
    this.eliminarVisible = false;
    this.usuarioEliminando = null;
  }
}
