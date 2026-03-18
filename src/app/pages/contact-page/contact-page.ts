import { Component, OnInit, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NavigationService } from '../../services/navigation';
import { MatSnackBar } from '@angular/material/snack-bar';

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

  constructor(private navigationService: NavigationService) {}


  ngOnInit(): void {
    if (!this.isBrowser()) return;

    this.nombre.set(localStorage.getItem('nombre') ?? '');
    this.email.set(localStorage.getItem('email') ?? '');
  }

  enviarFormulario(form: NgForm) {
    this.errorMessage.set('');
    this.successMessage.set('');

    if (form.invalid) {
      this.errorMessage.set('Por favor completa correctamente el formulario.');
      return;
    }

    this.loading.set(true);

    // Simulación de API
    setTimeout(() => {
      console.log('Mensaje enviado:', {
        nombre: this.nombre(),
        email: this.email(),
        mensaje: this.mensaje()
      });

      this.successMessage.set('Mensaje enviado correctamente.');
      this.mensaje.set('');
      form.resetForm();

      this.loading.set(false);
    }, 1000);
  }

  volver() {
    this.navigationService.goTo('');
  }

  private isBrowser(): boolean {
    return typeof window !== 'undefined';
  }
}
