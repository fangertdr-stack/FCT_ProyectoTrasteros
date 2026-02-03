import { Component } from '@angular/core';
import { Trastero } from '../../models/trastero';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavigationService } from '../../services/navigation';

@Component({
  selector: 'app-admin-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-page.html',
  styleUrl: './admin-page.css',
})
export class AdminPage {

  constructor(private nav: NavigationService) {}

  irAlMain() {
    this.nav.goTo('');
  }

  gestionUsuarios() {
    this.nav.goTo('users');
  }
  
  // array de meses
  mesesDisponibles = [1, 2, 3, 4, 5, 6, 9, 12];

  // ejemplos visuales hasta tener backend
  trasteros: Trastero[] = [
  { id_trastero: 1, codigo: 'T01', estado: 'OCUPADO', precio: 30, tamanio: 'PEQUEÑO', usuario: 'usuario1' },
  { id_trastero: 2, codigo: 'T02', estado: 'LIBRE', precio: 40, tamanio: 'MEDIANO' },
  { id_trastero: 3, codigo: 'T03', estado: 'OCUPADO', precio: 50, tamanio: 'GRANDE', usuario: 'usuario2' },
  { id_trastero: 4, codigo: 'T04', estado: 'LIBRE', precio: 25, tamanio: 'PEQUEÑO' },
  { id_trastero: 5, codigo: 'T05', estado: 'MANTENIMIENTO', precio: 35, tamanio: 'MEDIANO' },
  { id_trastero: 6, codigo: 'T06', estado: 'OCUPADO', precio: 60, tamanio: 'GRANDE', usuario: 'usuario3' },
  { id_trastero: 7, codigo: 'T07', estado: 'LIBRE', precio: 28, tamanio: 'PEQUEÑO' },
  { id_trastero: 8, codigo: 'T08', estado: 'OCUPADO', precio: 42, tamanio: 'MEDIANO', usuario: 'usuario4' },
  { id_trastero: 9, codigo: 'T09', estado: 'MANTENIMIENTO', precio: 55, tamanio: 'GRANDE' },
  { id_trastero: 10, codigo: 'T10', estado: 'LIBRE', precio: 33, tamanio: 'PEQUEÑO' },
  { id_trastero: 11, codigo: 'T11', estado: 'OCUPADO', precio: 45, tamanio: 'MEDIANO', usuario: 'usuario5' },
  { id_trastero: 12, codigo: 'T12', estado: 'LIBRE', precio: 70, tamanio: 'GRANDE' }
];

  trasteroSeleccionado: Trastero | null = null;

  seleccionar(t: Trastero) {
    this.trasteroSeleccionado = { ...t };
  }

  cambiarEstado(estado: 'LIBRE' | 'OCUPADO' | 'MANTENIMIENTO') {
    if (!this.trasteroSeleccionado) return;

    this.trasteroSeleccionado.estado = estado;

    if (estado !== 'OCUPADO') {
      this.trasteroSeleccionado.usuario = undefined;
      this.trasteroSeleccionado.fechaInicio = undefined;
      this.trasteroSeleccionado.mesesContrato = undefined;
    }
  }

  calcularFechaFin(fechaInicio?: string, meses?: number): string | null {
    if (!fechaInicio || !meses) return null;

    const inicio = new Date(fechaInicio);

    const dias = meses * 30;

    const fin = new Date(inicio);
    fin.setDate(fin.getDate() + dias);

    return fin.toISOString().split('T')[0]; // yyyy-mm-dd
  }

  estadoContrato(fechaFin: string | null): 'verde' | 'amarillo' | 'rojo' | null {
    if (!fechaFin) return null;

    const hoy = new Date();
    const fin = new Date(fechaFin);

    const diffMs = fin.getTime() - hoy.getTime();
    const diffDias = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    if (diffDias > 15) {
      return 'verde';       // queda bastante
    } else if (diffDias > 5) {
      return 'amarillo';    // cerca
    } else {
      return 'rojo';        // a punto de vencer o vencido
    }
  }


  guardar() {
  if (!this.trasteroSeleccionado) return;

  // si hay usuario, pasa a OCUPADO (salvo mantenimiento)
  if (this.trasteroSeleccionado.estado !== 'MANTENIMIENTO') {

    if (
      this.trasteroSeleccionado.usuario &&
      this.trasteroSeleccionado.usuario.trim() !== ''
    ) {
      this.trasteroSeleccionado.estado = 'OCUPADO';
    } else {
      this.trasteroSeleccionado.estado = 'LIBRE';
    }
  }

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
