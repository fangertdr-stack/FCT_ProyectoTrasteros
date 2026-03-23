import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Usuario } from '../../../models/usuario';
import { UsersCrud } from '../../../services/users-crud';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RegisterService } from '../../../services/registerService';

@Component({
  selector: 'app-add-user',
  standalone: true,
  imports: [CommonModule, FormsModule, MatSnackBarModule],
  templateUrl: './add-user.html',
  styleUrls: ['./add-user.css']
})
export class AddUser {

  nuevoUsuario: Omit<Usuario, 'id_usuario'> = {
    nombre: '',
    email: '',
    password: '',
    rol: 0,
    dni: '',
    direccion: '',
    telefono: ''
  };

  @Output() agregado = new EventEmitter<void>(); // Avisar al padre
  @Output() cancel = new EventEmitter<void>();

  constructor(private register: RegisterService, private snackBar: MatSnackBar) {}

  private showMessage(message: string, success: boolean = true) {
    this.snackBar.open(message, 'Cerrar', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: success ? ['snackbar-success'] : ['snackbar-error']
    });
  }

  agregarUsuario() {
    this.register.create(this.nuevoUsuario).subscribe({
      next: () => {
        this.showMessage('Usuario agregado correctamente');
        this.agregado.emit();
        this.nuevoUsuario = { nombre:'', email:'', password:'', dni:'', rol:0, direccion:'', telefono:'' }; // reset
      },
      error: () => this.showMessage('Error al agregar usuario', false)
    });
  }

  cancelar() {
    this.cancel.emit();
  }
}
