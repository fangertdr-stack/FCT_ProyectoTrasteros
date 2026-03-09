import { Component, OnInit } from '@angular/core';
import { Trastero } from '../../models/trastero';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavigationService } from '../../services/navigation';
import { TrasteroService } from '../../services/trasteroService';
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

  // Lista de trasteros
  trasteros: Trastero[] = [];

  // Lista de usuarios para el select
  usuarios: any[] = [];

  // meses disponibles contrato
  mesesDisponibles = [1, 2, 3, 4, 5, 6, 9, 12];

  // trastero que se está editando
  trasteroSeleccionado: Trastero | null = null;

  // modal liberar
  mostrarModal = false;
  trasteroALiberar: Trastero | null = null;

  trastero$: Observable<Trastero[]> | undefined;

  ngOnInit(): void {
    this.trastero$ = this.trasteroService.getTrasteros();
    // cargar trasteros


    // cargar usuarios
    this.trasteroService.getUsuarios().subscribe({
      next: (data) => {
        this.usuarios = data;
      },
      error: (err) => {
        console.error('Error cargando usuarios', err);
      }
    });

  }


  trackByTrasteroId(index: number, item: Trastero) {
    return item.id_trastero;
  }


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

    // copia del objeto
    this.trasteroSeleccionado = {
      ...t,
      id_usuario: t.id_usuario ?? undefined
    };

  }


  cambiarEstado(estado: 'libre' | 'ocupado' | 'mantenimiento') {

    if (!this.trasteroSeleccionado) return;

    this.trasteroSeleccionado.estado = estado;

    if (estado !== 'ocupado') {

      this.trasteroSeleccionado.usuario = undefined;
      this.trasteroSeleccionado.id_usuario = undefined;
      this.trasteroSeleccionado.fechaInicio = undefined;
      this.trasteroSeleccionado.mesesContrato = undefined;

    }

  }


  calcularFechaFin(fechaInicio?: string, meses?: number): string | null {

    if (!fechaInicio || !meses) return null;

    const inicio = new Date(fechaInicio);
    const fin = new Date(inicio);

    fin.setMonth(fin.getMonth() + meses);

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

    if (!this.trasteroSeleccionado.id_usuario) {
      alert("Selecciona un usuario");
      return;
    }

    if (!this.trasteroSeleccionado.fechaInicio || !this.trasteroSeleccionado.mesesContrato) {
      alert("Completa los datos del contrato");
      return;
    }

    const fechaFin = this.calcularFechaFin(
      this.trasteroSeleccionado.fechaInicio,
      this.trasteroSeleccionado.mesesContrato
    );

    const data = {
      id_usuario: this.trasteroSeleccionado.id_usuario,
      id_trastero: this.trasteroSeleccionado.id_trastero,
      fecha_inicio: this.trasteroSeleccionado.fechaInicio,
      fecha_fin: fechaFin
    };

    this.trasteroService.asignarTrastero(data).subscribe({

      next: () => {

        this.cargarTrasteros();
        this.trasteroSeleccionado = null;

      },

      error: (err) => {
        console.error("Error guardando alquiler", err);
      }

    });

  }


  liberar(t: Trastero) {

    this.trasteroALiberar = t;
    this.mostrarModal = true;

  }


  confirmarLiberar() {

    if (!this.trasteroALiberar) return;

    this.trasteroALiberar.estado = 'libre';
    this.trasteroALiberar.usuario = undefined;
    this.trasteroALiberar.id_usuario = undefined;
    this.trasteroALiberar.fechaInicio = undefined;
    this.trasteroALiberar.mesesContrato = undefined;

    this.cerrarModal();

  }


  cerrarModal() {

    this.mostrarModal = false;
    this.trasteroALiberar = null;

  }

}
