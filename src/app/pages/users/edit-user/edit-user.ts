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

  @Input() usuario!: Usuario;       // Usuario a editar
  @Output() guardado = new EventEmitter<void>(); // Emitir cuando se guarda
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

  guardarCambios() {
    if (!this.usuario) return;

    this.usersCrud.updateUsuario(this.usuario).subscribe({
      next: () => {
        this.showMessage('Usuario actualizado correctamente');
        this.guardado.emit(); // Avisamos al componente padre
      },
      error: () => this.showMessage('Error al actualizar usuario', false)
    });
  }

  cancelarEdicion() {
    this.cancel.emit();
  }
}
