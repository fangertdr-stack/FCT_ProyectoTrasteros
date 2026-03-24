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
    this.trastero$.subscribe(trasteros => {
  console.log('Trasteros recibidos:', trasteros);
});

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
      id_usuario: t.id_usuario ?? undefined,
      fechaInicio: t.fechaInicio ?? '', // inicializar como string vacío
      mesesContrato: t.mesesContrato ?? undefined // inicializar null
    };
    console.log("Copia para edición:", this.trasteroSeleccionado);
  }

  cambiarEstado(estado: 'libre' | 'ocupado' | 'mantenimiento') {
  if (!this.trasteroSeleccionado) return;

  this.trasteroSeleccionado.estado = estado;

  if (estado !== 'ocupado') {
    this.trasteroSeleccionado.usuario = undefined;
    this.trasteroSeleccionado.id_usuario = undefined;
    this.trasteroSeleccionado.fechaInicio = '';
    this.trasteroSeleccionado.mesesContrato = undefined;
  }

  if (this.trasteroSeleccionado.estado === 'mantenimiento' && estado !== 'mantenimiento') {

    alert('Este trastero está en mantenimiento');
    return;
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
  if (!this.trasteroSeleccionado) return;

  if (this.trasteroSeleccionado.estado === 'ocupado') {
    if (!this.trasteroSeleccionado.id_usuario) {
      alert("Selecciona un usuario");
      return;
    }
    if (!this.trasteroSeleccionado.fechaInicio || !this.trasteroSeleccionado.mesesContrato) {
      alert("Completa los datos del contrato");
      return;
    }
  }

  // Construir objeto a enviar
  const data: any = {
    id_trastero: this.trasteroSeleccionado.id_trastero,
    estado: this.trasteroSeleccionado.estado,
    precio_mensual_aplicado: this.trasteroSeleccionado.precio
  };

  if (this.trasteroSeleccionado.estado === 'ocupado') {
    data.id_usuario = this.trasteroSeleccionado.id_usuario;
    data.fecha_inicio = this.trasteroSeleccionado.fechaInicio;
    data.fecha_fin = this.calcularFechaFin(
      this.trasteroSeleccionado.fechaInicio,
      this.trasteroSeleccionado.mesesContrato
    );
  }

  this.trasteroService.asignarTrastero(data).subscribe({
    next: () => {
      this.cargarTrasteros();
      this.trasteroSeleccionado = null;
    },
    error: (err) => {
      console.error("Error guardando contrato", err);
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

  const idTrastero = this.trasteroALiberar.id_trastero; // guardar id antes

  this.cerrarModal(); // cerrar modal inmediatamente

  this.trasteroService.liberarTrastero(idTrastero).subscribe({
    next: () => {
      this.cargarTrasteros(); // recargar trasteros
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
