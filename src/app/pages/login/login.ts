import { Component, ChangeDetectorRef, } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router, ActivatedRouteSnapshot } from '@angular/router';
import { NavigationService } from '../../services/navigation';
import { LoginService } from '../../services/loginService';
import { RegisterService } from '../../services/registerService';

// Import para el login con Google a través de Firebase Authentication
import { Auth, signInWithPopup, GoogleAuthProvider } from '@angular/fire/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, MatSnackBarModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {

  // Campos del formulario de login y registro.
  // Login solo usa email y password, el resto se usan únicamente en el registro.
  name = '';
  email = '';
  dni = '';
  password = '';
  confirmPassword = '';
  telefono = '';
  direccion = '';
  cif = '';
  razonsocial = '';

  // Variables de control del estado del formulario.
  // isRegister indica si se muestra el formulario de registro o el de login.
  // registerStep permite dividir el registro en varios pasos (paso 1, paso 2, etc).
  // showPassword controla si la contraseña se ve en texto plano o con asteriscos.
  // loading indica si hay una petición en curso para deshabilitar el botón mientras tanto.
  // errorMessage guarda el mensaje de error a mostrar bajo el formulario.
  isRegister = false;
  registerStep = 1;
  showPassword = false;
  loading = false;
  errorMessage = '';

  constructor(
    private auth: Auth, // necesario para el login con Google a través de Firebase
    private snackBar: MatSnackBar,
    private serviceLogin: LoginService,
    private registro: RegisterService,
    private router: Router,
    private nav: NavigationService,
    private cdr: ChangeDetectorRef
  ) { }


  // Función para mostrar un mensaje emergente (snackbar) al usuario.
  // El parámetro success determina si el mensaje aparece con estilo de éxito (verde) o de error (rojo).
  private showMessage(message: string, success: boolean = true): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: success ? ['snackbar-success'] : ['snackbar-error']
    });
  }


  // Función para volver a la página anterior usando el servicio de navegación
  volver() {
    this.nav.goBack();
  }


  // Función para alternar la visibilidad de la contraseña entre texto plano y oculta
  togglePassword() {
    this.showPassword = !this.showPassword;
  }


  // Función para cambiar entre el modo login y el modo registro.
  // Resetea el paso del registro y limpia los mensajes de error al cambiar de modo.
  toggleMode() {
    this.isRegister = !this.isRegister;
    this.registerStep = 1;
    this.errorMessage = '';
  }


  // Función para iniciar sesión con Google a través de Firebase Authentication.
  // Abre una ventana emergente (popup) donde el usuario selecciona su cuenta de Google.
  loginGoogle() {
    const provider = new GoogleAuthProvider();
    this.loading = true;
    signInWithPopup(this.auth, provider)
      .then(() => this.loading = false)
      .catch(err => this.handleError(err));
  }


  // Función principal que se ejecuta al enviar el formulario.
  // Decide si hay que hacer login o registro según el modo actual (isRegister).
  // Valida los campos correspondientes antes de llamar al backend.
  submit() {
    this.errorMessage = '';

    if (!this.isRegister) {

      // Validación y envío del formulario de LOGIN
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

    // Validación del formulario de REGISTRO
    // Se comprueba que todos los campos obligatorios estén rellenos,
    // que las contraseñas coincidan, que el email sea válido y que la contraseña tenga al menos 6 caracteres
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

    // Llamada al servicio de registro con todos los datos del nuevo usuario
    this.registro.create({
      nombre: this.name,
      email: this.email,
      password: this.password,
      dni: this.dni,
      telefono: this.telefono,
      direccion: this.direccion,
      cif: this.cif,
      razon_social: this.razonsocial

    }).subscribe({
      next: (resp: any) => {
        this.loading = false;
        // markForCheck fuerza a Angular a revisar los cambios en este componente,
        // útil cuando se usa OnPush change detection para asegurar que la UI se actualiza
        this.cdr.markForCheck();

        if (resp.ok || resp.status) {
          // Si el registro fue correcto, se vuelve automáticamente al formulario de login
          // para que el usuario pueda iniciar sesión con sus nuevas credenciales
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

        // Se intenta extraer el mensaje de error del servidor probando varios campos posibles,
        // ya que la estructura del error puede variar según cómo lo devuelva el backend
        const mensaje = err.error?.message || err.error?.error || err.message || 'Error de conexión';
        this.showMessage(mensaje, false);
      }
    });
  }


  // Función que envía las credenciales al backend para iniciar sesión.
  // Si el login es correcto, guarda el token y los datos del usuario en localStorage
  // y redirige al usuario al panel de admin o al main según su rol.
  private loginBackend() {
    const email = this.email;
    const password = this.password;

    this.serviceLogin.login({ email, password }).subscribe({
      next: (resp: any) => {
        this.loading = false;
        this.cdr.markForCheck();
        console.log('RESPUESTA:', resp);

        if ((resp.data || resp.ok)) {
          // Comprobación importante para SSR: el localStorage solo existe en el navegador,
          // si se ejecuta en el servidor no estará disponible y daría error
          if (typeof window !== 'undefined') {
            const token = resp.data.token;

            localStorage.setItem('token', token);

            // Se decodifica el payload del token JWT (la parte central separada por puntos, en base64)
            // para extraer datos del usuario como el id y el rol sin tener que hacer otra petición
            const payload = JSON.parse(atob(token.split('.')[1]));

            localStorage.setItem('id_usuario', payload.id_usuario);
            localStorage.setItem('rol', payload.rol);
            localStorage.setItem('nombre', resp.data.nombre_publico);
            // Para el email se usa el que devuelve el backend, y si no existe se busca en el token o en el input del formulario
            localStorage.setItem('email', resp.data.email ?? payload.email ?? email);

          }

          // Según el rol del usuario se redirige a la zona de admin o a la página principal
          // Se convierte a String para poder comparar tanto con texto ('admin') como con número ('1')
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


  // Manejador genérico de errores. Desactiva el loading y muestra un mensaje de error al usuario.
  // Se usa principalmente en el login con Google donde no se necesita un manejo de error tan específico.
  private handleError(err: any) {
    this.loading = false;
    console.error(err);
    this.showMessage('Error de autenticación', false);
  }


  // Valida que un email tenga un formato correcto mediante una expresión regular básica:
  // algo@algo.algo (sin espacios ni arrobas extra)
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
