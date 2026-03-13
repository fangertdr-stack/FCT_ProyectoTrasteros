import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contacto',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './contacto.html',
  styleUrl: './contacto.css',
})
export class Contacto {

  mostrarFormulario = false;

  abrirFormulario() {
    this.mostrarFormulario = true;
  }

  cerrarFormulario() {
    this.mostrarFormulario = false;
  }

  enviarFormulario(event: Event) {
    event.preventDefault();

    const form = event.target as HTMLFormElement;

    const datos = {
      nombre: (form.elements.namedItem('nombre') as HTMLInputElement).value,
      email: (form.elements.namedItem('email') as HTMLInputElement).value,
      telefono: (form.elements.namedItem('telefono') as HTMLInputElement).value,
      mensaje: (form.elements.namedItem('mensaje') as HTMLTextAreaElement).value,
    };

    console.log('Datos enviados:', datos);

    alert('Formulario enviado correctamente');
    form.reset();
    this.cerrarFormulario();
  }
}
