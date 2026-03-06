import { Component, ChangeDetectorRef,  } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router, ActivatedRouteSnapshot } from '@angular/router';
import { NavigationService } from '../../services/navigation';
import { LoginService } from '../../services/loginService';
import { RegisterService } from '../../services/registerService';




// Si sigues usando Google login, deja esto. Si no, bórralo.
import { Auth, signInWithPopup, GoogleAuthProvider } from '@angular/fire/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, MatSnackBarModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {

  name = '';
  email = '';
  dni = '';
  password = '';
  confirmPassword = '';
  telefono = '';
  direccion = '';

  isRegister = false;
  registerStep = 1;
  showPassword = false;
  loading = false;
  errorMessage = '';


  constructor(
    private auth: Auth, // solo si se usa google login
    private snackBar: MatSnackBar,
    private serviceLogin: LoginService,
    private registro: RegisterService,
    private router: Router,
    private nav: NavigationService,
    private cdr: ChangeDetectorRef
  ) {}

  private showMessage(message: string, success: boolean = true): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: success ? ['snackbar-success'] : ['snackbar-error']
    });
  }
  
  volver() {
    this.nav.goBack();
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  toggleMode() {
    this.isRegister = !this.isRegister;
    this.registerStep = 1;
    this.errorMessage = '';
  }

  // Google login (opcional)
  loginGoogle() {
    const provider = new GoogleAuthProvider();
    this.loading = true;
    signInWithPopup(this.auth, provider)
      .then(() => this.loading = false)
      .catch(err => this.handleError(err));
  }

  // SUBMIT: decide si login o register
  submit() {
    this.errorMessage = '';

    if (!this.isRegister) {
      //  LOGIN BACKEND
      if (!this.email || !this.password) {
        this.errorMessage = 'Completa todos los campos';
        return;
      }
      if (!this.isValidEmail(this.email)) {
        this.errorMessage = 'Email inválido';
        return;
      }
      this.loading = true;
      this.loginBackend();
      return;
    }

    //  REGISTRO BACKEND
    if (!this.name || !this.email || !this.dni || !this.password || !this.confirmPassword) {
      this.errorMessage = 'Completa todos los campos';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Las contraseñas no coinciden';
      return;
    }

    if (!this.isValidEmail(this.email)) {
      this.errorMessage = 'Email inválido';
      return;
    }

    if (this.password.length < 6) {
      this.errorMessage = 'La contraseña debe tener al menos 6 caracteres';
      return;
    }

    this.loading = true;

    this.registro.create({
      nombre: this.name,
      email: this.email,
      password: this.password,
      dni: this.dni,
      telefono: this.telefono,
      direccion: this.direccion
    }).subscribe({
      next: (resp: any) => {
        this.loading = false;
        this.cdr.markForCheck();

        if (resp.ok || resp.status) {
          this.showMessage('Usuario creado correctamente');
          this.isRegister = false;
          this.registerStep = 1;
        } else {
          this.showMessage(resp.message ?? 'No se pudo registrar', false);
        }
      },
      error: (err: any) => {
        this.loading = false;
        this.cdr.markForCheck();
        console.error('Error de registro completo:', err);
        console.error('Respuesta del servidor:', err.error);

        // Intentar obtener mensaje del servidor
        const mensaje = err.error?.message || err.error?.error || err.message || 'Error de conexión';
        this.showMessage(mensaje, false);
      }
    });
  }

  private loginBackend() {
    const email = this.email;
    const password = this.password;

    this.serviceLogin.login({ email, password }).subscribe({
      next: (resp: any) => {
        this.loading = false;
        this.cdr.markForCheck();
        console.log('RESPUESTA:', resp);

        if ((resp.status || resp.ok) && resp.data) {
          // ✅ Importante en SSR: solo si existe window
          if (typeof window !== 'undefined') {
            localStorage.setItem('token', resp.data.token ?? '');
            localStorage.setItem('usuario', resp.data.usuario ?? '');
            localStorage.setItem('rol', String(resp.data.rol ?? ''));
            localStorage.setItem('nombre_publico', resp.data.nombre_publico ?? '');
          }

          //  aqui se comprueba si el rol es admin o no va a un sitio u a otro de la aplicacion
          const rol = String(resp.data.rol ?? '');

          if (rol === 'admin' || rol === '1') {
            this.router.navigate(['/admin']);
          } else {
            this.router.navigate(['/']);
          }

        } else {
          this.showMessage(resp.message ?? 'Credenciales incorrectas', false);
        }
      },
      error: (err) => {
        this.loading = false;
        this.cdr.markForCheck();
        console.error(err);
        this.showMessage('Error de conexión con el servidor', false);
      }
    });
  }

  private handleError(err: any) {
    this.loading = false;
    console.error(err);
    this.showMessage('Error de autenticación', false);
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
