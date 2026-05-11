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

  nombre = signal('');
  email = signal('');
  mensaje = signal('');

  loading = signal(false);
  successMessage = signal('');
  errorMessage = signal('');

  constructor(
    private navigationService: NavigationService,
    private http: HttpClient
  ) {}

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
      this.nombre.set('');
      this.email.set('');
    }
  }

  enviarFormulario(form: NgForm) {
    this.errorMessage.set('');
    this.successMessage.set('');

    if (form.invalid) {
      this.errorMessage.set('Por favor completa correctamente el formulario.');
      return;
    }

    if (!this.isValidEmail(this.email())) {
      this.errorMessage.set('No se pudo recuperar tu email. Cierra sesión y vuelve a iniciar sesión.');
      return;
    }

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
          this.successMessage.set(resp.mensaje ?? 'Mensaje enviado correctamente.');
          this.mensaje.set('');
          form.resetForm({ mensaje: '' });
        } else {
          this.errorMessage.set(resp.error ?? 'No se pudo enviar el mensaje.');
        }

        this.loading.set(false);
      },
      error: (err) => {
        this.errorMessage.set(err?.error?.error ?? 'No se pudo enviar el mensaje.');
        this.loading.set(false);
      }
    });
  }

  volver() {
    this.navigationService.goTo('');
  }

  private isBrowser(): boolean {
    return typeof window !== 'undefined';
  }

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

  private cargarDatosToken(token: string): void {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));

      if (!this.nombre() && payload?.nombre) {
        this.nombre.set(payload.nombre);
      }

      if (!this.isValidEmail(this.email()) && this.isValidEmail(payload?.email ?? '')) {
        this.email.set(payload.email);
      }
    } catch {
      return;
    }
  }

  private getStorageValue(key: string): string {
    const value = localStorage.getItem(key);

    if (!value || value === 'undefined' || value === 'null') {
      return '';
    }

    return value;
  }

  private isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  private getHeaders(): HttpHeaders {
    const token = this.isBrowser() ? localStorage.getItem('token') : '';

    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }
}
