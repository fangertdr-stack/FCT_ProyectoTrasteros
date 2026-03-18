import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
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

  nombre = '';
  email = '';
  mensaje = '';

  constructor(private navigationService: NavigationService,
              private snackBar: MatSnackBar

  ) {}


  private showMessage(message: string, success: boolean = true): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: success ? ['snackbar-success'] : ['snackbar-error']
    });
  }


  ngOnInit(): void {
    if (!this.isBrowser()) return;

    this.nombre = localStorage.getItem('nombre') ?? '';
    this.email = localStorage.getItem('usuario') ?? '';
  }

  enviarFormulario() {
    if (!this.mensaje.trim()) {
      this.showMessage('Por favor escribe un mensaje')
      return;
    }

    console.log('Mensaje enviado:', {
      nombre: this.nombre,
      email: this.email,
      mensaje: this.mensaje
    });

    this.showMessage('Mensaje enviado correctamente')

    this.mensaje = '';
  }

  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }

  volver() {
    this.navigationService.goTo('');
  }

  //PHP MAILER libreria para configurar el envio de correo


}
