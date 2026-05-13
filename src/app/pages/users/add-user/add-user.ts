import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Usuario } from '../../../models/usuario';
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

  // creo una variable para almacenar los datos del nuevo usuario que se va a agregar
  // se utiliza Omit para crear un tipo que tiene todas las propiedades de Usuario excepto id_usuario
  // porque el id lo genera el la db con un autoincrementado al crear el usuario y no lo necesitamos en el formulario
  nuevoUsuario: Omit<Usuario, 'id_usuario'> = {
    nombre: '',
    email: '',
    password: '',
    rol: 0,
    dni: '',
    direccion: '',
    telefono: '',
    cif: '',
    razon_social: ''
  };

  // inyecto los servicios necesarios para agregar un usuario y mostrar mensajes
  // Eventos que notifican al componente padre cuando se agrega un usuario o se cancela la operacion
  @Output() agregado = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  constructor(private register: RegisterService, private snackBar: MatSnackBar) { }


  private showMessage(message: string, success: boolean = true) {
    this.snackBar.open(message, 'Cerrar', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: success ? ['snackbar-success'] : ['snackbar-error']
    });
  }

  // metodo para agregar un nuevo usuario llamando al servicio de registro
  //  y manejando la respuesta para mostrar mensajes de exito o error
  agregarUsuario() {
    if (
      !this.nuevoUsuario.nombre.trim() ||
      !this.nuevoUsuario.email.trim() ||
      !this.nuevoUsuario.password.trim() ||
      !this.nuevoUsuario.dni.trim() ||
      !this.nuevoUsuario.telefono.trim()
    ) {
      this.showMessage('Faltan campos obligatorios por rellenar', false);
      return;
    }

    this.register.create(this.nuevoUsuario).subscribe({
      next: () => {
        this.showMessage('Usuario agregado correctamente');
        this.agregado.emit();
        this.nuevoUsuario = { nombre: '', email: '', password: '', dni: '', rol: 0, direccion: '', telefono: '', cif: '', razon_social: '' };
      },
      error: error => {
        console.error('Error al agregar usuario:', error);
        this.showMessage(error?.error?.error ?? 'Error al agregar usuario', false);
      }
    });
  }

  // metodo para cancelar la operacion de agregar un usuario y notifica al componente padre
  cancelar() {
    this.cancel.emit();
  }
}
