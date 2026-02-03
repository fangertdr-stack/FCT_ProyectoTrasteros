import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { NavigationService } from '../../services/navigation';
import { Login } from '../../services/login';

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
  imports: [
    FormsModule,
    MatSnackBarModule,
    
  ],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {

  // Campos
  name = '';
  email = '';
  dni = '';
  password = '';
  confirmPassword = '';
  telefono = '';
  direccion = '';

  // Estados
  isRegister = false;
  registerStep = 1;
  showPassword = false;
  loading = false;
  errorMessage = '';
  isAdmin = false; 

  constructor(private auth: Auth,
              private snackBar: MatSnackBar,
              private serviceLogin: Login,
              private router: Router,
              private nav: NavigationService

  ) {}

  // Volver atrás
  volver() {
    this.nav.goBack();
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
      this.snackBar.open('Contraseña muy débil', 'Error', { duration: 3000 }) ;
    }
    else if (err.code?.includes('email-already')) {
      this.snackBar.open ('Ese correo ya está registrado', 'Cerrar', { duration: 3000 }) ;
    }
    else if (err.code?.includes('user-not-found')) {
      this.snackBar.open('Usuario no encontrado', 'Cerrar', { duration: 3000 });

    }
    else if (err.code?.includes('wrong-password')) {
      this.snackBar.open('Contraseña incorrecta', 'Error', { duration: 3000 }) ;
    
    }
    else if (err.code?.includes('email')) {
      this.snackBar.open('Correo inválido', 'Error', { duration: 3000 })
      
    }
    else {
      this.snackBar.open ('Error al autenticar', 'Error', { duration: 3000 });
    }
  }
}
