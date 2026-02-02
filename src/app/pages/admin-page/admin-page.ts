import { Component } from '@angular/core';
import { Trastero } from '../../models/trastero';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-page.html',
  styleUrl: './admin-page.css',
})
export class AdminPage {


  // Datos de ejemplo
  trasteros: Trastero[] = [
    {
      id_trastero: 1,
      codigo: 'T01',
      estado: 'OCUPADO',
      precio: 30,
      tamanio: 'P',

      usuario: 'usuario1' // temporal hasta backend real
    },

    {
      id_trastero: 2,
      codigo: 'T02',
      estado: 'OCUPADO',
      precio: 40,
      tamanio: 'M'
    },

    {
      id_trastero: 3,
      codigo: 'T03',
      estado: 'LIBRE',
      precio: 50,
      tamanio: 'G',

      usuario: 'usuario2' // temporal hasta backend real
    }

  ];

  trasteroSeleccionado: Trastero | null = null;

  seleccionar(t: Trastero) {
    this.trasteroSeleccionado =  {...t};
  }

  guardar() {
    if (!this.trasteroSeleccionado) return;

    if (this.trasteroSeleccionado.usuario) {
      this.trasteroSeleccionado.estado = 'OCUPADO';
    }

    const index = this.trasteros.findIndex(
      t => t.id_trastero === this.trasteroSeleccionado!.id_trastero
    );

    this.trasteros[index] = this.trasteroSeleccionado!;
    this.trasteroSeleccionado = null;
  }

  liberar(t: Trastero) {
    t.estado = 'LIBRE';
    t.usuario = undefined; // temporal hasta backend real
  }
}
