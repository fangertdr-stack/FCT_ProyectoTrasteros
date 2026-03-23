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

  @Input() usuario!: Usuario;       // Usuario a eliminar
  @Output() eliminado = new EventEmitter<void>(); // Emitir cuando se elimina
  @Output() cancel = new EventEmitter<void>();   // Emitir cuando se cancela

  constructor(private usersCrud: UsersCrud, private snackBar: MatSnackBar) {}

  private showMessage(message: string, success: boolean = true) {
    this.snackBar.open(message, 'Cerrar', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: success ? ['snackbar-success'] : ['snackbar-error']
    });
  }

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

  cancelar() {
    this.cancel.emit();
  }
}
