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

  trasteros: Trastero[] = [];
  usuarios: any[] = [];
  mesesDisponibles = [1, 2, 3, 4, 5, 6, 9, 12];

  trasteroSeleccionado: Trastero | null = null;

  mostrarModal = false;
  trasteroALiberar: Trastero | null = null;

  trastero$: Observable<Trastero[]> | undefined;

  ngOnInit(): void {
    console.log("AdminPage iniciado");

    this.trastero$ = this.trasteroService.getTrasteros();

    // Cargar usuarios
    this.trasteroService.getUsuarios().subscribe({
      next: (data) => {
        console.log("Usuarios cargados:", data);
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
    console.log("Cargando trasteros...");
    this.trasteroService.getTrasteros().subscribe({
      next: (data) => {
        console.log("Trasteros recibidos:", data);
        this.trasteros = data;
      },
      error: (err) => {
        console.error('Error al cargar trasteros', err);
      }
    });
  }

  irAlMain() {
    console.log("Navegando al main");
    this.nav.goTo('');
  }

  gestionUsuarios() {
    console.log("Navegando a gestión de usuarios");
    this.nav.goTo('users');
  }

  seleccionar(t: Trastero) {
    console.log("Trastero seleccionado:", t);
    this.trasteroSeleccionado = {
      ...t,
      id_usuario: t.id_usuario ?? undefined
    };
    console.log("Copia para edición:", this.trasteroSeleccionado);
  }

  cambiarEstado(estado: 'libre' | 'ocupado' | 'mantenimiento') {

    //aqui hay que tocar
    this.trasteroService.asignarTrastero
    if (!this.trasteroSeleccionado) return;

    console.log("Cambiando estado a:", estado);
    this.trasteroSeleccionado.estado = estado;

    if (estado !== 'ocupado') {
      console.log("Reseteando datos de contrato");
      this.trasteroSeleccionado.usuario = undefined;
      this.trasteroSeleccionado.id_usuario = undefined;
      this.trasteroSeleccionado.fechaInicio = undefined;
      this.trasteroSeleccionado.mesesContrato = undefined;
    }

    if(estado == 'libre'){
      this.trasteroService.liberarTrastero

    }
  }

  calcularFechaFin(fechaInicio?: string, meses?: number | string): string | null {
    console.log("Calculando fecha fin seguro...");
    if (!fechaInicio || !meses) return null;

    const mesesNum = Number(meses);
    console.log("Meses convertidos a número:", mesesNum);

    const [year, month, day] = fechaInicio.split('-').map(Number);
    const inicio = new Date(year, month - 1, day);
    console.log("Fecha inicio segura (Date):", inicio);

    const fin = new Date(inicio);
    fin.setMonth(fin.getMonth() + mesesNum);
    console.log("Fecha fin segura (Date):", fin);

    const y = fin.getFullYear();
    const m = String(fin.getMonth() + 1).padStart(2, '0');
    const d = String(fin.getDate()).padStart(2, '0');

    const resultado = `${y}-${m}-${d}`;
    console.log("Fecha fin segura enviada al backend:", resultado);

    return resultado;
  }

  estadoContrato(fechaFin: string | null): 'verde' | 'amarillo' | 'rojo' | null {
    console.log("Evaluando estado contrato para fecha:", fechaFin);

    if (!fechaFin) return null;

    const hoy = new Date();
    const fin = new Date(fechaFin);

    const diffMs = fin.getTime() - hoy.getTime();
    const diffDias = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    console.log("Días restantes de contrato:", diffDias);

    if (diffDias > 15) return 'verde';
    if (diffDias > 5) return 'amarillo';

    return 'rojo';
  }

  guardar() {
    console.log("Intentando guardar contrato...");

    if (!this.trasteroSeleccionado) {
      console.log("No hay trastero seleccionado");
      return;
    }

    console.log("Datos actuales del trastero:", this.trasteroSeleccionado);

    if (!this.trasteroSeleccionado.id_usuario) {
      alert("Selecciona un usuario");
      console.log("Usuario no seleccionado");
      return;
    }

    if (!this.trasteroSeleccionado.fechaInicio || !this.trasteroSeleccionado.mesesContrato) {
      alert("Completa los datos del contrato");
      console.log("Faltan datos de contrato");
      return;
    }

    console.log("Fecha inicio:", this.trasteroSeleccionado.fechaInicio);
    console.log("Meses contrato:", this.trasteroSeleccionado.mesesContrato);

    const fechaFin = this.calcularFechaFin(
      this.trasteroSeleccionado.fechaInicio,
      this.trasteroSeleccionado.mesesContrato
    );

    console.log("Fecha fin final:", fechaFin);

    const data = {
      id_usuario: this.trasteroSeleccionado.id_usuario,
      id_trastero: this.trasteroSeleccionado.id_trastero,
      fecha_inicio: this.trasteroSeleccionado.fechaInicio,
      fecha_fin: fechaFin
    };

    console.log("Datos enviados al backend:", data);

    this.trasteroService.asignarTrastero(data).subscribe({
      next: (res) => {
        console.log("Contrato guardado correctamente", res);
        this.cargarTrasteros();
        this.trasteroSeleccionado = null;
      },
      error: (err) => {
        console.error("Error guardando alquiler", err);
      }
    });
  }

  liberar(t: Trastero) {
    console.log("Preparando liberar trastero:", t);
    this.trasteroALiberar = t;
    this.mostrarModal = true;
  }

  confirmarLiberar() {
  if (!this.trasteroALiberar) return;

  console.log("Liberando trastero:", this.trasteroALiberar);

  this.trasteroService.liberarTrastero(this.trasteroALiberar.id_trastero).subscribe({
    next: () => {
      this.cargarTrasteros();
      this.cerrarModal();
    },
    error: (err) => {
      console.error("Error liberando trastero", err);
    }
  });
}

  cerrarModal() {
    console.log("Cerrando modal");
    this.mostrarModal = false;
    this.trasteroALiberar = null;
  }

}
