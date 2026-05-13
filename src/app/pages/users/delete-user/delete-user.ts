import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Usuario } from '../../../models/usuario';
import { UsersCrud } from '../../../services/users-crud';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-delete-user',
  standalone: true,
  imports: [CommonModule, MatSnackBarModule],
  templateUrl: './delete-user.html',
  styleUrls: ['./delete-user.css'],
})
export class DeleteUser {

  // creo una variable de tipo input para recibir el usuario que se va a eliminar desde el componente padre
  // y dos variables de tipo output para emitir eventos al componente padre cuando se elimina un usuario o se cancela la operacion
  @Input() usuario!: Usuario;       // Usuario a eliminar
  @Output() eliminado = new EventEmitter<void>(); // Emitir cuando se elimina
  @Output() cancel = new EventEmitter<void>();   // Emitir cuando se cancela

  constructor(private usersCrud: UsersCrud, private snackBar: MatSnackBar) { }

  private showMessage(message: string, success: boolean = true) {
    this.snackBar.open(message, 'Cerrar', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: success ? ['snackbar-success'] : ['snackbar-error']
    });
  }

  // metodo para confirmar la eliminacion del usuario llamando al servicio de usersCrud
  //  y manejando la respuesta para mostrar mensajes de exito o error
  confirmarEliminacion() {
    if (!this.usuario) return;

    this.usersCrud.deleteUsuario(this.usuario.id_usuario).subscribe({
      next: () => {
        this.showMessage('Usuario eliminado correctamente');
        this.eliminado.emit();
      },
      error: () => this.showMessage('Error al eliminar el usuario', false)
    });
  }

  // metodo para cancelar la eliminacion y emitir el evento de cancelacion al componente padre
  cancelar() {
    this.cancel.emit();
  }
}
