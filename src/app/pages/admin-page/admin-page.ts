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

  trasteros: Trastero[] = [
    {
      id_trastero: 1,
      codigo: 'T01',
      estado: 'OCUPADO',
      precio: 30,
      tamanio: 'PEQUEÑO',
      usuario: 'usuario1'
    },
    {
      id_trastero: 2,
      codigo: 'T02',
      estado: 'LIBRE',
      precio: 40,
      tamanio: 'MEDIANO',
    },
    {
      id_trastero: 3,
      codigo: 'T03',
      estado: 'OCUPADO',
      precio: 50,
      tamanio: 'GRANDE',
      usuario: 'usuario2'
    }
  ];

  trasteroSeleccionado: Trastero | null = null;

  seleccionar(t: Trastero) {
    // copia para no modificar la tabla directo
    this.trasteroSeleccionado = { ...t };
  }

  cambiarEstado(estado: 'LIBRE' | 'OCUPADO' | 'MANTENIMIENTO') {
    if (!this.trasteroSeleccionado) return;

    this.trasteroSeleccionado.estado = estado;

    // lógica automática
    if (estado !== 'OCUPADO') {
      this.trasteroSeleccionado.usuario = undefined;
    }
  }

  guardar() {
    if (!this.trasteroSeleccionado) return;

    const index = this.trasteros.findIndex(
      t => t.id_trastero === this.trasteroSeleccionado!.id_trastero
    );

    this.trasteros[index] = { ...this.trasteroSeleccionado };
    this.trasteroSeleccionado = null;
  }

  liberar(t: Trastero) {
    t.estado = 'LIBRE';
    t.usuario = undefined;
  }
}
