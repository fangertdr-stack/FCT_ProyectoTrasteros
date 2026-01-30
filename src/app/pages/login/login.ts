import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import {
  Auth,
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from '@angular/fire/auth';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {

  // Campos
  name = '';
  email = '';
  password = '';
  confirmPassword = '';

  // Estados
  isRegister = false;
  registerStep = 1;
  showPassword = false;
  loading = false;
  errorMessage = '';

  constructor(private auth: Auth) {}

  // Volver atrás
  goBack() {
    window.history.back();
  }

  // Google login
  loginGoogle() {
    const provider = new GoogleAuthProvider();

    this.loading = true;
    this.errorMessage = '';

    signInWithPopup(this.auth, provider)
      .then(() => this.loading = false)
      .catch(err => this.handleError(err));
  }

  // Mostrar / ocultar contraseña
  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  // Cambiar login / registro
  toggleMode() {
    this.isRegister = !this.isRegister;
    this.registerStep = 1;
    this.errorMessage = '';
  }

  // Paso 1 registro → continuar
  nextRegisterStep() {

    if (!this.name || !this.email) {
      this.errorMessage = 'Completa nombre y correo';
      return;
    }

    this.errorMessage = '';
    this.registerStep = 2;
  }

  // Enviar (login o registro final)
  submit() {

    this.errorMessage = '';

    // LOGIN
    if (!this.isRegister) {

      if (!this.email || !this.password) {
        this.errorMessage = 'Completa todos los campos';
        return;
      }

      this.loading = true;

      signInWithEmailAndPassword(this.auth, this.email, this.password)
        .then(() => this.loading = false)
        .catch(err => this.handleError(err));

      return;
    }

    // REGISTRO PASO 2

    if (!this.password || !this.confirmPassword) {
      this.errorMessage = 'Completa las contraseñas';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Las contraseñas no coinciden';
      return;
    }

    this.loading = true;

    createUserWithEmailAndPassword(this.auth, this.email, this.password)
      .then(() => {
        this.loading = false;
          
        // Aca se guarda el nombre en la base de datos si es necesario
      })
      .catch(err => this.handleError(err));
  }

  // Errores amigables
  handleError(err: any) {

    this.loading = false;

    if (err.code?.includes('weak-password')) {
      this.errorMessage = 'Contraseña muy débil';
    }
    else if (err.code?.includes('email-already')) {
      this.errorMessage = 'Ese correo ya está registrado';
    }
    else if (err.code?.includes('user-not-found')) {
      this.errorMessage = 'Usuario no encontrado';
    }
    else if (err.code?.includes('wrong-password')) {
      this.errorMessage = 'Contraseña incorrecta';
    }
    else if (err.code?.includes('email')) {
      this.errorMessage = 'Correo inválido';
    }
    else {
      this.errorMessage = 'Error al autenticar';
    }
  }
}
