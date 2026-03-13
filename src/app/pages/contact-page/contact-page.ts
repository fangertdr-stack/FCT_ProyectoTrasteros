import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NavigationService } from '../../services/navigation';

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

  constructor(private navigationService: NavigationService) {
  }

  ngOnInit(): void {
    if (!this.isBrowser()) return;

    this.nombre = localStorage.getItem('nombre_publico') ?? '';
    this.email = localStorage.getItem('usuario') ?? '';
  }

  enviarFormulario() {
    if (!this.mensaje.trim()) {
      alert('Por favor escribe un mensaje');
      return;
    }

    console.log('Mensaje enviado:', {
      nombre: this.nombre,
      email: this.email,
      mensaje: this.mensaje
    });

    alert('Mensaje enviado correctamente');

    this.mensaje = '';
  }

  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }

  volver() {
    this.navigationService.goTo('');
  }

}
