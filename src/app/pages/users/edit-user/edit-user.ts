import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Usuario } from '../../../models/usuario';
import { UsersCrud } from '../../../services/users-crud';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-edit-user',
  standalone: true,
  imports: [CommonModule, FormsModule, MatSnackBarModule],
  templateUrl: './edit-user.html',
  styleUrls: ['./edit-user.css'],
})
export class EditUser {

  // creo una variable de tipo input para recibir el usuario que se va a editar desde el componente padre
  // y dos variables de tipo output para emitir eventos al componente padre cuando se guarda un usuario o se cancela la operacion
  @Input() usuario!: Usuario;       // Usuario a editar
  @Output() guardado = new EventEmitter<void>(); // Emitir cuando se guarda
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

  // metodo para guardar los cambios del usuario llamando al servicio de usersCrud
  //  y manejando la respuesta para mostrar mensajes de exito o error
  guardarCambios() {
    if (!this.usuario) return;

    this.usersCrud.updateUsuario(this.usuario).subscribe({
      next: () => {
        this.showMessage('Usuario actualizado correctamente');
        this.guardado.emit();
      },
      error: () => this.showMessage('Error al actualizar usuario', false)
    });
  }

  // metodo para cancelar la edicion y emitir el evento de cancelacion al componente padre
  cancelarEdicion() {
    this.cancel.emit();
  }
}
