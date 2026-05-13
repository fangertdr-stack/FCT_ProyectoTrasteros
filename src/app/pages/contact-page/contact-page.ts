import { Component, OnInit, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NavigationService } from '../../services/navigation';
import { URL_API } from '../../../environments/environment';

@Component({
  selector: 'app-contact-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contact-page.html',
  styleUrl: './contact-page.css'
})
export class ContactPage implements OnInit {

  // Signals para los campos del formulario de contacto
  // Se usan signals en lugar de propiedades normales para que Angular detecte los cambios de forma reactiva
  nombre = signal('');
  email = signal('');
  mensaje = signal('');

  // Signals para controlar el estado de la petición y mostrar mensajes al usuario
  // loading indica si se está enviando el formulario (para deshabilitar el botón mientras tanto)
  // successMessage y errorMessage guardan los mensajes a mostrar tras el envío
  loading = signal(false);
  successMessage = signal('');
  errorMessage = signal('');

  constructor(
    private navigationService: NavigationService,
    private http: HttpClient
  ) {}


  // Al iniciar el componente, se intenta rellenar automáticamente nombre y email del usuario logueado.
  // Si no hay token (usuario no logueado), no hace nada y el formulario queda vacío.
  // Si hay token, se cargan los datos desde localStorage, desde el propio token y desde el backend
  // para asegurar que la información esté lo más actualizada posible.
  ngOnInit(): void {
    if (!this.isBrowser()) return;

    const token = localStorage.getItem('token');

    if (!token) return;

    try {
      this.nombre.set(this.getStorageValue('nombre'));
      this.email.set(this.getStorageValue('email'));
      this.cargarDatosToken(token);
      this.cargarDatosUsuario();
    } catch {
      // Si algo falla al leer los datos, se dejan los campos vacíos para que el usuario los rellene a mano
      this.nombre.set('');
      this.email.set('');
    }
  }


  // Función que se ejecuta al enviar el formulario de contacto.
  // Valida que el formulario sea correcto y que el email tenga un formato válido antes de enviar.
  // Hace la petición POST al backend con los datos del formulario y muestra el mensaje de éxito o error.
  enviarFormulario(form: NgForm) {
    // Limpiar mensajes anteriores antes de procesar el nuevo envío
    this.errorMessage.set('');
    this.successMessage.set('');

    if (form.invalid) {
      this.errorMessage.set('Por favor completa correctamente el formulario.');
      return;
    }

    // Validación extra del email por si se cargó mal desde el token o localStorage
    if (!this.isValidEmail(this.email())) {
      this.errorMessage.set('No se pudo enviar tu email. Debes iniciar sesión o registrarte.');
      return;
    }

    // Se construye el objeto que se envía al backend con los datos del formulario
    const payload = {
      nombre: this.nombre(),
      email: this.email(),
      mensaje: this.mensaje()
    };

    this.loading.set(true);

    this.http.post<{ success: boolean; mensaje?: string; error?: string }>(
      `${URL_API}/contact.php`,
      payload
    ).subscribe({
      next: (resp) => {
        if (resp.success) {
          // Si el envío fue correcto, se muestra el mensaje y se limpia el campo del mensaje
          // (se mantienen nombre y email para que el usuario no tenga que volver a rellenarlos)
          this.successMessage.set(resp.mensaje ?? 'Mensaje enviado correctamente.');
          this.mensaje.set('');
          form.resetForm({ mensaje: '' });
        } else {
          this.errorMessage.set(resp.error ?? 'No se pudo enviar el mensaje.');
        }

        this.loading.set(false);
      },
      error: (err) => {
        // Si la petición falla, se intenta mostrar el mensaje de error del backend o uno genérico
        this.errorMessage.set(err?.error?.error ?? 'No se pudo enviar el mensaje.');
        this.loading.set(false);
      }
    });
  }


  // Función para volver a la página principal
  volver() {
    this.navigationService.goTo('');
  }


  // Comprueba si el código se está ejecutando en el navegador.
  // Es necesario porque Angular puede ejecutarse también en el servidor (SSR) donde no existe localStorage ni window.
  private isBrowser(): boolean {
    return typeof window !== 'undefined';
  }


  // Carga los datos del usuario logueado desde el backend usando su id guardado en localStorage.
  // Si el backend devuelve nombre o email válidos, actualiza tanto los signals como el localStorage
  // para mantener la información sincronizada para futuras sesiones.
  private cargarDatosUsuario(): void {
    const idUsuario = Number(this.getStorageValue('id_usuario'));

    if (!idUsuario) return;

    this.http.get<any>(`${URL_API}/user.php?id_usuario=${idUsuario}`, {
      headers: this.getHeaders()
    }).subscribe({
      next: (usuario) => {
        if (usuario?.nombre) {
          this.nombre.set(usuario.nombre);
          localStorage.setItem('nombre', usuario.nombre);
        }

        if (usuario?.email && this.isValidEmail(usuario.email)) {
          this.email.set(usuario.email);
          localStorage.setItem('email', usuario.email);
        }
      }
    });
  }


  // Extrae los datos del usuario directamente del token JWT como fallback.
  // El token JWT tiene tres partes separadas por puntos, donde la segunda es el payload codificado en base64.
  // Solo se rellenan los campos que aún estén vacíos o tengan datos inválidos, para no sobrescribir lo ya cargado.
  private cargarDatosToken(token: string): void {
    try {
      // Decodifica la segunda parte del token (payload) que contiene la info del usuario
      const payload = JSON.parse(atob(token.split('.')[1]));

      if (!this.nombre() && payload?.nombre) {
        this.nombre.set(payload.nombre);
      }

      if (!this.isValidEmail(this.email()) && this.isValidEmail(payload?.email ?? '')) {
        this.email.set(payload.email);
      }
    } catch {
      // Si el token está mal formado o no se puede decodificar, se ignora silenciosamente
      return;
    }
  }


  // Obtiene un valor de localStorage de forma segura.
  // Devuelve cadena vacía si el valor no existe o si está guardado literalmente como "undefined" o "null"
  // (esto puede pasar si en algún momento se guardó mal el valor con un toString)
  private getStorageValue(key: string): string {
    const value = localStorage.getItem(key);

    if (!value || value === 'undefined' || value === 'null') {
      return '';
    }

    return value;
  }


  // Valida que un email tenga un formato correcto mediante una expresión regular básica:
  // algo@algo.algo (sin espacios ni arrobas extra)
  private isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }


  // Construye las cabeceras HTTP para las peticiones autenticadas.
  // Añade el token JWT en la cabecera Authorization para que el backend pueda identificar al usuario.
  private getHeaders(): HttpHeaders {
    const token = this.isBrowser() ? localStorage.getItem('token') : '';

    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }
}
