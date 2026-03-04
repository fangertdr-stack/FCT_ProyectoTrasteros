import { Component, OnInit } from '@angular/core';
import { Trastero } from '../../models/trastero';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavigationService } from '../../services/navigation';
import { TrasteroService } from '../../services/trastero';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-admin-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-page.html',
  styleUrls: ['./admin-page.css'],
})
export class AdminPage implements OnInit {

  constructor(
    private nav: NavigationService,
    private trasteroService: TrasteroService
  ) {}

  trackByTrasteroId(index: number, item: any) {
    return item.id_trastero;
  }

  // Array viene del backend
  trasteros: Trastero[] = [];

  // array de meses
  mesesDisponibles = [1, 2, 3, 4, 5, 6, 9, 12];

  trasteroSeleccionado: Trastero | null = null;

  // control del modal de confirmacion
  mostrarModal = false;
  trasteroALiberar: Trastero | null = null;

  trastero$: Observable<Trastero[]> | undefined;

  ngOnInit(): void {
    this.trastero$ = this.trasteroService.getTrasteros();


  }

  // Se ejecuta al cargar la página


  cargarTrasteros() {

    this.trasteroService.getTrasteros().subscribe({
      next: (data) => {
        this.trasteros = data;
      },
      error: (err) => {
        console.error('Error al cargar trasteros', err);
      }
    });
  }

  irAlMain() {
    this.nav.goTo('');
  }

  gestionUsuarios() {
    this.nav.goTo('users');
  }

  seleccionar(t: Trastero) {
    this.trasteroSeleccionado = { ...t };
  }

  cambiarEstado(estado: 'libre' | 'ocupado' | 'mantenimiento') {
    if (!this.trasteroSeleccionado) return;

    this.trasteroSeleccionado.estado = estado;

    if (estado !== 'ocupado') {
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

    return fin.toISOString().split('T')[0];
  }

  estadoContrato(fechaFin: string | null): 'verde' | 'amarillo' | 'rojo' | null {
    if (!fechaFin) return null;

    const hoy = new Date();
    const fin = new Date(fechaFin);

    const diffMs = fin.getTime() - hoy.getTime();
    const diffDias = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    if (diffDias > 15) return 'verde';
    if (diffDias > 5) return 'amarillo';
    return 'rojo';
  }

  guardar() {
    if (!this.trasteroSeleccionado) return;

    // Solo lógica visual por ahora (update real lo hacemos después)
    if (this.trasteroSeleccionado.estado !== 'mantenimiento') {

      if (
        this.trasteroSeleccionado.usuario &&
        this.trasteroSeleccionado.usuario.trim() !== ''
      ) {
        this.trasteroSeleccionado.estado = 'ocupado';
      } else {
        this.trasteroSeleccionado.estado = 'libre';
      }
    }

    const index = this.trasteros.findIndex(
      t => t.id_trastero === this.trasteroSeleccionado!.id_trastero
    );

    if (index !== -1) {
      this.trasteros[index] = { ...this.trasteroSeleccionado };
    }

    this.trasteroSeleccionado = null;
  }

  liberar(t: Trastero) {
    this.trasteroALiberar = t;
    this.mostrarModal = true;
  }

  confirmarLiberar() {
    if (!this.trasteroALiberar) return;

    this.trasteroALiberar.estado = 'libre';
    this.trasteroALiberar.usuario = undefined;
    this.trasteroALiberar.fechaInicio = undefined;
    this.trasteroALiberar.mesesContrato = undefined;

    this.cerrarModal();
  }

  cerrarModal() {
    this.mostrarModal = false;
    this.trasteroALiberar = null;
  }
}
